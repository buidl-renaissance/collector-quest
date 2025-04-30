import type { NextApiRequest, NextApiResponse } from 'next';
import { SponsorService } from '../../lib/sponsor';

type RequestData = {
  transactionBytes: string;
  userAddress: string;
  userSignature?: string;
};

type ResponseData = {
  success: boolean;
  result?: any;
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
    const { transactionBytes, userAddress, userSignature } = req.body as RequestData;

    // Validate required fields
    if (!transactionBytes) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required field: transactionBytes' 
      });
    }

    // Execute the sponsored transaction
    const result = await SponsorService.sponsorTransaction(transactionBytes, userAddress, userSignature);

    // Return success response
    return res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error executing sponsored transaction:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
}
