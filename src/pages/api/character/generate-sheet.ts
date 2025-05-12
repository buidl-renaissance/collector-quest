import { attacks } from "@/data/attacks";
import { effects } from "@/data/effects";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CharacterSheetInput {
  name: string;
  race: string;
  class: string;
  background: string;
  bio: string;
  traits: {
    personality: string[];
    fear: string[];
    memory: string;
    possession: string;
  };
  motivation: string;
  sex: string;
}

interface CharacterSheet {
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
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
    const {
      name,
      race,
      class: characterClass,
      background,
      bio,
      traits,
      motivation,
      sex,
    } = req.body as CharacterSheetInput;

    const prompt = `Generate a D&D character sheet for the following character:

Name: ${name}
Race: ${race}
Class: ${characterClass}
Background: ${background}
Bio: ${bio}
Sex: ${sex}

Traits:
- Personality: ${traits.personality?.join(", ")}
- Fear: ${traits.fear?.join(", ")}
- Memory: ${traits.memory}
- Possession: ${traits.possession}

Motivation: ${motivation}

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

7. Ideals, based on the character's bio
What drives your character?

These are your character’s guiding principles — what they believe in, what they strive for, or what moral code they follow.

🧠 Mechanics & Use:
Ideals influence decision-making, alliances, and goals.

Often tied to alignment, but not strictly.

DMs (or systems like Collector Quest) can reward alignment with these ideals using inspiration or story benefits.

Examples in JSON: ${JSON.stringify(effects.ideals)}

8. Bonds, based on the character's bio
Who or what matters most to your character?

Bonds are personal connections — to people, places, objects, or events — that anchor your character in the world.

🧠 Mechanics & Use:
Drive quest hooks, emotional stakes, or NPC relationships.

Help guide reactions in moral or social dilemmas.

A Bond can be threatened or used as leverage in narrative.

Examples in JSON: ${JSON.stringify(effects.bonds)}

9. Flaws, based on the character's bio
What’s your greatest vulnerability or weakness?

Flaws reveal a character’s imperfections — the internal conflicts or bad habits that can lead to drama or mistakes.

🧠 Mechanics & Use:
Drive complications and story tension.

A Flaw might lead to bad decisions but better roleplay.

Can be used by the DM or system to introduce challenges or even comic relief.

Examples in JSON: ${JSON.stringify(effects.flaws)}

10. Personality Traits, based on the character's bio

Personality traits are a collection of short phrases that describe the character's personality.🎭 Personality Traits in Collector Quest
Personality traits define how your character thinks and behaves, adding depth to roleplay and shaping interactions with the world. They influence dialogue, decisions, and relationships—both with NPCs and party members. Traits can lead to unique story moments, cause tension or teamwork, and may earn you rewards like inspiration when roleplayed well. Whether you're cautious, curious, or hot-headed, your trait helps make your character feel alive and reactive in the game world.

Examples in JSON: ${JSON.stringify(effects.personality_traits)}

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
  "effects": {
    "ideals": string[],
    "bonds": string[],
    "flaws": string[],
    "personality_traits": string[]
  },
  "combat": {
    "attacks": string[],
    "spellcasting": string[]
  },
  "equipment": string[],
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
