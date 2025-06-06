import { useState } from 'react';
import { Character } from '@/data/character';
import { useCache } from '@/context/CacheContext';
import { updateCharacterCache } from '@/cache/character';
import { setCharacter as setStorageCharacter } from '@/utils/storage';

export function useManageCharacter() {
  const cache = useCache();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveCharacter = async (character: Character) => {
    setSaving(true);
    setError(null);

    try {
      // Save to API
      const response = await fetch(`/api/characters/${character.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(character),
      });

      if (!response.ok) {
        throw new Error('Failed to save character');
      }

      const savedCharacter = await response.json();

      // Update cache
      updateCharacterCache(savedCharacter, cache);

      // Update local storage
      setStorageCharacter(savedCharacter.id, savedCharacter);

      return savedCharacter;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save character'));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteCharacter = async (characterId: string) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete character');
      }

      // Remove from cache
      cache.remove('character', characterId);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete character'));
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    saveCharacter,
    deleteCharacter,
    saving,
    error
  };
}
