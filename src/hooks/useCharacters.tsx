import { useState, useEffect } from 'react';
import { Character } from '@/data/character';
import { useCache } from '@/context/CacheContext';
import { getCharactersByIds } from '@/cache/character';

export function useCharacters(characterIds: string[] | undefined) {
  const cache = useCache();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCharacters = async () => {
      if (!characterIds?.length) {
        setCharacters([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await getCharactersByIds(characterIds, cache);
        if (mounted) {
          setCharacters(results);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch characters'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCharacters();

    return () => {
      mounted = false;
    };
  }, [cache, characterIds?.join(',')]);

  return { characters, loading, error };
}
