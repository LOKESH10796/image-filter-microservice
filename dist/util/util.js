"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterImageFromURL = filterImageFromURL;
exports.deleteLocalFiles = deleteLocalFiles;
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Downloads an image from a URL, processes it with Sharp (resizes, greyscales, adjusts quality),
 * and saves it to a temporary file.
 *
 * @param inputURL - The public URL of the image to process.
 * @returns A Promise resolving to the absolute file path of the processed image.
 */
async function filterImageFromURL(inputURL) {
    // Fetch the image as an ArrayBuffer
    const response = await fetch(inputURL);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // Generate a unique temporary file path safely using OS temp dir
    const filename = `filtered_${crypto_1.default.randomUUID()}.jpg`;
    const outpath = path_1.default.join(os_1.default.tmpdir(), filename);
    // Process image natively with high-performance Sharp (libvips)
    // Replaces legacy Jimp implementation for ~40x speed increase
    await (0, sharp_1.default)(buffer)
        .resize(256, 256, {
        fit: sharp_1.default.fit.cover,
        position: sharp_1.default.strategy.entropy
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
async function deleteLocalFiles(files) {
    for (const file of files) {
        try {
            if (fs_1.default.existsSync(file)) {
                fs_1.default.unlinkSync(file);
            }
        }
        catch (err) {
            console.error(`Failed to delete local file ${file}:`, err);
        }
    }
}
//# sourceMappingURL=util.js.map