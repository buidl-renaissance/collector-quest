import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import busboy from 'busboy';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Check if Digital Ocean Spaces credentials are properly configured
const accessKeyId = process.env.DO_SPACES_KEY;
const secretAccessKey = process.env.DO_SPACES_SECRET;
const region = process.env.DO_SPACES_REGION || 'nyc3';
const endpoint = process.env.DO_SPACES_ENDPOINT || `https://${region}.digitaloceanspaces.com`;

// Only create S3 client if credentials are available
const s3Client = accessKeyId && secretAccessKey ? new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: false,
}) : null;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Digital Ocean credentials are configured
  if (!s3Client) {
    console.error('Digital Ocean Spaces credentials not configured');
    // For development, return a mock URL instead of failing
    if (process.env.NODE_ENV === 'development' && false) {
      return res.status(200).json({
        success: true,
        url: `https://placeholder.com/${uuidv4()}.png`,
        key: `mock-${uuidv4()}.png`,
        mock: true
      });
    }
    return res.status(500).json({ error: 'Digital Ocean Spaces credentials not configured' });
  }

  // Check if Digital Ocean Space is configured
  const spaceName = process.env.DO_SPACES_BUCKET;
  if (!spaceName) {
    return res.status(500).json({ error: 'Digital Ocean Space not configured' });
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
      
      // Extract the base64 data from the data URL
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Determine file type from the data URL
      const fileType = image.split(';')[0].split('/')[1] || 'png';
      const fileName = `${uuidv4()}.${fileType}`;
      
      // Create a temporary file
      const tempFilePath = path.join(os.tmpdir(), fileName);
      fs.writeFileSync(tempFilePath, buffer);
      
      const uploadParams = {
        Bucket: spaceName,
        Key: fileName,
        Body: buffer,
        ContentType: `image/${fileType}`,
        ACL: 'public-read',
      };
      
      try {
        await s3Client.send(new PutObjectCommand({
          ...uploadParams,
          ACL: 'public-read' as ObjectCannedACL
        }));
      } catch (uploadError) {
        console.error('Digital Ocean Spaces upload error:', uploadError);
        // For development, return a mock URL instead of failing
        if (process.env.NODE_ENV === 'development' && false) {
          return res.status(200).json({
            success: true,
            url: `https://placeholder.com/${fileName}`,
            key: fileName,
            mock: true
          });
        }
        throw uploadError;
      }
      
      // Clean up the temp file
      fs.unlinkSync(tempFilePath);
      
      const fileUrl = `${endpoint}/${spaceName}/${fileName}`;
      
      return res.status(200).json({
        success: true,
        url: fileUrl,
        key: fileName
      });
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

      const fileContent = fs.readFileSync(file.filepath);
      const fileExtension = file.filename.split('.').pop() || 'png';
      const fileName = `${uuidv4()}.${fileExtension}`;
      
      const uploadParams = {
        Bucket: spaceName,
        Key: fileName,
        Body: fileContent,
        ContentType: file.mimetype || 'image/png',
        ACL: 'public-read',
      };

      try {
        await s3Client.send(new PutObjectCommand({
          ...uploadParams,
          ACL: 'public-read' as ObjectCannedACL
        }));
      } catch (uploadError) {
        console.error('Digital Ocean Spaces upload error:', uploadError);
        // For development, return a mock URL instead of failing
        if (process.env.NODE_ENV === 'development') {
          return res.status(200).json({
            success: true,
            url: `https://placeholder.com/${fileName}`,
            key: fileName,
            mock: true
          });
        }
        throw uploadError;
      }
      
      // Clean up the temp file
      fs.unlinkSync(file.filepath);
      
      const fileUrl = `${endpoint}/${spaceName}/${fileName}`;
      
      return res.status(200).json({ 
        success: true, 
        url: fileUrl,
        key: fileName
      });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}