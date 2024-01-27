import fs from "fs";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";
import { fileURLToPath } from "url";
import { ImageData } from "./types.ts";

export const imgWidth = 64;
export const imgHeight = 64;

function loadAndPreprocessImage(imagePath: string, expandDims = false) {
  const imageBuffer = fs.readFileSync(imagePath);
  const decodedImage = tf.node.decodeImage(imageBuffer, 3);
  const output = tf.image
    .resizeBilinear(decodedImage, [imgWidth, imgHeight])
    .div(tf.scalar(255.0));
  return expandDims ? output.expandDims() : output;
}

// Convert image paths to preprocessed image tensors
export const loadImageTensors = async (data: ImageData, expandDims = false) => {
  const imagePromises = data.map(({ path }) =>
    loadAndPreprocessImage(path, expandDims)
  );
  return await Promise.all(imagePromises);
};

export const pathToFolder = (folder: string) =>
  `file://${path.join(path.dirname(fileURLToPath(import.meta.url)), folder)}`;

export const figureModelSize = 256;
