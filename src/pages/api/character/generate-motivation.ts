import { NextApiRequest, NextApiResponse } from 'next';
import { generateMotivation } from '@/lib/generateStory';

interface MotivationInput {
  actions: string[];
  forces: string[];
  forceIntensities: Record<string, number>;
  archetype: string | null;
  sex: string;
  race: string;
  class: string;
  personality: string[];
  ideals: string[];
  flaws: string[];
  hauntingMemory: string;
  treasuredPossession: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      actions, 
      forces, 
      forceIntensities, 
      archetype, 
      sex,
      race,
      class: characterClass,
      personality,
      ideals,
      flaws,
      hauntingMemory,
      treasuredPossession
    } = req.body as MotivationInput;

    const generatedMotivation = await generateMotivation({
      actions,
      forces,
      forceIntensities,
      archetype,
      sex,
      race,
      class: characterClass,
      personality,
      ideals,
      flaws,
      hauntingMemory,
      treasuredPossession
    });

    res.status(200).json({ motivation: generatedMotivation });
  } catch (error) {
    console.error('Error generating motivation:', error);
    res.status(500).json({ error: 'Failed to generate motivation' });
  }
} 