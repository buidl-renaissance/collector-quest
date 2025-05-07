import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import fs from "fs";

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
    const { prompt, image } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let imageFile: File = new File([], "image.png", { type: "image/png" });
    const maskPath = "public/images/mask.png";
    const maskBuffer = fs.readFileSync(maskPath);
    const mask = new File([maskBuffer], "mask.png", { type: "image/png" });

    // Process the provided image if it exists
    if (image) {
      if (image.startsWith('data:image')) {
        // Handle base64 encoded image
        const base64Data = image.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');
        imageFile = new File([imageBuffer], "image.png", { type: "image/png" });
      } else if (image.startsWith('http')) {
        // Handle image URL
        const response = await fetch(image);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        imageFile = new File([buffer], "image.png", { type: response.headers.get("content-type") || "image/png" });
      }
    } else {
      // Use default image if no image is provided
      const imagePath = "public/images/COLLECTOR-quest-intro-1024.png";
      const imageBuffer = fs.readFileSync(imagePath);
      imageFile = new File([imageBuffer], "image.png", { type: "image/png" });
    }

    // Generate the image
    const imageResponse = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      mask: mask,
      prompt: `replace the quest master, keeping the style of the image, with a ${prompt}`,
      n: 1,
      size: "1024x1024",
    });

    return res.status(200).json({
      b64_json: imageResponse.data[0].b64_json,
      success: true,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({
      error: "Failed to generate image",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
