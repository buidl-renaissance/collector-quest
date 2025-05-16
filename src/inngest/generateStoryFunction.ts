import { inngest } from "./client";
import { CharacterDB } from "@/db/character";
import { completeResult, failResult, updateResult } from "@/lib/storage";
import { generateBackstory, generateMotivation } from "@/lib/generateStory";

interface GenerateBackstoryEvent {
  data: {
    characterId: string;
    resultId?: string;
    traits?: string[];
    alignment?: string;
    race?: string;
    characterClass?: string;
  };
}

export const generateStoryFunction = inngest.createFunction(
  { id: "generate-character-story" },
  { event: "character/generate.story" },
  async ({ event, step }: { event: GenerateBackstoryEvent; step: any }) => {
    try {
      const { characterId, resultId } = event.data;
      const characterDB = new CharacterDB();
      const character = await characterDB.getCharacter(characterId);

      if (!character) {
        throw new Error("Character not found");
      }

      if (!resultId) {
        throw new Error("Result ID is required");
      }

      // Update the result with progress
      updateResult(
        resultId,
        JSON.stringify({
          message: "Generating character backstory and motivation...",
          step: "generate-motivation",
        })
      );

      const motivationResult = await step.run(
        "generate-motivation",
        async () => {
          return await generateMotivation(character);
        }
      );

      updateResult(
        resultId,
        JSON.stringify({
          message: "Motivation generated successfully",
          motivation: motivationResult,
          step: "save-motivation",
        })
      );

      // save motivation to character
      await step.run("save-motivation", async () => {
        await characterDB.updateCharacter(characterId, {
          motivation: motivationResult,
        });
      });

      updateResult(
        resultId,
        JSON.stringify({
          message: "Motivation saved successfully",
          motivation: motivationResult,
          step: "generate-backstory",
        })
      );

      // Generate backstory and motivation
      const backstoryResult = await step.run("generate-backstory", async () => {
        return await generateBackstory(character);
      });

      updateResult(
        resultId,
        JSON.stringify({
          message: "Backstory generated successfully",
          backstory: backstoryResult,
          step: "save-backstory",
        })
      );

      // save backstory to character
      await step.run("save-backstory", async () => {
        await characterDB.updateCharacter(characterId, {
          backstory: backstoryResult,
        });
      });

      // Complete the result
      completeResult(
        resultId,
        JSON.stringify({
          step: "complete",
          message: "Backstory and motivation generated successfully",
          backstory: backstoryResult,
          motivation: motivationResult,
        })
      );
    

      return {
        characterId,
        backstory: backstoryResult,
        motivation: motivationResult,
      };
    } catch (error) {
      console.error("Error generating backstory:", error);

      if (event.data.resultId) {
        failResult(
          event.data.resultId,
          JSON.stringify({
            error: `Failed to generate backstory: ${
              error instanceof Error ? error.message : String(error)
            }`,
          })
        );
      }

      throw error;
    }
  }
);
