import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CharacterClass } from '@/data/classes';
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';
import { useCharacter } from './useCharacter';

/**
 * Custom hook to manage character class selection state
 * Handles loading from localStorage and persisting changes
 */
export function useCharacterClass() {
  const { saveCharacter, updateCharacter } = useCharacter();
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadClass = async () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          setLoading(false);
          return;
        }

        // First try to get from namespaced storage
        const cachedClass = getCharacterKey(characterId, 'class');
        if (cachedClass) {
          setSelectedClass(cachedClass);
          setLoading(false);
          return;
        }

        // If not in namespaced storage, try to get from API
        const savedClassId = getCharacterKey(characterId, 'classId');
        if (savedClassId) {
          const response = await fetch(`/api/classes/${savedClassId}`);
          if (!response.ok) throw new Error('Failed to fetch class');
          
          const data = await response.json();
          setSelectedClass(data);
          // Cache the full class data in namespaced storage
          setCharacterKey(characterId, 'class', data);
        }
      } catch (error) {
        console.error('Error loading class:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClass();
  }, []);

  // Function to update selected class and save to namespaced storage
  const selectClass = (characterClass: CharacterClass) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setSelectedClass(characterClass);
    updateCharacter({ class: characterClass });
  };

  // Function to clear class selection
  const clearClass = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setSelectedClass(null);
    updateCharacter({ class: undefined });
  };

  // Navigate to class selection page
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
