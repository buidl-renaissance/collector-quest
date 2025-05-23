import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentCharacterId, getCharacterKey } from '@/utils/storage';
import { useCharacter } from './useCharacter';

export type Sex = 'male' | 'female' | 'other';

export function useSex() {
  const { updateCharacter } = useCharacter();
  const [selectedSex, setSelectedSex] = useState<Sex | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadSex = () => {
      try {
        const characterId = getCurrentCharacterId();
        if (!characterId) {
          setLoading(false);
          return;
        }

        const savedSex = getCharacterKey(characterId, 'sex');
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
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setSelectedSex(sex);
    updateCharacter({ sex });
  };

  const clearSex = () => {
    const characterId = getCurrentCharacterId();
    if (!characterId) return;

    setSelectedSex(null);
    updateCharacter({ sex: undefined });
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