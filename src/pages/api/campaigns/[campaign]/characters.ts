import { NextApiRequest, NextApiResponse } from 'next';
import { addCharacterToCampaign, removeCharacterFromCampaign } from '../../../../db/campaigns';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { campaignId } = req.query;
  
  if (!campaignId || typeof campaignId !== 'string') {
    return res.status(400).json({ error: 'Campaign ID is required' });
  }

  switch (req.method) {
    case 'POST':
      return handleAddCharacter(req, res, campaignId);
    case 'DELETE':
      return handleRemoveCharacter(req, res, campaignId);
    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleAddCharacter(
  req: NextApiRequest,
  res: NextApiResponse,
  campaignId: string
) {
  const { characterId, role } = req.body;

  if (!characterId || !role) {
    return res.status(400).json({ error: 'Character ID and role are required' });
  }

  try {
    const result = await addCharacterToCampaign(campaignId, characterId, role);
    if (!result) {
      return res.status(404).json({ error: 'Failed to add character to campaign' });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error adding character to campaign:', error);
    return res.status(500).json({ error: 'Failed to add character to campaign' });
  }
}

async function handleRemoveCharacter(
  req: NextApiRequest,
  res: NextApiResponse,
  campaignId: string
) {
  const { characterId } = req.body;

  if (!characterId) {
    return res.status(400).json({ error: 'Character ID is required' });
  }

  try {
    const success = await removeCharacterFromCampaign(campaignId, characterId);
    if (!success) {
      return res.status(404).json({ error: 'Character not found in campaign' });
    }
    return res.status(200).json({ message: 'Character removed from campaign' });
  } catch (error) {
    console.error('Error removing character from campaign:', error);
    return res.status(500).json({ error: 'Failed to remove character from campaign' });
  }
} 