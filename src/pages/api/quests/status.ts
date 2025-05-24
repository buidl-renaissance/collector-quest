import { NextApiRequest, NextApiResponse } from 'next';
import { questDb } from '@/db/quest';
import { getResult } from '@/lib/storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { eventId } = req.query;

  if (!eventId || typeof eventId !== 'string') {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    // Check if the quest exists in the database
    const result = await getResult(eventId);

    if (!result) {
      return res.status(200).json({ 
        status: 'pending',
        message: 'Quest generation in progress'
      });
    }

    result.result = result.result ? JSON.parse(result.result) : null;

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error checking quest status:', error);
    return res.status(500).json({ 
      error: 'Failed to check quest status',
      status: 'error'
    });
  }
} 