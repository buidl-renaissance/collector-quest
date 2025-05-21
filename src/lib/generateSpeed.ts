import OpenAI from "openai";
import { Character, AbilityModifier } from "@/data/character";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

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

export function generateSpeed(character: Character): SpeedOutput {
  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  if (character.sheet?.combat?.speed) {
    return character.sheet.combat.speed;
  }

  const race = character.race.name;
  const subrace = character.race.subraces?.[0]?.name || null;
  const characterClass = character.class.name;
  const level = character.level || 1;
  const background = character.traits?.background || "";
  
  // Extract abilities from character
  const strengthScore = character.sheet?.abilitiesScores?.strength?.total || 10;
  
  // Extract equipment details
  let armorEquipped: "none" | "light" | "medium" | "heavy" = "none";
  if (character.equipment?.armor && character.equipment.armor.length > 0) {
    // Simplified logic - would need to be expanded based on actual armor data structure
    const armorName = character.equipment.armor[0].name.toLowerCase();
    if (armorName.includes("heavy")) armorEquipped = "heavy";
    else if (armorName.includes("medium")) armorEquipped = "medium";
    else if (armorName.includes("light")) armorEquipped = "light";
  }
  
  // Extract class features, racial abilities, and magic items
  const classFeatures = character.class.abilities?.map((ability: AbilityModifier) => ability.name) || [];
  const racialAbilities = character.race.abilities?.map((ability: AbilityModifier) => ability.name) || [];
  const magicItems = character.equipment?.magicItems?.map(item => item.name) || [];
  
  // Calculate base racial speed
  const racialBase = getRacialBaseSpeed(race, subrace);

  // Calculate class bonus
  const classBonus = getClassSpeedBonus(characterClass, level, classFeatures);
  
  // Calculate racial ability bonus
  const racialAbilityBonus = getRacialAbilityBonus(racialAbilities, racialBase);
  
  // Calculate magic item bonus
  const magicItemBonus = getMagicItemBonus(magicItems);
  
  // Calculate armor penalty
  const armorPenalty = getArmorPenalty(armorEquipped, strengthScore);
  
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
  
  // Generate narrative description if character has enough details
  if (character.name && character.race && character.class) {
    const description = generateSpeedDescription(character, result);
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

function generateSpeedDescription(
  character: Character,
  result: SpeedOutput
): string {
  const race = character.race?.name || "";
  const characterClass = character.class?.name || "";
  const background = character.traits?.background || "";
  
  // Generate a basic description based on character details
  if (result.modifiedSpeed >= 40) {
    return `${character.name} moves with exceptional speed, darting across the battlefield with the grace befitting a ${race} ${characterClass}.`;
  } else if (result.modifiedSpeed >= 35) {
    return `${character.name} moves swiftly and purposefully, their ${background} background evident in their confident stride.`;
  } else if (result.modifiedSpeed <= 25) {
    return `${character.name} moves steadily but deliberately, their ${race} heritage giving them a distinctive gait despite their slower pace.`;
  } else {
    return `${character.name} moves with the typical agility of a ${race} ${characterClass}, neither too fast nor too slow.`;
  }
}
