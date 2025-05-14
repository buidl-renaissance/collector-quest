import { getRaceById, saveRace } from "@/db/races";
import { inngest } from "./client";
import { generateImageRequest } from "@/lib/imageGenerator";
import { uploadBase64Image, UploadResult, UploadError } from "@/lib/imageUpload";
import { completeResult, failResult } from "@/lib/storage";
import { coreRaces, expandedRaces, Race } from "@/data/races";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const generateImageFunction = inngest.createFunction(
  { id: "generate-image" },
  { event: "test/generate.image" },
  async ({ event, step }) => {
    try {
      // Generate the image
      const image = await step.run("generate-image", async () => {
        return await generateImageRequest(event.data.prompt, event.data.image);
      });

      let imageUrl = null;

      if (image) {  
        const uploadResult: UploadResult | UploadError = await step.run("upload-image", async () => {
          return await uploadBase64Image(image);
        });

        if ('success' in uploadResult) {
          imageUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error);
        }
      }

      // Store the result
      if (event.data.resultId) {
        if (image) {
          completeResult(event.data.resultId, JSON.stringify({
            success: true,
            message: "Image generated successfully",
            imageUrl,
          }));
        } else {
          failResult(event.data.resultId, "Failed to generate image");
        }
      }

      return {
        success: !!image,
        message: image ? `Image generated successfully` : `Failed to generate image`,
        image,
        imageUrl,
      };
    } catch (error) {
      // Store the error
      if (event.data.resultId) {
        failResult(
          event.data.resultId,
          error instanceof Error ? error.message : "Unknown error"
        );
      }

      throw error;
    }
  },
);

export const generateRaceImageFunction = inngest.createFunction(
  { id: "generate-race-image" },
  { event: "test/generate.race.image" },
  async ({ event, step }) => {
    try {
      // Generate the image
      const image = await step.run("generate-image", async () => {
        return await generateImageRequest(event.data.prompt, event.data.image);
      });

      let imageUrl = null;

      if (image) {  
        const uploadResult: UploadResult | UploadError = await step.run("upload-image", async () => {
          return await uploadBase64Image(image);
        });

        if ('success' in uploadResult) {
          imageUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error);
        }
      }

      let race: Race | null = await getRaceById(event.data.raceId);
      if (!race) {
        race = [...coreRaces, ...expandedRaces].find((r) => r.id === event.data.raceId) || null;
      }

      if (race && imageUrl) {
        race.image = imageUrl;
        await step.run("save-race", async () => {
          await saveRace(race);
        });
      }

      // Store the result
      if (event.data.resultId) {
        if (image) {
          completeResult(event.data.resultId, JSON.stringify({
            success: true,
            message: "Image generated successfully",
            imageUrl,
            race,
          }));
        } else {
          failResult(event.data.resultId, "Failed to generate image");
        }
      }

      return {
        success: !!image,
        message: image ? `Image generated successfully` : `Failed to generate image`,
        image,
        imageUrl,
      };
    } catch (error) {
      // Store the error
      if (event.data.resultId) {
        failResult(
          event.data.resultId,
          error instanceof Error ? error.message : "Unknown error"
        );
      }

      throw error;
    }
  },
);
