import { inngest } from "@/utils/inngest";
import { CharacterDB } from "@/db/character";
import { generateStoryRequest } from "@/lib/storyGenerator";

export interface GenerateBackstoryEvent {
  name: "generate/character.backstory";
  data: {
    characterId: string;
    resultId?: string;
  };
}

interface TTSResponse {
  success: boolean;
  audioUrls: string[];
  metadata: {
    duration: number;
    filenames: string[];
    parts: number;
  };
}

export const generateCharacterBackstory = inngest.createFunction(
  { id: "generate-character-backstory" },
  { event: "generate/character.backstory" },
  async ({ event, step }) => {
    try {
      const { characterId } = event.data;

      // Get character data
      const characterData = await step.run("fetch-character", async () => {
        const characterDB = new CharacterDB();
        const character = await characterDB.getCharacter(characterId);
        if (!character) {
          throw new Error(`Character not found: ${characterId}`);
        }
        return character;
      });

      // Generate backstory
      const backstory = await step.run("generate-backstory", async () => {
        const traits = characterData.traits?.personality || [];
        const prompt = `Create a detailed backstory for a character with the following details:
Name: ${characterData.name}
Race: ${characterData.race?.name || 'Unknown'}
Class: ${characterData.class?.name || 'Unknown'}
Traits: ${traits.join(", ")}

The backstory should be engaging, personal, and explain how they became who they are today. Include key moments from their past, relationships, and motivations.`;

        return generateStoryRequest(prompt);
      });

      if (!backstory) {
        throw new Error("Failed to generate backstory");
      }

      // Convert backstory to speech
      const audioResult = await step.run("convert-to-speech", async () => {
        const result = await inngest.send({
          name: "tts/convert",
          data: {
            text: backstory,
            metadata: {
              characterId,
              type: "backstory"
            }
          }
        });

        return result as unknown as TTSResponse;
      });

      // Save backstory and audio URLs to character
      await step.run("save-backstory", async () => {
        const characterDB = new CharacterDB();
        await characterDB.updateCharacter(characterId, {
          backstory,
          narration: {
            urls: audioResult.audioUrls,
            duration: audioResult.metadata.duration
          }
        });
      });

      return {
        success: true,
        characterId,
        backstory,
        audioUrls: audioResult.audioUrls,
        duration: audioResult.metadata.duration
      };
    } catch (error) {
      console.error("Error generating character backstory:", error);
      throw error;
    }
  }
); 