import type { NextApiRequest, NextApiResponse } from 'next';

type FormData = {
  name: string;
  email: string;
  guests: number;
  message?: string;
};

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Parse the request body
    const { name, email, guests, message }: FormData = req.body;

    // Basic validation
    if (!name || !email || !guests) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    if (typeof guests !== 'number' || guests < 1 || guests > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid number of guests' 
      });
    }

    // Here you would typically store the data in a database
    // For example with a database client:
    // await db.collection('rsvps').insertOne({ name, email, guests, message, createdAt: new Date() });
    
    // For now, we'll just log it and return success
    console.log('RSVP Submission:', { name, email, guests, message });

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'RSVP submitted successfully' 
    });
    
  } catch (error) {
    console.error('Error processing RSVP:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your request' 
    });
  }
}
