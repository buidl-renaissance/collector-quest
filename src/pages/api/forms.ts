import type { NextApiRequest, NextApiResponse } from 'next';

type FormData = {
  name: string;
  email: string;
  role: string;
  experience: string;
  portfolio: string;
  discord: string;
  github: string;
  motivation: string;
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
    const formData: FormData = req.body;

    // Basic validation
    if (!formData.name || !formData.email || !formData.role || !formData.motivation) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send notification email
    // 3. Perform any other necessary actions
    
    // For now, we'll just simulate a successful submission
    console.log('Form submission received:', formData);

    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully' 
    });
    
  } catch (error) {
    console.error('Error processing form submission:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your application' 
    });
  }
}
