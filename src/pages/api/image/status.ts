import { NextApiRequest, NextApiResponse } from 'next';
import { getResult } from '@/lib/storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid result ID' });
  }

  const result = getResult(id);

  if (!result) {
    return res.status(404).json({ error: 'Result not found' });
  }

  return res.status(200).json({
    id: result.id,
    status: result.status,
    result: result.result,
    error: result.error,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  });
}
