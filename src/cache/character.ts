import { Character } from '@/data/character';
import { useCache } from '@/context/CacheContext';

// Default cache duration for characters (30 minutes)
export const CHARACTER_CACHE_DURATION = 30 * 60 * 1000;

// Helper function to fetch character from API
async function fetchCharacterFromAPI(id: string): Promise<Character> {
  const response = await fetch(`/api/characters/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch character');
  }
  return response.json();
}

// Hook to get a single character with caching
export function useCharacter(characterId: string | null) {
  const cache = useCache();
  
  const getCharacter = async () => {
    if (!characterId) return null;
    
    return cache.fetch<Character>(
      'character',
      characterId,
      () => fetchCharacterFromAPI(characterId),
      CHARACTER_CACHE_DURATION
    );
  };
  
  return { getCharacter };
}

// Helper function to fetch multiple characters
export async function getCharactersByIds(ids: string[], cache: ReturnType<typeof useCache>): Promise<Character[]> {
  const characters = await Promise.all(
    ids.map(async (id) => {
      try {
        return await cache.fetch<Character>(
          'character',
          id,
          () => fetchCharacterFromAPI(id),
          CHARACTER_CACHE_DURATION
        );
      } catch (error) {
        console.error(`Failed to fetch character ${id}:`, error);
        return null;
      }
    })
  );
  
  return characters.filter((char): char is Character => char !== null);
}

// Function to update character in cache
export function updateCharacterCache(character: Character, cache: ReturnType<typeof useCache>) {
  console.log('updateCharacterCache', character);
  if (character.id) {
    cache.set('character', character.id, character, CHARACTER_CACHE_DURATION);
  }
}

// Function to remove character from cache
export function removeCharacterFromCache(characterId: string, cache: ReturnType<typeof useCache>) {
  cache.remove('character', characterId);
}

// Function to clear all character cache
export function clearCharacterCache(cache: ReturnType<typeof useCache>) {
  cache.clearCache('character');
}
