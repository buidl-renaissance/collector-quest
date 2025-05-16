import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const fsExists = promisify(fs.exists);
const fsMkdir = promisify(fs.mkdir);

/**
 * Compresses an MP4 video to 720p resolution using FFmpeg
 * 
 * @param inputPath - Path to the input video file
 * @param outputPath - Path where the compressed video will be saved (optional)
 * @param options - Additional compression options
 * @returns Promise that resolves to the path of the compressed video
 */
export async function compressVideo(
  inputPath: string,
  outputPath?: string,
  options: {
    width?: number;
    height?: number;
    crf?: number; // Constant Rate Factor (18-28 is good, lower = better quality)
    preset?: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
  } = {}
): Promise<string> {
  // Set default options
  const width = options.width || 1280;
  const height = options.height || 720;
  const crf = options.crf || 23;
  const preset = options.preset || 'medium';

  // Generate output path if not provided
  if (!outputPath) {
    const dir = path.dirname(inputPath);
    const filename = path.basename(inputPath, path.extname(inputPath));
    outputPath = path.join(dir, `${filename}-compressed.mp4`);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!(await fsExists(outputDir))) {
    await fsMkdir(outputDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    // FFmpeg command to compress video to 720p
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,
      '-vf', `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
      '-c:v', 'libx264',
      '-crf', crf.toString(),
      '-preset', preset,
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-y', // Overwrite output file if it exists
      outputPath
    ]);

    let stdoutData = '';
    let stderrData = '';

    ffmpeg.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    ffmpeg.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}: ${stderrData}`));
      }
    });

    ffmpeg.on('error', (err) => {
      reject(new Error(`Failed to start FFmpeg process: ${err.message}`));
    });
  });
}
