import { useState, useEffect } from 'react';
import { Campaign } from '@/data/campaigns';
import { getCampaignById } from '@/cache/campaign';
import { STORAGE_KEYS } from '@/utils/storage';
import { useCharacters } from './useCharacters';
import { useCache } from '@/context/CacheContext';

const getCurrentCampaignId = () => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_CAMPAIGN_ID);
};

export const useCurrentCampaign = () => {
  const cache = useCache();
  const [currentCampaignId, setCurrentCampaignId] = useState<string | null>(null);
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null);
  const [characterIds, setCharacterIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { characters, loading: charactersLoading, error: charactersError } = useCharacters(characterIds);

  // Load campaign ID from localStorage on mount
  useEffect(() => {
    const storedCampaignId = getCurrentCampaignId();
    if (storedCampaignId) {
      setCurrentCampaignId(storedCampaignId);
    }
  }, []);

  // Load campaign data whenever ID changes
  useEffect(() => {
    const loadCampaign = async () => {
      if (!currentCampaignId) {
        setCurrentCampaign(null);
        setCharacterIds([]);
        return;
      }

      setLoading(true);
      try {
        const campaign = await getCampaignById(currentCampaignId, cache);
        setCurrentCampaign(campaign);
        setCharacterIds(campaign?.characters?.map(c => c.character_id) || []);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();
  }, [currentCampaignId, cache]);

  // Store campaign ID in localStorage whenever it changes
  useEffect(() => {
    if (currentCampaignId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CAMPAIGN_ID, currentCampaignId);
    }
  }, [currentCampaignId]);

  const setCampaign = (campaign: Campaign | null) => {
    setCurrentCampaign(campaign);
    setCurrentCampaignId(campaign?.id || null);
    setCharacterIds(campaign?.characters?.map(c => c.character_id) || []);
  };

  const updateCampaign = async (updates: Partial<Campaign>) => {
    if (!currentCampaign) return;
    
    setLoading(true);
    try {
      const updatedCampaign = {
        ...currentCampaign,
        ...updates
      };

      // Update in cache
      await getCampaignById(updatedCampaign.id, cache); // This will update the cache
      setCurrentCampaign(updatedCampaign);
      setCharacterIds(updatedCampaign.characters?.map(c => c.character_id) || []);
    } finally {
      setLoading(false);
    }
  };

  const clearCampaign = () => {
    setCurrentCampaign(null);
    setCurrentCampaignId(null);
    setCharacterIds([]);
  };

  return {
    currentCampaign,
    currentCampaignId,
    characters,
    charactersLoading,
    charactersError,
    setCampaign,
    updateCampaign,
    clearCampaign,
    loading,
    isLoading: currentCampaignId !== null && currentCampaign === null
  };
};
