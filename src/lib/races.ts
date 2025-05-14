import db from '@/db/client';
import { Race, coreRaces, expandedRaces } from '@/data/races';

/**
 * Get a race by ID, falling back to predefined races if not found in database
 */
export async function getRaceById(id: string): Promise<Race | null> {
  // First try to get from database
  const dbRace = await db('races')
    .where({ id })
    .first();

  if (dbRace) {
    return dbRace;
  }

  // If not in database, check predefined races
  const allRaces = [...coreRaces, ...expandedRaces];
  const predefinedRace = allRaces.find(race => race.id === id);

  if (predefinedRace) {
    // Insert the predefined race into the database
    await db('races').insert({
      id: predefinedRace.id,
      name: predefinedRace.name,
      source: predefinedRace.source,
      image: predefinedRace.image,
      description: predefinedRace.description,
      accessory: predefinedRace.accessory,
      created_at: new Date(),
      updated_at: new Date()
    });

    return predefinedRace;
  }

  return null;
}

/**
 * Update a race, creating it from predefined races if it doesn't exist
 */
export async function updateRace(id: string, updates: Partial<Race>): Promise<Race | null> {
  // First try to get the race
  const existingRace = await getRaceById(id);

  if (!existingRace) {
    return null;
  }

  // Update the race in the database
  await db('races')
    .where({ id })
    .update({
      ...updates,
      updated_at: new Date()
    });

  // Fetch the updated race
  const updatedRace = await db('races')
    .where({ id })
    .first();

  return updatedRace;
}

/**
 * Get all races, combining database and predefined races
 */
export async function getAllRaces(): Promise<Race[]> {
  // Get all races from database
  const dbRaces = await db('races').select('*');

  // Get all predefined races
  const allPredefinedRaces = [...coreRaces, ...expandedRaces];

  // Create a map of existing database races
  const existingRaces = new Map(dbRaces.map(race => [race.id, race]));

  // Combine races, preferring database versions
  const combinedRaces = allPredefinedRaces.map(race => 
    existingRaces.get(race.id) || race
  );

  return combinedRaces;
} 