import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SpeedInput {
  race: string;
  subrace: string | null;
  class: string;
  level: number;
  background: string;
  armorEquipped: "none" | "light" | "medium" | "heavy";
  strengthScore: number;
  classFeatures: string[];
  racialAbilities: string[];
  magicItems: string[];
  terrainModifier?: string;
  narrativeFlavor?: boolean;
  outputFormat?: string;
}

interface SpeedOutput {
  baseSpeed: number;
  modifiedSpeed: number;
  breakdown: {
    racialBase: number;
    classBonus: number;
    racialAbilityBonus: number;
    magicItemBonus: number;
    armorPenalty: number;
  };
  description?: string;
}

export async function generateSpeed(input: SpeedInput): Promise<SpeedOutput> {
  // Calculate base racial speed
  const racialBase = getRacialBaseSpeed(input.race, input.subrace);

  // Calculate class bonus
  const classBonus = getClassSpeedBonus(input.class, input.level, input.classFeatures);
  
  // Calculate racial ability bonus
  const racialAbilityBonus = getRacialAbilityBonus(input.racialAbilities, racialBase);
  
  // Calculate magic item bonus
  const magicItemBonus = getMagicItemBonus(input.magicItems);
  
  // Calculate armor penalty
  const armorPenalty = getArmorPenalty(input.armorEquipped, input.strengthScore);
  
  // Calculate total speed
  const baseSpeed = racialBase;
  const modifiedSpeed = racialBase + classBonus + racialAbilityBonus + magicItemBonus - armorPenalty;
  
  // Create result object
  const result: SpeedOutput = {
    baseSpeed,
    modifiedSpeed,
    breakdown: {
      racialBase,
      classBonus,
      racialAbilityBonus,
      magicItemBonus,
      armorPenalty
    }
  };
  
  // Generate narrative description if requested
  if (input.narrativeFlavor) {
    const description = await generateSpeedDescription(input, result);
    result.description = description;
  }
  
  return result;
}

function getRacialBaseSpeed(race: string, subrace: string | null): number {
  // Default speed for most races
  const raceSpeeds: Record<string, number> = {
    "Human": 30,
    "Elf": 30,
    "Half-Elf": 30,
    "Dwarf": 25,
    "Halfling": 25,
    "Gnome": 25,
    "Half-Orc": 30,
    "Tiefling": 30,
    "Dragonborn": 30,
    "Tabaxi": 30,
    "Aarakocra": 25, // 25 walking, but 50 flying
    "Kenku": 30,
    "Goliath": 30,
    "Firbolg": 30,
    "Lizardfolk": 30,
    "Triton": 30,
    "Genasi": 30,
    "Aasimar": 30,
    "Bugbear": 30,
    "Goblin": 30,
    "Hobgoblin": 30,
    "Kobold": 30,
    "Orc": 30,
    "Yuan-ti": 30
  };
  
  // Subrace modifications
  if (race === "Elf") {
    if (subrace === "Wood Elf") {
      return 35;
    }
  }
  
  return raceSpeeds[race] || 30; // Default to 30 if race not found
}

function getClassSpeedBonus(characterClass: string, level: number, classFeatures: string[]): number {
  let bonus = 0;
  
  // Monk's Unarmored Movement
  if (characterClass === "Monk" && classFeatures.includes("Unarmored Movement")) {
    if (level >= 2 && level < 6) bonus += 10;
    else if (level >= 6 && level < 10) bonus += 15;
    else if (level >= 10 && level < 14) bonus += 20;
    else if (level >= 14 && level < 18) bonus += 25;
    else if (level >= 18) bonus += 30;
  }
  
  // Barbarian's Fast Movement
  if (characterClass === "Barbarian" && level >= 5 && classFeatures.includes("Fast Movement")) {
    bonus += 10;
  }
  
  return bonus;
}

function getRacialAbilityBonus(racialAbilities: string[], baseSpeed: number): number {
  let bonus = 0;
  
  // Tabaxi's Feline Agility
  if (racialAbilities.includes("Feline Agility")) {
    bonus += baseSpeed; // Doubles speed
  }
  
  // Wood Elf's Fleet of Foot
  if (racialAbilities.includes("Fleet of Foot")) {
    bonus += 5;
  }
  
  return bonus;
}

function getMagicItemBonus(magicItems: string[]): number {
  let bonus = 0;
  
  // Boots of Speed
  if (magicItems.includes("Boots of Speed")) {
    // Note: Boots of Speed actually double your speed when activated
    // For simplicity, we're not applying the doubling effect here
    bonus += 0;
  }
  
  // Boots of Striding and Springing
  if (magicItems.includes("Boots of Striding and Springing")) {
    bonus += 10;
  }
  
  return bonus;
}

function getArmorPenalty(armorType: string, strengthScore: number): number {
  // Heavy armor can reduce speed if strength requirement not met
  if (armorType === "heavy") {
    // Different heavy armors have different STR requirements
    // Simplified for this example
    const strengthRequirement = 15;
    
    if (strengthScore < strengthRequirement) {
      return 10;
    }
  }
  
  return 0;
}

async function generateSpeedDescription(
  input: SpeedInput,
  result: SpeedOutput
): Promise<string> {
  const prompt = `
    Create a short, vivid description (1-2 sentences) of how a ${input.race} ${input.class} 
    with a ${input.background} background moves at a speed of ${result.modifiedSpeed} feet.
    
    Character details:
    - Level: ${input.level}
    - Base speed: ${result.baseSpeed} feet
    - Class features: ${input.classFeatures.join(", ")}
    - Racial abilities: ${input.racialAbilities.join(", ")}
    - Magic items: ${input.magicItems.join(", ")}
    ${input.terrainModifier ? `- Moving through: ${input.terrainModifier} terrain` : ""}
    
    The description should be vivid and reflect the character's movement style based on their race and class.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant specializing in fantasy character descriptions. Create vivid, concise descriptions that capture a character's unique movement style."
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
      `The ${input.race} ${input.class} moves with remarkable speed and agility.`;
  } catch (error) {
    console.error("Error generating speed description:", error);
    return `The ${input.race} ${input.class} moves with remarkable speed and agility.`;
  }
}
