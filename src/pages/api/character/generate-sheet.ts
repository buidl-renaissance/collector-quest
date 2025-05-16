import { attacks } from "@/data/attacks";
import { Character } from "@/hooks/useCharacter";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CharacterSheet {
  character: Character;
  combatStats: {
    armorClass: number;
    initiative: number;
    currentHitPoints: number;
    hitDice: string;
  };
  skills: {
    name: string;
    proficient: boolean;
  }[];
  deathSaves: {
    successes: number;
    failures: number;
  };
  combat: {
    attacks: string[];
    spellcasting: string[];
  };
  effects: {
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
  equipment: string[];
  features: string[];
  proficiencies: string[];
  languages: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const character = req.body as Character;

    const prompt = `Generate a D&D character sheet for the following character:

Name: ${character.name}
Race: ${JSON.stringify(character.race)}
Class: ${JSON.stringify(character.class)}
Background: ${character.traits?.background}
Bio: ${character.bio}
Sex: ${character.sex}

Traits:
- Personality: ${character.traits?.personality?.join(", ")}
- Fear: ${character.traits?.fear?.join(", ")}
- Memory: ${character.traits?.memory}
- Possession: ${character.traits?.possession}

Motivation: ${character.motivation}

Please generate a complete character sheet with the following sections:

1. Abilities (roll 4d6 drop lowest for each):
- Strength
- Dexterity
- Constitution
- Intelligence
- Wisdom
- Charisma

2. Combat Stats:
- Armor Class (10 + Dex mod)
- Initiative (Dex mod)
- Current Hit Points (based on class + Con mod)
- Hit Dice (based on class)

3. Skills (select appropriate skills based on class and background)

4. Combat & Equipment:
- Attacks & Spellcasting (based on class)
- Equipment (starting gear based on class and background)
- Select 5 Attacks in JSON format: ${JSON.stringify(attacks)} 

5. Features & Traits (from race and class)

6. Proficiencies & Languages (from race, class, and background)

Format the response as a JSON object with the following structure:
{
  "abilities": {
    "strength": number,
    "dexterity": number,
    "constitution": number,
    "intelligence": number,
    "wisdom": number,
    "charisma": number
  },
  "combatStats": {
    "armorClass": number,
    "initiative": number,
    "currentHitPoints": number,
    "hitDice": string
  },
  "skills": [
    { "name": string, "proficient": boolean }
  ],
  "deathSaves": {
    "successes": 0,
    "failures": 0
  },
  "combat": {
    "attacks": {
      "name": string,
      "classRaceCreature": string,
      "element": string,
      "attackType": string,
      "effect": string,
      "type": string
    }[],
  },
  "features": string[],
  "proficiencies": string[],
  "languages": string[]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a D&D character sheet generator. Generate balanced and appropriate character sheets based on the character's attributes. Ensure all values are within reasonable ranges and follow D&D 5e rules.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Clean up the response by removing markdown code block syntax
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const characterSheet = JSON.parse(cleanedResponse) as CharacterSheet;
      console.log(characterSheet);
      return res.status(200).json(characterSheet);
    } catch (parseError) {
      console.error("Error parsing character sheet:", parseError);
      console.error("Raw response:", response);
      console.error("Cleaned response:", cleanedResponse);
      throw new Error("Failed to parse character sheet response");
    }
  } catch (error) {
    console.error("Error generating character sheet:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate character sheet" });
  }
}
