import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CharacterClass } from '@/data/classes';

/**
 * Custom hook to manage character class selection state
 * Handles loading from localStorage and persisting changes
 */
export function useCharacterClass() {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadClass = async () => {
      try {
        // First try to get from cache
        const cachedClass = localStorage.getItem('selectedClass');
        if (cachedClass) {
          setSelectedClass(JSON.parse(cachedClass));
          setLoading(false);
          return;
        }

        // If not in cache, try to get from API
        const savedClassId = localStorage.getItem('selectedClassId');
        if (savedClassId) {
          const response = await fetch(`/api/classes/${savedClassId}`);
          if (!response.ok) throw new Error('Failed to fetch class');
          
          const data = await response.json();
          setSelectedClass(data);
          // Cache the full class data
          localStorage.setItem('selectedClass', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error loading class:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClass();
  }, []);

  const selectClass = (characterClass: CharacterClass) => {
    setSelectedClass(characterClass);
    localStorage.setItem('selectedClassId', characterClass.id);
    localStorage.setItem('selectedClass', JSON.stringify(characterClass));
  };

  const clearClass = () => {
    setSelectedClass(null);
    localStorage.removeItem('selectedClassId');
    localStorage.removeItem('selectedClass');
  };

  const goToClassSelection = () => {
    router.push('/character/class');
  };

  return {
    selectedClass,
    loading,
    selectClass,
    clearClass,
    goToClassSelection
  };
}

export default useCharacterClass;
