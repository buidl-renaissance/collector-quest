import { NextApiRequest, NextApiResponse } from "next";
import { CharacterDB } from "@/db/character";
import { dispatchGenerationEvent } from "@/inngest/sendEvent";

const characterDB = new CharacterDB();

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
      return res.status(400).json({ error: "Missing required fields" });
    }

    const character = await characterDB.getCharacter(characterId);

    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    const event = await dispatchGenerationEvent({
      eventName: "character/sheet/generate",
      objectType: "character",
      objectId: characterId,
      objectKey: "sheet",
      data: {
        characterId,
        character,
      }
    });

    if (!event) {
      return res.status(500).json({ error: "Failed to create generation event" });
    }

    return res.status(200).json({ event: event });
  } catch (error) {
    console.error("Error generating character sheet:", error);
    return res.status(500).json({ error: "Failed to generate character sheet" });
  }
}
