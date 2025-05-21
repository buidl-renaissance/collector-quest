import { Character, Equipment } from "@/data/character";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEquipment(
  character: Character
): Promise<Equipment> {
  if (!character.class) {
    throw new Error("Character class is required");
  }

  if (character?.equipment) {
    return character.equipment;
  }

  // Create a detailed prompt for the AI
  const prompt = `Generate appropriate D&D 5e starting equipment for a character with the following details:

Character Details:
- Race: ${character.race?.name || "Unknown"}
- Class: ${character.class.name}
- Background: ${character.traits?.background || "Unknown"}
- Bonds: ${character.traits?.bonds?.join(", ") || "None"}
- Backstory: ${character.backstory?.substring(0, 500) || "None"}

Please generate a comprehensive list of starting equipment appropriate for this character based on their class, background, and personal details. The equipment should be organized into the following categories:
1. Weapons
2. Armor
3. Adventuring Gear
4. Tools
5. Currency

For each item, specify the quantity. Follow D&D 5e rules for starting equipment based on class and background, but add personalized touches based on the character's bonds and backstory.

Format the response as a JSON object with the following structure:
{
  "weapons": [{"name": "Item name", "quantity": number}, ...],
  "armor": [{"name": "Item name", "quantity": number}, ...],
  "adventuringGear": [{"name": "Item name", "quantity": number}, ...],
  "tools": [{"name": "Item name", "quantity": number}, ...],
  "currency": [{"name": "Gold Pieces", "quantity": number}, ...],
  "magicItems": [{"name": "Item name", "quantity": number}, ...]
}

Ensure the equipment is realistic, balanced, and appropriate for a level 1 character.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a Dungeons & Dragons equipment expert who specializes in creating appropriate starting equipment for characters based on their class, background, and personal details. You always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Failed to generate equipment");
    }

    const equipmentData = JSON.parse(content) as Equipment;
    return equipmentData;
  } catch (error) {
    console.error("Error generating equipment:", error);
    throw new Error("Failed to generate equipment");
  }
}
