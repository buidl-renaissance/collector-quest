import { useState } from 'react';
import { Quest } from '@/data/quest';
import { Relic } from '@/data/artifacts';

interface PollResult {
  status: 'pending' | 'completed' | 'failed';
  result: string;
}

export const useGenerateQuest = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuest, setGeneratedQuest] = useState<Quest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateQuest = async (relic: Relic) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedQuest(null);

    try {
      const response = await fetch('/api/quest/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          relicId: relic.id,
          relicName: relic.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start quest generation');
      }

      const result = await response.json();

      // Start polling for the quest generation result
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/quest/status?eventId=${result.eventId}`);
          
          if (!statusResponse.ok) {
            throw new Error('Failed to fetch quest generation status');
          }

          const data: PollResult = await statusResponse.json();

          if (data.status === 'completed') {
            const questResult = JSON.parse(data.result);
            setGeneratedQuest(questResult.quest);
            setIsGenerating(false);
            clearInterval(pollInterval);
          } else if (data.status === 'failed') {
            throw new Error('Quest generation failed');
          }
        } catch (pollError) {
          console.error('Error polling for quest:', pollError);
          setError(pollError instanceof Error ? pollError.message : 'Unknown error');
          setIsGenerating(false);
          clearInterval(pollInterval);
        }
      }, 2000); // Poll every 2 seconds

      // Clear interval after 2 minutes (timeout)
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isGenerating) {
          setError('Quest generation timed out');
          setIsGenerating(false);
        }
      }, 120000);

    } catch (error) {
      console.error('Error generating quest:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setIsGenerating(false);
    setGeneratedQuest(null);
    setError(null);
  };

  return {
    isGenerating,
    generatedQuest,
    error,
    generateQuest,
    reset,
  };
};
