/**
 * Simple in-memory storage for Inngest results
 * In a production environment, this would be replaced with a database
 */

import db from '@/db/client';

// Type for stored results
export interface StoredResult {
  id: string;
  status: 'pending' | 'completed' | 'error';
  result?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create a new pending result
 * @param id Unique identifier for the result
 * @returns The created result
 */
export const createPendingResult = async (id: string): Promise<StoredResult> => {
  const result: StoredResult = {
    id,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await db('results').insert(result);
  return result;
};

/**
 * Update a result with the completed data
 * @param id Unique identifier for the result
 * @param result The result data
 * @returns The updated result
 */
export const updateResult = async (id: string, result: string): Promise<StoredResult | null> => {
  const [updatedResult] = await db('results')
    .where({ id })
    .update({
      status: 'pending',
      result,
      updatedAt: new Date(),
    })
    .returning('*');
  
  return updatedResult || null;
};

/**
 * Update a result with the completed data
 * @param id Unique identifier for the result
 * @param result The result data
 * @returns The updated result
 */
export const completeResult = async (id: string, result: string): Promise<StoredResult | null> => {
  const [updatedResult] = await db('results')
    .where({ id })
    .update({
      status: 'completed',
      result,
      updatedAt: new Date(),
    })
    .returning('*');
  
  return updatedResult || null;
};

/**
 * Update a result with an error
 * @param id Unique identifier for the result
 * @param error The error message
 * @returns The updated result
 */
export const failResult = async (id: string, error: string): Promise<StoredResult | null> => {
  const [updatedResult] = await db('results')
    .where({ id })
    .update({
      status: 'error',
      error,
      updatedAt: new Date(),
    })
    .returning('*');
  
  return updatedResult || null;
};

/**
 * Get a result by its ID
 * @param id Unique identifier for the result
 * @returns The result or null if not found
 */
export const getResult = async (id: string): Promise<StoredResult | null> => {
  const result = await db('results')
    .where({ id })
    .first();
  
  return result || null;
};

/**
 * Clean up old results (older than 1 hour)
 */
export const cleanupOldResults = async (): Promise<void> => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  await db('results')
    .where('createdAt', '<', oneHourAgo)
    .delete();
};

// Clean up old results every hour
if (typeof window === 'undefined') {
  setInterval(async () => {
    try {
      await cleanupOldResults();
    } catch (error) {
      console.error('Error cleaning up old results:', error);
    }
  }, 60 * 60 * 1000);
}
