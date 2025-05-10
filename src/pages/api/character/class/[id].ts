import { NextApiRequest, NextApiResponse } from 'next';
import { CharacterClass } from '@/data/classes';
import { getClassById } from '@/db/classes';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid class ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const characterClass = await getClassById(id);
        if (!characterClass) {
          return res.status(404).json({ error: 'Character class not found' });
        }
        return res.status(200).json(characterClass);
      } catch (error) {
        console.error('Error fetching character class:', error);
        return res.status(500).json({ error: 'Failed to fetch character class' });
      }

    case 'PUT':
      try {
        const updatedClass: CharacterClass = req.body;
        console.log('Received update request:', { id, body: updatedClass });
        
        // Validate required fields
        if (!updatedClass.id || !updatedClass.name || !updatedClass.description) {
          console.error('Missing required fields:', updatedClass);
          return res.status(400).json({ 
            error: 'Missing required fields',
            received: updatedClass
          });
        }

        // Get the base URL from environment or use localhost for development
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        console.log('Making request to:', `${baseUrl}/api/classes/${id}`);
        
        // Update the class in the database
        const result = await fetch(`${baseUrl}/api/classes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedClass),
        });

        if (!result.ok) {
          const errorData = await result.json().catch(() => null);
          console.error('Failed to update character class:', {
            status: result.status,
            statusText: result.statusText,
            error: errorData
          });
          throw new Error(`Failed to update character class: ${result.statusText}`);
        }

        const data = await result.json();
        console.log('Successfully updated character class:', data);
        return res.status(200).json(data);
      } catch (error) {
        console.error('Error updating character class:', error);
        return res.status(500).json({ 
          error: 'Failed to update character class',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 