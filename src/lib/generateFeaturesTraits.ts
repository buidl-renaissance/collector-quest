import OpenAI from "openai";
import { Character } from "@/hooks/useCharacter";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface FeaturesTraitsInput {
  race: string;
  subrace?: string;
  characterClass: string;
  level: number;
  background: string;
  subclass?: string;
  customItems?: string[];
  questRewards?: string[];
  narrativeFlavor?: boolean;
}

interface FeaturesTraitsOutput {
  featuresAndTraits: {
    raceTraits: string[];
    classFeatures: string[];
    backgroundFeature: string;
    subclassFeatures: string[];
    customFeatures: string[];
  };
  description?: string;
}

export async function generateFeaturesTraits(
  character: Character
): Promise<FeaturesTraitsOutput> {
  if (!character.race || !character.class) {
    throw new Error("Character race and class are required");
  }

  const input: FeaturesTraitsInput = {
    race: character.race.name,
    // subrace: character.race.subrace || undefined,
    characterClass: character.class.name,
    level: character.level || 1,
    background: character.traits?.background || "Commoner",
    // subclass: character.class.subclass,
    customItems: character.equipment?.magicItems?.map(item => item.name) || [],
    narrativeFlavor: true
  };

  const prompt = `
    Generate features and traits for a D&D 5e character with the following details:
    
    Character Details:
    - Race: ${input.race}${input.subrace ? ` (${input.subrace})` : ''}
    - Class: ${input.characterClass}${input.subclass ? ` (${input.subclass})` : ''}
    - Level: ${input.level}
    - Background: ${input.background}
    
    ${input.customItems?.length ? `- Magic Items: ${input.customItems.join(", ")}` : ''}
    ${input.questRewards?.length ? `- Quest Rewards: ${input.questRewards.join(", ")}` : ''}
    
    Please generate a comprehensive list of features and traits for this character, including:
    1. Race Traits: Innate abilities from the character's race
    2. Class Features: Abilities gained from the character's class and level
    3. Background Feature: The special feature provided by the character's background
    4. Subclass Features (if applicable): Special abilities from the character's subclass
    5. Custom Features (if applicable): Any special abilities from magic items or quest rewards
    
    Return the result as a JSON object with the following structure:
    {
      "featuresAndTraits": {
        "raceTraits": ["trait1", "trait2", ...],
        "classFeatures": ["feature1", "feature2", ...],
        "backgroundFeature": "feature description",
        "subclassFeatures": ["feature1", "feature2", ...],
        "customFeatures": ["feature1", "feature2", ...]
      }
    }
    
    Each trait or feature should include a brief description of its mechanical effect.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a D&D 5e rules expert specializing in character creation. You provide accurate, comprehensive lists of character features and traits based on official D&D 5e rules."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1000
    });

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Failed to generate features and traits");
    }

    const result = JSON.parse(content) as FeaturesTraitsOutput;
    
    // Generate narrative description if requested
    if (input.narrativeFlavor) {
      result.description = await generateFeaturesTraitsDescription(input, result);
    }
    
    return result;
  } catch (error) {
    console.error("Error generating features and traits:", error);
    throw new Error("Failed to generate features and traits");
  }
}

async function generateFeaturesTraitsDescription(
  input: FeaturesTraitsInput,
  result: FeaturesTraitsOutput
): Promise<string> {
  const prompt = `
    Create a brief, evocative description (2-3 sentences) of how a ${input.race} ${input.characterClass} 
    with a ${input.background} background manifests their unique abilities and traits.
    
    Features and traits to reference:
    - Race traits: ${result.featuresAndTraits.raceTraits.join(", ")}
    - Class features: ${result.featuresAndTraits.classFeatures.join(", ")}
    - Background feature: ${result.featuresAndTraits.backgroundFeature}
    ${result.featuresAndTraits.subclassFeatures.length ? `- Subclass features: ${result.featuresAndTraits.subclassFeatures.join(", ")}` : ""}
    ${result.featuresAndTraits.customFeatures.length ? `- Custom features: ${result.featuresAndTraits.customFeatures.join(", ")}` : ""}
    
    The description should be vivid and reflect how these abilities manifest in the character's appearance and actions.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant specializing in fantasy character descriptions. Create vivid, concise descriptions that capture a character's unique abilities and traits."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0]?.message?.content?.trim() || 
      "This character's abilities and traits blend together to create a unique adventurer with distinctive capabilities.";
  } catch (error) {
    console.error("Error generating features and traits description:", error);
    return "This character's abilities and traits blend together to create a unique adventurer with distinctive capabilities.";
  }
}
