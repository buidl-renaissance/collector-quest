import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type BioInput = {
  name: string;
  race: string;
  class: string;
  background: string;
  traits: {
    personality: string;
    fear: string;
    memory: string;
    possession: string;
    ideals: string;
    bonds: string;
    flaws: string;
  };
  motivation: string;
  sex: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, race, class: characterClass, background, traits, motivation, sex } = req.body as BioInput;

    const prompt = `Create a compelling backstory for a ${race} ${characterClass} named ${name}. 
    They are ${sex.toLowerCase()}, and their background is ${background}.
    
    Their personality is ${traits.personality}.
    They fear ${traits.fear}.
    They are haunted by ${traits.memory}.
    They treasure ${traits.possession}.
    Their ideals are ${traits.ideals}.
    Their bonds are ${traits.bonds}.
    Their flaws are ${traits.flaws}.
    
    Their motivation is: ${motivation}
    
    Write a concise but evocative backstory that weaves these elements together naturally. 
    Focus on key moments that shaped their character and led them to their current path.
    Keep it under 200 words.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative writing assistant specializing in D&D character backstories. Write in a natural, flowing style that brings characters to life."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const bio = completion.choices[0].message.content;

    res.status(200).json({ bio });
  } catch (error) {
    console.error('Error generating bio:', error);
    res.status(500).json({ error: 'Failed to generate bio' });
  }
} 