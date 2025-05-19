import { NextApiRequest, NextApiResponse } from "next";
import { inngest } from "@/inngest/client";
import { createPendingResult } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { characterId, character } = req.body;

    if (!characterId || !character) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a unique ID for this generation request
    const resultId = uuidv4();

    // Create a pending result
    await createPendingResult(resultId);

    // Send event to Inngest
    await inngest.send({
      name: "equipment/generate",
      data: {
        resultId,
        characterId,
        character,
      },
    });

    return res.status(200).json({ resultId, status: "pending" });
  } catch (error) {
    console.error("Error generating equipment:", error);
    return res.status(500).json({ error: "Failed to generate equipment" });
  }
}
