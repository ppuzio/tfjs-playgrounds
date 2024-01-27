import { figureModelSize, loadImageTensors } from "./utils.ts";
import * as tf from "@tensorflow/tfjs-node";

let model: tf.LayersModel;
async function loadModel() {
  model = await tf.loadLayersModel("file://./model/model.json");
}

loadModel().then(() => {
  loadImageTensors(
    new Array(figureModelSize / 4).fill(0).map((_, i) => ({
      path: `squares/square_${i + (figureModelSize * 3) / 4}.png`,
    })),
    true
  ).then((imageTensors) => imageTensors.forEach(predict));
});

async function predict(image: tf.Tensor<tf.Rank>) {
  // Implement this function similar to your training preprocessing
  const prediction = model.predict(image) as tf.Tensor<tf.Rank>;

  // Convert the prediction tensor to a JavaScript array
  const predictionArray = await prediction.data();

  // Assuming binary classification: [not_square_probability, square_probability]
  const squareProbability = predictionArray[1];

  // You can set a threshold to decide the class
  const threshold = 0.5;
  const isSquare = squareProbability > threshold;

  // Display results
  console.log(isSquare, squareProbability);
}
