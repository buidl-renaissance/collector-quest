import { ArtifactProperties } from './interfaces';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the artifact classes, elements, effects, and rarities based on our game's taxonomy
const ARTIFACT_CLASSES = ['Tool', 'Weapon', 'Symbol', 'Wearable', 'Key'];
const ELEMENTS = ['Fire', 'Water', 'Nature', 'Shadow', 'Light', 'Electric'];
const EFFECTS = ['Reveal', 'Heal', 'Unlock', 'Boost', 'Summon'];
const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic'];

// Fallback generation function in case the API call fails
function fallbackGenerateProperties(
  title: string,
  medium: string,
  description: string
): ArtifactProperties {
  // Create a deterministic but seemingly random approach based on input
  const seed = title.length + medium.length + description.length;
  
  // Use the seed to generate consistent properties for the same input
  const classIndex = (seed * 7) % ARTIFACT_CLASSES.length;
  const elementIndex = (seed * 13) % ELEMENTS.length;
  const effectIndex = (seed * 17) % EFFECTS.length;
  const rarityIndex = Math.min(
    Math.floor((seed * 19) % RARITIES.length),
    RARITIES.length - 1
  );

  return {
    class: ARTIFACT_CLASSES[classIndex],
    element: ELEMENTS[elementIndex],
    effect: EFFECTS[effectIndex],
    rarity: RARITIES[rarityIndex]
  };
}

export async function generateArtifactProperties(
  title: string,
  medium: string,
  description: string,
  imageUrl: string
): Promise<ArtifactProperties> {
  try {
    // Prepare the prompt for the AI
    const prompt = `
🎯 Prompt for Extracting Game Asset Metadata from a Painting:
You are an expert game designer and art analyst. Given an image of a painting, analyze the visual composition, color palette, subject matter, and symbolic elements to generate detailed metadata for a collectible game asset. Provide the following structured output:

{
  "title": "[Give it a fitting, lore-inspired name]",
  "class": "Tool, Weapon, Symbol, Wearable, or Key",
  "element": "Fire, Water, Nature, Shadow, Light, or Electric",
  "effect": "Reveal, Heal, Unlock, Boost, or Summon",
  "rarity": "Common, Uncommon, Rare, or Epic",
  "flavor_text": "[One sentence of poetic or cryptic lore hinting at its power or origin]"
}

Focus on:
- The emotion and symbolism of the painting
- The colors and lighting as clues to the element
- The subject matter to infer its class and power
- Any gestures, creatures, or mystical features for effect design

Analyze this artwork:
Title: ${title}
Medium: ${medium}
Description: ${description}

Output only the JSON block.
`;

    // Make the API call to an AI service
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 500
      }
    );

    // Parse the response
    const aiResponse = response.choices[0].message.content;
    const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const jsonData = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure the returned properties match our expected values
      const properties: ArtifactProperties = {
        class: ARTIFACT_CLASSES.includes(jsonData.class) ? jsonData.class : fallbackGenerateProperties(title, medium, description).class,
        element: ELEMENTS.includes(jsonData.element) ? jsonData.element : fallbackGenerateProperties(title, medium, description).element,
        effect: EFFECTS.includes(jsonData.effect) ? jsonData.effect : fallbackGenerateProperties(title, medium, description).effect,
        rarity: RARITIES.includes(jsonData.rarity) ? jsonData.rarity : fallbackGenerateProperties(title, medium, description).rarity
      };
      
      return properties;
    }
    
    // If we couldn't parse the JSON, fall back to deterministic generation
    return fallbackGenerateProperties(title, medium, description);
    
  } catch (error) {
    console.error('Error generating artifact properties with AI:', error);
    // Fall back to deterministic generation if the API call fails
    return fallbackGenerateProperties(title, medium, description);
  }
}

export async function generateArtifactTitleAndDescription(properties: ArtifactProperties): Promise<{ title: string, description: string }> {
  try {
    const prompt = `
🎯 Prompt for Generating Game Asset Metadata from Artifact Properties:
You are an expert game designer and art analyst. Given a set of artifact properties, generate a title and description that capture the essence of the artifact. Provide the following structured output:

{
  "title": "[A fitting, lore-inspired title]",
  "description": "[A concise, poetic description of the artifact]"
}

Focus on:
- The symbolism and lore of the artifact
- The colors and lighting as clues to the element
- The subject matter to infer its class and power
- Any gestures, creatures, or mystical features for effect design

Analyze these artifact properties:
${JSON.stringify(properties)}

Output only the JSON block.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt }
          ]
        }
      ],
      max_tokens: 500
    });

    const aiResponse = response.choices[0].message.content;
    const jsonMatch = aiResponse?.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const jsonData = JSON.parse(jsonMatch[0]);
      return {
        title: jsonData.title,
        description: jsonData.description
      };
    }

    return {
      title: fallbackGenerateTitle(properties),
      description: fallbackGenerateDescription(properties)
    };
  } catch (error) {
    console.error('Error generating artifact title and description:', error);
    return {
      title: fallbackGenerateTitle(properties),
      description: fallbackGenerateDescription(properties)
    };
  }
}

// Fallback generation functions
function fallbackGenerateTitle(properties: ArtifactProperties): string {
  const classIndex = ARTIFACT_CLASSES.indexOf(properties.class);
  const elementIndex = ELEMENTS.indexOf(properties.element);
  const effectIndex = EFFECTS.indexOf(properties.effect);
  const rarityIndex = RARITIES.indexOf(properties.rarity);

  const seed = (classIndex * 7) + (elementIndex * 13) + (effectIndex * 17) + (rarityIndex * 19);
  const title = `Artifact of ${properties.class} ${properties.element} ${properties.effect} ${properties.rarity}`;
  return title;
}

function fallbackGenerateDescription(properties: ArtifactProperties): string {
  const description = `A ${properties.class} that uses ${properties.element} and has the ${properties.effect} effect.`;
  return description;
}

