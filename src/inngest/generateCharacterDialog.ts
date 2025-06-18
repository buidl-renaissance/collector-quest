import { inngest } from "./client";
import { completeResult } from "@/db/generate";
import { generateDialog } from "@/lib/generateDialog";
import { CharacterDB } from "@/db/character";
import { Character } from "@/data/character";

interface GenerateDialogEvent {
  data: {
    characterIds: string[];
    context?: string;
    resultId?: string;
  };
}

export const generateCharacterDialog = inngest.createFunction(
  { name: "Generate Character Dialog", id: "generate-character-dialog" },
  { event: "character/generate.dialog" },
  async ({ event, step }) => {
    const { characterIds, context, resultId } = 
      event.data as GenerateDialogEvent["data"];

    if (!characterIds || characterIds.length < 2) {
      throw new Error("At least two character IDs are required");
    }

    // Step 1: Get character details
    const characterDB = new CharacterDB();
    const fetchedCharacters = await Promise.all(
      characterIds.map(id => characterDB.getCharacter(id))
    );

    if (fetchedCharacters.length < characterIds.length) {
        throw new Error("One or more characters not found");
    }
    
    const characters = fetchedCharacters.filter(char => char !== null) as Character[];

    // Step 2: Generate dialog between characters
    const dialogResult = await step.run("generate-dialog", async () => {
      const dialog = await generateDialog(characters, context);

      return {
        step: "generate-dialog",
        message: "Generated character dialog",
        dialog: dialog
      };
    });

    if (resultId) {
      await completeResult(
        resultId,
        "Dialog generated successfully",
        dialogResult.dialog
      );
    }

    return {
      success: true,
      dialog: dialogResult.dialog
    };
  }
);
