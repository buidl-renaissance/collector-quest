import client from './client';
import { CharacterClass } from '../data/classes';

interface CharacterClassColumns {
  id: string;
  name: string;
  description: string;
  abilities: string;
  image: string;
}

/**
 * Get all character classes from the database
 */
export async function getAllClasses(): Promise<CharacterClass[]> {
  return client('classes')
    .select('*')
    .then(classes => classes.map(cls => ({
      ...cls,
      abilities: typeof cls.abilities === 'string' ? JSON.parse(cls.abilities) : cls.abilities
    })));
}

/**
 * Get a character class by its ID
 */
export async function getClassById(id: string): Promise<CharacterClass | null> {
  const result = await client('classes')
    .select('*')
    .where({ id })
    .first();
  
  if (!result) return null;
  
  return {
    ...result,
    abilities: typeof result.abilities === 'string' ? JSON.parse(result.abilities) : result.abilities
  };
}

/**
 * Create a new character class
 */
export async function createClass(characterClass: CharacterClass): Promise<CharacterClass> {
  const [created] = await client('classes')
    .insert({
      ...characterClass,
      abilities: JSON.stringify(characterClass.abilities)
    })
    .returning('*');
  
  return {
    ...created,
    abilities: typeof created.abilities === 'string' ? JSON.parse(created.abilities) : created.abilities
  };
}

/**
 * Update an existing character class
 */
export async function updateClass(id: string, characterClass: Partial<CharacterClass>): Promise<CharacterClass | null> {
  const updateData = { ...characterClass } as unknown as CharacterClassColumns;
  
  if (updateData.abilities) {
    updateData.abilities = JSON.stringify(updateData.abilities);
  }
  
  const [updated] = await client('classes')
    .where({ id })
    .update(updateData)
    .returning('*');
  
  if (!updated) return null;
  
  return {
    ...updated,
    abilities: typeof updated.abilities === 'string' ? JSON.parse(updated.abilities) : updated.abilities
  };
}

/**
 * Delete a character class by its ID
 */
export async function deleteClass(id: string): Promise<boolean> {
  const deleted = await client('classes')
    .where({ id })
    .delete();
  
  return deleted > 0;
}

/**
 * Get usage statistics for a character class
 */
export async function getClassStats(id: string): Promise<{ totalCharacters: number, activeCharacters: number, lastUsed: string | null }> {
  // This would typically join with a characters table to get usage data
  // For now, returning placeholder data
  return {
    totalCharacters: 0,
    activeCharacters: 0,
    lastUsed: null
  };
}
