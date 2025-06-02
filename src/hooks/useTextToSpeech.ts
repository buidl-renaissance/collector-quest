import { useState } from 'react';

interface TTSOptions {
  speaker?: string;
  emotion?: string;
  metadata?: {
    characterId?: string;
    artifactId?: string;
    relicId?: string;
  };
}

interface TTSResult {
  success: boolean;
  audioUrl: string;
  metadata: {
    filename: string;
    duration: number;
  };
}

export function useTextToSpeech() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToSpeech = async (text: string, options?: TTSOptions): Promise<TTSResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          ...options,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to trigger text-to-speech conversion');
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert text to speech';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    convertToSpeech,
    isLoading,
    error,
  };
} 