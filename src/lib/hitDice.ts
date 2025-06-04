import { Character } from "@/data/character";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface HitDiceInput {
  characterClass: string;
  level: number;
  constitutionModifier: number;
  narrativeFlavor?: boolean;
}

interface HitDiceOutput {
  hitDieType: string;
  totalHitDice: number;
  usedHitDice: number;
  maxHitPoints: number;
  description?: string;
}

/**
 * Determines the hit die type based on character class
 */
export function getHitDieType(characterClass: string): string {
  const hitDieByClass: Record<string, string> = {
    "Barbarian": "d12",
    "Fighter": "d10",
    "Paladin": "d10",
    "Ranger": "d10",
    "Bard": "d8",
    "Cleric": "d8",
    "Druid": "d8",
    "Monk": "d8",
    "Rogue": "d8",
    "Warlock": "d8",
    "Sorcerer": "d6",
    "Wizard": "d6"
  };

  return hitDieByClass[characterClass] || "d8"; // Default to d8 if class not found
}

/**
 * Gets the numeric value of a hit die type
 */
export function getHitDieValue(hitDieType: string): number {
  return parseInt(hitDieType.substring(1));
}

/**
 * Calculates starting hit points for a level 1 character
 */
export function calculateStartingHitPoints(hitDieType: string, constitutionModifier: number): number {
  const hitDieValue = getHitDieValue(hitDieType);
  return hitDieValue + constitutionModifier;
}

/**
 * Generates hit dice information for a character
 */
export async function generateHitDice(input: HitDiceInput): Promise<HitDiceOutput> {
  const hitDieType = getHitDieType(input.characterClass);
  const totalHitDice = input.level;
  const usedHitDice = 0; // New characters start with all hit dice available
  
  // For level 1, max hit points is the max value of the hit die + constitution modifier
  // For higher levels, we'd need to account for rolled values, but that's not part of this implementation
  const maxHitPoints = calculateStartingHitPoints(hitDieType, input.constitutionModifier);
  
  const result: HitDiceOutput = {
    hitDieType,
    totalHitDice,
    usedHitDice,
    maxHitPoints
  };
  
  // Generate narrative description if requested
  if (input.narrativeFlavor) {
    const description = await generateHitDiceDescription(input, result);
    result.description = description;
  }
  
  return result;
}

/**
 * Generates a narrative description of the character's hit dice
 */
async function generateHitDiceDescription(
  input: HitDiceInput,
  result: HitDiceOutput
): Promise<string> {
  const prompt = `
    Create a short, flavorful description (1-2 sentences) of a level ${input.level} ${input.characterClass}'s 
    vitality and endurance, represented by their hit dice (${result.totalHitDice}${result.hitDieType}) 
    and maximum hit points (${result.maxHitPoints}).
    
    The description should reflect the character class's typical physical condition and stamina.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant specializing in fantasy character descriptions. Create vivid, concise descriptions that capture a character's physical vitality and endurance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0]?.message?.content?.trim() || 
      `This ${input.characterClass} possesses ${result.maxHitPoints} hit points and ${result.totalHitDice}${result.hitDieType} hit dice, representing their physical endurance.`;
  } catch (error) {
    console.error("Error generating hit dice description:", error);
    return `This ${input.characterClass} possesses ${result.maxHitPoints} hit points and ${result.totalHitDice}${result.hitDieType} hit dice, representing their physical endurance.`;
  }
}

/**
 * Formats hit dice for display
 */
export function formatHitDice(totalHitDice: number, hitDieType: string, usedHitDice: number = 0): string {
  return `${totalHitDice}${hitDieType} (${usedHitDice} used)`;
}

/**
 * Creates a JSON representation of hit dice
 */
export function createHitDiceJSON(characterClass: string, level: number, usedHitDice: number = 0) {
  const hitDieType = getHitDieType(characterClass);
  
  return {
    type: hitDieType,
    total: level,
    used: usedHitDice
  };
}

/**
 * Rolls a hit die and returns the result
 * @param hitDieType The type of hit die (e.g. 'd6', 'd8', 'd10', 'd12')
 * @param constitutionModifier The character's constitution modifier
 * @returns Object containing the roll result and total healing
 */
export function rollHitDie(hitDieType: string, constitutionModifier: number = 0) {
  // Extract the die size number from the hit die type (e.g. 8 from 'd8')
  const dieSize = parseInt(hitDieType.replace('d', ''));
  
  // Roll the die (random number from 1 to die size)
  const roll = Math.floor(Math.random() * dieSize) + 1;
  
  // Calculate total healing (roll + constitution modifier)
  const total = roll + constitutionModifier;
  
  return {
    roll,
    constitutionModifier,
    total: Math.max(1, total) // Ensure minimum healing of 1
  };
}

/**
 * Represents different types of dice and their use cases in the game
 */
export const DICE_TYPES = {
  d4: { sides: 4, useCase: 'Small weapon damage, healing potions' },
  d6: { sides: 6, useCase: 'Common weapon damage, sneak attack' },
  d8: { sides: 8, useCase: 'Medium weapon damage' },
  d10: { sides: 10, useCase: 'Heavy weapon, spell damage' },
  d12: { sides: 12, useCase: 'Greataxe, Barbarian hit dice' },
  d20: { sides: 20, useCase: 'Attacks, skills, saves' },
  d100: { sides: 100, useCase: 'Random loot, wild magic' }
} as const;

/**
 * Rolls dice based on standard dice notation (e.g. "2d6+3")
 * @param notation Dice notation string (e.g. "2d6+3")
 * @returns Object containing individual rolls, modifier, and total
 */
export function rollDice(notation: string) {
  // Parse dice notation (e.g. "2d6+3" -> {count: 2, sides: 6, modifier: 3})
  const match = notation.toLowerCase().match(/^(\d+)d(\d+)(?:([+-])(\d+))?$/);
  if (!match) throw new Error('Invalid dice notation');

  const [_, countStr, sidesStr, op, modStr] = match;
  const count = parseInt(countStr);
  const sides = parseInt(sidesStr);
  const modifier = op && modStr ? (op === '+' ? 1 : -1) * parseInt(modStr) : 0;

  // Roll the dice
  const rolls = Array.from({ length: count }, () => 
    Math.floor(Math.random() * sides) + 1
  );

  // Calculate total
  const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;

  return {
    rolls,
    modifier,
    total
  };
}

/**
 * Rolls for specific game mechanics
 */
export const gameRolls = {
  attackRoll: (modifier: number) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    return { roll, total: roll + modifier };
  },

  savingThrow: (saveBonus: number) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    return { roll, total: roll + saveBonus };
  },

  initiative: (dexModifier: number) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    return { roll, total: roll + dexModifier };
  },

  deathSave: () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    return {
      roll,
      success: roll >= 10,
      critical: roll === 20,
      criticalFail: roll === 1
    };
  }
};

/**
 * Gets the dice notation string for a character action
 */
export const getDiceNotation = (
  action: 'attack' | 'damage' | 'heal' | 'ability' | 'save',
  character: Character
): string => {
  switch (action) {
    case 'attack':
      // Standard attack roll is 1d20 + modifiers
      return '1d20';

    case 'damage': {
      // Different weapons/classes have different damage dice
      const baseDamage = ((): string => {
        switch(character.class?.name) {
          case 'Fighter': return '1d8';
          case 'Rogue': return '1d6';
          case 'Wizard': return '1d6';
          case 'Cleric': return '1d6';
          default: return '1d8';
        }
      })();
      return baseDamage;
    }

    case 'heal': {
      // Healing typically scales with level
      const healDice = Math.ceil(character.level || 1 / 2);
      return `${healDice}d8`;
    }

    case 'ability':
      // Ability checks are 1d20
      return '1d20';

    case 'save':
      // Saving throws are 1d20
      return '1d20';

    default:
      return '1d20';
  }
};
