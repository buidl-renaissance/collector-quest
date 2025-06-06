import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Character } from '@/data/character';
import { Campaign } from '@/data/campaigns';
import { Item } from '@/data/items';

type CacheableTypes = Character | Campaign | Item;
type ObjectType = 'character' | 'campaign' | 'item';

// Add a pending promises map to track in-flight requests
const pendingPromises: Map<string, Promise<any>> = new Map();

interface CacheItem<T> {
  data: T;
  timestamp: number;
  loading: boolean;
  error: Error | null;
  type: ObjectType;
}

interface CacheContextType {
  get: <T extends CacheableTypes>(type: ObjectType, id: string) => CacheItem<T> | undefined;
  set: <T extends CacheableTypes>(type: ObjectType, id: string, data: T, ttl?: number) => void;
  remove: (type: ObjectType, id: string) => void;
  fetch: <T extends CacheableTypes>(type: ObjectType, id: string, fetchFn: () => Promise<T>, ttl?: number) => Promise<T>;
  isLoading: (type: ObjectType, id: string) => boolean;
  getError: (type: ObjectType, id: string) => Error | null;
  clearCache: (type?: ObjectType) => void;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const STORAGE_PREFIX = 'cache_';

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export function CacheProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState<Record<string, CacheItem<any>>>({});

  // Load cache from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      const newCache: Record<string, CacheItem<any>> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || '');
            // Load all items regardless of expiration
            newCache[key.slice(STORAGE_PREFIX.length)] = item;
          } catch (e) {
            localStorage.removeItem(key);
          }
        }
      }
      setCache(newCache);
    };

    loadFromStorage();
  }, []);

  const getCacheKey = (type: ObjectType, id: string) => `${type}:${id}`;

  const get = useCallback(<T extends CacheableTypes>(type: ObjectType, id: string): CacheItem<T> | undefined => {
    const key = getCacheKey(type, id);
    return cache[key];
  }, [cache]);

  const set = useCallback(<T extends CacheableTypes>(
    type: ObjectType,
    id: string,
    data: T,
    ttl: number = DEFAULT_TTL
  ) => {
    const key = getCacheKey(type, id);
    const cacheItem = {
      data,
      timestamp: Date.now() + ttl,
      loading: false,
      error: null,
      type
    };

    // Update in-memory cache
    setCache(prev => ({
      ...prev,
      [key]: cacheItem
    }));

    // Update localStorage
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(cacheItem));
  }, []);

  const remove = useCallback((type: ObjectType, id: string) => {
    const key = getCacheKey(type, id);
    setCache(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
    localStorage.removeItem(STORAGE_PREFIX + key);
  }, []);

  const isLoading = useCallback((type: ObjectType, id: string): boolean => {
    const key = getCacheKey(type, id);
    return cache[key]?.loading ?? false;
  }, [cache]);

  const getError = useCallback((type: ObjectType, id: string): Error | null => {
    const key = getCacheKey(type, id);
    return cache[key]?.error ?? null;
  }, [cache]);

  const fetch = useCallback(async <T extends CacheableTypes>(
    type: ObjectType,
    id: string,
    fetchFn: () => Promise<T>,
    ttl: number = DEFAULT_TTL
  ): Promise<T> => {
    const key = getCacheKey(type, id);
    const existing = cache[key];

    // If we have valid cached data, return it immediately
    if (existing && existing.timestamp > Date.now()) {
      return existing.data;
    }

    // Check if there's already a pending request for this key
    const pendingKey = `${type}:${id}`;
    let promise = pendingPromises.get(pendingKey);

    if (!promise) {
      // If no pending request, create a new one
      promise = (async () => {
        try {
          setCache(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              loading: true,
              error: null,
              type
            }
          }));

          const data = await fetchFn();
          
          // Update cache with new data
          setCache(prev => ({
            ...prev,
            [key]: {
              data,
              timestamp: Date.now() + ttl,
              loading: false,
              error: null,
              type
            }
          }));

          // Store in localStorage
          localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify({
            data,
            timestamp: Date.now() + ttl,
            loading: false,
            error: null,
            type
          }));

          // Remove from pending promises
          pendingPromises.delete(pendingKey);
          
          return data;
        } catch (error) {
          // Update cache with error state
          const errorItem = {
            ...cache[key],
            loading: false,
            error: error as Error
          };
          
          setCache(prev => ({
            ...prev,
            [key]: errorItem
          }));
          
          localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(errorItem));
          
          // Remove from pending promises
          pendingPromises.delete(pendingKey);
          
          throw error;
        }
      })();

      // Store the promise in the pending promises map
      pendingPromises.set(pendingKey, promise);
    }

    // Return the promise (either newly created or existing)
    return promise;
  }, [cache]);

  const clearCache = useCallback((type?: ObjectType) => {
    if (type) {
      // Clear specific type
      const newCache = { ...cache };
      Object.keys(newCache).forEach(key => {
        if (key.startsWith(`${type}:`)) {
          delete newCache[key];
          localStorage.removeItem(STORAGE_PREFIX + key);
        }
      });
      setCache(newCache);
    } else {
      // Clear all cache
      setCache({});
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [cache]);

  return (
    <CacheContext.Provider value={{ get, set, remove, fetch, isLoading, getError, clearCache }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}
