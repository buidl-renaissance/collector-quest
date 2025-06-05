import { useState, useEffect } from 'react';
import { Character } from '@/data/character';
import { getCharacterById } from '@/cache/character';

export const useCharacter = (characterId: string | null) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCharacter = async () => {
      if (!characterId) {
        setCharacter(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const characterData = await getCharacterById(characterId);
        setCharacter(characterData);
      } catch (err) {
        console.error('Error loading character:', err);
        setError('Failed to load character');
      } finally {
        setLoading(false);
      }
    };

    loadCharacter();
  }, [characterId]);

  return {
    character,
    loading,
    error
  };
};
