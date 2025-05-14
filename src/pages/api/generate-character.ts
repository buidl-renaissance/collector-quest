import { NextApiRequest, NextApiResponse } from 'next';
import { FaceAnalyzer } from '@/lib/faceAnalyzer';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const faceAnalyzer = new FaceAnalyzer(process.env.OPENAI_API_KEY || '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { characteristics, race } = req.body;

    if (!characteristics || !race) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const imageUrl = await faceAnalyzer.generateCharacter({ characteristics, race });
    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating character:', error);
    return res.status(500).json({ 
      error: 'Failed to generate character',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 