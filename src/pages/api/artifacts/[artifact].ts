import { NextApiRequest, NextApiResponse } from 'next';
import { getArtifact } from '@/db/artifacts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { artifact } = req.query;

    if (!artifact || typeof artifact !== 'string') {
      return res.status(400).json({ error: 'Artifact ID is required' });
    }

    const artifactData = await getArtifact(artifact);

    if (!artifactData) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    return res.status(200).json(artifactData);
  } catch (error) {
    console.error('Error fetching artifact:', error);
    return res.status(500).json({ error: 'Failed to fetch artifact' });
  }
}
