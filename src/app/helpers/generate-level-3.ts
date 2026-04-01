import { Brick } from '../brick';
import { LEVEL_3 } from '../constants/levels/level-3';
import { generateBricks } from './generate-bricks';

export function generateLevel3(sceneX: number, sceneY: number, cellSize: number): Brick[] {
  return generateBricks(sceneX, sceneY, cellSize, LEVEL_3);
}
