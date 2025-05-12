import { useState, useEffect } from 'react';

export function useMotivation() {
  const [selectedMotivation, setSelectedMotivation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMotivation = () => {
      try {
        const savedMotivation = localStorage.getItem('selectedMotivation');
        if (savedMotivation) {
          setSelectedMotivation(savedMotivation);
        }
      } catch (error) {
        console.error('Error loading motivation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMotivation();
  }, []);

  const selectMotivation = (motivation: string) => {
    setSelectedMotivation(motivation);
    localStorage.setItem('selectedMotivation', motivation);
  };

  const clearMotivation = () => {
    setSelectedMotivation(null);
    localStorage.removeItem('selectedMotivation');
  };

  return {
    selectedMotivation,
    loading,
    selectMotivation,
    clearMotivation
  };
}

export default useMotivation; 