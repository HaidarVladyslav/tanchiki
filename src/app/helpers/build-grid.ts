import { Graphics } from 'pixi.js';
import { CELLS_AMOUNT } from '../constants/cell-params';

export function buildGrid(graphics: Graphics, screenWidth: number, screenHeight: number) {
  // 1340
  const cellSize = Math.floor(screenWidth / CELLS_AMOUNT);
  const width = cellSize * CELLS_AMOUNT;
  for (let i = 0; i <= CELLS_AMOUNT; i++) {
    graphics.moveTo(i * cellSize, 0).lineTo(i * cellSize, width);
  }
  for (let i = 0; i <= CELLS_AMOUNT; i++) {
    graphics.moveTo(0, i * cellSize).lineTo(width, i * cellSize);
  }

  return { graphics, cellSize, cellsAmount: CELLS_AMOUNT, width };
}
