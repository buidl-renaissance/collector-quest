import { Inngest } from "inngest";
import { Character } from "@/hooks/useCurrentCharacter";
import { generateTraits as generateTraitsLib } from "@/lib/generateTraits";
import { CharacterDB } from "@/db/character";
import { completeResult, failResult, updateResult } from "@/db/generate";

// Create a client
export const inngest = new Inngest({ id: "collector-quest" });

const characterDB = new CharacterDB();

// Define the function
export const generateTraits = inngest.createFunction(
  { id: "generate-character-traits", name: "Generate Character Traits" },
  { event: "character/generate-traits" },
  async ({ event, step }) => {
    try {
      const { characterId, resultId } = event.data;

      if (!characterId) {
        throw new Error("Character ID is required");
      }

      if (!resultId) {
        throw new Error("Result ID is required");
      }

      // Update the result with progress
      await updateResult(
        resultId,
        "pending",
        "get-character",
        "Generating character traits...",
        null
      );

      // Get the character from the database
      const character = await step.run("Get character", async () => {
        return await characterDB.getCharacter(characterId);
      });

      if (!character) {
        throw new Error(`Character not found: ${characterId}`);
      }

      await updateResult(
        resultId,
        "pending",
        "generate-traits",
        "Character found, generating traits...",
        null
      );

      // Generate traits using the OpenAI integration
      const traits = await step.run("Generate traits with AI", async () => {
        return await generateTraitsLib(character as Character);
      });

      await updateResult(
        resultId,
        "pending",
        "update-character",
        "Traits generated successfully, saving to character...",
        traits
      );

      // Update the character with the generated traits
      await step.run(
        "Update character traits",
        async () => {
          return await characterDB.updateCharacter(characterId, {
            traits: {
              ...character.traits,
              personality: traits.personality,
              ideals: traits.ideals,
              bonds: traits.bonds,
              flaws: traits.flaws,
            },
          });
        }
      );

      // Complete the result
      await completeResult(
        resultId,
        "Character traits generated successfully",
        traits
      );

      return {
        characterId,
        success: true,
        traits,
      };
    } catch (error) {
      console.error("Error generating traits:", error);

      if (event.data.resultId) {
        await failResult(
          event.data.resultId,
          `Failed to generate traits: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }

      throw error;
    }
  }
);
