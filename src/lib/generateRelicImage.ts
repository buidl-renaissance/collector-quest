import { Artifact, Relic } from '@/data/artifacts';
import OpenAI from 'openai';
import { downloadAndUploadImage, UploadResult, UploadError, uploadBase64Image } from './imageUpload';

/**
 * Generates a game relic/artifact based on the provided artifact
 * 
 * @param artifact The artifact to generate a relic from
 * @param inspirationImageUrl Optional URL of an image to use as inspiration
 * @returns An object containing the generated relic data
 */
export const generateRelicImage = async (artifact: Artifact, relic: Relic, inspirationImageUrl?: string) => {
  try {
    // Generate an image using OpenAI API
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let prompt = `Generate a fantasy relic glowing with mystical energy, featuring an ornate, twisted metal structure that represents [${artifact.title}]. The relic should have enchanted elements that symbolize ${relic.effect}, ${relic.element}, and ${relic.class}. It is of ${relic.rarity} rarity.

The relic should sit on a stone-tiled pedestal, radiating magical sparks and ambient particles in blues, golds, and purples that reflect its essence. ${artifact.description}

Style the relic with warm lighting, soft glows, and intricate metallic textures. It should appear ancient and powerful, with a dark and atmospheric background that makes the magical elements stand out. The design should be suitable for display in a game inventory or artifact compendium.

Do not include any text, badges, or logos in the image.

The relic embodies this story: ${relic.story}`;

    // Add inspiration image context if provided
    if (inspirationImageUrl) {
      prompt += `\n\nDraw inspiration from the provided reference image while maintaining the fantasy relic aesthetic.`;
    }

    prompt += `\n\nRender with transparent background (PNG format)

Centered composition

Include vibrant, animated-looking magical elements and ambient particles

Emphasize high-detail digital painting style with intricate textures

Keywords: fantasy relic, mystical energy, ornate structure, ${relic.element}, ${relic.effect}, ${relic.class}, enchanted, magical artifact, stone pedestal, magical sparks, ambient particles, warm lighting, intricate textures.

The image should be a high resolution image, 1024x1024px, and contain only the generated artifact, no other text or elements.
`;

    try {
      const imageGenerationOptions: any = {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
      };

      // If we have an inspiration image, use it with the image edit API
      if (inspirationImageUrl) {
        try {
          // First download the inspiration image
          const response = await fetch(inspirationImageUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch inspiration image: ${response.status}`);
          }
          
          // Convert to File object for the API
          const imageBlob = await response.blob();
          const imageFile = new File([imageBlob], "inspiration.png", { type: "image/png" });
          
          // Get mask image
          const maskResponse = await fetch("https://collectorquest.ai/images/mask-512.png");
          if (!maskResponse.ok) {
            throw new Error(`Failed to fetch mask image: ${maskResponse.status}`);
          }
          const maskBlob = await maskResponse.blob();
          const maskFile = new File([maskBlob], "mask.png", { type: "image/png" });
          
          console.log('Generating relic image with prompt:', prompt);

          // Use the image edit API instead of variation
          const editResponse = await openai.images.edit({
            model: "gpt-image-1",
            image: imageFile,
            mask: maskFile,
            prompt: `with this image as a reference, keep the style of the image, maintain the transparent background, and generate a ${prompt}`,
            n: 1,
            size: "1024x1024",
          });

          // console.log('Edit response:', editResponse);
          
          if (editResponse.data[0]?.b64_json) {
            const result: UploadResult = await uploadBase64Image(editResponse.data[0].b64_json) as UploadResult;
            console.log('Generated new image for relic with inspiration:', relic.name);
            console.log('Generated new image URL:', result.url);
            relic.imageUrl = result.url;
          }
        } catch (editError) {
          console.error('Error generating image edit:', editError);
          // Fall back to standard generation if edit fails
          const standardResponse = await openai.images.generate(imageGenerationOptions);
          if (standardResponse.data[0]?.url) {
            const result: UploadResult = await downloadAndUploadImage(standardResponse.data[0].url) as UploadResult;
            relic.imageUrl = result.url;
          }
        }
      } else {
        // Standard image generation without inspiration
        const response = await openai.images.generate(imageGenerationOptions);
        if (response.data[0]?.url) {
          const result: UploadResult = await downloadAndUploadImage(response.data[0].url) as UploadResult;
          console.log('Generated new image for relic:', artifact.title);
          console.log('Generated new image URL:', result.url);
          relic.imageUrl = result.url;
        }
      }
    } catch (imageError) {
      console.error('Error generating image with OpenAI:', imageError);
      // Continue with the original image if available
      console.log('Falling back to original image for relic:', artifact.title);
    }

    return {
      success: true,
      data: relic
    };
  } catch (error) {
    console.error('Error generating relic:', error);
    return {
      success: false,
      error: 'Failed to generate relic'
    };
  }
};
