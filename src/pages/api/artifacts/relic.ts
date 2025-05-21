import { NextApiRequest, NextApiResponse } from 'next';
import { getArtifact, updateArtifact } from '@/db/artifacts';
import { generateRelic } from '@/lib/generateRelic';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { artifactId } = req.body;

    if (!artifactId) {
      return res.status(400).json({ error: 'Artifact ID is required' });
    }

    // Get the artifact
    const artifact = await getArtifact(artifactId);
    
    if (!artifact) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    // Generate the relic
    const result = await generateRelic(artifact, '');

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Update the artifact with the new relic image URL
    const updatedArtifact = await updateArtifact(artifactId, {
      relicImageUrl: result.data?.relicImageUrl
    });

    return res.status(200).json(updatedArtifact);
  } catch (error) {
    console.error('Error generating relic:', error);
    return res.status(500).json({ error: 'Failed to generate relic' });
  }
}
