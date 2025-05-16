import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Race } from '@/data/races';
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';
import { useCharacter } from './useCharacter';

/**
 * Custom hook to manage character race selection state
 * Handles loading from localStorage and persisting changes
 */
export function useRace() {
  const { saveCharacter, updateCharacter } = useCharacter();
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadRace = async () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          setLoading(false);
          return;
        }

        // First try to get from namespaced storage
        const cachedRace = getCharacterKey(characterId, 'race');
        if (cachedRace) {
          setSelectedRace(cachedRace);
          setLoading(false);
          return;
        }

        // If not in namespaced storage, try to get from API
        const savedRaceId = getCharacterKey(characterId, 'raceId');
        if (savedRaceId) {
          const response = await fetch(`/api/races/${savedRaceId}`);
          if (!response.ok) throw new Error('Failed to fetch race');
          
          const data = await response.json();
          setSelectedRace(data);
          // Cache the full race data in namespaced storage
          setCharacterKey(characterId, 'race', data);
        }
      } catch (error) {
        console.error('Error loading race:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRace();
  }, []);

  // Function to update selected race and save to namespaced storage
  const selectRace = (race: Race) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setSelectedRace(race);
    updateCharacter({ race: race });
    (async () => {
      await saveCharacter();
    })();
  };

  // Function to clear race selection
  const clearRace = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setSelectedRace(null);
    updateCharacter({ race: undefined });
  };

  // Navigate to race selection page
  const goToRaceSelection = () => {
    router.push('/character/race');
  };

  return {
    selectedRace,
    loading,
    selectRace,
    clearRace,
    goToRaceSelection
  };
}

export default useRace;
