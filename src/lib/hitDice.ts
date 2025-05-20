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
