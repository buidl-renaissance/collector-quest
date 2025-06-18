import OpenAI from "openai";
import { Character } from "@/data/character";
import { formatCharacterDescription, generateCharacterSummaries } from "./character";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDialog(characters: Character[], context?: string): Promise<string> {
  if (!characters || characters.length < 2) {
    throw new Error("At least two characters are required to generate dialog");
  }

  // Build character descriptions for context
  const characterSummaries = generateCharacterSummaries(characters);
  const characterDescriptions = characterSummaries.map((summary, index) => formatCharacterDescription(summary, `Character ${index + 1}:`)).join("\n\n");

  // Build the prompt
  const prompt = `Generate a natural dialog between the following characters:
  
${characterDescriptions}

${context ? `Context for the conversation: ${context}` : ''}

Write the dialog in a natural, character-driven way that reflects each character's personality and background. Include both dialog and minimal narrative description of actions/emotions where relevant.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a skilled fantasy writer who excels at writing natural, engaging dialog between characters."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000
    });

    return completion.choices[0].message.content || "Failed to generate dialog";
  } catch (error) {
    console.error("Error generating dialog:", error);
    throw new Error("Failed to generate character dialog");
  }
}
