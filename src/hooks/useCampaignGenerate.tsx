import { useState, useEffect } from 'react';
import { Campaign } from '@/data/campaigns';

interface UseCampaignGenerateProps {
  pollInterval?: number;
}

interface UseCampaignGenerateReturn {
  createCampaign: (characters: { characterId: string; role: string }[]) => Promise<Campaign>;
  isGenerating: boolean;
  error: Error | null;
  campaign: Campaign | null;
}

export function useCampaignGenerate({ pollInterval = 2000 }: UseCampaignGenerateProps = {}): UseCampaignGenerateReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [shouldPoll, setShouldPoll] = useState(true);

  useEffect(() => {
    if (!campaign || campaign.status !== 'generating' || !shouldPoll) {
      return;
    }

    const pollCampaign = async () => {
      try {
        const response = await fetch(`/api/campaigns/${campaign.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch campaign status');
        }
        const data = await response.json();
        
        setCampaign(data);
        
        if (data.status !== 'generating') {
          setIsGenerating(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
        setIsGenerating(false);
        setShouldPoll(false); // Stop polling on error
      }
    };

    const interval = setInterval(pollCampaign, pollInterval);
    return () => clearInterval(interval);
  }, [campaign, pollInterval, shouldPoll]);

  const createCampaign = async (characters: { characterId: string; role: string }[]) => {
    try {
      setIsGenerating(true);
      setError(null);
      setShouldPoll(true); // Reset polling state for new campaign

      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characters })
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const result = await response.json();
      setCampaign(result.campaign);
      return result.campaign;

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create campaign'));
      setIsGenerating(false);
      setShouldPoll(false); // Stop polling on creation error
      throw err;
    }
  };

  return {
    createCampaign,
    isGenerating,
    error,
    campaign
  };
}
