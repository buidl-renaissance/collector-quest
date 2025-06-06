import { v4 as uuidv4 } from 'uuid';
import { inngest } from './client';
import { createResult, findResult } from '@/db/generate';
import { GenerationResult } from '@/data/generate';

export async function createGenerationEvent<T>({
  eventName,
  objectType,
  objectId,
  objectKey,
  data
}: {
  eventName: string;
  objectType: string;
  objectId: string;
  objectKey: string;
  data: Record<string, any>;
}): Promise<GenerationResult<T>> {
  // Create a unique ID for this generation request
  const resultId = uuidv4();

  // Create initial pending result
  const result = await createResult<T>({
    id: resultId,
    event_name: eventName,
    status: 'pending',
    object_type: objectType,
    object_id: objectId,
    object_key: objectKey
  });

  if (!result) {
    throw new Error('Failed to create generation result');
  }

  // Send event to Inngest
  const inngestResult = await inngest.send({
    name: eventName,
    data: {
      resultId,
      ...data
    }
  });

  console.log("inngestResult", inngestResult); 

  return result;
}

export async function dispatchGenerationEvent<T>({
  eventName,
  objectType,
  objectId,
  objectKey,
  data
}: {
  eventName: string;
  objectType: string;
  objectId: string | null;
  objectKey: string | null;
  data: Record<string, any>;
}): Promise<GenerationResult<T> | null> {
  // Check for existing pending result
  const existingResult = await findResult<T>({
    event_name: eventName,
    status: 'pending',
    object_type: objectType,
    object_id: objectId ?? "",
    object_key: objectKey ?? ""
  });

  if (existingResult) {
    return existingResult;
  }

  // If no pending result exists, create a new generation event
  return createGenerationEvent<T>({
    eventName,
    objectType,
    objectId: objectId ?? "",
    objectKey: objectKey ?? "",
    data
  });
}