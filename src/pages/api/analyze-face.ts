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
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const characteristics = await faceAnalyzer.analyzeFace(image);
    return res.status(200).json({ characteristics });
  } catch (error) {
    console.error('Error analyzing face:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze face',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 