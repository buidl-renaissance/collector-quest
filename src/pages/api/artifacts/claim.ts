import { NextApiRequest, NextApiResponse } from 'next';
import { updateArtifact, getArtifact } from '@/db/artifacts';
import { CharacterDB } from '@/db/character';

const characterDB = new CharacterDB();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { artifactId, artistName, email, phone, termsAgreed } = req.body;

    // Validate required fields
    const errors = [];
    if (!artifactId) errors.push('Artifact ID is required');
    if (!artistName) errors.push('Artist name is required');
    if (!termsAgreed) errors.push('Terms agreement is required');
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Check if artifact exists
    const existingArtifact = await getArtifact(artifactId);
    if (!existingArtifact) {
      return res.status(404).json({ error: 'Artifact not found' });
    }

    // Create the character
    const character = await characterDB.registerCharacter(artistName, email, phone);

    if (!character) {
      return res.status(400).json({ error: 'Failed to create character' });
    }

    // Update the artifact with the artist's information
    const updatedArtifact = await updateArtifact(artifactId, {
      artist: artistName,
      owner: character.id,
    });

    return res.status(200).json(updatedArtifact);
  } catch (error) {
    console.error('Error claiming artifact:', error);
    return res.status(500).json({ error: 'Failed to claim artifact' });
  }
}
