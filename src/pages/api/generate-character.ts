import { generateImageRequest } from '@/lib/imageGenerator';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { characteristics, race } = req.body;

    if (!characteristics || !race || !race.image || !race.description || !race.name) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Construct a detailed prompt for DALL-E
    const prompt = `Create a video game character portrait that combines these facial characteristics: ${JSON.stringify(characteristics)}. 
    The character should maintain the fantasy race's ${race.name} features, described as ${race.description} while incorporating the human facial characteristics. 
    Style: High-quality digital art, detailed fantasy character portrait, soft lighting, professional game art style.`;

    const imageUrl = await generateImageRequest(prompt, race.image);

    if (!imageUrl) {
      throw new Error('No image URL in response');
    }

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating character:', error);
    return res.status(500).json({ 
      error: 'Failed to generate character',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 