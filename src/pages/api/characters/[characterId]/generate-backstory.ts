import { NextApiRequest, NextApiResponse } from 'next';
import { inngest } from '@/utils/inngest';
import { CharacterDB } from '@/db/character';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const characterId = req.query.characterId as string;

  try {
    // Verify character exists
    const characterDB = new CharacterDB();
    const character = await characterDB.getCharacter(characterId);
    
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    // Trigger the backstory generation
    await inngest.send({
      name: "generate/character.backstory",
      data: {
        characterId,
      },
    });

    return res.status(200).json({
      message: 'Backstory generation started',
      characterId,
    });
  } catch (error) {
    console.error('Error triggering backstory generation:', error);
    return res.status(500).json({ 
      message: 'Failed to trigger backstory generation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 