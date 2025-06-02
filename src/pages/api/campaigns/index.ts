import { NextApiRequest, NextApiResponse } from 'next';
import { listCampaigns } from '../../../db/campaigns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const characterId = req.query.characterId as string;
  if (!characterId) {
    return res.status(400).json({ error: 'Character ID is required' });
  }

  try {
    const campaigns = await listCampaigns(characterId);
    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
}