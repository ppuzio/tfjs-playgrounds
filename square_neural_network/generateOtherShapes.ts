import { createCanvas } from "canvas";
import fs from "fs";
import { figureModelSize } from "./utils.js";

const generateRandomShapeImage = (filename: string) => {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext("2d");

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 64, 64);

  // Random dark color
  const color = `rgb(${Math.floor(Math.random() * 128)}, ${Math.floor(
    Math.random() * 128,
  )}, ${Math.floor(Math.random() * 128)})`;
  ctx.fillStyle = color;

  // Randomly choose a shape
  const shapeType = Math.floor(Math.random() * 3);
  switch (shapeType) {
    case 0: // Rectangle (not a square)
      let width, height;
      do {
        width = Math.floor(Math.random() * 32) + 16;
        height = Math.floor(Math.random() * 32) + 16;
      } while (Math.abs(width - height) < width * 0.2); // Ensure one side is at least 20% longer
      ctx.fillRect(
        Math.floor(Math.random() * (64 - width)),
        Math.floor(Math.random() * (64 - height)),
        width,
        height,
      );
      break;
    case 1: // Circle
      ctx.beginPath();
      const radius = Math.floor(Math.random() * 24) + 4;
      ctx.arc(
        Math.floor(Math.random() * (64 - 2 * radius)) + radius,
        Math.floor(Math.random() * (64 - 2 * radius)) + radius,
        radius,
        0,
        2 * Math.PI,
      );
      ctx.fill();
      break;
    case 2: // Other shapes (Triangle)
      ctx.beginPath();
      ctx.moveTo(
        Math.floor(Math.random() * 64),
        Math.floor(Math.random() * 64),
      );
      ctx.lineTo(
        Math.floor(Math.random() * 64),
        Math.floor(Math.random() * 64),
      );
      ctx.lineTo(
        Math.floor(Math.random() * 64),
        Math.floor(Math.random() * 64),
      );
      ctx.closePath();
      ctx.fill();
      break;
  }

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filename, buffer);
};

for (let i = 0; i < figureModelSize; i++) {
  const filename = `otherShapes/shape_${i}.png`;
  generateRandomShapeImage(filename);
}

console.log("Images generated.");
