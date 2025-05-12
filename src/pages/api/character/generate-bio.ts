import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface CharacterData {
  race: {
    name: string;
    traits?: string[];
    description: string;
  };
  class: {
    name: string;
    description: string;
  };
  traits: {
    personality: string[];
    ideals: string[];
    bonds: string[];
    flaws: string[];
  };
  motivation: string;
  perspective: 'first' | 'third';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const characterData = req.body as CharacterData;
    const { race, class: characterClass, traits, motivation, perspective } = characterData;

    const prompt = `Create a rich, detailed character biography based on the following elements:

Race: ${race.name}
${race.description}

Class: ${characterClass.name}
${characterClass.description}

Personality Traits: ${traits.personality.join(', ')}
Ideals: ${traits.ideals.join(', ')}
Bonds: ${traits.bonds.join(', ')}
Flaws: ${traits.flaws.join(', ')}

Core Motivation: ${motivation}

Generate a compelling character biography that:
1. Incorporates all racial and class elements naturally
2. Weaves in personality traits, ideals, bonds, and flaws
3. Centers around their core motivation
4. Includes their background and how it shaped them
5. Suggests their future goals and potential conflicts
6. Maintains a consistent ${perspective}-person perspective

The output should be a cohesive narrative that reads like a character study, approximately 3-4 paragraphs long.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative writing expert specializing in character development and world-building. Your task is to generate rich, nuanced character biographies that incorporate multiple elements while maintaining narrative coherence and consistency."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    const generatedBio = completion.choices[0]?.message?.content || '';

    res.status(200).json({ bio: generatedBio });
  } catch (error) {
    console.error('Error generating bio:', error);
    res.status(500).json({ error: 'Failed to generate bio' });
  }
} 