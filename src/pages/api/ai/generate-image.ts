
import { generateImage } from "@/lib/image";
import { NextApiRequest, NextApiResponse } from "next";

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


    const imageResponse = await generateImage(prompt, image);

    return res.status(200).json({
      b64_json: imageResponse,
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
