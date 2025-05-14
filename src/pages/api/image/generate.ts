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
    const { prompt, image } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Create a unique ID for this generation request
    const resultId = uuidv4();
    
    // Create a pending result
    await createPendingResult(resultId);

    // Trigger the Inngest function
    await inngest.send({
      name: 'test/generate.image',
      data: {
        prompt,
        image: image?.length > 0 ? image : 'https://collectorquest.ai/images/COLLECTOR-quest-intro-1024.png',
        resultId,
      },
    });

    // Return the result ID so the client can check the status
    return res.status(200).json({
      resultId,
      status: 'pending',
    });
  } catch (error) {
    console.error('Error triggering image generation:', error);
    return res.status(500).json({
      error: 'Failed to trigger image generation',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
