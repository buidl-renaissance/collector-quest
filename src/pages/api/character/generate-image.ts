import { NextApiRequest, NextApiResponse } from 'next';
import { inngest } from '@/inngest/client';
import { v4 as uuidv4 } from 'uuid';
import { createPendingResult } from '@/lib/storage';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { characterId, image } = req.body;

    if (!characterId) {
      return res.status(400).json({ error: 'Character ID is required' });
    }

    // Create a unique ID for tracking the result
    const resultId = uuidv4();
    
    // Create a pending result entry
    await createPendingResult(resultId);

    // Trigger the Inngest function to generate the character image
    await inngest.send({
      name: "character/generate.image",
      data: {
        characterId,
        userImage: image,
        resultId,
      },
    });

    // Return the result ID for the client to poll
    return res.status(200).json({ 
      success: true, 
      resultId,
      message: 'Character image generation started'
    });
  } catch (error) {
    console.error('Error starting character image generation:', error);
    return res.status(500).json({ 
      error: 'Failed to start character image generation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
