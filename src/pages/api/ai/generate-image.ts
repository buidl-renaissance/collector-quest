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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // let imageResponse;

    // if (image) {
    //   // If an image is provided, use it for image variation or editing
    //   imageResponse = await openai.images.createVariation({
    //     image: new File(
    //       [Buffer.from(image.split(',')[1], 'base64')],
    //       'image.png',
    //       { type: 'image/png' }
    //     ),
    //     n: 1,
    //     size: '1024x1024',
    //     response_format: 'url',
    //   });
    // } else {
    //   // If only prompt is provided, generate image from text
    //   imageResponse = await openai.images.generate({
    //     prompt: `A Renaissance-style fantasy portrait of a ${prompt} in a dimly lit medieval setting. The character wears a dark cloak with golden accents and a shirt reading "COLLECTOR QUEST" featuring a fiery D20 die. They stand before a table with red polyhedral dice. The background includes warm tones of brown and gray. Capture the race's essence with solemn dignity and a modern RPG flair. `,
    //     n: 1,
    //     size: '1024x1024',
    //     response_format: 'url',
    //   });
    // }

    // Read the image file as a buffer and create a File object with proper MIME type
    const imagePath = "public/images/COLLECTOR-quest-intro-1024.png";
    const imageBuffer = fs.readFileSync(imagePath);
    const image = new File([imageBuffer], "image.png", { type: "image/png" });

    const maskPath = "public/images/mask.png";
    const maskBuffer = fs.readFileSync(maskPath);
    const mask = new File([maskBuffer], "mask.png", { type: "image/png" });

    const imageResponse = await openai.images.edit({
      model: "gpt-image-1",
      image: image,
      mask: mask,
      prompt: `replace the quest master, keeping the style of the image, with a ${prompt}`,
      n: 1,
      size: "1024x1024",
    });

    console.log(imageResponse);

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
