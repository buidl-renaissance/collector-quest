import OpenAI from "openai";
import { Character } from "@/hooks/useCharacter";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Armor {
  name: string;
  type: string;
  baseAC: number;
  modifier: string;
  weight: string;
  material: string;
  specialTrait: string;
  description: string;
}

export async function generateArmor(character: Character): Promise<Armor> {
  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  if (!character.traits) {
    throw new Error("Character traits are required");
  }

  const prompt = `Generate a piece of armor for a ${character.traits?.alignment} ${character.race.name} ${character.class.name} with the ${character.traits?.background} background. 
  
  Character Details:
  - Name: ${character.name}
  - Race: ${character.race.name}
  - Class: ${character.class.name}
  - Background: ${character.traits?.background}
  - Alignment: ${character.traits?.alignment}
  
  Personality & Traits:
  - Personality: ${character.traits.personality?.join(", ")}
  - Ideals: ${character.traits.ideals?.join(", ")}
  - Flaws: ${character.traits.flaws?.join(", ")}
  
  The armor should reflect their personality, be appropriate for a level 1-3 character, and include mechanical stats (AC, weight, type), materials used, and one special trait or property. Add a brief description of its appearance and a name for the item.
  
  Return the result as a JSON object with the following structure:
  {
    "name": "Name of the armor",
    "type": "Light/Medium/Heavy Armor",
    "baseAC": number,
    "modifier": "modifier description (e.g., + Dex mod (max 2))",
    "weight": "weight in lb",
    "material": "materials used",
    "specialTrait": "one unique trait or property",
    "description": "description of appearance"
  }`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a creative fantasy equipment designer specializing in creating unique armor for roleplaying game characters. You always return valid JSON objects."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Failed to generate armor");
    }

    return JSON.parse(content) as Armor;
  } catch (error) {
    console.error("Error generating armor:", error);
    throw new Error("Failed to generate armor");
  }
}
