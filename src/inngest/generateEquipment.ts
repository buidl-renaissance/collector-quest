import { completeResult } from "@/lib/storage";
import { inngest } from "./client";
import { Character } from "@/hooks/useCharacter";
import { generateEquipment as generateEquipmentFunction } from "@/lib/generateEquipment";
import { CharacterDB } from "@/db/character";

interface GenerateEquipmentEvent {
  data: {
    characterId: string;
    character: Character;
    resultId?: string;
  };
}

interface EquipmentResult {
  weapons: { name: string; quantity: number }[];
  armor: { name: string; quantity: number }[];
  adventuringGear: { name: string; quantity: number }[];
  tools: { name: string; quantity: number }[];
  currency: { name: string; quantity: number }[];
}

export const generateEquipment = inngest.createFunction(
  { name: "Generate Equipment", id: "generate-equipment" },
  { event: "equipment/generate" },
  async ({ event, step }) => {
    const { characterId } = event.data as GenerateEquipmentEvent["data"];

    const characterDB = new CharacterDB();
    const character = await characterDB.getCharacter(characterId);

    if (!character) {
      throw new Error("Character not found");
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
      // This would be where you'd call your AI service to generate appropriate equipment
      // For now, we'll return mock data
      //   const mockEquipment: EquipmentResult = {
      //     weapons: [
      //       { name: "Longsword", quantity: 1 },
      //       { name: "Shortbow", quantity: 1 },
      //       { name: "Arrows", quantity: 20 },
      //     ],
      //     armor: [{ name: "Chain Mail", quantity: 1 }],
      //     adventuringGear: [
      //       { name: "Backpack", quantity: 1 },
      //       { name: "Bedroll", quantity: 1 },
      //       { name: "Mess Kit", quantity: 1 },
      //       { name: "Tinderbox", quantity: 1 },
      //       { name: "Torches", quantity: 10 },
      //       { name: "Rations", quantity: 10 },
      //       { name: "Waterskin", quantity: 1 },
      //       { name: "Rope, Hempen (50 feet)", quantity: 1 },
      //     ],
      //     tools: [{ name: "Herbalism Kit", quantity: 1 }],
      //     currency: [{ name: "Gold Pieces", quantity: 15 }],
      //   };

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
        equipment: equipmentResult.equipment,
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
