import * as tf from "@tensorflow/tfjs-node";

import {
  figureModelSize,
  imgHeight,
  imgWidth,
  loadImageTensors,
  pathToFolder,
} from "./utils.ts";

// Define the model
const model = tf.sequential();
model.add(
  tf.layers.conv2d({
    inputShape: [imgWidth, imgHeight, 3],
    filters: 32,
    kernelSize: 3,
    activation: "relu",
  })
); // convolutional layer
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] })); // pooling layer
model.add(tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: "relu" })); // convolutional layer
model.add(tf.layers.maxPooling2d({ poolSize: [2, 2] })); // pooling layer
model.add(tf.layers.flatten()); //
model.add(tf.layers.dense({ units: 64, activation: "relu" })); // fully connected layer
model.add(tf.layers.dense({ units: 2, activation: "softmax" })); // output layer

// Compile the model
model.compile({
  optimizer: "adam",
  loss: "categoricalCrossentropy",
  metrics: ["accuracy"],
});

// training data

const squareTrainingData = new Array((figureModelSize * 3) / 4)
  .fill(0)
  .map((_, i) => ({ label: 1, path: `squares/square_${i}.png` }));
const otherTrainingData = new Array((figureModelSize * 3) / 4)
  .fill(0)
  .map((_, i) => ({ label: 0, path: `otherShapes/shape_${i}.png` }));

const randomizedTrainingData = squareTrainingData
  .concat(otherTrainingData)
  .sort(() => Math.random() - 0.5);

// validation data

const squareValidationData = new Array((figureModelSize * 1) / 4)
  .fill(0)
  .map((_, i) => ({
    label: 1,
    path: `squares/square_${i + (figureModelSize * 3) / 4}.png`,
  }));

const otherValidationData = new Array((figureModelSize * 1) / 4)
  .fill(0)
  .map((_, i) => ({
    label: 0,
    path: `squares/square_${i + (figureModelSize * 3) / 4}.png`,
  }));

const randomizedValidationData = squareValidationData
  .concat(otherValidationData)
  .sort(() => Math.random() - 0.5);

// Load and preprocess training and validation images
const loadTrainingData = async () => {
  const trainImageTensors = await loadImageTensors(randomizedTrainingData);
  const trainData = tf.stack(trainImageTensors);
  const labelTensors = randomizedTrainingData.map(({ label }) =>
    tf.oneHot(label, 2)
  ); // One-hot encoding for two classes
  const trainLabels = tf.stack(labelTensors);

  const validationImageTensors = await loadImageTensors(
    randomizedValidationData
  );

  const validationLabelTensors = randomizedValidationData.map(({ label }) =>
    tf.oneHot(label, 2)
  ); // One-hot encoding for two classes
  const validationData = tf.stack(validationImageTensors);
  const validationLabels = tf.stack(validationLabelTensors);

  return { trainData, trainLabels, validationData, validationLabels };
};

loadTrainingData().then(
  ({ trainData, trainLabels, validationData, validationLabels }) => {
    model
      .fit(trainData, trainLabels, {
        epochs: 25,
        validationData: [validationData, validationLabels],
        callbacks: {
          onEpochEnd: (epoch, log) => {
            console.log(
              `Epoch ${epoch + 1}: loss = ${log?.loss}, accuracy = ${log?.acc}`
            );
          },
        },
      })
      .then(({ history }) => {
        console.log("Training Complete");
        console.log(history);
        const savePath = pathToFolder("model");

        model.save(savePath);
      });
  }
);
