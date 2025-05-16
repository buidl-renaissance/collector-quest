import { NextApiRequest, NextApiResponse } from "next";
import { inngest } from "@/inngest/generateTraits";
import { createPendingResult } from "@/lib/storage";

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

    // Create a result ID to track the progress
    const result = await createPendingResult(crypto.randomUUID());

    // Send the event to Inngest
    await inngest.send({
      name: "character/generate-traits",
      data: {
        characterId,
        resultId: result.id,
      },
    });

    return res.status(200).json({
      success: true,
      resultId: result.id,
      message: "Trait generation started",
    });
  } catch (error) {
    console.error("Error starting trait generation:", error);
    return res.status(500).json({
      error: "Failed to start trait generation",
      details: error instanceof Error ? error.message : String(error),
    });
  }
} 