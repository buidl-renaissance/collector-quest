import { NextApiRequest, NextApiResponse } from 'next';
import { inngest } from '@/inngest/client';
import { createPendingResult } from '@/lib/storage';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { artifactId } = req.body;

    if (!artifactId) {
      return res.status(400).json({ error: 'Artifact ID is required' });
    }

    const resultId = uuidv4();
    await createPendingResult(resultId);

    // Send event to Inngest
    await inngest.send({
      name: "relic/generate",
      data: {
        resultId,
        artifactId
      }
    });

    return res.status(202).json({ 
      message: 'Relic generation started',
      status: 'processing',
      resultId
    });
  } catch (error) {
    console.error('Error triggering relic generation:', error);
    return res.status(500).json({ error: 'Failed to start relic generation' });
  }
}
