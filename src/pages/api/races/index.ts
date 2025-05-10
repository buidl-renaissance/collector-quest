import { NextApiRequest, NextApiResponse } from 'next';
import { getAllRaces } from '@/db/races';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const races = await getAllRaces();
    res.status(200).json(races);
  } catch (error) {
    console.error('Error fetching races:', error);
    res.status(500).json({ message: 'Error fetching races' });
  }
} 