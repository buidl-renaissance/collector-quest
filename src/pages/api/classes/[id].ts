import { NextApiRequest, NextApiResponse } from 'next';
import { CharacterClass } from '@/data/classes';
import client from '@/db/client';

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
        const characterClass = await client('classes')
          .select('*')
          .where({ id })
          .first();

        if (!characterClass) {
          return res.status(404).json({ error: 'Character class not found' });
        }

        return res.status(200).json({
          ...characterClass,
          abilities: JSON.parse(characterClass.abilities as unknown as string)
        });
      } catch (error) {
        console.error('Error fetching character class:', error);
        return res.status(500).json({ error: 'Failed to fetch character class' });
      }

    case 'PUT':
      try {
        const updatedClass: CharacterClass = req.body;
        console.log('Received PUT request:', { id, body: updatedClass });
        
        // Validate required fields
        if (!updatedClass.id || !updatedClass.name || !updatedClass.description) {
          console.error('Missing required fields:', updatedClass);
          return res.status(400).json({ 
            error: 'Missing required fields',
            received: updatedClass
          });
        }

        // Update the class in the database
        const [result] = await client('classes')
          .where({ id })
          .update({
            name: updatedClass.name,
            description: updatedClass.description,
            abilities: JSON.stringify(updatedClass.abilities || []),
            image: updatedClass.image
          })
          .returning('*');

        if (!result) {
          console.error('No class found to update:', id);
          return res.status(404).json({ error: 'Character class not found' });
        }

        console.log('Successfully updated class:', result);
        return res.status(200).json({
          ...result,
          abilities: JSON.parse(result.abilities as unknown as string)
        });
      } catch (error) {
        console.error('Error updating character class:', error);
        return res.status(500).json({ 
          error: 'Failed to update character class',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    case 'DELETE':
      try {
        const deleted = await client('classes')
          .where({ id })
          .delete();

        if (deleted === 0) {
          return res.status(404).json({ error: 'Character class not found' });
        }

        return res.status(200).json({ message: 'Character class deleted successfully' });
      } catch (error) {
        console.error('Error deleting character class:', error);
        return res.status(500).json({ error: 'Failed to delete character class' });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 