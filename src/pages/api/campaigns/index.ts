import { NextApiRequest, NextApiResponse } from "next";
import { listCampaigns, createCampaign } from "../../../db/campaigns";
import { inngest } from "@/inngest/client";
import { createPendingResult } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";
import { dispatchGenerationEvent } from "@/inngest/sendEvent";

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
    const { characters } = req.body;

    if (!characters || !Array.isArray(characters)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    try {
      const characterIds = characters.map((c) => c.characterId);

      const campaign = await createCampaign({
        status: "generating",
        name: "New Campaign",
        description: "New Campaign",
      }, characters[0].characterId, characters);

      const event = await dispatchGenerationEvent({
        eventName: "campaign/generate",
        objectType: "campaign",
        objectId: campaign.id,
        objectKey: null,
        data: { characterIds, ownerId: characters[0].characterId, campaignId: campaign.id },
      });

      res.status(201).json({ campaign, event });
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ error: "Failed to create campaign" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
