import { NextApiRequest, NextApiResponse } from 'next';
import { dispatchGenerationEvent } from '@/inngest/sendEvent';
import { GenerationResult } from '@/data/generate';
import { findResult } from '@/db/generate';

interface IntroductionData {
  introduction: string;
  locale: any;
  characters: any[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const campaignId = req.query.campaign as string;
  if (!campaignId) {
    return res.status(400).json({ error: 'Campaign ID is required' });
  }

  try {

    const existingResult = await findResult<IntroductionData>({
      event_name: "campaign/introduction/generate",
      status: 'complete',
      object_type: "campaign",
      object_id: campaignId,
      object_key: "introduction"
    });

    if (existingResult) {
      return res.status(200).json({
        success: true,
        message: 'Campaign introduction generation already completed',
        event: existingResult
      });
    }

    // Use dispatchGenerationEvent to prevent duplicates
    const event: GenerationResult<IntroductionData> | null = await dispatchGenerationEvent({
      eventName: "campaign/introduction/generate",
      objectType: "campaign",
      objectId: campaignId,
      objectKey: "introduction",
      data: {
        campaignId,
      }
    });

    if (!event) {
      return res.status(500).json({ error: 'Failed to create generation event' });
    }

    // Return the event for polling
    res.status(200).json({
      success: true,
      message: 'Campaign introduction generation started',
      event
    });

  } catch (error) {
    console.error('Error starting introduction generation:', error);
    res.status(500).json({ error: 'Failed to start introduction generation' });
  }
} 