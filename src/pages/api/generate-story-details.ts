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
    const { prompt, imageUrl } = req.body;

    if (!prompt && !imageUrl) {
      return res.status(400).json({ error: "Either prompt or imageUrl is required" });
    }

    let imageAnalysis = "";
    if (imageUrl) {
      // Analyze the image using GPT-4 Vision
      const imageCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an art critic and storyteller for Lord Smearington's Gallery of the Absurd.
            Analyze the provided image and describe its key elements, mood, and potential story elements.
            Focus on visual details, symbolism, and emotional impact.
            Keep your analysis concise but insightful.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this image and provide key details that could inspire a story:" },
              { 
                type: "image_url", 
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500
      });

      imageAnalysis = imageCompletion.choices[0]?.message?.content || "";
    }

    // Generate story based on both prompt and image analysis
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
          content: `Generate a story based on:
          ${prompt ? `Prompt: ${prompt}` : ""}
          ${imageAnalysis ? `\nImage Analysis: ${imageAnalysis}` : ""}
          
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

    let storyDetails;
    try {
      // Clean the response string by removing any control characters
      const cleanedResponse = response.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      storyDetails = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.error("Raw response:", response);
      throw new Error("Failed to parse story details from OpenAI response");
    }

    // Validate the required fields
    if (!storyDetails.title || !storyDetails.description || !storyDetails.script) {
      throw new Error("Incomplete story details in OpenAI response");
    }

    return res.status(200).json(storyDetails);
  } catch (error) {
    console.error("Error generating story details:", error);
    return res.status(500).json({ 
      error: "Failed to generate story details",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 