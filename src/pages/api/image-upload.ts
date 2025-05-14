import { NextApiRequest, NextApiResponse } from 'next';
import busboy from 'busboy';
import { uploadBase64Image, uploadFileFromPath } from '@/lib/imageUpload';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
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
    // Check if the request is a base64 encoded image
    if (req.headers['content-type'] === 'application/json') {
      // Parse the JSON body manually since bodyParser is disabled
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      
      const { image } = JSON.parse(body);
      
      if (!image) {
        return res.status(400).json({ error: 'No image data provided' });
      }
      
      const result = await uploadBase64Image(image);
      
      if ('error' in result) {
        return res.status(500).json(result);
      }
      
      return res.status(200).json(result);
    } else {
      // Handle regular file uploads with busboy
      const bb = busboy({ headers: req.headers });
      
      // Create a promise to handle the file upload
      const uploadPromise = new Promise<{
        filepath: string;
        filename: string;
        mimetype: string;
      }>((resolve, reject) => {
        let uploadedFile: {
          filepath: string;
          filename: string;
          mimetype: string;
        } | null = null;
        
        bb.on('file', (name: string, file: any, info: any) => {
          const { filename, mimeType } = info;
          const saveTo = path.join(os.tmpdir(), `${uuidv4()}-${filename}`);
          const writeStream = fs.createWriteStream(saveTo);
          
          file.pipe(writeStream);
          
          writeStream.on('finish', () => {
            uploadedFile = {
              filepath: saveTo,
              filename: filename,
              mimetype: mimeType
            };
          });
        });
        
        bb.on('finish', () => {
          if (uploadedFile) {
            resolve(uploadedFile);
          } else {
            reject(new Error('No file uploaded'));
          }
        });
        
        bb.on('error', (err: any) => {
          reject(err);
        });
      });
      
      req.pipe(bb);
      
      const file = await uploadPromise;
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const result = await uploadFileFromPath(
        file.filepath,
        file.filename,
        file.mimetype
      );
      
      if ('error' in result) {
        return res.status(500).json(result);
      }
      
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}