import { NextApiRequest, NextApiResponse } from 'next';
import { getRelic, updateRelic } from '@/db/relics';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { relicId, registrationId } = req.body;

    if (!relicId || !registrationId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const relic = await getRelic(relicId);
    if (!relic) {
      return res.status(404).json({ message: 'Relic not found' });
    }

    const updatedRelic = await updateRelic(relicId, {
      ...relic,
      objectId: registrationId,
    });

    return res.status(200).json(updatedRelic);
  } catch (error) {
    console.error('Error registering relic:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 