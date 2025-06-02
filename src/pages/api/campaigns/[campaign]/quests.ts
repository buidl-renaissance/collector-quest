import { NextApiRequest, NextApiResponse } from 'next';
import client from '../../../../db/client';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { campaign: campaignId } = req.query;
  
  if (!campaignId || typeof campaignId !== 'string') {
    return res.status(400).json({ error: 'Campaign ID is required' });
  }

  switch (req.method) {
    case 'POST':
      return handleAddQuest(req, res, campaignId);
    case 'DELETE':
      return handleRemoveQuest(req, res, campaignId);
    default:
      res.setHeader('Allow', ['POST', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleAddQuest(
  req: NextApiRequest,
  res: NextApiResponse,
  campaignId: string
) {
  const { questId } = req.body;

  if (!questId) {
    return res.status(400).json({ error: 'Quest ID is required' });
  }

  try {
    const id = uuidv4();
    await client('campaign_quests').insert({
      id,
      campaign_id: campaignId,
      quest_id: questId,
      status: 'not_started'
    });

    const quest = await client('campaign_quests')
      .where('id', id)
      .first();

    return res.status(200).json(quest);
  } catch (error) {
    console.error('Error adding quest to campaign:', error);
    return res.status(500).json({ error: 'Failed to add quest to campaign' });
  }
}

async function handleRemoveQuest(
  req: NextApiRequest,
  res: NextApiResponse,
  campaignId: string
) {
  const { questId } = req.body;

  if (!questId) {
    return res.status(400).json({ error: 'Quest ID is required' });
  }

  try {
    const count = await client('campaign_quests')
      .where({
        campaign_id: campaignId,
        quest_id: questId
      })
      .delete();

    if (count === 0) {
      return res.status(404).json({ error: 'Quest not found in campaign' });
    }

    return res.status(200).json({ message: 'Quest removed from campaign' });
  } catch (error) {
    console.error('Error removing quest from campaign:', error);
    return res.status(500).json({ error: 'Failed to remove quest from campaign' });
  }
} 