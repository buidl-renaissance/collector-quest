import { NextApiRequest, NextApiResponse } from 'next';
import { getRaceById, updateRace } from '@/lib/races';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid race ID' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const race = await getRaceById(id);
        if (!race) {
          return res.status(404).json({ message: 'Race not found' });
        }
        return res.status(200).json(race);
      }

      case 'PUT': {
        const updates = req.body;
        const updatedRace = await updateRace(id, updates);
        if (!updatedRace) {
          return res.status(404).json({ message: 'Race not found' });
        }
        return res.status(200).json(updatedRace);
      }

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling race:', error);
    return res.status(500).json({ 
      message: 'Error handling race',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 