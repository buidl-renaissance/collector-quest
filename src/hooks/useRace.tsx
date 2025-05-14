import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Race } from '@/data/races';

/**
 * Custom hook to manage character race selection state
 * Handles loading from localStorage and persisting changes
 */
export function useRace() {
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadRace = async () => {
      try {
        // First try to get from cache
        const cachedRace = localStorage.getItem('selectedRace');
        if (cachedRace) {
          setSelectedRace(JSON.parse(cachedRace));
          setLoading(false);
          return;
        }

        // If not in cache, try to get from API
        const savedRaceId = localStorage.getItem('selectedRaceId');
        if (savedRaceId) {
          const response = await fetch(`/api/races/${savedRaceId}`);
          if (!response.ok) throw new Error('Failed to fetch race');
          
          const data = await response.json();
          setSelectedRace(data);
          // Cache the full race data
          localStorage.setItem('selectedRace', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error loading race:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRace();
  }, []);

  // Function to update selected race and save to localStorage
  const selectRace = (race: Race) => {
    setSelectedRace(race);
    localStorage.setItem('selectedRaceId', race.id);
    localStorage.setItem('selectedRace', JSON.stringify(race));
  };

  // Function to clear race selection
  const clearRace = () => {
    setSelectedRace(null);
    localStorage.removeItem('selectedRaceId');
    localStorage.removeItem('selectedRace');
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
