import client from './client';
import { v4 as uuidv4 } from 'uuid';
import { Relic } from '@/data/artifacts';

interface DbRelic {
  id: string;
  objectId: string;
  name: string;
  class: string;
  effect: string;
  element: string;
  rarity: string;
  story: string;
  imageUrl: string;
  properties: string;
  created_at: string;
  updated_at: string;
}

export async function getRelic(id: string): Promise<Relic | null> {
  try {
    const relic = await client('relics').where({ id }).first();
    return relic ? mapDbRelicToRelic(relic) : null;
  } catch (error) {
    console.error('Error fetching relic:', error);
    return null;
  }
}

export async function getRelicByObjectId(objectId: string): Promise<Relic | null> {
  try {
    const relic = await client('relics').where({ objectId }).first();
    return relic ? mapDbRelicToRelic(relic) : null;
  } catch (error) {
    console.error('Error fetching relic by objectId:', error);
    return null;
  }
}

export async function listRelics(limit = 20, offset = 0): Promise<Relic[]> {
  try {
    const relics = await client('relics')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    
    return relics.map(mapDbRelicToRelic);
  } catch (error) {
    console.error('Error listing relics:', error);
    return [];
  }
}

export async function createRelic(relicData: Omit<Relic, 'id' | 'objectId'>): Promise<Relic | null> {
  const id = uuidv4();
  
  const newRelic = {
    id,
    name: relicData.name,
    class: relicData.class,
    effect: relicData.effect,
    element: relicData.element,
    rarity: relicData.rarity,
    story: relicData.story || null,
    imageUrl: relicData.imageUrl || null,
    properties: typeof relicData.properties === 'object' ? JSON.stringify(relicData.properties) : relicData.properties,
  };
  
  try {
    await client('relics').insert(newRelic);
    return await getRelic(id);
  } catch (error) {
    console.error('Error creating relic:', error);
    throw new Error('Failed to create relic');
  }
}

export async function updateRelic(id: string, relicData: Partial<Relic>): Promise<Relic | null> {
  try {
    const updateData = {
      ...relicData,
      properties: typeof relicData.properties === 'object' ? JSON.stringify(relicData.properties) : relicData.properties,
    };
    
    await client('relics').where({ id }).update(updateData);
    return getRelic(id);
  } catch (error) {
    console.error('Error updating relic:', error);
    throw new Error('Failed to update relic');
  }
}

export async function deleteRelic(id: string): Promise<boolean> {
  try {
    const deleted = await client('relics').where({ id }).delete();
    return deleted > 0;
  } catch (error) {
    console.error('Error deleting relic:', error);
    return false;
  }
}

export async function getRelicsByRarity(rarity: string): Promise<Relic[]> {
  try {
    const relics = await client('relics')
      .where({ rarity })
      .orderBy('created_at', 'desc');
    
    return relics.map(mapDbRelicToRelic);
  } catch (error) {
    console.error('Error fetching relics by rarity:', error);
    return [];
  }
}

export async function getRelicsByClass(relicClass: string): Promise<Relic[]> {
  try {
    const relics = await client('relics')
      .where({ class: relicClass })
      .orderBy('created_at', 'desc');
    
    return relics.map(mapDbRelicToRelic);
  } catch (error) {
    console.error('Error fetching relics by class:', error);
    return [];
  }
}

function mapDbRelicToRelic(dbRelic: DbRelic): Relic {
  return {
    id: dbRelic.id,
    objectId: dbRelic.objectId || null,
    name: dbRelic.name,
    class: dbRelic.class as any,
    effect: dbRelic.effect as any,
    element: dbRelic.element as any,
    rarity: dbRelic.rarity as any,
    story: dbRelic.story || null,
    imageUrl: dbRelic.imageUrl || null,
    properties: typeof dbRelic.properties === 'string' ? JSON.parse(dbRelic.properties) : dbRelic.properties,
  };
}
