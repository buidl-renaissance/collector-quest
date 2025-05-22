import { NextApiRequest, NextApiResponse } from 'next';
import { getArtifactsByOwner } from '@/db/artifacts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid character ID' });
  }

  try {
    const artifacts = await getArtifactsByOwner(id);
    return res.status(200).json(artifacts);
  } catch (error) {
    console.error('Error fetching character artifacts:', error);
    return res.status(500).json({ error: 'Failed to fetch character artifacts' });
  }
} 