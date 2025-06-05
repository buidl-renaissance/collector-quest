import { Campaign } from '@/data/campaigns';
import { STORAGE_KEYS } from '@/utils/storage';

// Cache duration in milliseconds (1 hour default)
export const CACHE_DURATION_MS = 60 * 60 * 1000;

function getCampaigns() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '{}');
}

function getCachedCampaign(id: string) {
  const campaigns = getCampaigns();
  return campaigns[id] || null;
}

function setCampaign(id: string, campaign: Campaign & { timestamp?: number }) {
  const campaigns = getCampaigns();
  campaigns[id] = {
    ...campaign,
    timestamp: Date.now()
  };
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  // Check local storage first
  const cachedCampaign = getCachedCampaign(id);
  if (cachedCampaign && cachedCampaign.timestamp && 
      Date.now() - cachedCampaign.timestamp < CACHE_DURATION_MS) {
    return cachedCampaign as Campaign;
  }

  // Fetch from API if not in local storage or cache expired
  try {
    const response = await fetch(`/api/campaigns/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch campaign');
    }
    const campaign: Campaign = await response.json();
    
    // Store in local storage with timestamp
    setCampaign(id, campaign);
    return campaign;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    return null;
  }
}

export async function getCampaignsByIds(ids: string[]): Promise<(Campaign | null)[]> {
  const campaigns: (Campaign | null)[] = [];
  
  for (const id of ids) {
    // Check local storage first
    const cachedCampaign = getCachedCampaign(id);
    if (cachedCampaign && cachedCampaign.timestamp && 
        Date.now() - cachedCampaign.timestamp < CACHE_DURATION_MS) {
      campaigns.push(cachedCampaign as Campaign);
      continue;
    }

    // Fetch from API if not in local storage or cache expired
    try {
      const response = await fetch(`/api/campaigns/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch campaign ${id}`);
      }
      const campaign: Campaign = await response.json();
      
      // Store in local storage with timestamp
      setCampaign(id, campaign);
      campaigns.push(campaign);
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      campaigns.push(null);
    }
  }

  return campaigns;
}
