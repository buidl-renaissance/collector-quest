import { Race } from "@/data/races";
import { Character } from "@/data/character";

/**
 * Saves a race to the database
 * @param race The race to save
 * @returns The saved race
 */
export const saveRace = async (race: Race) => {
   const response = await fetch("/api/races", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: race.id,
      name: race.name,
      source: race.source,
      description: race.description,
      image: race.image,
      accessory: race.accessory,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save race and image");
  }

  return response.json();
}

export interface CharacterSummary {
  name: string;
  race: string;
  class: string;
  backstory: string;
  motivation: string;
  personality: string;
  bonds: string;
  flaws: string;
  alignment: string;
  deity: string;
  background: string;
  ideals: string;
  actions: string;
}

export function generateCharacterSummaries(characters: Character[]): CharacterSummary[] {
  return characters.map(generateCharacterSummary);
}

/**
 * Generates a formatted character summary string
 * @param character The character to generate a summary for
 * @returns Formatted string with character details
 */
export function generateCharacterSummary(character: Character): CharacterSummary {
  return {
    name: character.name,
    race: character.race?.name || 'Unknown',
    class: character.class?.name || 'Unknown',
    backstory: character.backstory || 'Unknown',
    motivation: character.motivation || 'Unknown',
    personality: character.traits?.personality?.join(', ') || 'Unknown',
    bonds: character.traits?.bonds?.join(', ') || 'Unknown',
    flaws: character.traits?.flaws?.join(', ') || 'Unknown',
    alignment: character.traits?.alignment || 'Unknown',
    deity: character.traits?.deity || 'Unknown',
    background: character.traits?.background || 'Unknown',
    ideals: character.traits?.ideals?.join(', ') || 'Unknown',
    actions: character.traits?.actions?.join(', ') || 'Unknown',
  };
}

/**
 * Formats a character summary into a descriptive string
 * @param summary The character summary to format
 * @returns Formatted string description
 */
export function formatCharacterDescription(summary: CharacterSummary, description?: string): string {
  return (
    `${description ? `${description}\n` : ''}` +
    `Name: ${summary.name}\n` +
    `Race: ${summary.race}\n` +
    `Class: ${summary.class}\n` +
    `Background: ${summary.background}\n` +
    `Motivation: ${summary.motivation}\n` +
    `Personality: ${summary.personality}\n` +
    `Bonds: ${summary.bonds}\n` +
    `Flaws: ${summary.flaws}\n` +
    `Alignment: ${summary.alignment}\n` +
    `Deity: ${summary.deity}\n` +
    `Background: ${summary.background}\n` +
    `Ideals: ${summary.ideals}\n` +
    `Actions: ${summary.actions}`
  );
}
