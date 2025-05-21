import { Artifact } from '@/data/artifacts';
import OpenAI from 'openai';

/**
 * Generates a game relic/artifact based on the provided artifact
 * 
 * @param artifact The artifact to generate a relic from
 * @returns An object containing the generated relic data
 */
export const generateRelic = async (artifact: Artifact) => {
  try {
    const relicData = {
      name: artifact.title,
      description: artifact.description,
      class: artifact.class,
      element: artifact.element,
      effect: artifact.effect,
      rarity: artifact.rarity,
      imageUrl: artifact.imageUrl,
      createdAt: new Date().toISOString(),
      id: `relic_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    };

    // Generate an image using OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `A fantasy game artifact: ${artifact.title}. 
      It is a ${artifact.rarity} ${artifact.class} with ${artifact.element} element and ${artifact.effect} effect. 
      Description: ${artifact.description}`;

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      // Update the image URL with the generated image
      if (response.data[0]?.url) {
        relicData.imageUrl = response.data[0].url;
        console.log('Generated new image for relic:', relicData.name);
      }
    } catch (imageError) {
      console.error('Error generating image with OpenAI:', imageError);
      // Continue with the original image if available
      console.log('Falling back to original image for relic:', relicData.name);
    }

    return {
      success: true,
      data: relicData
    };
  } catch (error) {
    console.error('Error generating relic:', error);
    return {
      success: false,
      error: 'Failed to generate relic'
    };
  }
};
