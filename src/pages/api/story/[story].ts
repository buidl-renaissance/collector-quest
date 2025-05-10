import { NextApiRequest, NextApiResponse } from 'next';
import { getStoryBySlug } from '@/db/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { story } = req.query;
  
  if (req.method === 'GET') {
    try {
      // Validate story ID
      if (!story || typeof story !== 'string') {
        return res.status(400).json({ error: 'Invalid story ID' });
      }

      // Get the story from the database
      const result = await getStoryBySlug(story);
      
      if (!result.success) {
        return res.status(500).json({ error: 'Failed to fetch story' });
      }
      
      if (!result.data) {
        return res.status(404).json({ error: 'Story not found' });
      }

      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error fetching story:', error);
      return res.status(500).json({ error: 'Failed to fetch story' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
