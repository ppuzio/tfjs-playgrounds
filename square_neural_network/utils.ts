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

export const getRandomizedData = (isValidation: boolean) => {
  const arraySizeFactor = isValidation ? 1 : 3;
  const pathStartingIndex = isValidation ? 3 : 0;

  const squareValidationData = new Array(
    (figureModelSize * arraySizeFactor) / 4
  ) // validation * 1, training * 3
    .fill(0)
    .map((_, i) => ({
      label: 1,
      path: `squares/square_${
        i + (figureModelSize * pathStartingIndex) / 4
      }.png`, // validation * 3, training * 0
    }));

  const otherValidationData = new Array((figureModelSize * arraySizeFactor) / 4)
    .fill(0)
    .map((_, i) => ({
      label: 0,
      path: `otherShapes/shape_${
        i + (figureModelSize * pathStartingIndex) / 4
      }.png`,
    }));

  return squareValidationData
    .concat(otherValidationData)
    .sort(() => Math.random() - 0.5);
};
