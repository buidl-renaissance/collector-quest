import { NextApiRequest, NextApiResponse } from 'next';
import db, { getStoryBySlug } from '@/db/client';
import useIsAdmin from '@/hooks/useIsAdmin';

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
  } else if (req.method === 'PUT') {
    try {
      // Validate story ID
      if (!story || typeof story !== 'string') {
        return res.status(400).json({ error: 'Invalid story ID' });
      }

      const { title, description, videoUrl, script, artwork } = JSON.parse(req.body);

      // Validate required fields
      if (!title && !description && !videoUrl && !script && !artwork) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      // Build update object with only provided fields
      const updateData: any = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (videoUrl) updateData.videoUrl = videoUrl;
      if (script) updateData.script = script;
      if (artwork) updateData.artwork = artwork;

      // Update the story
      const updated = await db('stories')
        .where({ slug: story })
        .update(updateData);

      if (!updated) {
        return res.status(404).json({ error: 'Story not found or no changes made' });
      }

      // Fetch the updated story
      const result = await getStoryBySlug(story);
      
      return res.status(200).json(result.data);
    } catch (error) {
      console.error('Error updating story:', error);
      return res.status(500).json({ error: 'Failed to update story' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
