import { createCanvas } from "canvas";
import fs from "fs";
import { figureModelSize } from "./utils.js";

const generateSquareImage = (size: number, color: string, filename: string) => {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext("2d");

  // White background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 64, 64);

  // Draw the square
  const padding = (64 - size) / 2; // Center the square
  ctx.fillStyle = color;
  ctx.fillRect(padding, padding, size, size);

  // Save to file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(filename, buffer);
};

const getRandomDarkColor = () => {
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);
  return `rgb(${r}, ${g}, ${b})`;
};

for (let i = 0; i < figureModelSize; i++) {
  const size = Math.floor(Math.random() * (56 - 16 + 1)) + 16;
  const color = getRandomDarkColor();
  const filename = `squares/square_${i}.png`;
  generateSquareImage(size, color, filename);
}
