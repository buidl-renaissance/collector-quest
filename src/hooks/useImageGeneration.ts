import { useState, useCallback } from 'react';

interface UseImageGenerationOptions {
  pollingInterval?: number;
  maxAttempts?: number;
}

export interface ImageGenerationResult {
  success: boolean;
  message: string;
  image: string;
  imageUrl: string;
}

interface UseImageGenerationReturn {
  generateImage: (prompt: string, image?: string, raceId?: string) => Promise<ImageGenerationResult | null>;
  isGenerating: boolean;
  error: string | null;
  progress: number;
}

interface ImageGenerationStatus {
  id: string;
  status: 'pending' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
  result?: string;
  error?: string;
}

/**
 * Hook for generating images with Inngest
 */
export const useImageGeneration = (options?: UseImageGenerationOptions): UseImageGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const pollingInterval = options?.pollingInterval || 2000; // 2 seconds
  const maxAttempts = options?.maxAttempts || 60; // 30 attempts = 120 seconds max

  const generateImage = useCallback(async (prompt: string, image?: string, raceId?: string): Promise<ImageGenerationResult | null> => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // Trigger image generation
      const response = await fetch('/api/image/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          image,
          raceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to trigger image generation');
      }

      const data = await response.json();
      const resultId = data.resultId;

      // Poll for the result
      let attempts = 0;
      
      while (attempts < maxAttempts) {
        attempts++;
        setProgress(Math.min(100, Math.round((attempts / maxAttempts) * 100)));
        
        await new Promise(resolve => setTimeout(resolve, pollingInterval));
        
        const statusResponse = await fetch(`/api/image/status?id=${resultId}`);
        
        if (!statusResponse.ok) {
          throw new Error('Failed to check image status');
        }
        
        const statusData = await statusResponse.json() as ImageGenerationStatus;
        
        if (statusData.status === 'completed' && statusData.result) {
          setIsGenerating(false);
          setProgress(100);
          const result = JSON.parse(statusData.result) as ImageGenerationResult;
          console.log('Image generation result:', result);
          return result;
        } else if (statusData.status === 'error') {
          throw new Error(statusData.error || 'Failed to generate image');
        }
      }
      
      throw new Error('Timed out waiting for image generation');
    } catch (err) {
      setIsGenerating(false);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    }
  }, [pollingInterval, maxAttempts]);

  return {
    generateImage,
    isGenerating,
    error,
    progress,
  };
};
