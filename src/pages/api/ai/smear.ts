import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Initialize OpenAI client
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
    const { title, description, artist, imageUrl } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Missing required fields: title and description" });
    }

    // Prepare the prompt for OpenAI
    const prompt = `Generate an absurd, over-the-top art review in the voice of Lord Smearington, an eccentric art critic known for his bizarre metaphors and extreme reactions.

Artwork Title: "${title}"
Artist: "${artist || "Unknown"}"
Description: "${description}"
${imageUrl ? `Image URL: "${imageUrl}"` : ''}

Lord Smearington's reviews typically:
- Use ALL CAPS for emphasis on random words
- Include bizarre, exaggerated metaphors
- Express extreme emotional reactions to mundane details
- Make grandiose, nonsensical comparisons
- Length should be 2-3 sentences, max 280 characters
- End with a rating based on a statement like "8 venomous sparkles out of a shattered disco ball"

Lord Smearington's review:`;

    // Call OpenAI API
    const completion = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 150,
      temperature: 0.9,
    });

    const review = completion.choices[0].text.trim();

    return res.status(200).json({ review });
  } catch (error) {
    console.error("Error generating review:", error);
    return res.status(500).json({ error: "Failed to generate review" });
  }
}
