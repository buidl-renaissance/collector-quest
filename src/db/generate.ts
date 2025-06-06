import client from './client';
import { GenerationResult } from '@/data/generate';

export async function createResult<T>(result: Omit<GenerationResult<T>, 'created_at' | 'updated_at'>): Promise<GenerationResult<T> | null> {
  await client('generation_results')
    .insert({
      id: result.id,
      event_name: result.event_name,
      event_id: result.event_id,
      status: result.status,
      step: result.step,
      message: result.message,
      result: result.result ? JSON.stringify(result.result) : null,
      error: result.error,
      object_type: result.object_type,
      object_id: result.object_id,
      object_key: result.object_key
    })
  return getResult(result.id);
}

export async function updateResult<T>(id: string, status: 'pending' | 'complete' | 'error', step: string, message: string, result: T): Promise<GenerationResult<T>> {
  const [updated] = await client('generation_results')
    .where({ id })
    .update({
      status,
      step,
      message,
      result: result ? JSON.stringify(result) : undefined
    })
    .returning('*');

  return {
    ...updated,
    result: updated.result ? JSON.parse(updated.result) : null
  };
}

export async function getResult<T>(id: string): Promise<GenerationResult<T> | null> {
  const result = await client('generation_results')
    .where({ id })
    .first();

  if (!result) {
    return null;
  }

  return {
    ...result,
    result: result.result ? JSON.parse(result.result) : null
  };
}

export async function getResultsByObject<T>(objectType: string, objectId: string): Promise<GenerationResult<T>[]> {
  const results = await client('generation_results')
    .where({
      object_type: objectType,
      object_id: objectId
    })
    .orderBy('created_at', 'desc');

  return results.map((result: any) => ({
    ...result,
    result: result.result ? JSON.parse(result.result) : null
  }));
}

export async function findResult<T>(query: Partial<GenerationResult<T>>): Promise<GenerationResult<T> | null> {
  const result = await client('generation_results')
    .where(query)
    .first();

  return result ? {
    ...result,
    result: result.result ? JSON.parse(result.result) : null
  } : null;
}

export async function completeResult<T>(id: string, message: string, result: T): Promise<GenerationResult<T> | null> {
  const updated = await updateResult(id, 'complete', 'completed', message, result);
  return updated;
}

export async function failResult<T>(id: string, message: string): Promise<GenerationResult<T> | null> {
  const updated = await updateResult(id, 'error', 'failed', message, null as unknown as T);
  return updated;
}