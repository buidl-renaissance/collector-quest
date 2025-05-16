import { useCharacter } from '@/hooks/useCharacter';
import { useState, useEffect, useCallback, useRef } from 'react';

interface StoryGenerationResult {
  success: boolean;
  message: string;
  status: string;
  result?: string;
}

interface StoryGenerationResultData {
  step?: string;
  message?: string;
  backstory?: string;
  motivation?: string;
  success?: boolean;
}

interface UseStoryGeneratorReturn {
  generateStory: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  backstory: string | null;
  motivation: string | null;
  progress: string | null;
}

export const useStoryGenerator = (): UseStoryGeneratorReturn => {
  const { character } = useCharacter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backstory, setBackstory] = useState<string | null>(null);
  const [motivation, setMotivation] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const generationAttempted = useRef(false);

  const generateStory = useCallback(async (): Promise<void> => {
    if (!character) {
      setError('No character selected');
      return;
    }

    if (isLoading) {
      setError('Story generation already in progress');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setProgress('Starting story generation...');

      const response = await fetch('/api/character/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characterId: character?.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.resultId) {
          setResultId(data.resultId);
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start story generation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsLoading(false);
    }
  }, [character, isLoading]);

  useEffect(() => {
    if (!resultId) return;

    const pollInterval = 3000; // Poll every 3 seconds
    let timeoutId: NodeJS.Timeout;

    const pollResult = async () => {
      try {
        const response = await fetch(`/api/image/status?id=${resultId}`);
        const result: StoryGenerationResult = await response.json();
        const resultData: StoryGenerationResultData = result.result ? JSON.parse(result.result) : {};

        if (resultData.step) {
          setProgress(resultData.message || `Processing: ${resultData.step}`);
        }

        if (result.status === 'completed') {
          setIsLoading(false);
        }  
        
        if (resultData.motivation) {
          setMotivation(resultData.motivation);
        }

        if (resultData.backstory) {
          setBackstory(resultData.backstory);
        }

        if (!result.success && result.message?.includes('error')) {
          throw new Error(result.message);
        } else {
          // Continue polling
          timeoutId = setTimeout(pollResult, pollInterval);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch story generation result');
        setIsLoading(false);
        setResultId(null);
      }
    };

    // Start polling
    timeoutId = setTimeout(pollResult, pollInterval);

    // Cleanup function
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [resultId, character?.id]);

  return {
    generateStory,
    isLoading,
    error,
    backstory,
    motivation,
    progress,
  };
};
