import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generateImageFunction, generateRaceImageFunction } from "@/inngest/functions";
import { generateCharacterImageFunction } from "@/inngest/generateCharacterImage";
import { generateStoryFunction } from "@/inngest/generateStoryFunction";
import { generateTraits } from "@/inngest/generateTraits";
import { generateEquipment } from "@/inngest/generateEquipment";
import { generateCharacterSheet } from "@/inngest/generateCharacterSheet";
import { generateRelicFunction } from "@/inngest/generateArtifactRelic";
import { generateQuestFunction } from "@/inngest/generateQuest";
import { generateCampaignFunction } from "@/inngest/generateCampaign";
import { generateCampaignIntroductionFunction } from "@/inngest/generateCampaignIntroduction";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
    responseLimit: '8mb',
  },
};


// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [
    generateImageFunction,
    generateRaceImageFunction,
    generateCharacterImageFunction,
    generateCharacterSheet,
    generateRelicFunction,
    generateQuestFunction,
    generateStoryFunction,
    generateTraits,
    generateEquipment,
    generateCampaignFunction,
    generateCampaignIntroductionFunction,
  ],
});