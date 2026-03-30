import { Brick } from '../brick';
import { LEVEL_4 } from '../constants/levels/level-4';
import { generateBricks } from './generate-bricks';

export function generateLevel4(sceneX: number, sceneY: number, cellSize: number): Brick[] {
  return generateBricks(sceneX, sceneY, cellSize, LEVEL_4);
}
