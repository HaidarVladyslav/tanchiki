import { Brick } from '../brick';
import { LEVEL_2 } from '../constants/levels/level-2';
import { generateBricks } from './generate-bricks';

export function generateLevel2(sceneX: number, sceneY: number, cellSize: number): Brick[] {
  return generateBricks(sceneX, sceneY, cellSize, LEVEL_2);
}
