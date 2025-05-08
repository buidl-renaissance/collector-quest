import { inngest } from "./client";
import { generateImage } from "@/lib/image";

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
    const image = await generateImage(event.data.prompt, event.data.image);
    return { message: `Generating image: ${image}!` };
  },
);