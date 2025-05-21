import client from './client';
import { v4 as uuidv4 } from 'uuid';
import { Artifact } from '@/data/artifacts';

interface DbArtifact {
  id: string;
  title: string;
  artist: string;
  owner: string;
  year: string;
  medium: string;
  description: string;
  properties: string;
  imageUrl: string;
  relicImageUrl: string;
  story: string;
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
    
    return artifacts.map(mapDbArtifactToArtifact);
  } catch (error) {
    console.error('Error listing artifacts:', error);
    return [];
  }
}

export async function createArtifact(artifactData: Omit<Artifact, 'id' | 'created_at' | 'updated_at'>): Promise<Artifact | null> {
  const id = uuidv4();
  const now = new Date();
  
  const newArtifact = {
    id,
    ...artifactData,
    properties: JSON.stringify(artifactData.properties),
    created_at: now,
    updated_at: now
  };
  
  try {
    await client('artifacts').insert(newArtifact);
    return await getArtifact(id);
  } catch (error) {
    console.error('Error creating artifact:', error);
    throw new Error('Failed to create artifact');
  }
}

export async function updateArtifact(id: string, artifactData: Partial<Artifact>): Promise<Artifact | null> {
  try {
    const updateData = {
      ...artifactData,
      updated_at: new Date()
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

function mapDbArtifactToArtifact(dbArtifact: DbArtifact): Artifact {
  return {
    id: dbArtifact.id,
    title: dbArtifact.title,
    artist: dbArtifact.artist,
    owner: dbArtifact.owner,
    year: dbArtifact.year,
    medium: dbArtifact.medium,
    description: dbArtifact.description,
    properties: JSON.parse(dbArtifact.properties),
    imageUrl: dbArtifact.imageUrl,
    relicImageUrl: dbArtifact.relicImageUrl,
    story: dbArtifact.story,
    created_at: dbArtifact.created_at,
    updated_at: dbArtifact.updated_at
  };
}
