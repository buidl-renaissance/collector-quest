import { OpenAI } from 'openai';
import { ArtifactClass, Element, Effect, Rarity, Artifact } from '@/data/artifacts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the artifact classes, elements, effects, and rarities based on our game's taxonomy
const ARTIFACT_CLASSES = ['Tool', 'Weapon', 'Symbol', 'Wearable', 'Key'];
const ELEMENTS = ['Fire', 'Water', 'Nature', 'Shadow', 'Light', 'Electric'];
const EFFECTS = ['Reveal', 'Heal', 'Unlock', 'Boost', 'Summon'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic'];

export interface GeneratedRelic {
  name: string;
  class: ArtifactClass;
  element: Element;
  effect: Effect;
  rarity: Rarity;
  story: string;
  properties: {
    activeUse?: string;
    visualAsset?: string;
    passiveBonus?: string;
    unlockCondition?: string;
    reflectionTrigger?: string;
  }
}

/**
 * Analyzes an artifact image using OpenAI's vision capabilities
 * @param imageUrl URL of the artifact image to analyze
 * @param medium The medium used to create the artifact
 * @param yearCreated The year the artifact was created
 * @returns Object containing artifact title, description, and properties
 */
export async function generateRelic(artifact: Artifact): Promise<GeneratedRelic> {
  try {
    const prompt = `
🎯 You are a world-builder and game designer crafting legendary artifacts based on visual art. Analyze this painting and generate a complete artifact profile that fits seamlessly into a fantasy RPG. Your output should be lore-rich, gameplay-relevant, and emotionally resonant.

Additional context:
- Title: ${artifact.title}
- Description: ${artifact.description}
- Medium: ${artifact.medium}
- Year created: ${artifact.year}

Provide the following structured output:

{
  "name": "[Lore-rich, symbolic name inspired by the painting]",
  "description": "[A concise, poetic description of the relic]",
  "story": "[One or two sentences of lore or mythological backstory—mysterious, poetic, or emotionally resonant]",
  "class": "Tool, Weapon, Symbol, Wearable, or Key",
  "element": "Fire, Water, Nature, Shadow, Light, or Electric",
  "effect": "Reveal, Heal, Unlock, Boost, or Summon",
  "rarity": "Common, Uncommon, Rare, or Epic",
  "properties": {
    "visualAsset": "[Describe how the artwork appears in-game, including environmental placement and any subtle animations or effects]",
    "passiveBonus": "[Name of passive skill] – [Describe the gameplay effect this passive ability provides]",
    "activeUse": "[Name of active skill] – [Describe the one-time effect this artifact can trigger during a quest]",
    "unlockCondition": "[Describe the narrative or gameplay requirement needed to acquire or activate the artifact]",
    "reflectionTrigger": "[A thoughtful or cryptic question the AI guide might ask when the artifact is viewed]"
  }
}

Focus on:
- Interpreting the subject, lighting, colors, and symbolism of the painting
- Designing the artifact's effects to reinforce the theme or emotion conveyed by the artwork
- Creating gameplay elements that feel meaningful and connected to the visual representation
- Developing lore that enhances the mystique and value of the artifact

Output only the JSON block.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: artifact.imageUrl } }
          ]
        }
      ],
      max_tokens: 1000
    });

    const aiResponse = response.choices[0].message.content;
    const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonData = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure the returned properties match our expected values
      return {
        name: jsonData.name,
        story: jsonData.story,
        class: ARTIFACT_CLASSES.includes(jsonData.class) ? jsonData.class : ARTIFACT_CLASSES[0],
        element: ELEMENTS.includes(jsonData.element) ? jsonData.element : ELEMENTS[0],
        effect: EFFECTS.includes(jsonData.effect) ? jsonData.effect : EFFECTS[0],
        rarity: RARITIES.includes(jsonData.rarity) ? jsonData.rarity : RARITIES[0],
        properties: jsonData.properties,
      };
    }
    
    throw new Error("Failed to generate relic");
    
  } catch (error) {
    console.error('Error analyzing artifact image with AI:', error);
    throw error;
  }
}
