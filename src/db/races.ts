import { Race } from "@/data/races";
import client from "./client";

/**
 * Fetches all races from the database
 * @returns Promise<Race[]> Array of all races
 */
export async function getAllRaces(): Promise<Race[]> {
  try {
    const races = await client('races').select('*').orderBy('name', 'asc');
    return races;
  } catch (error) {
    console.error("Database error when fetching races:", error);
    throw new Error("Failed to fetch races");
  }
}

/**
 * Fetches a race by its ID
 * @param id The race ID to fetch
 * @returns Promise<Race | null> The race or null if not found
 */
export async function getRaceById(id: string): Promise<Race | null> {
  try {
    const result = await client('races').select('*').where('id', id).first();
    return result || null;
  } catch (error) {
    console.error(`Database error when fetching race ${id}:`, error);
    throw new Error("Failed to fetch race");
  }
}

/**
 * Creates a new race or updates an existing one
 * @param race The race data to save
 * @returns Promise<Race> The saved race
 */
export async function saveRace(race: Race): Promise<Race> {
  try {
    // Check if race exists
    const existingRace = await getRaceById(race.id);
    
    if (existingRace) {
      // Update existing race
      await client('races')
        .where('id', race.id)
        .update({
          name: race.name || existingRace.name,
          source: race.source || existingRace.source,
          description: race.description || existingRace.description,
          image: race.image || existingRace.image,
          accessory: race.accessory || existingRace.accessory
        });
      
      // Fetch the updated record
      const updatedRace = await getRaceById(race.id);
      if (!updatedRace) {
        throw new Error("Failed to fetch updated race");
      }
      return updatedRace;
    } else {
      // Insert new race
      await client('races')
        .insert({
          id: race.id,
          name: race.name,
          source: race.source,
          description: race.description,
          image: race.image,
          accessory: race.accessory
        });
      
      // Fetch the inserted record
      const newRace = await getRaceById(race.id);
      if (!newRace) {
        throw new Error("Failed to fetch new race");
      }
      return newRace;
    }
  } catch (error) {
    console.error("Database error when saving race:", error);
    throw new Error("Failed to save race");
  }
}

/**
 * Deletes a race by its ID
 * @param id The race ID to delete
 * @returns Promise<boolean> True if deleted, false if not found
 */
export async function deleteRace(id: string): Promise<boolean> {
  try {
    const count = await client('races').where('id', id).delete();
    return count > 0;
  } catch (error) {
    console.error(`Database error when deleting race ${id}:`, error);
    throw new Error("Failed to delete race");
  }
}
