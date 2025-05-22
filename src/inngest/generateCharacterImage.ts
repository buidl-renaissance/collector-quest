import { inngest } from './client';
import { CharacterDB } from '@/db/character';
import { FaceAnalyzer } from '@/lib/faceAnalyzer';
import { generateImageRequest } from '@/lib/imageGenerator';
import { uploadBase64Image } from '@/lib/imageUpload';
import { completeResult, failResult, updateResult } from '@/lib/storage';

interface UploadResult {
  success: true;
  url: string;
}

interface UploadError {
  success: false;
  error: string;
}

interface GenerateCharacterImageEvent {
  data: {
    characterId: string;
    userImage?: string;
    facialData?: Record<string, any>;
    prompt?: string;
    resultId?: string;
  };
}

export const generateCharacterImageFunction = inngest.createFunction(
  { id: "generate-character-image" },
  { event: "character/generate.image" },
  async ({ event, step }: { event: GenerateCharacterImageEvent, step: any }) => {
    try {
      const { characterId, userImage, facialData: existingFacialData, prompt } = event.data;
      const characterDB = new CharacterDB();
      const character = await characterDB.getCharacter(characterId);

      if (!character) {
        throw new Error('Character not found');
      }

      if (!character.race) {
        throw new Error('Character race not found');
      }

      updateResult(event.data.resultId!, JSON.stringify({
        message: "Starting character image generation",
        step: "analyze-facial-data",
      }));
      
      // Step 1: Analyze facial data if user image is provided
      let facialData = existingFacialData;
      if (userImage && !facialData) {
        facialData = await step.run("analyze-facial-data", async () => {
          const faceAnalyzer = new FaceAnalyzer(process.env.OPENAI_API_KEY || '');
          return await faceAnalyzer.analyzeFace(userImage);
        });

        updateResult(event.data.resultId!, JSON.stringify({
          message: "Facial data analyzed successfully",
          step: "generate-character-image",
          facialAnalysis: facialData
        }));

      }
      
      // Step 2: Generate the character image
      const generatedImage = await step.run("generate-image", async () => {
        const imagePrompt = prompt || 
          `character portrait based on facial analysis: ${facialData} and character race: ${character.race?.name} and class: ${character.class?.name}, change character from holding the current item to holding something specific to their race/class`;
        return await generateImageRequest(imagePrompt, character.race?.image);
      });
      
      let imageUrl = null;
      
      // Step 3: Upload the generated image
      if (generatedImage) {
        const uploadResult: UploadResult | UploadError = await step.run("upload-image", async () => {
          return await uploadBase64Image(generatedImage);
        });
        
        if ('success' in uploadResult && uploadResult.success) {
          imageUrl = uploadResult.url;
        } else {
          throw new Error(('error' in uploadResult) ? uploadResult.error : 'Failed to upload image');
        }

        updateResult(event.data.resultId!, JSON.stringify({
          success: true,
          message: "Character image generated successfully",
          step: "uploading-image",
          imageUrl,
          character,
          facialData
        }));
      }
      
      // Step 4: Save the image URL to the character
      if (imageUrl) {
        await step.run("save-character-image", async () => {
          // Save to database
          const characterDB = new CharacterDB();
          await characterDB.updateCharacter(characterId, { image_url: imageUrl });

          updateResult(event.data.resultId!, JSON.stringify({
            success: true,
            message: "Character image saved successfully",
            step: "save-character-image",
            imageUrl,
            character,
          }));
  
        });
      }
      
      // Step 5: Store the result
      if (event.data.resultId) {
        if (generatedImage && imageUrl) {
          await step.run("complete-result", async () => {
            // Get the character data
            const characterDB = new CharacterDB();
            const character = await characterDB.getCharacter(characterId);
            
            // Complete the result
            await completeResult(event.data.resultId!, JSON.stringify({
              success: true,
              message: "Character image generated successfully",
              imageUrl,
              character,
              facialData
            }));
          });
        } else {
          await step.run("fail-result", async () => {
            await failResult(event.data.resultId!, JSON.stringify({
              message: "Failed to generate character image"
            }));
          });
        }
      }
      
      return {
        success: !!generatedImage && !!imageUrl,
        message: generatedImage ? `Character image generated successfully` : `Failed to generate character image`,
        imageUrl,
        characterId
      };
    } catch (error) {
      // Store the error
      if (event.data.resultId) {
        await failResult(event.data.resultId, JSON.stringify({
          message: error instanceof Error ? error.message : "Unknown error",
          error: error
        }));
      }
      
      throw error;
    }
  },
);