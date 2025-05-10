import { NextApiRequest, NextApiResponse } from 'next';
import { getRaceById } from '@/db/races';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid race ID' });
  }

  try {
    const race = await getRaceById(id);
    if (!race) {
      return res.status(404).json({ message: 'Race not found' });
    }
    res.status(200).json(race);
  } catch (error) {
    console.error('Error fetching race:', error);
    res.status(500).json({ message: 'Error fetching race' });
  }
} 