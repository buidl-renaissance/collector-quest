import { NextApiRequest, NextApiResponse } from 'next';
import knex from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { title, description, videoUrl, script, realmId } = JSON.parse(req.body);

      // Validate required fields
      if (!title || !description || !videoUrl || !script || !realmId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create the story in the database
      const [createdStory] = await knex('stories')
        .insert({
          title,
          description,
          videoUrl,
          script,
          realmId
        })
        .returning('*');

      return res.status(201).json(createdStory);
    } catch (error) {
      console.error('Error creating story:', error);
      return res.status(500).json({ error: 'Failed to create story' });
    }
  } else if (req.method === 'GET') {
    try {
      const stories = await knex('stories').select('*');
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
