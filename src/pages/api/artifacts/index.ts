import { NextApiRequest, NextApiResponse } from 'next';
import { createArtifact, listArtifacts } from '@/db/artifacts';

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
  if (req.method === 'POST') {
    try {
      const { artistName, artworkTitle, medium, yearCreated, imageUrl, description } = req.body;

      // Validate required fields
      if (!artistName || !artworkTitle || !medium || !yearCreated || !imageUrl || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create artifact in database
      const artifact = await createArtifact({
        title: artworkTitle,
        artist: artistName,
        year: yearCreated,
        medium,
        description,
        imageUrl,
      });

      return res.status(201).json(artifact);
    } catch (error) {
      console.error('Error creating artifact:', error);
      return res.status(500).json({ error: 'Failed to create artifact' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { limit, offset } = req.query;
      const artifacts = await listArtifacts(
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );
      return res.status(200).json(artifacts);
    } catch (error) {
      console.error('Error fetching artifacts:', error);
      return res.status(500).json({ error: 'Failed to fetch artifacts' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 