"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterImageFromURL = filterImageFromURL;
exports.deleteLocalFiles = deleteLocalFiles;
const fs_1 = __importDefault(require("fs"));
const jimp_1 = __importDefault(require("jimp"));
async function filterImageFromURL(inputURL) {
    const photo = await jimp_1.default.read(inputURL);
    const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
    await photo
        .resize(256, 256)
        .quality(60)
        .greyscale()
        .writeAsync(outpath);
    return outpath;
}
async function deleteLocalFiles(files) {
    for (const file of files) {
        fs_1.default.unlinkSync(file);
    }
}
//# sourceMappingURL=util.js.map