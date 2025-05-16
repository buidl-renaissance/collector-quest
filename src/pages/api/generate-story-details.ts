import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a creative storyteller for Lord Smearington's Gallery of the Absurd. 
          Generate engaging story details that match the surreal and artistic theme of the gallery.
          Focus on creating immersive, interactive narratives that blend art, mystery, and wonder.
          Keep the tone whimsical yet sophisticated, with a touch of the absurd.`
        },
        {
          role: "user",
          content: `Generate a story with the following prompt: ${prompt}
          
          Please provide:
          1. A captivating title
          2. A brief description (1-2 sentences)
          3. A script for the story (100 words)
          
          Format the response as JSON with these fields:
          {
            "title": "string",
            "description": "string",
            "script": "string"
          }`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const storyDetails = JSON.parse(response);

    return res.status(200).json(storyDetails);
  } catch (error) {
    console.error("Error generating story details:", error);
    return res.status(500).json({ 
      error: "Failed to generate story details",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 