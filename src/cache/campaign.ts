import { Campaign } from '@/data/campaigns';
import { STORAGE_KEYS } from '@/utils/storage';

function getCampaigns() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '{}');
}

function getCachedCampaign(id: string) {
  const campaigns = getCampaigns();
  return campaigns[id] || null;
}

function setCampaign(id: string, campaign: Campaign) {
  const campaigns = getCampaigns();
  campaigns[id] = campaign;
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  // Check local storage first
  const cachedCampaign = getCachedCampaign(id);
  if (cachedCampaign) {
    return cachedCampaign as Campaign;
  }

  // Fetch from API if not in local storage
  try {
    const response = await fetch(`/api/campaigns/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch campaign');
    }
    const campaign: Campaign = await response.json();
    
    // Store in local storage
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
    if (cachedCampaign) {
      campaigns.push(cachedCampaign as Campaign);
      continue;
    }

    // Fetch from API if not in local storage
    try {
      const response = await fetch(`/api/campaigns/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch campaign ${id}`);
      }
      const campaign: Campaign = await response.json();
      
      // Store in local storage
      setCampaign(id, campaign);
      campaigns.push(campaign);
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      campaigns.push(null);
    }
  }

  return campaigns;
}
