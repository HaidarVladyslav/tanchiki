import { Brick } from '../brick';
import { LEVEL_1 } from '../constants/levels/level-1';
import { generateBricks } from './generate-bricks';

export function generateLevel1(sceneX: number, sceneY: number, cellSize: number): Brick[] {
  return generateBricks(sceneX, sceneY, cellSize, LEVEL_1);
}
