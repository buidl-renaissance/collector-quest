import { inngest } from './client';
import { generateQuest } from '@/lib/questGenerator';
import { questDb } from '@/db/quest';

export const generateQuestFunction = inngest.createFunction(
  { id: "generate-quest" },
  { event: "quest/generate" },
  async ({ event, step }) => {
    const { relic } = event.data;

    // Step 1: Generate the quest using AI
    const quest = await step.run("generate-quest-content", async () => {
      return await generateQuest({ 
        relic,
        eventId: event.id
      });
    });

    // Step 2: Save the quest to the database
    const savedQuest = await step.run("save-quest-to-db", async () => {
      return await questDb.createQuest(quest);
    });

    // Step 3: Create quest objectives in the database
    await step.run("save-quest-objectives", async () => {
      for (const objective of quest.objectives) {
        await questDb.createQuestObjective({
          ...objective,
          id: savedQuest.id, // Associate with the quest
        });
      }
    });

    return {
      success: true,
      questId: savedQuest.id,
      quest: savedQuest,
    };
  }
);
