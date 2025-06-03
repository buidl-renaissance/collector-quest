import { NextApiRequest, NextApiResponse } from "next";
import { listCampaigns, createCampaign } from "../../../db/campaigns";
import { inngest } from "@/inngest/client";
import { createPendingResult } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const characterId = req.query.characterId as string;
    if (!characterId) {
      return res.status(400).json({ error: "Character ID is required" });
    }

    try {
      const campaigns = await listCampaigns(characterId);
      res.status(200).json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  } else if (req.method === "POST") {
    const { status, characters } = req.body;

    if (!status || !characters || !Array.isArray(characters)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    try {
      const characterIds = characters.map((c) => c.characterId);

      // Create a unique ID for this generation request
      const resultId = uuidv4();

      // Create a pending result
      await createPendingResult(resultId);

      await inngest.send({
        name: "campaign/generate",
        data: { characterIds, ownerId: characters[0].characterId, resultId },
      });

      res.status(201).json({ resultId });
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ error: "Failed to create campaign" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
