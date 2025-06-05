import { useState, useEffect, useCallback } from 'react';
import { Character, CharacterSheet, useCurrentCharacter } from './useCurrentCharacter';;
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';

interface PollResult {
  status: 'pending' | 'completed' | 'failed' | 'error';
  result?: string;
  error?: string;
}

const MAX_POLL_ATTEMPTS = 30;
const POLL_INTERVAL = 3000;

export function useCharacterSheet() {
  const { character } = useCurrentCharacter();
  const [characterSheet, setCharacterSheet] = useState<CharacterSheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState<'idle' | 'polling' | 'completed' | 'failed' | 'error'>('idle');
  const [pollAttempts, setPollAttempts] = useState(0);
  const [resultId, setResultId] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<string>("calculate-abilities");

  useEffect(() => {
    if (!character?.sheet && !loading && !resultId) {
      // generateCharacterSheet();
    }
  }, [character, loading, resultId]);

  const generateCharacterSheet = async () => {
    setLoading(true);
    setError(null);
    setCurrentStep("calculate-abilities");
    if (resultId) {
      return;
    }
    try {
      const response = await fetch('/api/character/sheet/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId: getCurrentCharacterId() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate character sheet');
      }

      const data = await response.json();

      const resultId = data.resultId;
      setResultId(resultId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const pollResult = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/character/sheet/status?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to check character sheet status');
      }

      const data: PollResult = await response.json();
      return data;
    } catch (err) {
      console.error('Error polling character sheet status:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    let pollTimeout: NodeJS.Timeout;

    const startPolling = async () => {
      if (!resultId || pollStatus === 'completed' || pollStatus === 'failed' || pollStatus === 'error') {
        return;
      }

      try {
        setPollStatus('polling');
        const result = await pollResult(resultId);
        const resultData = result.result ? JSON.parse(result.result) : {};
        console.log('Character sheet generation result:', resultData);
        setResultData(resultData);
        
        // Update current step if available in result data
        if (resultData.step) {
          setCurrentStep(resultData.step);
        }

        if (result.status === 'pending' && resultData.sheet) {
          setCharacterSheet(resultData.sheet);
          setError(null);
        }
        
        if (result.status === 'completed' && resultData.sheet) {
          setCharacterSheet(resultData.sheet);
          setPollStatus('completed');
          setLoading(false);
          setError(null);
        } else if (result.status === 'failed' || result.status === 'error') {
          setError(result.error || 'Failed to generate character sheet');
          setPollStatus(result.status);
          // Stop polling when failed or error
          return;
        } else {
          // Still pending, continue polling
          setPollAttempts(prev => {
            if (prev >= MAX_POLL_ATTEMPTS) {
              setError('Character sheet generation timed out');
              setPollStatus('failed');
              return prev;
            }
            return prev + 1;
          });

          pollTimeout = setTimeout(startPolling, POLL_INTERVAL);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check character sheet status');
        setPollStatus('error');
        // Stop polling on error
        return;
      }
    };

    if (resultId && pollStatus === 'idle') {
      startPolling();
    }

    return () => {
      if (pollTimeout) {
        clearTimeout(pollTimeout);
      }
    };
  }, [resultId, pollStatus, pollResult]);

  // Load character sheet from namespaced storage on mount
  useEffect(() => {
    const loadCharacterSheet = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) return;

        const savedSheet = getCharacterKey(characterId, 'sheet');
        if (savedSheet) {
          setCharacterSheet(savedSheet);
        }
      } catch (err) {
        console.error('Error loading character sheet from storage:', err);
      }
    };

    loadCharacterSheet();
  }, []);

  return {
    characterSheet,
    loading,
    error,
    generateCharacterSheet,
    currentStep,
  };
} 