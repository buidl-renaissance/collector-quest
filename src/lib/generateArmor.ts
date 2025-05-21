import OpenAI from "openai";
import { Armor, Character } from "@/data/character";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateArmor(character: Character): Promise<Armor> {

  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  if (!character.traits) {
    throw new Error("Character traits are required");
  }

  if (character.sheet?.combat?.armor) {
    return character.sheet.combat.armor;
  }

  const prompt = `Generate a unique armor piece for a ${character.traits?.alignment} ${character.race.name} ${character.class.name} with the ${character.traits?.background} background that integrates real-world artistic inspiration.
  
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
  
  The armor should reflect their personality and be appropriate for their class and level (1-3). Include:
  
  1. Name of the armor piece
  2. Type (e.g., Headgear, Chestplate, Cloak, Boots, etc.)
  3. Visual Description (artistic style, materials, colors — include if it's inspired by a real-world artwork or cultural element)
  4. Game Stats:
     - Armor Class (AC) Bonus
     - Speed/Mobility Modifier
     - Durability (scale of 1–100)
     - Resistance(s) (e.g., fire, ice, magic, charm, etc.)
  5. Special Trait or Passive Ability (unique feature based on its origin or materials)
  6. Lore/Origin Story (short paragraph linking it to a quest, relic, or event)
  7. Rarity Tier (Common, Uncommon, Rare, Epic, Legendary)
  8. How It Is Obtained (crafted, found in a specific quest, or bought from a specific vendor)
  
  Return the result as a JSON object with the following structure:
  {
    "name": "Name of the armor",
    "type": "Type of armor piece",
    "visualDescription": "Detailed visual description including artistic inspiration",
    "stats": {
      "acBonus": number,
      "mobilityModifier": number,
      "durability": number,
      "resistances": ["resistance1", "resistance2"]
    },
    "specialTrait": "unique trait or passive ability",
    "lore": "short origin story paragraph",
    "rarity": "rarity tier",
    "obtainedBy": "how it is obtained"
  }`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a creative fantasy equipment designer specializing in creating unique armor for roleplaying game characters that integrates real-world artistic inspiration. You always return valid JSON objects."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 800
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
