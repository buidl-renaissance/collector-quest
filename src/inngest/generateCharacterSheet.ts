import { inngest } from "./client";
import { Character } from "@/data/character";
import { CharacterDB } from "@/db/character";
import { generateArmor } from "@/lib/generateArmor";
import { generateInitiative } from "@/lib/generateInitiative";
import { generateSpeed } from "@/lib/generateSpeed";
import { generateSkills } from "@/lib/generateSkills";
import { generateFeaturesTraits } from "@/lib/generateFeaturesTraits";
import { calculateAbilityScores, generateAbilities } from "@/lib/generateAbilities";
import { updateResult, completeResult } from "@/lib/storage";

interface GenerateSheetEvent {
  data: {
    characterId: string;
    character: Character;
    resultId?: string;
  };
}

const characterDB = new CharacterDB();

export const generateCharacterSheet = inngest.createFunction(
  { name: "Generate Character Sheet", id: "generate-character-sheet" },
  { event: "character/sheet/generate" },
  async ({ event, step }) => {
    const { character } = event.data as GenerateSheetEvent["data"];

    if (!character || !character.id) {
      throw new Error("Character not found");
    }

    // Step 0: Calculate abilities
    const abilitiesResult = await step.run("calculate-abilities", async () => {
      const abilities = await generateAbilities(character);
      const abilitiesScores = await calculateAbilityScores(abilities);
      if (character.id) {
        characterDB.updateCharacterSheet(character.id, {
          abilities: abilities,
          abilitiesScores: abilitiesScores,
        });
      }
      return {
        step: "calculate-abilities",
        message: "Calculated character abilities",
        abilities,
        abilitiesScores
      };
    });

    updateResult(event.data.resultId!, JSON.stringify({
      message: "Calculated character abilities",
      step: "calculate-abilities",
      abilities: abilitiesResult.abilities,
      abilitiesScores: abilitiesResult.abilitiesScores,
    }));

    // Step 1: Calculate base stats
    const baseStatsResult = await step.run("calculate-base-stats", async () => {
      // Calculate armor class based on class, race, and equipment
      const armorClass = await generateArmor(character);
      
      // Calculate initiative based on dexterity
      const initiative = await generateInitiative(character, abilitiesResult.abilitiesScores);
      
      // Calculate speed based on race and class
      const speed = await generateSpeed(character);

      if (character.id) {
        characterDB.updateCharacterSheet(character.id, {
          combat: {
            attacks: [],
            armor: armorClass,
            initiative: initiative,
            speed: speed,
            currentHitPoints: 0,
            hitDice: {
              type: "d8",
              bonus: 0,
              count: 1,
              current: 0,
            },
          },
        });
      }

      return {
        step: "calculate-base-stats",
        message: "Calculated base character statistics",
        stats: { armorClass, initiative, speed }
      };
    });

    updateResult(event.data.resultId!, JSON.stringify({
      message: "Calculated base character statistics",
      step: "calculate-base-stats",
      armorClass: baseStatsResult.stats.armorClass,
      initiative: baseStatsResult.stats.initiative,
      speed: baseStatsResult.stats.speed,
    }));

    // Step 2: Generate skills
    const skillsResult = await step.run("generate-skills", async () => {
      const characterSkills = await generateSkills(character);
      if (character.id) {
        characterDB.updateCharacterSheet(character.id, {
          skills: characterSkills,
        });
      }
      return {
        step: "generate-skills",
        message: "Generated character skills",
        skills: characterSkills
      };
    });
    
    updateResult(event.data.resultId!, JSON.stringify({
      message: "Generated character skills",
      step: "generate-skills",
      skills: skillsResult.skills,
    }));

    // Step 3: Generate features and traits
    const featuresAndTraitsResult = await step.run("generate-features-traits", async () => {
      const featuresAndTraits = await generateFeaturesTraits(character);
      if (character.id) {
        characterDB.updateCharacterSheet(character.id, {
          featuresAndTraits: featuresAndTraits,
        });
      }
      return {
        step: "generate-features-traits",
        message: "Generated character features and traits",
        featuresAndTraits
      };
    });

    completeResult(event.data.resultId!, JSON.stringify({
      message: "Generated character features and traits",
      step: "generate-features-traits",
      featuresAndTraits: featuresAndTraitsResult.featuresAndTraits,
    }));

    return {
      success: true,
      sheet: {
        armorClass: baseStatsResult.stats.armorClass,
        initiative: baseStatsResult.stats.initiative,
        speed: baseStatsResult.stats.speed,
        skills: skillsResult.skills,
        featuresAndTraits: featuresAndTraitsResult.featuresAndTraits,
      }
    };
  }
);