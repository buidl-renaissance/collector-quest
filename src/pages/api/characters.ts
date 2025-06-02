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
      const { owner } = req.query;
      const characters = await characterDB.listCharacters({
        owner: owner as string
      });
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
  } else if (req.method === 'PUT') {
    try {
      const character: Character = req.body;
      const success = await characterDB.updateCharacter(character.id!, character);
      if (!success) {
        return res.status(404).json({ error: 'Character not found' });
      }
      return res.status(200).json(character);
    } catch (error) {
      console.error('Error updating character:', error);
      return res.status(500).json({ error: 'Failed to update character' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
