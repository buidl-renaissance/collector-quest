import { NextApiRequest, NextApiResponse } from 'next';
import { CharacterDB } from '@/db/character';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const characterDB = new CharacterDB();

  if (req.method === 'GET') {
    try {
      const character = await characterDB.getCharacter(id as string);
      
      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      return res.status(200).json(character);
    } catch (error) {
      console.error('Error fetching character:', error);
      return res.status(500).json({ error: 'Failed to fetch character' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 