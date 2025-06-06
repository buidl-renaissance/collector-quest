import { useEffect, useState } from 'react';
import { Campaign } from '@/data/campaigns';
import { useCache } from '@/context/CacheContext';
import { getCampaignById } from '@/cache/campaign';
import { useCharacters } from './useCharacters';

export function useCampaign(id: string | undefined) {
  const cache = useCache();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [characterIds, setCharacterIds] = useState<string[]>([]);
  const { characters, loading: charactersLoading, error: charactersError } = useCharacters(characterIds);

  useEffect(() => {
    let mounted = true;

    async function loadCampaign() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const campaignData = await getCampaignById(id, cache);
        if (mounted) {
          setCampaign(campaignData);
          setCharacterIds(campaignData?.characters?.map((c) => c.character_id) || []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load campaign'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCampaign();

    return () => {
      mounted = false;
    };
  }, [cache, id]);

  return { campaign, loading, error, characterIds, characters, charactersLoading, charactersError };
}
