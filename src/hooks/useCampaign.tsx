import { useEffect, useState } from 'react';
import { Campaign } from '@/data/campaigns';
import { getCampaignById } from '@/cache/campaign';
import { useCharacters } from './useCharacters';

export function useCampaign(id: string | undefined) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [characterIds, setCharacterIds] = useState<string[]>([]);
  const { characters, loading: charactersLoading, error: charactersError } = useCharacters(characterIds);

  useEffect(() => {
    async function loadCampaign() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const campaignData = await getCampaignById(id);
        setCampaign(campaignData);
        setCharacterIds(campaignData?.characters?.map((c) => c.character_id) || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load campaign'));
      } finally {
        setLoading(false);
      }
    }

    loadCampaign();
  }, [id]);

  return { campaign, loading, error, characterIds, characters, charactersLoading, charactersError };
}
