import { NextApiRequest, NextApiResponse } from 'next';
import { questDb } from '@/db/quest';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const quests = await questDb.getAllQuests();
    
    return res.status(200).json({
      success: true,
      quests,
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return res.status(500).json({
      error: 'Failed to fetch quests',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
