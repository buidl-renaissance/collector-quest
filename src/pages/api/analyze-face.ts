import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Remove the data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract facial characteristics that we can use to fuse with a generated video game character. Focus on: face shape, eye shape and color, nose shape, mouth shape, hair style and color, skin tone, and any distinctive features. Format the response as a JSON object with these characteristics."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    // Clean up the response content by removing markdown formatting
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    
    // Parse the response to ensure it's valid JSON
    const characteristics = JSON.parse(cleanedContent);

    return res.status(200).json({ characteristics });
  } catch (error) {
    console.error('Error analyzing face:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze face',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 