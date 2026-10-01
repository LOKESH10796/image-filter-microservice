/**
 * Downloads an image from a URL, processes it with Sharp (resizes, greyscales, adjusts quality),
 * and saves it to a temporary file.
 *
 * @param inputURL - The public URL of the image to process.
 * @returns A Promise resolving to the absolute file path of the processed image.
 */
export declare function filterImageFromURL(inputURL: string): Promise<string>;
/**
 * Deletes an array of local files from the disk.
 *
 * @param files - Array of absolute file paths to delete.
 */
export declare function deleteLocalFiles(files: string[]): Promise<void>;
//# sourceMappingURL=util.d.ts.map