import { Brick } from '../brick';
import { LevelConfig } from '../types/level-config';

export function generateBricks(
  sceneX: number,
  sceneY: number,
  cellSize: number,
  bricksBlocksConfigurations: LevelConfig[],
): Brick[] {
  const bricks: Brick[] = [];

  const leftCellGap = 1;

  for (let brickIndex = 0; brickIndex < bricksBlocksConfigurations.length; brickIndex++) {
    const brickConfig = bricksBlocksConfigurations[brickIndex];
    for (let i = brickConfig.xStart; i < brickConfig.xStart + brickConfig.xCellsAmount; i++) {
      for (let j = brickConfig.yStart; j < brickConfig.yStart + brickConfig.yCellsAmount; j++) {
        const brick = new Brick(
          cellSize,
          brickConfig.type === 'default'
            ? undefined
            : {
                canBeDestroyed: brickConfig.type !== 'stone',
                canBePassedThrough: brickConfig.type === 'gross',
                canShootThrough: brickConfig.type === 'water',
              },
        );
        brick.setX(sceneX + (cellSize * i + leftCellGap));
        brick.setY(sceneY + (cellSize * j + leftCellGap));
        bricks.push(brick);
      }
    }
  }

  return bricks;
}
