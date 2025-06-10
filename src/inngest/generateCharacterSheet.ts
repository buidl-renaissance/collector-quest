import { inngest } from "./client";
import { Character } from "@/data/character";
import { CharacterDB } from "@/db/character";
import { generateArmor } from "@/lib/generateArmor";
import { generateInitiative } from "@/lib/generateInitiative";
import { generateSpeed } from "@/lib/generateSpeed";
import { generateSkills } from "@/lib/generateSkills";
import { generateFeaturesTraits } from "@/lib/generateFeaturesTraits";
import { calculateAbilityScores, generateAbilities } from "@/lib/generateAbilities";
import { generateAttacks } from "@/lib/generateAttacks";
import { generateLanguages } from "@/lib/generateLanguages";
import { generateProficiencies } from "@/lib/generateProficiencies";
import { updateResult, completeResult, createResult, failResult } from "@/db/generate";

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

    await updateResult(event.data.resultId!, 'pending', 'calculate-abilities', 'Calculating character abilities', null);

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

    await updateResult(event.data.resultId!, 'pending', 'calculate-combat', 'Calculating combat stats', {
      abilities: abilitiesResult.abilities,
      abilitiesScores: abilitiesResult.abilitiesScores,
    });

    // Step 1: Calculate base stats
    const combatResult = await step.run("calculate-combat", async () => {
      // Calculate armor class based on class, race, and equipment
      const armorClass = await generateArmor(character);
      
      // Calculate initiative based on dexterity
      const initiative = await generateInitiative(character, abilitiesResult.abilitiesScores);
      
      // Calculate speed based on race and class
      const speed = await generateSpeed(character);

      // Generate attacks for the character
      const characterAttacks = await generateAttacks(character);

      const combat = {
        attacks: characterAttacks,
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
      };

      if (character.id) {
        characterDB.updateCharacterSheet(character.id, {
          combat: combat,
        });
      }
  
      return {
        step: "calculate-base-stats",
        message: "Calculated base character stats",
        combat: combat,
      };
    });

    await updateResult(event.data.resultId!, 'pending', 'generate-skills', 'Generating character skills', {
      abilities: abilitiesResult.abilities,
      abilitiesScores: abilitiesResult.abilitiesScores,
      combat: combatResult.combat,
    });

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

    await updateResult(event.data.resultId!, 'pending', 'generate-features-traits', 'Generating character features and traits', {
      abilities: abilitiesResult.abilities,
      abilitiesScores: abilitiesResult.abilitiesScores,
      combat: combatResult.combat,
      skills: skillsResult.skills,
    });

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

    // Step 4: Generate languages and proficiencies
    const languages = await step.run("generate-languages", async () => {
      return generateLanguages(character);
    });

    const proficiencies = await step.run("generate-proficiencies", async () => {
      return generateProficiencies(character);
    });

    // Combine all data into final character sheet
    const characterSheet = {
      abilities: abilitiesResult.abilities,
      abilitiesScores: abilitiesResult.abilitiesScores,
      combat: combatResult.combat,
      skills: skillsResult.skills,
      featuresAndTraits: featuresAndTraitsResult.featuresAndTraits,
      languages,
      proficiencies,
    };

    await completeResult(event.data.resultId!, "Generated character sheet", characterSheet);

    return {
      success: true,
      sheet: characterSheet,
    };
  }
);