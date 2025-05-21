import { useState, useEffect, useCallback } from 'react';
import { Character, CharacterSheet, useCharacter } from './useCharacter';;
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';

interface PollResult {
  status: 'pending' | 'completed' | 'failed' | 'error';
  result?: string;
  error?: string;
}

const MAX_POLL_ATTEMPTS = 30;
const POLL_INTERVAL = 3000;

export function useCharacterSheet() {
  const { character } = useCharacter();
  const [characterSheet, setCharacterSheet] = useState<CharacterSheet | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState<'idle' | 'polling' | 'completed' | 'failed' | 'error'>('idle');
  const [pollAttempts, setPollAttempts] = useState(0);
  const [resultId, setResultId] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!character?.sheet && !loading && !resultId) {
      // generateCharacterSheet();
    }
  }, [character, loading, resultId]);

  const generateCharacterSheet = async () => {
    setLoading(true);
    setError(null);
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
      const response = await fetch(`/api/image/status?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to check result status');
      }

      const data: PollResult = await response.json();
      return data;
    } catch (err) {
      console.error('Error polling result:', err);
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
        console.log('result', resultData);
        setResultData(resultData);
        if (result.status === 'completed' && resultData.imageUrl) {
          setGeneratedImage(resultData.imageUrl);
          setPollStatus('completed');
          setError(null);
        } else if (result.status === 'failed' || result.status === 'error') {
          setError(result.error || 'Failed to generate image');
          setPollStatus(result.status);
          // Stop polling when failed or error
          return;
        } else {
          // Still pending, continue polling
          setPollAttempts(prev => {
            if (prev >= MAX_POLL_ATTEMPTS) {
              setError('Image generation timed out');
              setPollStatus('failed');
              return prev;
            }
            return prev + 1;
          });

          pollTimeout = setTimeout(startPolling, POLL_INTERVAL);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check result status');
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
  };
} 