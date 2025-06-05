import { useState, useCallback, useEffect } from 'react';
import { useCurrentCharacter } from './useCurrentCharacter';

interface GenerateImageResult {
  resultId: string;
}

interface PollResult {
  status: 'pending' | 'completed' | 'failed' | 'error';
  result?: string;
  error?: string;
}

interface useCharacterImageGeneratorResult {
  generateImage: (imageData: string) => Promise<GenerateImageResult>;
  isGenerating: boolean;
  error: string | null;
  resultId: string | null;
  resultData: {
    step?: string;
    message?: string;
    imageUrl?: string;
    success?: boolean;
  } | null;
  generatedImage: string | null;
  pollStatus: 'idle' | 'polling' | 'completed' | 'failed' | 'error';
}

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLL_ATTEMPTS = 60; // 2 minute maximum

export function useCharacterImageGenerator(): useCharacterImageGeneratorResult {
  const { character, updateCharacter } = useCurrentCharacter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [resultData, setResultData] = useState<{
    step?: string;
    message?: string;
    imageUrl?: string;
    success?: boolean;
  } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState<'idle' | 'polling' | 'completed' | 'failed' | 'error'>('idle');
  const [pollAttempts, setPollAttempts] = useState(0);

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
        } else if (result.status === 'pending' && resultData.imageUrl) {
          setGeneratedImage(resultData.imageUrl);
          updateCharacter({
            ...character,
            image_url: resultData.imageUrl,
          });
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

  const generateImage = useCallback(async (imageData: string): Promise<GenerateImageResult> => {
    if (!character?.id) {
      throw new Error('Character ID is required');
    }

    try {
      setIsGenerating(true);
      setError(null);
      setPollStatus('idle');
      setPollAttempts(0);
      setGeneratedImage(null);

      const response = await fetch('/api/character/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterId: character.id,
          image: imageData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate character image');
      }

      const data = await response.json();
      setResultId(data.resultId);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate character image';
      setError(errorMessage);
      setPollStatus('failed');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [character?.id]);

  return {
    generateImage,
    isGenerating,
    error,
    resultId,
    resultData,
    generatedImage,
    pollStatus,
  };
} 