import OpenAI from "openai";
import { Quest, QuestObjective } from "@/data/quest";
import { v4 as uuidv4 } from "uuid";
import { Relic } from "@/data/artifacts";
import { Character } from "@/data/character";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateQuestInput {
  relic: Relic;
  character?: Character;
  eventId?: string;
}

export async function generateQuest(input: GenerateQuestInput): Promise<Quest> {
  const relic = input.relic;

  if (!relic) {
    throw new Error("Relic is required");
  }

//   const character = input.character;
//   if (character) {
//     const characterCustomization = `
// Based on the character profile, create a quest that is tailored to the character's background, motivation, and alignment.
// Character Profile:
// - Name: ${input.character?.name || "Unknown Adventurer"}
// - Race: ${input.character?.race || "Human"}
// - Class: ${input.character?.class || "Explorer"}
// - Background: ${input.character?.traits?.background || "unknown"}
// - Motivation: ${input.character?.motivation || "unknown"}
// - Alignment: ${input.character?.traits?.alignment || "unknown"}
// - Personality: ${input.character?.traits?.personality?.join(", ") || "unknown"}
// - Bonds: ${input.character?.traits?.bonds?.join(", ") || "unknown"}
// - Fears: ${input.character?.traits?.fear?.join(", ") || "unknown"}
// - Ideals: ${input.character?.traits?.ideals?.join(", ") || "unknown"}
// `;
//   }

  const prompt = `Create a relic quest for the Collector Quest game.

Relic:
- Name: ${relic.name}
- Lore: ${relic.story}
- Visual Asset: ${relic.properties?.visualAsset || "Unknown visual asset"}
- Passive Effect: ${relic.properties?.passiveBonus || "Unknown passive effect"}
- Active Effect: ${relic.properties?.activeUse || "Unknown active use"}
- Unlock Condition: ${relic.properties?.unlockCondition || "Complete the associated quest"}
- Reflection Trigger: ${relic.properties?.reflectionTrigger || "Unknown reflection trigger"}

Instructions:
- Design a quest that thematically matches the relic's lore and powers.
- Incorporate the character's personal story and attributes.
- Clearly define the quest type (e.g. Puzzle, Combat, Social/Co-op, Creation, Moral Dilemma).
- Include a main objective, any requirements, possible obstacles, and how success is measured.

Generate a quest with the following structure:
- Title: A creative and engaging title that reflects the relic's nature
- Description: A brief overview of the quest that connects to the character's motivation
- Story: A detailed narrative that incorporates both the character's background and the relic's lore
- Type: One of: exploration, puzzle, collection, mystery, artifact
- Difficulty: One of: easy, medium, hard, epic (based on relic tier and complexity)
- Objectives: 2-3 specific objectives that involve discovering or proving worthiness for the relic
- Location: A specific location that matches the relic's thematic origin
- Estimated Duration: Number of minutes to complete (15-120 minutes based on difficulty)

Format the response as a JSON object matching the Quest interface.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4-turbo-preview",
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error(
      "Failed to generate quest: No content received from OpenAI"
    );
  }

  const generatedQuest = JSON.parse(content);

  // Transform the generated quest to match our Quest interface
  const quest: Quest = {
    id: uuidv4(),
    title: generatedQuest.title,
    description: generatedQuest.description,
    story: generatedQuest.story,
    type: generatedQuest.type,
    difficulty: generatedQuest.difficulty,
    status: "available",
    requirements: {
      artifacts: [],
      relics: [],
    },
    rewards: {
      experience: calculateExperience(generatedQuest.difficulty),
      relics: [relic.id],
      currency: calculateCurrency(generatedQuest.difficulty),
    },
    objectives: generatedQuest.objectives.map((obj: any) => ({
      id: uuidv4(),
      description: obj.description,
      type: obj.type,
      target: obj.target,
      quantity: obj.quantity,
      completed: false,
      hint: obj.hint,
    })),
    location: generatedQuest.location,
    estimatedDuration: generatedQuest.estimatedDuration,
  };

  return quest;
}

function calculateExperience(difficulty: Quest["difficulty"]): number {
  switch (difficulty) {
    case "easy":
      return 100;
    case "medium":
      return 250;
    case "hard":
      return 500;
    case "epic":
      return 1000;
    default:
      return 100;
  }
}

function calculateCurrency(difficulty: Quest["difficulty"]): number {
  switch (difficulty) {
    case "easy":
      return 50;
    case "medium":
      return 125;
    case "hard":
      return 250;
    case "epic":
      return 500;
    default:
      return 50;
  }
}
