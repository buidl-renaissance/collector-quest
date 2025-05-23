import { NextApiRequest, NextApiResponse } from 'next';
import { analyzeArtifactImage, AnalyzedArtifact } from '@/lib/analyzeArtifactImage';
import { createArtifact } from '@/db/artifacts';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl, medium, yearCreated, artistName, owner } = req.body;

    const errors = [];
    
    if (!imageUrl) errors.push('Image URL is required');
    if (!medium) errors.push('Medium is required');
    if (!yearCreated) errors.push('Year created is required');
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        errors: errors
      });
    }

    const analysisResult: AnalyzedArtifact = await analyzeArtifactImage(imageUrl, medium, yearCreated);

    // Store the analyzed artifact in the database
    // The user will claim ownership in a later step
    const createdArtifact = await createArtifact({
      title: analysisResult.title,
      artist: artistName ?? "Unknown",
      owner: owner ?? null,
      medium: medium,
      year: yearCreated,
      description: analysisResult.description,
      imageUrl: imageUrl,
    });
    
    return res.status(200).json(createdArtifact);
  } catch (error) {
    console.error('Error analyzing artifact image:', error);
    return res.status(500).json({ error: 'Failed to analyze artifact image' });
  }
}
