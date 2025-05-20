import { inngest } from "./client";
import { Character } from "@/data/character";
import { CharacterDB } from "@/db/character";
import { generateArmor } from "@/lib/generateArmor";
import { generateInitiative } from "@/lib/generateInitiative";
import { generateSpeed } from "@/lib/generateSpeed";
import { generateSkills } from "@/lib/generateSkills";
import { generateFeaturesTraits } from "@/lib/generateFeaturesTraits";
import { calculateAbilityScores, generateAbilities } from "@/lib/generateAbilities";

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
      return {
        step: "calculate-abilities",
        message: "Calculated character abilities",
        abilities,
        abilitiesScores
      };
    });

    // Step 1: Calculate base stats
    const baseStatsResult = await step.run("calculate-base-stats", async () => {
      // Calculate armor class based on class, race, and equipment
      const armorClass = await generateArmor(character);
      
      // Calculate initiative based on dexterity
      const initiative = await generateInitiative(character);
      
      // Calculate speed based on race and class
      const speed = await generateSpeed(character);

      return {
        step: "calculate-base-stats",
        message: "Calculated base character statistics",
        stats: { armorClass, initiative, speed }
      };
    });

    // Step 2: Generate skills
    const skillsResult = await step.run("generate-skills", async () => {
      const characterSkills = await generateSkills(character);
      return {
        step: "generate-skills",
        message: "Generated character skills",
        skills: characterSkills
      };
    });

    // Step 3: Generate features and traits
    const featuresAndTraitsResult = await step.run("generate-features-traits", async () => {
      const featuresAndTraits = await generateFeaturesTraits(character);
      
      return {
        step: "generate-features-traits",
        message: "Generated character features and traits",
        featuresAndTraits
      };
    });

    // Step 4: Save character sheet
    await step.run("save-character-sheet", async () => {
      if (!character.id) {
        throw new Error("Character ID is required");
      }

      // Here you would save the character sheet to your database
      await characterDB.updateCharacter(character.id, {
        sheet: {
          abilities: abilitiesResult.abilities,
          abilitiesScores: abilitiesResult.abilitiesScores,
          combat: {
            attacks: [],
            armor: baseStatsResult.stats.armorClass,
            initiative: baseStatsResult.stats.initiative,
            speed: baseStatsResult.stats.speed,
            currentHitPoints: 0,
            hitDice: {
              type: "d8",
              bonus: 0,
              count: 1,
              current: 0,
            },
          },
          deathSaves: {
            successes: 0,
            failures: 0,
          },
          skills: skillsResult.skills,
          featuresAndTraits: featuresAndTraitsResult.featuresAndTraits,
          proficiencies: [],
          languages: [],
        }
      });

      return {
        step: "save-character-sheet",
        message: "Saved character sheet",
        success: true
      };
    });

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