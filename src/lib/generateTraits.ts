import { Character } from "@/hooks/useCharacter";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedTraits {
  personality: string[];
  ideals: string[];
  bonds: string[];
  flaws: string[];
}

export async function generateTraits(character: Character): Promise<GeneratedTraits> {
  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  // Create a detailed prompt for the AI
  const prompt = `Generate personality traits, ideals, bonds, and flaws for a fantasy RPG character with the following details:

Character Details:
- Name: ${character.name || "Unnamed"}
- Race: ${character.race.name}
- Class: ${character.class.name}
- Sex: ${character.sex || "Unknown"}
- Background: ${character.traits?.background || "Unknown"}
- Alignment: ${character.traits?.alignment || "Unknown"}
- Deity: ${character.traits?.deity || "None"}

Please generate:

1. Personality Traits (6 distinct traits):
   - Based on the character's background, race/class flavor, and alignment
   - These should guide interaction choices, relationships, and dialogue

2. Ideals (6 distinct ideals):
   - Pulled from the character's background and alignment
   - These should shape quest-lines, decision trees, and narrative arcs

3. Bonds (6 distinct bonds):
   - Generated using background, region, and potential relationships
   - These should be used for mission hooks, quest stakes, and NPC relations

4. Flaws (6 distinct flaws):
   - Based on personality traits and background
   - These should add vulnerability and enhance roleplaying opportunities

Format the response as a JSON object with arrays for each category:
{
  "personality": ["trait1", "trait2", "trait3", "trait4", "trait5", "trait6"],
  "ideals": ["ideal1", "ideal2", "ideal3", "ideal4", "ideal5", "ideal6"],
  "bonds": ["bond1", "bond2", "bond3", "bond4", "bond5", "bond6"],
  "flaws": ["flaw1", "flaw2", "flaw3", "flaw4", "flaw5", "flaw6"]
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant specializing in character development for fantasy roleplaying games. You generate detailed character traits that are consistent with the character's background, race, class, and alignment."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const responseContent = completion.choices[0]?.message?.content || "";
    
    try {
      const parsedResponse = JSON.parse(responseContent) as GeneratedTraits;
      return {
        personality: parsedResponse.personality || [],
        ideals: parsedResponse.ideals || [],
        bonds: parsedResponse.bonds || [],
        flaws: parsedResponse.flaws || []
      };
    } catch (parseError) {
      console.error("Error parsing traits response:", parseError);
      throw new Error("Failed to parse generated traits");
    }
  } catch (error) {
    console.error("Error generating traits:", error);
    throw new Error("Failed to generate character traits");
  }
}
