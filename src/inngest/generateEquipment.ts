import { completeResult } from "@/lib/storage";
import { inngest } from "./client";
import { Character } from "@/hooks/useCharacter";
import { generateEquipment as generateEquipmentFunction } from "@/lib/generateEquipment";
import { CharacterDB } from "@/db/character";
import { Equipment } from "@/data/character";

interface GenerateEquipmentEvent {
  data: {
    characterId: string;
    character: Character;
    resultId?: string;
  };
}

interface EquipmentResult {
  step: string;
  message: string;
  equipment: Equipment;
}

export const generateEquipment = inngest.createFunction(
  { name: "Generate Equipment", id: "generate-equipment" },
  { event: "equipment/generate" },
  async ({ event, step }) => {
    const { characterId, character } =
      event.data as GenerateEquipmentEvent["data"];

    if (!character) {
      throw new Error("Character not found");
    }

    const characterDB = new CharacterDB();

    if (character.equipment) {
      completeResult(
        event.data.resultId,
        JSON.stringify({
          success: true,
          step: "complete",
          message: "Equipment generated successfully",
          equipment: character.equipment,
        })
      );

      return {
        success: true,
        equipment: character.equipment,
      };
    }

    // Step 1: Analyze character details
    await step.run("analyze-character", async () => {
      return {
        step: "analyze-character",
        message: "Analyzing character details for equipment generation",
      };
    });

    // Step 2: Generate equipment based on class and background
    const equipmentResult = await step.run("generate-equipment", async () => {
      const equipment = await generateEquipmentFunction(character);

      return {
        step: "generate-equipment",
        message: "Generated equipment based on character details",
        equipment: equipment,
      };
    });

    // Step 3: Save equipment to character
    await step.run("save-equipment", async () => {
      // Here you would save the equipment to your database
      await characterDB.updateCharacter(characterId, {
        equipment: equipmentResult.equipment as Equipment,
      });
      return {
        step: "save-equipment",
        message: "Saved equipment to character",
        success: true,
      };
    });

    completeResult(
      event.data.resultId,
      JSON.stringify({
        success: true,
        step: "complete",
        message: "Equipment generated successfully",
        equipment: equipmentResult.equipment,
      })
    );

    return {
      success: true,
      equipment: equipmentResult.equipment,
    };
  }
);
