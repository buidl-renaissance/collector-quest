import { inngest } from "./client";
import { Character } from "../data/character";
import { generateCampaign } from "../lib/generateCampaign";
import { CharacterDB } from "../db/character";
import { createCampaign } from "@/db/campaigns";

const characterDB = new CharacterDB();

export const generateCampaignFunction = inngest.createFunction(
  { id: "generate-campaign" },
  { event: "campaign/generate" },
  async ({ event, step }) => {
    const { characterIds, ownerId } = event.data as {
      characterIds: string[];
      ownerId: string;
    };

    const characters = await step.run("fetch-characters", async () => {
      const chars = await Promise.all(
        characterIds.map((id) => characterDB.getCharacter(id))
      );
      return chars.filter((char): char is Character => char !== null);
    });

    const campaignContent = await step.run(
      "generate-campaign-content",
      async () => {
        return generateCampaign(characters);
      }
    );

    const campaign = await step.run("create-campaign", async () => {
      return createCampaign(
        {
          status: "active",
          name: campaignContent.name,
          description: campaignContent.description,
        },
        ownerId,
        characters
      );
    });

    return {
        campaign,
    };
  }
);
