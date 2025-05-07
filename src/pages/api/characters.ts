import { NextApiRequest, NextApiResponse } from 'next';

interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  artworks?: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Mock data for characters
      const characters: Character[] = [
        {
          id: 'lord-smearington',
          name: 'Lord Smearington',
          title: 'The Eccentric Collector',
          description: 'A flamboyant aristocrat with an eye for the absurd and a passion for peculiar art.',
          imageUrl: '/images/lord-smearington.jpg',
          artworks: ['artwork1', 'artwork2', 'artwork3']
        },
        {
          id: 'lady-brushington',
          name: 'Lady Brushington',
          title: 'The Visionary Artist',
          description: 'A talented painter known for her surreal landscapes and vibrant color palette.',
          imageUrl: '/images/lady-brushington.jpg',
          artworks: ['artwork4', 'artwork5']
        },
        {
          id: 'sir-pixelot',
          name: 'Sir Pixelot',
          title: 'The Digital Maestro',
          description: 'A pioneer in digital art who blends traditional techniques with cutting-edge technology.',
          imageUrl: '/images/sir-pixelot.jpg',
          artworks: ['artwork6', 'artwork7', 'artwork8']
        }
      ];

      return res.status(200).json(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      return res.status(500).json({ error: 'Failed to fetch characters' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
