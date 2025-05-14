import { useState, useEffect } from 'react';

interface Traits {
  personality: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
  hauntingMemory?: string;
  treasuredPossession?: string;
}

export function useTraits() {
  const [selectedTraits, setSelectedTraits] = useState<Traits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTraits = () => {
      try {
        const savedTraits = localStorage.getItem('selectedTraits');
        if (savedTraits) {
          setSelectedTraits(JSON.parse(savedTraits));
        }
      } catch (error) {
        console.error('Error loading traits:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTraits();
  }, []);

  const selectTraits = (traits: Traits) => {
    setSelectedTraits(traits);
    localStorage.setItem('selectedTraits', JSON.stringify(traits));
  };

  const clearTraits = () => {
    setSelectedTraits(null);
    localStorage.removeItem('selectedTraits');
  };

  return {
    selectedTraits,
    loading,
    selectTraits,
    clearTraits
  };
}

export default useTraits; 