import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld, generateImageFunction } from "@/inngest/functions";

// Create an API that serves zero functions
export default serve({
  client: inngest,
  functions: [
    helloWorld,
    generateImageFunction,
  ],
});