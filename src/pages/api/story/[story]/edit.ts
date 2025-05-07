import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow PUT method for editing
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    // Get story slug from the URL
    const { story } = req.query;
    
    if (!story || typeof story !== 'string') {
      return res.status(400).json({ error: 'Invalid story slug' });
    }

    // Parse the request body
    const { title, description, videoUrl, script, artwork } = JSON.parse(req.body);

    // Validate required fields
    if (!title || !description || !script) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // In a real implementation, you would update the story in your database
    // For now, we'll just return success with the updated data
    
    // Mock successful update
    return res.status(200).json({
      success: true,
      story: {
        slug: story,
        title,
        description,
        videoUrl,
        script,
        artwork: artwork || '',
        // updatedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error updating story:', error);
    return res.status(500).json({ error: 'Failed to update story' });
  }
}
