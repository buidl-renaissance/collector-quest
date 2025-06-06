import { NextApiRequest, NextApiResponse } from "next";
import { dispatchGenerationEvent } from "@/inngest/sendEvent";
import { GenerationResult } from "@/data/generate";
import { Equipment } from "@/data/character";
import { CharacterDB } from "@/db/character";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { characterId } = req.body;

    if (!characterId) {
      return res.status(400).json({ error: "Character ID is required" });
    }

    if (characterId) {
      const characterDB = new CharacterDB();
      const character = await characterDB.getCharacter(characterId);
      if (character?.equipment) {
        return res.status(200).json({ success: true, equipment: character.equipment, event: null });
      }
    }

    const event: GenerationResult<Equipment> | null = await dispatchGenerationEvent({
      eventName: "character/generate-equipment",
      objectType: "character", 
      objectId: characterId,
      objectKey: "equipment",
      data: {
        characterId,
      }
    });

    return res.status(200).json({
      success: true,
      message: "Equipment generation started",
      event,
    });
  } catch (error) {
    console.error("Error starting equipment generation:", error);
    return res.status(500).json({
      error: "Failed to start equipment generation",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}