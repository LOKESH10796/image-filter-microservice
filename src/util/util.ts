import fs from 'fs';
import Jimp from 'jimp';

export async function filterImageFromURL(inputURL: string): Promise<string> {
  const photo = await Jimp.read(inputURL);
  const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
  await photo
    .resize(256, 256)
    .quality(60)
    .greyscale()
    .writeAsync(outpath);
  return outpath;
}

export async function deleteLocalFiles(files: string[]): Promise<void> {
  for (const file of files) {
    fs.unlinkSync(file);
  }
}