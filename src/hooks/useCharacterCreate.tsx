import { useState } from 'react';
import { Character, CharacterStatus } from '@/data/character';
import { useCache } from '@/context/CacheContext';
import { updateCharacterCache } from '@/cache/character';
import { setCharacter as setStorageCharacter, setCurrentCharacterId } from '@/utils/storage';

export function useCharacterCreate() {
  const cache = useCache();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCharacter = async (characterData?: Partial<Character>) => {
    setCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...characterData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create character');
      }

      const newCharacter = await response.json();

      // Update cache
      updateCharacterCache(newCharacter, cache);

      // Update local storage
      setStorageCharacter(newCharacter.id, newCharacter);
      setCurrentCharacterId(newCharacter.id);

      return newCharacter;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create character'));
      throw err;
    } finally {
      setCreating(false);
    }
  };

  return {
    createCharacter,
    creating,
    error
  };
}
