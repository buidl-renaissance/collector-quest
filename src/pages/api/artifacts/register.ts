import { NextApiRequest, NextApiResponse } from 'next';
import { updateArtifact, getArtifact } from '@/db/artifacts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { artifactId, registrationId } = req.body;

    // Validate required fields
    if (!artifactId) {
      return res.status(400).json({ error: 'Artifact ID is required' });
    }

    if (!registrationId) {
      return res.status(400).json({ error: 'Registration ID is required' });
    }

    // Check if artifact exists
    const existingArtifact = await getArtifact(artifactId);
    if (!existingArtifact) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    // Update the artifact with the registration ID
    const updatedArtifact = await updateArtifact(artifactId, {
      registration_id: registrationId,
    });

    if (!updatedArtifact) {
      return res.status(500).json({ error: 'Failed to register artifact' });
    }

    return res.status(200).json(updatedArtifact);
  } catch (error) {
    console.error('Error registering artifact:', error);
    return res.status(500).json({ error: 'Failed to register artifact' });
  }
}
