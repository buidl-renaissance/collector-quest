import { useEffect, useState } from 'react';
import { Campaign } from '@/data/campaigns';
import { getCampaignById } from '@/cache/campaign';

export function useCampaign(id: string | undefined) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCampaign() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const campaignData = await getCampaignById(id);
        setCampaign(campaignData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load campaign'));
      } finally {
        setLoading(false);
      }
    }

    loadCampaign();
  }, [id]);

  return { campaign, loading, error };
}
