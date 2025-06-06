// Generic interface for generation results
export interface GenerationResult<T> {
  id: string;
  event_name: string;
  event_id?: string;
  status: 'pending' | 'complete' | 'error';
  step?: string;
  message?: string;
  result?: T;
  error?: string;
  object_type: string; // e.g. 'character', 'campaign', 'artifact'
  object_id: string; // e.g. character ID or other identifier
  object_key: string; // e.g. 'equipment', 'traits', 'image'
  created_at: string;
  updated_at: string;
}
