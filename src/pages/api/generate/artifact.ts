import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { artworkTitle, medium, type, artifactClass, primaryEffect, elementalType } = req.body;

    if (type === 'game-integration') {
      const prompt = `Given this artwork:
Title: ${artworkTitle}
Medium: ${medium}

Generate appropriate game integration details for a fantasy RPG artifact. Consider the artwork's visual elements and medium when determining:
1. Artifact Class (Tool, Weapon, Symbol, Wearable, or Key)
2. Primary Effect (Reveal, Heal, Unlock, Boost, or Summon)
3. Elemental Type (Fire, Water, Nature, Shadow, Light, or Electric)
4. Rarity (Common, Uncommon, Rare, or Epic)

Return the response in JSON format with these exact keys: artifactClass, primaryEffect, elementalType, rarity`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
        response_format: { type: "json_object" },
      });

      const content = JSON.parse(completion.choices[0].message.content || '{}');
      return res.status(200).json(content);
    }

    if (type === 'lore') {
      const prompt = `Given this artifact:
Title: ${artworkTitle}
Medium: ${medium}
Class: ${artifactClass}
Primary Effect: ${primaryEffect}
Elemental Type: ${elementalType}

Write a short, engaging description (2-3 sentences) that explains:
1. What the artifact does
2. Its origin or history
3. Any notable characteristics

Keep the tone mystical and fantasy-oriented.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4",
      });

      return res.status(200).json({
        description: completion.choices[0].message.content
      });
    }

    return res.status(400).json({ error: 'Invalid generation type' });
  } catch (error) {
    console.error('Error generating content:', error);
    return res.status(500).json({ error: 'Failed to generate content' });
  }
} 