import { NextApiRequest, NextApiResponse } from "next";
import { inngest } from "@/inngest/generateTraits";
import { createPendingResult } from "@/lib/storage";
import { dispatchGenerationEvent } from "@/inngest/sendEvent";
import { GenerationResult } from "@/data/generate";
import { Equipment } from "@/data/character";

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


    const event: GenerationResult<Equipment> | null = await dispatchGenerationEvent({
      eventName: "character/generate-traits",
      objectType: "character",
      objectId: characterId,
      objectKey: "traits",
      data: {
        characterId,
      }
    });

    return res.status(200).json({
      success: true,
      message: "Trait generation started",
      event,
    });
  } catch (error) {
    console.error("Error starting trait generation:", error);
    return res.status(500).json({
      error: "Failed to start trait generation",
      details: error instanceof Error ? error.message : String(error),
    });
  }
} 