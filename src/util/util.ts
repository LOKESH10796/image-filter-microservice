import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';
import crypto from 'crypto';

/**
 * Downloads an image from a URL, processes it with Sharp (resizes, greyscales, adjusts quality),
 * and saves it to a temporary file.
 *
 * @param inputURL - The public URL of the image to process.
 * @returns A Promise resolving to the absolute file path of the processed image.
 */
export async function filterImageFromURL(
  inputURL: string, 
  filter: string = 'grayscale',
  width: number = 256,
  height: number = 256
): Promise<string> {
  // Fetch the image as an ArrayBuffer
  const response = await fetch(inputURL);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Generate a unique temporary file path safely using OS temp dir
  const filename = `filtered_${crypto.randomUUID()}.jpg`;
  const outpath = path.join(os.tmpdir(), filename);

  // Process image natively with high-performance Sharp (libvips)
  let imagePipeline = sharp(buffer).resize(width, height, {
    fit: sharp.fit.cover,
    position: sharp.strategy.entropy
  });

  // Apply dynamic filters
  if (filter === 'grayscale') {
    imagePipeline = imagePipeline.grayscale();
  } else if (filter === 'blur') {
    imagePipeline = imagePipeline.blur(5);
  } else if (filter === 'invert') {
    imagePipeline = imagePipeline.negate();
  } else if (filter === 'sepia') {
    imagePipeline = imagePipeline.tint({ r: 112, g: 66, b: 20 });
  }

  await imagePipeline
    .jpeg({ quality: 80 })
    .toFile(outpath);

  return outpath;
}

/**
 * Deletes an array of local files from the disk.
 *
 * @param files - Array of absolute file paths to delete.
 */
export async function deleteLocalFiles(files: string[]): Promise<void> {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (err) {
      console.error(`Failed to delete local file ${file}:`, err);
    }
  }
}