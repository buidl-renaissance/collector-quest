import { Artifact } from '@/data/artifacts';
import OpenAI from 'openai';
import { downloadAndUploadImage, UploadResult, UploadError } from './imageUpload';

/**
 * Generates a game relic/artifact based on the provided artifact
 * 
 * @param artifact The artifact to generate a relic from
 * @returns An object containing the generated relic data
 */
export const generateRelic = async (artifact: Artifact) => {
  try {
    // Generate an image using OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Generate a highly detailed digital image of a fantasy relic known as [${artifact.title}]. This object should appear as a mystical artifact infused with symbolic meaning and crafted for use in a fantasy RPG as a collectible in-game item.

The relic represents ${artifact.properties.effect}, ${artifact.properties.element}, and ${artifact.properties.class}. It is of ${artifact.properties.rarity} rarity. ${artifact.description}

Style the relic as an enchanted item meant for use in temples, guild halls, or ceremonial altars. It should feel ancient, revered, and emotionally resonant. The asset must be rendered in fantasy concept art style, suitable for inventory screens or collectible galleries in a video game.

Render with transparent background (PNG format)

Centered composition

Include soft magical glow, ambient lighting, and light particle effects

Emphasize realism in material texture, but maintain a painterly, fantasy aesthetic

Keywords: relic, ${artifact.properties.element}, ${artifact.properties.effect}, ${artifact.properties.class}, magical artifact, fantasy RPG, collector item, emotional resonance, digital asset, sacred, painterly detail, concept art.

The image should be a high resolution image, 1024x1024px, and contain only the generated artifact, no other text or elements.
`;

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      });

      // Update the image URL with the generated image
      if (response.data[0]?.url) {
        try {
          const result: UploadResult = await downloadAndUploadImage(response.data[0].url) as UploadResult;
          console.log('Generated new image for relic:', artifact.title);
          console.log('Generated new image for relic:', result.url);
          artifact.relicImageUrl = result.url;
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    } catch (imageError) {
      console.error('Error generating image with OpenAI:', imageError);
      // Continue with the original image if available
      console.log('Falling back to original image for relic:', artifact.title);
    }

    return {
      success: true,
      data: artifact
    };
  } catch (error) {
    console.error('Error generating relic:', error);
    return {
      success: false,
      error: 'Failed to generate relic'
    };
  }
};
