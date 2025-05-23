import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AnalyzedArtifact {
  title: string;
  description: string;
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
🎯 You are a world-builder and game designer crafting legendary artifacts based on visual art. Analyze this painting and generate a complete artifact profile that fits seamlessly into a fantasy RPG. Your output should be lore-rich, gameplay-relevant, and emotionally resonant.

Additional context:
- Medium: ${medium}
- Year created: ${yearCreated}

Provide the following structured output:

{
  "title": "[Lore-rich, symbolic name inspired by the painting]",
  "medium": "${medium}",
  "yearCreated": "${yearCreated}",
  "description": "[A concise, poetic description of the artifact]",
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
      
      return {
        title: jsonData.title || "Mysterious Artifact",
        description: jsonData.description || "An enigmatic object of unknown origin.",
      };
    }
    
    // Fallback if we couldn't parse the JSON
    return {
      title: "Mysterious Artifact",
      description: "An enigmatic object of unknown origin.",
    };
    
  } catch (error) {
    console.error('Error analyzing artifact image with AI:', error);
    // Return default values if the API call fails
    throw error;
  }
}
