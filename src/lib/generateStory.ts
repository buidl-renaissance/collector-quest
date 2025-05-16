import { Character } from "@/hooks/useCharacter";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBackstory(character: Character): Promise<string> {

  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  if (!character.traits) {
    throw new Error("Character traits are required");
  }

  const prompt = `Create a rich, detailed backstory for a ${character.sex} ${character.race.name} ${character.class.name} named ${character.name}. 
    
  Character traits:
  - Personality: ${character.traits.personality?.join(", ")}
  - Ideals: ${character.traits.ideals?.join(", ")}
  - Bonds: ${character.traits.bonds?.join(", ")}
  - Flaws: ${character.traits.flaws?.join(", ")}
  - Actions: ${character.traits.actions?.join(", ")}
  - Driving Forces:  ${character.traits.forces?.join(", ")}
  - Haunting Memory: ${character.traits.hauntingMemory}
  - Treasured Possession: ${character.traits.treasuredPossession}
  
  Primary Motivation: ${character.motivation}
  
  Race Description: ${character.race.description}
  Class Description: ${character.class.description}
  
  Write a compelling backstory that weaves together these elements into a cohesive narrative. The backstory should be written in third person and be approximately 3-4 paragraphs long.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a creative writing assistant specializing in crafting rich, detailed character backstories for fantasy roleplaying games. Your writing should be engaging, vivid, and emotionally resonant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.8,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating backstory:", error);
    throw new Error("Failed to generate backstory");
  }
}

export async function generateMotivation(character: Character): Promise<string> {

  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  if (!character.traits) {
    throw new Error("Character traits are required");
  }


  // Create a detailed prompt for the AI
  const prompt = `Create a compelling character motivation based on the following elements:

Character Details:
- Race: ${character.race.name}
- Class: ${character.class.name}
- Sex: ${character.sex}

Personality & Traits:
- Personality: ${character.traits.personality?.join(', ')}
- Ideals: ${character.traits.ideals?.join(', ')}
- Flaws: ${character.traits.flaws?.join(', ')}
- Haunting Memory: ${character.traits.hauntingMemory}
- Treasured Possession: ${character.traits.treasuredPossession}

Motivational Elements:
- Actions: ${character.traits.actions?.join(', ')}
- Driving Forces: ${character.traits.forces?.join(', ')}
- Archetype: ${character.traits.archetype || 'None'}

Generate a rich, nuanced motivation that:
1. Incorporates all selected actions and forces
2. Reflects the intensity levels of each force
3. Matches the character archetype if specified
4. Includes subtle psychological depth
5. Suggests potential internal conflicts
6. Maintains a natural, flowing narrative style
7. Acknowledges the character's race, class, and sex in a nuanced way
8. Connects to their personality traits, ideals, and flaws
9. References their haunting memory and treasured possession
10. Creates a cohesive narrative that ties all elements together

The output should be a single, cohesive paragraph that reads like a character study.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative writing expert specializing in character development and motivation. Your task is to generate rich, nuanced character motivations that incorporate multiple elements while maintaining narrative coherence."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating motivation:', error);
    throw new Error('Failed to generate motivation');
  }
}
