import { NextApiRequest, NextApiResponse } from 'next';
import { coreRaces, expandedRaces } from '@/data/races';
import db from '@/db/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      return getRaces(req, res);
    case 'POST':
      return createRace(req, res);
    case 'PUT':
      return updateRace(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get all races or a specific race by ID
async function getRaces(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (id) {
      // Get a specific race by ID
      const race = await db('races').where({ id }).first();
      
      if (!race) {
        // If not in database, check predefined races
        const predefinedRace = [...coreRaces, ...expandedRaces].find(r => r.id === id);
        
        if (!predefinedRace) {
          return res.status(404).json({ error: 'Race not found' });
        }
        
        return res.status(200).json(predefinedRace);
      }
      
      return res.status(200).json(race);
    } else {
      // Get all races
      const dbRaces = await db('races').select('*');
      const allRaces = [...coreRaces, ...expandedRaces, ...dbRaces];
      
      return res.status(200).json(allRaces);
    }
  } catch (error) {
    console.error('Error fetching races:', error);
    return res.status(500).json({ error: 'Failed to fetch races' });
  }
}

// Create a new race
async function createRace(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id, name, source, description, image } = req.body;
    
    if (!id || !name || !source || !description || !image) {
      return res.status(400).json({ error: 'Missing required fields: id, name, source, description, and image are required' });
    }
    
    // Check if race already exists
    const existingRace = await db('races').where({ id }).first();
    if (existingRace) {
      return res.status(409).json({ error: 'Race with this ID already exists' });
    }
    
    // Insert new race
    const [newRace] = await db('races').insert({
      id,
      name,
      source,
      image: image || '',
      description: description || '',
    }).returning('*');
    
    return res.status(201).json(newRace);
  } catch (error) {
    console.error('Error creating race:', error);
    return res.status(500).json({ error: 'Failed to create race' });
  }
}

// Update an existing race
async function updateRace(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const { name, source, description } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Race ID is required' });
    }
    
    // Check if race exists
    const existingRace = await db('races').where({ id }).first();
    if (!existingRace) {
      return res.status(404).json({ error: 'Race not found' });
    }
    
    // Update race
    const [updatedRace] = await db('races')
      .where({ id })
      .update({
        name: name || existingRace.name,
        source: source || existingRace.source,
        description: description !== undefined ? description : existingRace.description,
      })
      .returning('*');
    
    return res.status(200).json(updatedRace);
  } catch (error) {
    console.error('Error updating race:', error);
    return res.status(500).json({ error: 'Failed to update race' });
  }
}
