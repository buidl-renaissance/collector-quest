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
    const savedClassId = localStorage.getItem('selectedClassId');
    if (savedClassId) {
      fetch(`/api/classes/${savedClassId}`)
        .then(res => res.json())
        .then(data => {
          setSelectedClass(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching class:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const selectClass = (characterClass: CharacterClass) => {
    setSelectedClass(characterClass);
    localStorage.setItem('selectedClassId', characterClass.id);
  };

  const clearClass = () => {
    setSelectedClass(null);
    localStorage.removeItem('selectedClassId');
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
