import { getCharacter, setCharacter } from '@/utils/storage';
import { Character } from '@/data/character';

// Cache duration in milliseconds (1 hour default)
export const CACHE_DURATION_MS = 60 * 60 * 1000;

export async function getCharacterById(id: string): Promise<Character | null> {
  // Check local storage first
  const cachedCharacter = getCharacter(id);
  if (cachedCharacter && cachedCharacter.timestamp && 
      Date.now() - cachedCharacter.timestamp < CACHE_DURATION_MS) {
    return cachedCharacter as Character;
  }

  // Fetch from API if not in local storage or cache expired
  try {
    const response = await fetch(`/api/characters/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch character');
    }
    const character: Character = await response.json();
    
    // Store in local storage with timestamp
    setCharacter(id, {
      ...character,
      timestamp: Date.now()
    });
    return character;
  } catch (error) {
    console.error('Error fetching character:', error);
    return null;
  }
}

export async function getCharactersByIds(ids: string[]): Promise<(Character | null)[]> {
  const characters: (Character | null)[] = [];
  
  for (const id of ids) {
    // Check local storage first
    const cachedCharacter = getCharacter(id);
    if (cachedCharacter && cachedCharacter.timestamp && 
        Date.now() - cachedCharacter.timestamp < CACHE_DURATION_MS) {
      characters.push(cachedCharacter as Character);
      continue;
    }

    // Fetch from API if not in local storage or cache expired
    try {
      const response = await fetch(`/api/characters/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch character ${id}`);
      }
      const character: Character = await response.json();
      
      // Store in local storage with timestamp
      setCharacter(id, {
        ...character,
        timestamp: Date.now()
      });
      characters.push(character);
    } catch (error) {
      console.error(`Error fetching character ${id}:`, error);
      characters.push(null);
    }
  }

  return characters;
}
