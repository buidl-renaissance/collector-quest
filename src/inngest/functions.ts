import { inngest } from "./client";
import { generateImage } from "@/lib/image";
import { completeResult, failResult } from "@/lib/storage";

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
        return await generateImage(event.data.prompt, event.data.image);
      });

      // Store the result
      if (event.data.resultId) {
        if (image) {
          completeResult(event.data.resultId, image);
        } else {
          failResult(event.data.resultId, "Failed to generate image");
        }
      }

      return {
        success: !!image,
        message: image ? `Image generated successfully` : `Failed to generate image`,
        image
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