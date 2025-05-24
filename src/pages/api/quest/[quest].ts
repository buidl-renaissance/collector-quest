import { NextApiRequest, NextApiResponse } from 'next';
import { questDb } from '@/db/quest';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { quest: questId } = req.query;

  if (!questId || typeof questId !== 'string') {
    return res.status(400).json({ error: 'Quest ID is required' });
  }

  try {
    const quest = await questDb.getQuestById(questId);

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' });
    }

    return res.status(200).json(quest);
  } catch (error) {
    console.error('Error fetching quest:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch quest',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
