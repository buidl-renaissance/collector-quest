import type { NextApiRequest, NextApiResponse } from 'next';
import { registerHandle } from '../../lib/mint';
import { Handle } from '../../lib/interfaces';

type RequestData = {
  handle: string;
  owner: string;
  pinCode: string;
  guardians: string[];
};

type ResponseData = {
  success: boolean;
  handle?: Handle;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { handle, owner, pinCode, guardians } = JSON.parse(req.body) as RequestData;

    // Validate required fields
    if (!handle || !owner) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: handle and owner are required' 
      });
    }

    // Call the registerHandle function from mint.ts
    const result = await registerHandle({
      handle,
      owner,
      pinCode: pinCode || '1111', // Default PIN if not provided
      guardians: guardians || [], // Default empty array if not provided
    });

    // Return success response
    return res.status(200).json({
      success: true,
      handle: {
        id: result.digest,
        name: handle,
        owner: owner
      }
    });
  } catch (error) {
    console.error('Error registering handle:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}
