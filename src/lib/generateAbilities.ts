import OpenAI from "openai";
import { Character } from "@/hooks/useCharacter";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface AbilityScoreDetails {
  base: number;
  modifier: number;
  total: number;
}

export interface DetailedAbilityScores {
  strength: AbilityScoreDetails;
  dexterity: AbilityScoreDetails;
  constitution: AbilityScoreDetails;
  intelligence: AbilityScoreDetails;
  wisdom: AbilityScoreDetails;
  charisma: AbilityScoreDetails;
}

interface Ability {
  name: string;
  description: string;
  level: number;
  abilityScore: keyof AbilityScores;
  abilityBonus: number;
}

/**
 * Roll 4d6, drop the lowest die, and sum the remaining three
 */
function roll4d6DropLowest(): number {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b);
  return rolls.slice(1).reduce((sum, val) => sum + val, 0);
}

/**
 * Generate base ability scores using 4d6 drop lowest method
 */
function generateBaseAbilityScores(): AbilityScores {
  return {
    strength: roll4d6DropLowest(),
    dexterity: roll4d6DropLowest(),
    constitution: roll4d6DropLowest(),
    intelligence: roll4d6DropLowest(),
    wisdom: roll4d6DropLowest(),
    charisma: roll4d6DropLowest(),
  };
}

function modifier(score: keyof AbilityScores, abilities: Ability[]): number {
  const ability = abilities.find(a => a.abilityScore === score);
  if (ability) {
    return ability.abilityBonus;
  }
  return 0;
}

function calculateAbilityScore(baseScores: AbilityScores, type: keyof AbilityScores, abilities: Ability[]): AbilityScoreDetails {
  const ability = abilities.find(a => a.abilityScore === type);
  if (ability) {
    return {
      base: baseScores[type],
      modifier: modifier(type, abilities),
      total: baseScores[type] + modifier(type, abilities),
    };
  }
  return {
    base: 0,
    modifier: 0,
    total: 0,
  };
}

export function calculateAbilityScores(abilities: Ability[]): DetailedAbilityScores {
  const baseScores = generateBaseAbilityScores();
  return {
    strength: calculateAbilityScore(baseScores, "strength", abilities),
    dexterity: calculateAbilityScore(baseScores, "dexterity", abilities),
    constitution: calculateAbilityScore(baseScores, "constitution", abilities),
    intelligence: calculateAbilityScore(baseScores, "intelligence", abilities),
    wisdom: calculateAbilityScore(baseScores, "wisdom", abilities),
    charisma: calculateAbilityScore(baseScores, "charisma", abilities),
  };
}

/**
 * Generate ability score modifiers using OpenAI
 */
export async function generateAbilities(
  character: Character
): Promise<Ability[]> {
  if (!character.race || !character.class) {
    return [];
  }

  const raceName = character.race.name;
  const subraceName = character.race.subraces?.[0]?.name || null;
  const className = character.class.name;
  
  const prompt = `
    Create ability score modifiers for a ${raceName}${subraceName ? ` (${subraceName})` : ''} ${className} in D&D 5e.
    Each modifier should include a name, description, level requirement, the ability score it affects, and the bonus amount.
    Format the response as a JSON array of objects with the following structure:
    {
      "name": "Name of the ability",
      "description": "Description of how this racial or class feature affects the ability score",
      "level": 1,
      "abilityScore": "strength|dexterity|constitution|intelligence|wisdom|charisma",
      "abilityBonus": 1
    }
    Include both racial and class-based ability modifiers. Be creative but accurate to D&D 5e rules.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a D&D 5e rules expert who creates accurate character ability modifiers." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      return [];
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return [];
    }

    const abilities = JSON.parse(jsonMatch[0]) as Ability[];
    return abilities;
  } catch (error) {
    console.error("Error generating ability modifiers:", error);
    return [];
  }
}
