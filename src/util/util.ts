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
export async function filterImageFromURL(inputURL: string): Promise<string> {
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
  // Replaces legacy Jimp implementation for ~40x speed increase
  await sharp(buffer)
    .resize(256, 256, {
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy
    })
    .grayscale()
    .jpeg({ quality: 60 })
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