/**
 * Simple in-memory storage for Inngest results
 * In a production environment, this would be replaced with a database
 */

// Type for stored results
export interface StoredResult {
  id: string;
  status: 'pending' | 'completed' | 'error';
  result?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
const storage = new Map<string, StoredResult>();

/**
 * Create a new pending result
 * @param id Unique identifier for the result
 * @returns The created result
 */
export const createPendingResult = (id: string): StoredResult => {
  const result: StoredResult = {
    id,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  storage.set(id, result);
  return result;
};

/**
 * Update a result with the completed data
 * @param id Unique identifier for the result
 * @param result The result data
 * @returns The updated result
 */
export const completeResult = (id: string, result: string): StoredResult | null => {
  const storedResult = storage.get(id);
  if (!storedResult) return null;

  const updatedResult: StoredResult = {
    ...storedResult,
    status: 'completed',
    result,
    updatedAt: new Date(),
  };
  storage.set(id, updatedResult);
  return updatedResult;
};

/**
 * Update a result with an error
 * @param id Unique identifier for the result
 * @param error The error message
 * @returns The updated result
 */
export const failResult = (id: string, error: string): StoredResult | null => {
  const storedResult = storage.get(id);
  if (!storedResult) return null;

  const updatedResult: StoredResult = {
    ...storedResult,
    status: 'error',
    error,
    updatedAt: new Date(),
  };
  storage.set(id, updatedResult);
  return updatedResult;
};

/**
 * Get a result by its ID
 * @param id Unique identifier for the result
 * @returns The result or null if not found
 */
export const getResult = (id: string): StoredResult | null => {
  return storage.get(id) || null;
};

/**
 * Clean up old results (older than 1 hour)
 */
export const cleanupOldResults = (): void => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [id, result] of storage.entries()) {
    if (result.createdAt < oneHourAgo) {
      storage.delete(id);
    }
  }
};

// Clean up old results every hour
if (typeof window === 'undefined') {
  setInterval(cleanupOldResults, 60 * 60 * 1000);
}
