import { OpenAI } from 'openai';
import { ArtifactProperties, ArtifactClass, Element, Effect, Rarity } from '@/data/artifacts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the artifact classes, elements, effects, and rarities based on our game's taxonomy
const ARTIFACT_CLASSES = ['Tool', 'Weapon', 'Symbol', 'Wearable', 'Key'];
const ELEMENTS = ['Fire', 'Water', 'Nature', 'Shadow', 'Light', 'Electric'];
const EFFECTS = ['Reveal', 'Heal', 'Unlock', 'Boost', 'Summon'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic'];

export interface AnalyzedArtifact {
  artistName: string;
  artworkTitle: string;
  medium: string;
  yearCreated: string;
  description: string;
  properties: ArtifactProperties;
  story: string;
  visualAsset?: string;
  passiveBonus?: string;
  activeUse?: string;
  unlockCondition?: string;
  reflectionTrigger?: string;
}

/**
 * Analyzes an artifact image using OpenAI's vision capabilities
 * @param imageUrl URL of the artifact image to analyze
 * @param medium The medium used to create the artifact
 * @param yearCreated The year the artifact was created
 * @returns Object containing artifact title, description, and properties
 */
export async function analyzeArtifactImage(
  imageUrl: string,
  medium: string,
  yearCreated: string
): Promise<AnalyzedArtifact> {
  try {
    const prompt = `
🎯 You are a worldbuilder and game designer crafting legendary artifacts based on visual art. Analyze this painting and generate a complete artifact profile that fits seamlessly into a fantasy RPG. Your output should be lore-rich, gameplay-relevant, and emotionally resonant.

Additional context:
- Medium: ${medium}
- Year created: ${yearCreated}

Provide the following structured output:

{
  "artistName": "[Suggest a fitting artist name based on the style]",
  "artworkTitle": "[Lore-rich, symbolic name inspired by the painting]",
  "medium": "${medium}",
  "yearCreated": "${yearCreated}",
  "description": "[A concise, poetic description of the artifact]",
  "story": "[One or two sentences of lore or mythological backstory—mysterious, poetic, or emotionally resonant]",
  "properties": {
    "class": "Tool, Weapon, Symbol, Wearable, or Key",
    "element": "Fire, Water, Nature, Shadow, Light, or Electric",
    "effect": "Reveal, Heal, Unlock, Boost, or Summon",
    "rarity": "Common, Uncommon, Rare, or Epic",
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
            { type: 'image_url', image_url: { url: imageUrl } }
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
      const properties: ArtifactProperties = {
        class: ARTIFACT_CLASSES.includes(jsonData.properties.class) ? jsonData.properties.class : ARTIFACT_CLASSES[0],
        element: ELEMENTS.includes(jsonData.properties.element) ? jsonData.properties.element : ELEMENTS[0],
        effect: EFFECTS.includes(jsonData.properties.effect) ? jsonData.properties.effect : EFFECTS[0],
        rarity: RARITIES.includes(jsonData.properties.rarity) ? jsonData.properties.rarity : RARITIES[0],
        visualAsset: jsonData.properties.visualAsset,
        passiveBonus: jsonData.properties.passiveBonus,
        activeUse: jsonData.properties.activeUse,
        unlockCondition: jsonData.properties.unlockCondition,
        reflectionTrigger: jsonData.properties.reflectionTrigger
      };
      
      return {
        artistName: jsonData.artistName || "Unknown Artist",
        artworkTitle: jsonData.artworkTitle || "Mysterious Artifact",
        medium: jsonData.medium || medium,
        yearCreated: jsonData.yearCreated || yearCreated,
        description: jsonData.description || "An enigmatic object of unknown origin.",
        story: jsonData.story || "None",
        properties,
      };
    }
    
    // Fallback if we couldn't parse the JSON
    return {
      artistName: "Unknown Artist",
      artworkTitle: "Mysterious Artifact",
      medium: medium,
      yearCreated: yearCreated,
      description: "An enigmatic object of unknown origin.",
      story: "unknown",
      properties: {
        class: ARTIFACT_CLASSES[0] as ArtifactClass,
        element: ELEMENTS[0] as Element,
        effect: EFFECTS[0] as Effect,
        rarity: RARITIES[0] as Rarity
      },
    };
    
  } catch (error) {
    console.error('Error analyzing artifact image with AI:', error);
    // Return default values if the API call fails
    return {
      artistName: "Unknown Artist",
      artworkTitle: "Mysterious Artifact",
      medium: medium,
      yearCreated: yearCreated,
      description: "An enigmatic object of unknown origin.",
      story: "unknown",
      properties: {
        class: ARTIFACT_CLASSES[0] as ArtifactClass,
        element: ELEMENTS[0] as Element,
        effect: EFFECTS[0] as Effect,
        rarity: RARITIES[0] as Rarity
      }
    };
  }
}
