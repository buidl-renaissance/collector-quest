import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CharacterClass } from '@/data/character';
import { getCurrentCharacterId, getCharacterKey, setCharacterKey } from '@/utils/storage';
import { useCurrentCharacter } from './useCurrentCharacter';

/**
 * Custom hook to manage character class selection state
 * Handles loading from localStorage and persisting changes
 */
export function useCharacterClass() {
  const { character, saveCharacter, updateCharacter } = useCurrentCharacter();
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(character?.class as CharacterClass | null);
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
  const selectClass = async (characterClass: CharacterClass) => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setSelectedClass(characterClass);
    updateCharacter({ class: characterClass });
    await saveCharacter();
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
