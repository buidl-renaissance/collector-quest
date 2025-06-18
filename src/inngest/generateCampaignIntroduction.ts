import { inngest } from "./client";
import { getCampaign } from "@/db/campaigns";
import { listLocales } from "@/db/locales";
import { generateSceneIntroduction } from "@/lib/generateCampaignPlay";
import { CharacterDB } from "@/db/character";
import { completeResult, failResult, updateResult } from "@/db/generate";
import { Locale } from "@/data/locales";
import { Character } from "@/data/character";

const characterDB = new CharacterDB();

interface GenerateCampaignIntroductionEvent {
  data: {
    campaignId: string;
    resultId?: string;
  };
}

interface IntroductionResult {
  introduction: string;
  locale: Locale;
  characters: Character[];
}

export const generateCampaignIntroductionFunction = inngest.createFunction(
  { id: "generate-campaign-introduction" },
  { event: "campaign/introduction/generate" },
  async ({ event, step }) => {
    try {
      const { campaignId, resultId } = event.data as GenerateCampaignIntroductionEvent["data"];

      if (!campaignId) {
        throw new Error("Campaign ID is required");
      }

      if (!resultId) {
        throw new Error("Result ID is required");
      }

      // Step 1: Get the campaign with its characters
      const campaign = await step.run("get-campaign", async () => {
        const campaign = await getCampaign(campaignId);
        if (!campaign) {
          throw new Error("Campaign not found");
        }
        return campaign;
      });

      await updateResult(
        resultId,
        'pending',
        'get-locales',
        'Fetching available locales...',
        null
      );

      // Step 2: Get all available locales
      const locales = await step.run("get-locales", async () => {
        const locales = await listLocales();
        if (locales.length === 0) {
          throw new Error("No locales available");
        }
        return locales;
      });

      await updateResult(
        resultId,
        'pending',
        'select-locale',
        'Selecting a random locale...',
        null
      );

      // Step 3: Select a random locale
      const randomLocale = await step.run("select-locale", async () => {
        const selectedLocale = locales[Math.floor(Math.random() * locales.length)];
        return selectedLocale as Locale;
      });

      await updateResult(
        resultId,
        'pending',
        'get-characters',
        'Fetching campaign characters...',
        null
      );

      // Step 4: Get full character details for all campaign characters
      const characters = await step.run("get-characters", async () => {
        const chars = await Promise.all(
          campaign.characters?.map(async (campaignChar) => {
            const character = await characterDB.getCharacter(campaignChar.character_id);
            return character;
          }) || []
        );

        // Filter out null characters and only include player characters
        const playerCharacters = chars.filter(
          (char): char is NonNullable<typeof char> => 
            char !== null && 
            campaign.characters?.find(c => c.character_id === char.id)?.role === 'player'
        );

        if (playerCharacters.length === 0) {
          throw new Error("No player characters found in campaign");
        }

        return playerCharacters;
      });

      await updateResult(
        resultId,
        'pending',
        'generate-introduction',
        'Generating scene introduction...',
        null
      );

      // Step 5: Generate the scene introduction
      const introduction = await step.run("generate-introduction", async () => {
        return await generateSceneIntroduction(characters, randomLocale as Locale);
      });

      const result: IntroductionResult = {
        introduction,
        locale: randomLocale as Locale,
        characters
      };

      await updateResult<IntroductionResult>(
        resultId,
        'pending',
        'complete',
        'Introduction generated successfully',
        result
      );

      // Step 6: Complete the result
      await completeResult<IntroductionResult>(
        resultId,
        "Campaign introduction generated successfully",
        result
      );

      return {
        success: true,
        introduction,
        locale: randomLocale as Locale,
        characters: characters.map(c => ({ id: c.id, name: c.name }))
      };

    } catch (error) {
      // Store the error
      if (event.data.resultId) {
        await failResult(
          event.data.resultId,
          error instanceof Error ? error.message : "Unknown error"
        );
      }

      throw error;
    }
  }
); 