import { useState, useEffect } from 'react';
import { Character } from '@/data/character';
import { useCache } from '@/context/CacheContext';

export function useCharacter(characterId: string | null) {
  const cache = useCache();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCharacter = async () => {
      if (!characterId) {
        setCharacter(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await cache.fetch<Character>(
          'character',
          characterId,
          async () => {
            const response = await fetch(`/api/characters/${characterId}`);
            if (!response.ok) throw new Error('Failed to fetch character');
            return response.json();
          },
          30 * 60 * 1000 // 30 minute cache
        );

        if (mounted) {
          setCharacter(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCharacter();

    return () => {
      mounted = false;
    };
  }, [characterId, cache]);

  return { character, loading, error };
}
