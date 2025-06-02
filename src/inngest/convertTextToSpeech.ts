import { inngest } from "@/utils/inngest";
import { uploadAudioBuffer } from "@/lib/audioUpload";

const TOPMEDIA_API_KEY = process.env.TOPMEDIA_API_KEY;
const TOPMEDIA_API_URL = "https://api.topmediai.com/v1/text2speech";

interface BufferLike {
  type: "Buffer";
  data: number[];
}

/**
 * Split text into chunks of sentences, each chunk not exceeding maxLength characters
 */
function splitIntoChunks(text: string, maxLength: number = 500): string[] {
  // Split text into sentences using common sentence endings
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks: string[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    // If adding this sentence would exceed maxLength, start a new chunk
    if ((currentChunk + sentence).length > maxLength && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }

  // Add the last chunk if it's not empty
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Convert text to speech and save to Digital Ocean Spaces
export const convertTextToSpeech = inngest.createFunction(
  { 
    id: "convert-text-to-speech",
    name: "Convert Text to Speech" 
  },
  { event: "tts/convert" },
  async ({ event, step }) => {
    const { text, speaker, emotion, metadata } = event.data;

    // Split text into chunks
    const textChunks = splitIntoChunks(text);
    const audioBuffers: BufferLike[] = [];
    const audioData: { duration: number }[] = [];

    // Process each chunk
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      
      // Generate audio for this chunk
      const chunkData = await step.run(`Generate Audio Part ${i + 1}`, async () => {
        const response = await fetch(TOPMEDIA_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOPMEDIA_API_KEY}`,
          },
          body: JSON.stringify({
            text: chunk,
            speaker: speaker || "3746b45c-3ed2-11f0-8a5c-00163e0478fa",
            emotion: emotion || "Neutral",
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate audio: ${response.statusText}`);
        }

        return response.json();
      });

      // Download the audio file for this chunk
      const chunkBuffer = await step.run(`Download Audio Part ${i + 1}`, async () => {
        const response = await fetch(chunkData.audio_url);
        if (!response.ok) {
          throw new Error("Failed to download audio file");
        }
        const arrayBuffer = await response.arrayBuffer();
        const bufferData: BufferLike = {
          type: "Buffer",
          data: Array.from(new Uint8Array(arrayBuffer))
        };
        return bufferData;
      });

      audioBuffers.push(chunkBuffer);
      audioData.push({ duration: chunkData.duration });
    }

    // Generate a unique filename based on metadata and timestamp
    const timestamp = new Date().getTime();
    const prefix = metadata?.characterId ? `characters/${metadata.characterId}` :
                  metadata?.artifactId ? `artifacts/${metadata.artifactId}` :
                  metadata?.relicId ? `relics/${metadata.relicId}` : 'general';

    // Upload each audio chunk
    const uploadResults = await Promise.all(
      audioBuffers.map((buffer, index) => 
        step.run(`Upload Audio Part ${index + 1}`, async () => {
          const filename = `audio/${prefix}/speech-${timestamp}-part${index + 1}.mp3`;
          return uploadAudioBuffer(buffer, filename);
        })
      )
    );

    // Check for upload errors
    const uploadError = uploadResults.find(result => 'error' in result);
    if (uploadError && 'error' in uploadError) {
      throw new Error(`Failed to upload audio: ${uploadError.error}`);
    }

    // Calculate total duration
    const totalDuration = audioData.reduce((sum, data) => sum + data.duration, 0);

    return {
      success: true,
      audioUrls: uploadResults.map(result => ('url' in result ? result.url : '')),
      metadata: {
        ...metadata,
        filenames: uploadResults.map(result => ('key' in result ? result.key : '')),
        duration: totalDuration,
        parts: uploadResults.length,
      },
    };
  }
); 