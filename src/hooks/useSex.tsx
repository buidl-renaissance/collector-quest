import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export type Sex = 'male' | 'female' | 'other';

export function useSex() {
  const [selectedSex, setSelectedSex] = useState<Sex | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadSex = () => {
      try {
        const savedSex = localStorage.getItem('selectedSex');
        if (savedSex) {
          setSelectedSex(savedSex as Sex);
        }
      } catch (error) {
        console.error('Error loading sex:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSex();
  }, []);

  const selectSex = (sex: Sex) => {
    setSelectedSex(sex);
    localStorage.setItem('selectedSex', sex);
  };

  const clearSex = () => {
    setSelectedSex(null);
    localStorage.removeItem('selectedSex');
  };

  const goToSexSelection = () => {
    router.push('/character/sex');
  };

  return {
    selectedSex,
    loading,
    selectSex,
    clearSex,
    goToSexSelection
  };
}

export default useSex; 