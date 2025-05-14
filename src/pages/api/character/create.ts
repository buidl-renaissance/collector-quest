import { NextApiRequest, NextApiResponse } from 'next';
import { CharacterDB } from '@/db/character';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const characterDB = new CharacterDB();
    
    // Create a new character with minimal required fields
    const characterId = await characterDB.createCharacter({
      name: '', // Empty name to start
      level: 1, // Default level
    });

    // Return the new character ID
    return res.status(200).json({ characterId });
  } catch (error) {
    console.error('Error creating character:', error);
    return res.status(500).json({ 
      message: 'Failed to create character',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 