import { serve } from "inngest/next";
import { inngestServer } from "@/inngest/server";
import { helloWorld, generateImageFunction } from "@/inngest/functions";

// Create an API that serves zero functions
export default serve({
  client: inngestServer,
  functions: [
    helloWorld,
    generateImageFunction,
  ],
});