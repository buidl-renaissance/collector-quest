import { Campaign } from '@/data/campaigns';
import { useCache } from '@/context/CacheContext';

// Default cache duration for campaigns (30 minutes)
export const CAMPAIGN_CACHE_DURATION = 30 * 60 * 1000;

// Helper function to fetch campaign from API
async function fetchCampaignFromAPI(id: string): Promise<Campaign> {
  const response = await fetch(`/api/campaigns/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch campaign');
  }
  return response.json();
}

export async function getCampaignById(id: string, cache: ReturnType<typeof useCache>): Promise<Campaign | null> {
  try {
    return await cache.fetch<Campaign>(
      'campaign',
      id,
      () => fetchCampaignFromAPI(id),
      CAMPAIGN_CACHE_DURATION
    );
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

export async function getCampaignsByIds(ids: string[], cache: ReturnType<typeof useCache>): Promise<Campaign[]> {
  const campaigns = await Promise.all(
    ids.map(async (id) => {
      try {
        return await cache.fetch<Campaign>(
          'campaign',
          id,
          () => fetchCampaignFromAPI(id),
          CAMPAIGN_CACHE_DURATION
        );
      } catch (error) {
        console.error(`Error fetching campaign ${id}:`, error);
        return null;
      }
    })
  );
  
  return campaigns.filter((camp): camp is Campaign => camp !== null);
}

export function updateCampaignCache(campaign: Campaign, cache: ReturnType<typeof useCache>) {
  if (campaign.id) {
    cache.set('campaign', campaign.id, campaign, CAMPAIGN_CACHE_DURATION);
  }
}

export function removeCampaignFromCache(campaignId: string, cache: ReturnType<typeof useCache>) {
  cache.remove('campaign', campaignId);
}

export function clearCampaignCache(cache: ReturnType<typeof useCache>) {
  cache.clearCache('campaign');
}
