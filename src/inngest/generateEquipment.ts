import { completeResult } from "@/db/generate";
import { inngest } from "./client";
import { generateEquipment as generateEquipmentFunction } from "@/lib/generateEquipment";
import { CharacterDB } from "@/db/character";
import { Equipment } from "@/data/character";

interface GenerateEquipmentEvent {
  data: {
    characterId: string;
    resultId?: string;
  };
}

export const generateEquipment = inngest.createFunction(
  { name: "Generate Equipment", id: "generate-equipment" },
  { event: "character/generate-equipment" },
  async ({ event, step }) => {
    const { characterId } =
      event.data as GenerateEquipmentEvent["data"];
      
    const characterDB = new CharacterDB();
    const character = await characterDB.getCharacter(characterId);

    if (!character) {
      throw new Error("Character not found");
    }

    if (character.equipment) {
      await completeResult(
        event.data.resultId,
        "Equipment already generated",
        character.equipment
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

    await completeResult(
      event.data.resultId,
      "Equipment generated successfully",
      equipmentResult.equipment
    );

    return {
      success: true,
      equipment: equipmentResult.equipment,
    };
  }
);
