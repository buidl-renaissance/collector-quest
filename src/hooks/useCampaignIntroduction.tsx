import { useEffect } from 'react';
import { useCurrentCampaign } from './useCurrentCampaign';
import { Locale } from '@/data/locales';
import { Character } from '@/data/character';
import { useGeneratedResult } from './useGeneratedResult';
import { GenerationResult } from '@/data/generate';

interface IntroductionData {
  introduction: string;
  locale: Locale;
  characters: Character[];
}

export function useCampaignIntroduction() {
  const { currentCampaignId } = useCurrentCampaign();
  const {
    startGeneration,
    isGenerating: loading,
    error,
    result: introductionData,
    event: generationEvent,
  } = useGeneratedResult<IntroductionData>();

  const generateIntroduction = async (): Promise<{ event: GenerationResult<IntroductionData> }> => {
    if (!currentCampaignId) {
      throw new Error('No campaign ID available');
    }

    const response = await fetch(`/api/campaigns/${currentCampaignId}/introduction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to start introduction generation');
    }

    const data = await response.json();
    return { event: data.event };
  };

  const reloadIntroduction = () => {
    if (!currentCampaignId) return;
    startGeneration(generateIntroduction);
  };

  // Start generation when campaign changes
  useEffect(() => {
    if (currentCampaignId) {
      startGeneration(generateIntroduction);
    }
  }, [currentCampaignId]);

  return {
    introductionData,
    loading,
    error,
    reloadIntroduction,
    hasCampaign: !!currentCampaignId,
    generationStatus: generationEvent?.status || null,
    generationMessage: generationEvent?.message || null
  };
}