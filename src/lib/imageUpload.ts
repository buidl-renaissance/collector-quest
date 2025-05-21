import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Types
export interface UploadResult {
  success: boolean;
  url: string;
  key: string;
  mock?: boolean;
}

export interface UploadError {
  error: string;
  details?: string;
}

// S3 Client configuration
const accessKeyId = process.env.DO_SPACES_KEY;
const secretAccessKey = process.env.DO_SPACES_SECRET;
const region = process.env.DO_SPACES_REGION || 'nyc3';
const endpoint = process.env.DO_SPACES_ENDPOINT || `https://${region}.digitaloceanspaces.com`;
const spaceName = process.env.DO_SPACES_BUCKET;

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


export interface UploadResult {
  success: boolean;
  url: string;
  key: string;
  mock?: boolean;
}

export interface UploadError {
  error: string;
  details?: string;
}


/**
 * Upload a base64 encoded image to Digital Ocean Spaces
 */
export async function uploadBase64Image(image: string): Promise<UploadResult | UploadError> {
  if (!s3Client || !spaceName) {
    return handleMissingConfig();
  }

  try {
    // Extract the base64 data from the data URL
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Determine file type from the data URL
    const fileType = image.split(';')[0].split('/')[1] || 'png';
    const fileName = `${uuidv4()}.${fileType}`;
    
    // Create a temporary file
    const tempFilePath = path.join(os.tmpdir(), fileName);
    fs.writeFileSync(tempFilePath, buffer);
    
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: spaceName,
        Key: fileName,
        Body: buffer,
        ContentType: `image/${fileType}`,
        ACL: 'public-read' as ObjectCannedACL
      }));
    } catch (uploadError) {
      console.error('Digital Ocean Spaces upload error:', uploadError);
      return handleUploadError(fileName);
    }
    
    // Clean up the temp file
    fs.unlinkSync(tempFilePath);
    
    const fileUrl = `${endpoint}/${spaceName}/${fileName}`;
    
    return {
      success: true,
      url: fileUrl,
      key: fileName
    } as UploadResult;
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    return {
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    } as UploadError;
  }
}

/**
 * Upload a file from a file path to Digital Ocean Spaces
 */
export async function uploadFileFromPath(
  filepath: string,
  filename: string,
  mimetype: string
): Promise<UploadResult | UploadError> {
  if (!s3Client || !spaceName) {
    return handleMissingConfig();
  }

  try {
    const fileContent = fs.readFileSync(filepath);
    const fileExtension = filename.split('.').pop() || 'png';
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: spaceName,
        Key: fileName,
        Body: fileContent,
        ContentType: mimetype || 'image/png',
        ACL: 'public-read' as ObjectCannedACL
      }));
    } catch (uploadError) {
      console.error('Digital Ocean Spaces upload error:', uploadError);
      return handleUploadError(fileName);
    }
    
    // Clean up the temp file
    fs.unlinkSync(filepath);
    
    const fileUrl = `${endpoint}/${spaceName}/${fileName}`;
    
    return {
      success: true,
      url: fileUrl,
      key: fileName
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      error: 'Failed to upload file',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper functions
function handleMissingConfig(): UploadError {
  console.error('Digital Ocean Spaces credentials not configured');
  if (process.env.NODE_ENV === 'development') {
    return {
      error: 'Digital Ocean Spaces credentials not configured',
      details: 'Running in development mode'
    };
  }
  return {
    error: 'Digital Ocean Spaces credentials not configured'
  };
}

function handleUploadError(fileName: string): UploadResult | UploadError {
  if (process.env.NODE_ENV === 'development') {
    return {
      success: true,
      url: `https://placeholder.com/${fileName}`,
      key: fileName,
      mock: true
    };
  }
  return {
    error: 'Failed to upload to Digital Ocean Spaces'
  };
}

/**
 * Downloads an image from a URL and uploads it to Digital Ocean Spaces
 * @param imageUrl The URL of the image to download
 * @param folderPath Optional folder path within the bucket
 * @returns Upload result or error
 */
export async function downloadAndUploadImage(imageUrl: string, folderPath: string = ''): Promise<UploadResult | UploadError> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      return {
        error: 'Failed to download image',
        details: `HTTP status ${response.status}`
      };
    }
    
    // Get the image data as buffer
    const imageBuffer = await response.arrayBuffer();
    
    // Create a temporary file
    const tempDir = os.tmpdir();
    const fileExtension = getFileExtension(imageUrl);
    const fileName = `${folderPath ? folderPath + '/' : ''}${uuidv4()}${fileExtension}`;
    const filepath = path.join(tempDir, fileName);
    
    // Write the buffer to the temp file
    fs.writeFileSync(filepath, Buffer.from(imageBuffer));
    
    // Upload the file to Digital Ocean Spaces
    if (!s3Client || !spaceName) {
      return handleMissingConfig();
    }
    
    const fileStream = fs.createReadStream(filepath);
    
    const uploadParams = {
      Bucket: spaceName,
      Key: fileName,
      Body: fileStream,
      ACL: ObjectCannedACL.public_read,
      ContentType: getContentType(fileExtension)
    };
    
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
    } catch (uploadError) {
      console.error('Error uploading to Digital Ocean Spaces:', uploadError);
      fs.unlinkSync(filepath);
      return handleUploadError(fileName);
    }
    
    // Clean up the temp file
    fs.unlinkSync(filepath);
    
    const fileUrl = `${endpoint}/${spaceName}/${fileName}`;
    
    return {
      success: true,
      url: fileUrl,
      key: fileName
    };
  } catch (error) {
    console.error('Error in downloadAndUploadImage:', error);
    return {
      error: 'Failed to process image',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Gets the file extension from a URL
 * @param url The URL to extract extension from
 * @returns The file extension including the dot
 */
function getFileExtension(url: string): string {
  // Try to get extension from URL path
  const pathname = new URL(url).pathname;
  const extension = path.extname(pathname).toLowerCase();
  
  // If we got a valid extension, return it
  if (extension && ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
    return extension;
  }
  
  // Default to .jpg if no valid extension found
  return '.jpg';
}

/**
 * Gets the content type based on file extension
 * @param extension The file extension
 * @returns The appropriate content type
 */
function getContentType(extension: string): string {
  const contentTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  return contentTypes[extension] || 'image/jpeg';
}
