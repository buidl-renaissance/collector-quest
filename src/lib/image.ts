interface UploadResponse {
  success: boolean;
  url: string;
  key: string;
}

/**
 * Uploads an image to the server
 *
 * @param image The image to upload
 * @returns The uploaded image data
 */
export const uploadImage = async (image: string): Promise<UploadResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://smearington.theethical.ai';
  const response = await fetch(`${baseUrl}/api/image-upload`, {
    method: "POST",
    body: JSON.stringify({ image }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  console.log(data);
  return data;
};

/**
 * Generates an image using the AI
 *
 * @param image The image to generate
 * @param prompt The prompt to generate the image
 * @returns The generated image
 */
export const generateImage = async (prompt: string, image?: string) => {
  try {
    // Determine if we're in a server context (Inngest) or client context
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer ? process.env.NEXT_PUBLIC_BASE_URL || 'https://smearington.theethical.ai' : '';
    
    console.log("Generating image", prompt, image);

    const response = await fetch(`${baseUrl}/api/ai/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, image: image }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const data = await response.json();
    return `data:image/png;base64,${data.b64_json}`;
  } catch (err) {
    console.error("Error generating image:", err);
    return null;
  }
};

/**
 * Converts a URL path from one format to another
 *
 * @param url The original image URL
 * @param fromPattern The pattern to match in the URL
 * @param toPattern The pattern to replace with
 * @returns The converted URL
 */
export const convertImageUrl = (
  url: string,
  fromPattern: string,
  toPattern: string
): string => {
  if (!url) return url;
  return url.replace(fromPattern, toPattern);
};

/**
 * Converts an image URL from 800w resized format to tiles format
 *
 * @param url The original image URL with 800w format
 * @returns The converted URL with tiles format
 */
export const convertResizedToTiles = (url: string): string => {
  return convertImageUrl(url, "uploads/resized/800w", "uploads/resized/tiles");
};

/**
 * Converts an image URL from tiles format to 800w resized format
 *
 * @param url The original image URL with tiles format
 * @returns The converted URL with 800w format
 */
export const convertTilesToResized = (url: string): string => {
  return convertImageUrl(url, "uploads/resized/tiles", "uploads/resized/800w");
};

/**
 * Converts an image URL from default format to 800w resized format
 *
 * @param url The original image URL with default format
 * @returns The converted URL with 800w format
 */
export const convertDefaultToResized = (url: string): string => {
  return convertImageUrl(url, "uploads", "uploads/resized/800w");
};

/**
 * Converts an image URL from default format to tiles format
 *
 * @param url The original image URL with default format
 * @returns The converted URL with tiles format
 */
export const convertDefaultToTiles = (url: string): string => {
  return convertImageUrl(url, "uploads", "uploads/resized/tiles");
};

/**
 * Converts an image URL from 800w resized format to default format
 *
 * @param url The original image URL with 800w format
 * @returns The converted URL with default format
 */
export const convertResizedToDefault = (url: string): string => {
  return convertImageUrl(url, "uploads/resized/800w", "uploads");
};

/**
 * Converts an image URL from tiles format to default format
 *
 * @param url The original image URL with tiles format
 * @returns The converted URL with default format
 */
export const convertTilesToDefault = (url: string): string => {
  return convertImageUrl(url, "uploads/resized/tiles", "uploads");
};

/**
 * Compresses a base64 image to a specified width
 *
 * @param base64 The original base64 image string
 * @param size The target width in pixels (default: 600)
 * @returns The base64 string of the compressed image
 */
export const compressImageTo600px = (base64: string, size: number = 600): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate height to maintain aspect ratio
      const aspectRatio = img.height / img.width;
      const targetWidth = size;
      const targetHeight = targetWidth * aspectRatio;
      
      // Set canvas dimensions
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Draw resized image on canvas
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert canvas to base64
      const compressedBase64 = canvas.toDataURL('image/jpeg');
      resolve(compressedBase64);
    };
    
    img.onerror = (error) => {
      reject(error);
    };
    
    // Set source of image to the base64 string
    img.src = base64;
  });
};
