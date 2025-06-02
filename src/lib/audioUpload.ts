import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

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

interface BufferLike {
  type: "Buffer";
  data: number[];
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

function isBufferLike(data: any): data is BufferLike {
  return data && typeof data === 'object' && data.type === 'Buffer' && Array.isArray(data.data);
}

/**
 * Upload an audio buffer to Digital Ocean Spaces
 */
export async function uploadAudioBuffer(
  data: Buffer | Uint8Array | BufferLike,
  filename: string,
  contentType: string = 'audio/mpeg'
): Promise<UploadResult | UploadError> {
  if (!s3Client || !spaceName) {
    return handleMissingConfig();
  }

  try {
    let buffer: Buffer;
    
    if (isBufferLike(data)) {
      buffer = Buffer.from(data.data);
    } else if (Buffer.isBuffer(data)) {
      buffer = data;
    } else {
      buffer = Buffer.from(data);
    }

    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: spaceName,
        Key: filename,
        Body: buffer,
        ContentType: contentType,
        ACL: 'public-read' as ObjectCannedACL
      }));
    } catch (uploadError) {
      console.error('Digital Ocean Spaces upload error:', uploadError);
      return handleUploadError(filename);
    }
    
    const fileUrl = `${endpoint}/${spaceName}/${filename}`;
    
    return {
      success: true,
      url: fileUrl,
      key: filename
    };
  } catch (error) {
    console.error('Error uploading audio:', error);
    return {
      error: 'Failed to upload audio',
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