import client from './client';
import { v4 as uuidv4 } from 'uuid';
import { Artifact } from '@/data/artifacts';
import { getRelic } from './relics';

interface DbArtifact {
  id: string;
  registration_id: string;
  title: string;
  artist: string;
  owner: string;
  year: string;
  medium: string;
  description: string;
  relic_id?: string;
  imageUrl: string;
  created_at: string;
  updated_at: string;
}

export async function getArtifact(id: string): Promise<Artifact | null> {
  try {
    const artifact = await client('artifacts').where({ id }).first();
    return artifact ? mapDbArtifactToArtifact(artifact) : null;
  } catch (error) {
    console.error('Error fetching artifact:', error);
    return null;
  }
}

export async function listArtifacts(limit = 20, offset = 0): Promise<Artifact[]> {
  try {
    const artifacts = await client('artifacts')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    
    return await Promise.all(artifacts.map(async (artifact) => await mapDbArtifactToArtifact(artifact)));
  } catch (error) {
    console.error('Error listing artifacts:', error);
    return [];
  }
}

export async function createArtifact(artifactData: Omit<Artifact, 'id' | 'relic' | 'created_at' | 'updated_at'>): Promise<Artifact | null> {
  const id = uuidv4();
  
  const newArtifact = {
    id,
    ...artifactData,
  };
  
  try {
    await client('artifacts').insert(newArtifact);
    return await getArtifact(id);
  } catch (error) {
    console.error('Error creating artifact:', error);
    throw new Error('Failed to create artifact');
  }
}

export async function updateArtifact(id: string, artifactData: Partial<DbArtifact>): Promise<Artifact | null> {
  try {
    const updateData = {
      ...artifactData,
    };
  
    await client('artifacts').where({ id }).update(updateData);
    return getArtifact(id);
  } catch (error) {
    console.error('Error updating artifact:', error);
    return null;
  }
}

export async function deleteArtifact(id: string): Promise<boolean> {
  try {
    const deleted = await client('artifacts').where({ id }).delete();
    return deleted > 0;
  } catch (error) {
    console.error('Error deleting artifact:', error);
    return false;
  }
}

export async function getArtifactsByOwner(ownerId: string): Promise<Artifact[]> {
  try {
    const artifacts = await client('artifacts')
      .where({ owner: ownerId })
      .orderBy('created_at', 'desc');
    
    return await Promise.all(artifacts.map(async (artifact) => await mapDbArtifactToArtifact(artifact)));
  } catch (error) {
    console.error('Error fetching artifacts by owner:', error);
    return [];
  }
}

async function mapDbArtifactToArtifact(dbArtifact: DbArtifact): Promise<Artifact> {
  const artifact: Artifact = {
    id: dbArtifact.id,
    registration_id: dbArtifact.registration_id ?? null,
    title: dbArtifact.title,
    artist: dbArtifact.artist,
    owner: dbArtifact.owner,
    year: dbArtifact.year,
    medium: dbArtifact.medium,
    relic: null,
    description: dbArtifact.description,
    imageUrl: dbArtifact.imageUrl,
    created_at: dbArtifact.created_at,
    updated_at: dbArtifact.updated_at
  };

  if (dbArtifact.relic_id) {
    const relic = await getRelic(dbArtifact.relic_id);
    if (relic) {
      artifact.relic = relic;
    }
  }

  return artifact;
}
