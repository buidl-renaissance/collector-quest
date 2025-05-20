import { inngest } from "./client";
import { Character } from "@/hooks/useCharacter";

interface GenerateSheetEvent {
  data: {
    characterId: string;
    character: Character;
    resultId?: string;
  };
}

interface CharacterSheet {
  armorClass: number;
  initiative: number;
  speed: number;
  skills: {
    name: string;
    ability: string;
    proficient: boolean;
    bonus: number;
  }[];
  features: {
    name: string;
    description: string;
    source: string;
  }[];
  traits: {
    name: string;
    description: string;
    source: string;
  }[];
}

export const generateCharacterSheet = inngest.createFunction(
  { name: "Generate Character Sheet", id: "generate-character-sheet" },
  { event: "character/sheet/generate" },
  async ({ event, step }) => {
    const { character } = event.data as GenerateSheetEvent["data"];

    // Step 1: Calculate base stats
    const baseStats = await step.run("calculate-base-stats", async () => {
      // Calculate armor class based on class, race, and equipment
      const armorClass = calculateArmorClass(character);
      
      // Calculate initiative based on dexterity
      const initiative = calculateInitiative(character);
      
      // Calculate speed based on race and class
      const speed = calculateSpeed(character);

      return {
        step: "calculate-base-stats",
        message: "Calculated base character statistics",
        stats: { armorClass, initiative, speed }
      };
    });

    // Step 2: Generate skills
    const skills = await step.run("generate-skills", async () => {
      const characterSkills = generateSkills(character);
      return {
        step: "generate-skills",
        message: "Generated character skills",
        skills: characterSkills
      };
    });

    // Step 3: Generate features and traits
    const featuresAndTraits = await step.run("generate-features-traits", async () => {
      const features = generateFeatures(character);
      const traits = generateTraits(character);
      
      return {
        step: "generate-features-traits",
        message: "Generated character features and traits",
        features,
        traits
      };
    });

    // Step 4: Save character sheet
    await step.run("save-character-sheet", async () => {
      // Here you would save the character sheet to your database
      return {
        step: "save-character-sheet",
        message: "Saved character sheet",
        success: true
      };
    });

    return {
      success: true,
      sheet: {
        armorClass: baseStats.stats.armorClass,
        initiative: baseStats.stats.initiative,
        speed: baseStats.stats.speed,
        skills: skills.skills,
        features: featuresAndTraits.features,
        traits: featuresAndTraits.traits
      }
    };
  }
);

// Helper functions for calculations
function calculateArmorClass(character: Character): number {
  // Base AC calculation based on class, race, and equipment
  let baseAC = 10;
  
  // Add dexterity modifier
  const dexMod = Math.floor((character.abilities.dexterity - 10) / 2);
  baseAC += dexMod;

  // Add armor bonus if wearing armor
  if (character.equipment?.armor) {
    const armor = character.equipment.armor[0];
    switch (armor.name.toLowerCase()) {
      case 'chain mail':
        baseAC = 16;
        break;
      case 'leather armor':
        baseAC = 11 + dexMod;
        break;
      // Add more armor types as needed
    }
  }

  return baseAC;
}

function calculateInitiative(character: Character): number {
  const dexMod = Math.floor((character.abilities.dexterity - 10) / 2);
  return dexMod;
}

function calculateSpeed(character: Character): number {
  // Base speed from race
  let speed = 30; // Default human speed
  
  // Adjust based on race
  if (character.race?.name) {
    switch (character.race.name.toLowerCase()) {
      case 'dwarf':
        speed = 25;
        break;
      case 'elf':
        speed = 35;
        break;
      // Add more races as needed
    }
  }

  return speed;
}

function generateSkills(character: Character) {
  const skills = [
    { name: "Acrobatics", ability: "Dexterity" },
    { name: "Animal Handling", ability: "Wisdom" },
    { name: "Arcana", ability: "Intelligence" },
    { name: "Athletics", ability: "Strength" },
    { name: "Deception", ability: "Charisma" },
    { name: "History", ability: "Intelligence" },
    { name: "Insight", ability: "Wisdom" },
    { name: "Intimidation", ability: "Charisma" },
    { name: "Investigation", ability: "Intelligence" },
    { name: "Medicine", ability: "Wisdom" },
    { name: "Nature", ability: "Intelligence" },
    { name: "Perception", ability: "Wisdom" },
    { name: "Performance", ability: "Charisma" },
    { name: "Persuasion", ability: "Charisma" },
    { name: "Religion", ability: "Intelligence" },
    { name: "Sleight of Hand", ability: "Dexterity" },
    { name: "Stealth", ability: "Dexterity" },
    { name: "Survival", ability: "Wisdom" }
  ];

  // Calculate proficiency bonus based on level
  const proficiencyBonus = Math.floor((character.level - 1) / 4) + 2;

  // Add proficiency and calculate bonuses
  return skills.map(skill => {
    const abilityScore = character.abilities[skill.ability.toLowerCase() as keyof typeof character.abilities];
    const abilityMod = Math.floor((abilityScore - 10) / 2);
    const proficient = character.class?.proficiencies?.skills?.includes(skill.name) || false;
    const bonus = abilityMod + (proficient ? proficiencyBonus : 0);

    return {
      ...skill,
      proficient,
      bonus
    };
  });
}

function generateFeatures(character: Character) {
  const features = [];

  // Add class features
  if (character.class?.features) {
    features.push(...character.class.features.map(feature => ({
      name: feature.name,
      description: feature.description,
      source: character.class?.name || "Class"
    })));
  }

  // Add race features
  if (character.race?.features) {
    features.push(...character.race.features.map(feature => ({
      name: feature.name,
      description: feature.description,
      source: character.race?.name || "Race"
    })));
  }

  return features;
}

function generateTraits(character: Character) {
  const traits = [];

  // Add background traits
  if (character.background?.traits) {
    traits.push(...character.background.traits.map(trait => ({
      name: trait.name,
      description: trait.description,
      source: character.background?.name || "Background"
    })));
  }

  // Add race traits
  if (character.race?.traits) {
    traits.push(...character.race.traits.map(trait => ({
      name: trait.name,
      description: trait.description,
      source: character.race?.name || "Race"
    })));
  }

  return traits;
} 