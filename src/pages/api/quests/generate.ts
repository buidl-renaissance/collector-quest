import { NextApiRequest, NextApiResponse } from 'next';
import { inngest } from '@/inngest/client';
import { getRelic } from '@/db/relics';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { relicId } = req.body;

    if (!relicId) {
      return res.status(400).json({ 
        error: 'Relic ID is required' 
      });
    }

    const relic = await getRelic(relicId);

    if (!relic) {
      return res.status(404).json({
        error: 'Relic not found'
      });
    }

    // Validate relic structure
    if (!relic.id || !relic.name || !relic.story) {
      return res.status(400).json({ 
        error: 'Relic must have id, name, and story' 
      });
    }

    // Trigger the quest generation function
    const result = await inngest.send({
      name: "quest/generate",
      data: {
        relic,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Quest generation started',
      eventId: result.ids[0],
    });

  } catch (error) {
    console.error('Quest generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate quest',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
