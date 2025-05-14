import { NextApiRequest, NextApiResponse } from 'next';
import { CharacterDB } from '@/db/character';
import { Character } from '@/hooks/useCharacter';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const characterDB = new CharacterDB();

  if (req.method === 'GET') {
    try {
      const characters = await characterDB.listCharacters();
      return res.status(200).json(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      return res.status(500).json({ error: 'Failed to fetch characters' });
    }
  } else if (req.method === 'POST') {
    try {
      const character: Character = req.body;
      const id = await characterDB.createCharacter(character);
      return res.status(201).json({ id, ...character });
    } catch (error) {
      console.error('Error creating character:', error);
      return res.status(500).json({ error: 'Failed to create character' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
