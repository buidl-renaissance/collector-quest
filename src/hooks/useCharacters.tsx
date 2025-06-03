import { useEffect, useState } from 'react';
import { Character } from '@/data/character';
import { getCharactersByIds } from '@/cache/character';

export function useCharacters(ids: string[] | undefined) {
  const [characters, setCharacters] = useState<(Character)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCharacters() {
      if (!ids || ids.length === 0) {
        setCharacters([]);
        setLoading(false);
        return;
      }

      try {
        const charactersData = await getCharactersByIds(ids);
        setCharacters(charactersData.filter((char): char is Character => char !== null));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load characters'));
      } finally {
        setLoading(false);
      }
    }

    if (ids && ids.length > 0) {
      loadCharacters();
    }
  }, [ids]);

  return { characters, loading, error };
}
