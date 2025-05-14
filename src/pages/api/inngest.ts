import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld, generateImageFunction, generateRaceImageFunction } from "@/inngest/functions";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
    responseLimit: '8mb',
  },
};


// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [
    helloWorld,
    generateImageFunction,
    generateRaceImageFunction,
  ],
});