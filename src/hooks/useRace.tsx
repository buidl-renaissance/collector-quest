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
    const savedRaceId = localStorage.getItem('selectedRaceId');
    if (savedRaceId) {
      fetch(`/api/races/${savedRaceId}`)
        .then(res => res.json())
        .then(data => {
          setSelectedRace(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching race:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Function to update selected race and save to localStorage
  const selectRace = (race: Race) => {
    setSelectedRace(race);
    localStorage.setItem('selectedRaceId', race.id);
  };

  // Function to clear race selection
  const clearRace = () => {
    setSelectedRace(null);
    localStorage.removeItem('selectedRaceId');
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
