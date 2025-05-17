import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/db/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { title, description, videoUrl, script, realmId, defaultSlug } = JSON.parse(req.body);

      // Validate required fields
      if (!title || !description || !videoUrl || !script || !realmId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const slug = defaultSlug ? defaultSlug : title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

      // Insert the story
      await db('stories').insert({
        title,
        slug,
        description,
        videoUrl,
        script,
        realmId,
        artwork: ''
      });

      // Fetch the created story
      const [createdStory] = await db('stories')
        .where({ slug })
        .select('*');

      if (!createdStory) {
        throw new Error('Failed to create story');
      }

      return res.status(201).json(createdStory);
    } catch (error) {
      console.error('Error creating story:', error);
      return res.status(500).json({ error: 'Failed to create story' });
    }
  } else if (req.method === 'GET') {
    try {
      const stories = await db('stories').select('*');
      return res.status(200).json(stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      return res.status(500).json({ error: 'Failed to fetch stories' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
