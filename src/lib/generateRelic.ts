import { Artifact } from '@/data/artifacts';
import OpenAI from 'openai';
import { downloadAndUploadImage, UploadResult, UploadError } from './imageUpload';

/**
 * Generates a game relic/artifact based on the provided artifact
 * 
 * @param artifact The artifact to generate a relic from
 * @param inspirationImageUrl Optional URL of an image to use as inspiration
 * @returns An object containing the generated relic data
 */
export const generateRelic = async (artifact: Artifact, inspirationImageUrl?: string) => {
  try {
    // Generate an image using OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let prompt = `Generate a fantasy relic glowing with mystical energy, featuring an ornate, twisted metal structure that represents [${artifact.title}]. The relic should have enchanted elements that symbolize ${artifact.properties.effect}, ${artifact.properties.element}, and ${artifact.properties.class}. It is of ${artifact.properties.rarity} rarity.

The relic should sit on a stone-tiled pedestal, radiating magical sparks and ambient particles in blues, golds, and purples that reflect its essence. ${artifact.description}

Style the relic with warm lighting, soft glows, and intricate metallic textures. It should appear ancient and powerful, with a dark and atmospheric background that makes the magical elements stand out. The design should be suitable for display in a game inventory or artifact compendium.`;

    // Add inspiration image context if provided
    if (inspirationImageUrl) {
      prompt += `\n\nDraw inspiration from the provided reference image while maintaining the fantasy relic aesthetic.`;
    }

    prompt += `\n\nRender with transparent background (PNG format)

Centered composition

Include vibrant, animated-looking magical elements and ambient particles

Emphasize high-detail digital painting style with intricate textures

Keywords: fantasy relic, mystical energy, ornate structure, ${artifact.properties.element}, ${artifact.properties.effect}, ${artifact.properties.class}, enchanted, magical artifact, stone pedestal, magical sparks, ambient particles, warm lighting, intricate textures.

The image should be a high resolution image, 1024x1024px, and contain only the generated artifact, no other text or elements.
`;

    try {
      const imageGenerationOptions: any = {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      };

      // If we have an inspiration image, use it with the image variation API
      if (inspirationImageUrl) {
        try {
          // First download the inspiration image
          const response = await fetch(inspirationImageUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch inspiration image: ${response.status}`);
          }
          
          // Convert to base64 or use directly depending on OpenAI's API requirements
          const imageBlob = await response.blob();
          const imageFile = new File([imageBlob], "inspiration.png", { type: "image/png" });
          
          // Use the image variation API instead of text-to-image
          const variationResponse = await openai.images.createVariation({
            image: imageFile,
            n: 1,
            size: "1024x1024",
          });
          
          if (variationResponse.data[0]?.url) {
            const result: UploadResult = await downloadAndUploadImage(variationResponse.data[0].url) as UploadResult;
            console.log('Generated new image for relic with inspiration:', artifact.title);
            console.log('Generated new image URL:', result.url);
            artifact.relicImageUrl = result.url;
          }
        } catch (variationError) {
          console.error('Error generating image variation:', variationError);
          // Fall back to standard generation if variation fails
          const standardResponse = await openai.images.generate(imageGenerationOptions);
          if (standardResponse.data[0]?.url) {
            const result: UploadResult = await downloadAndUploadImage(standardResponse.data[0].url) as UploadResult;
            artifact.relicImageUrl = result.url;
          }
        }
      } else {
        // Standard image generation without inspiration
        const response = await openai.images.generate(imageGenerationOptions);
        if (response.data[0]?.url) {
          const result: UploadResult = await downloadAndUploadImage(response.data[0].url) as UploadResult;
          console.log('Generated new image for relic:', artifact.title);
          console.log('Generated new image URL:', result.url);
          artifact.relicImageUrl = result.url;
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
