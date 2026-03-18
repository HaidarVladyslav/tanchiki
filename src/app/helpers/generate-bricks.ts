import { Brick } from '../brick';

export function generateBricksHelper(
  sceneX: number,
  sceneY: number,
  cellSize: number,
  cellsAmount: number,
): Brick[] {
  const bricks: Brick[] = [];

  const palka1XStart = 4;
  const palka2XStart = 12;
  const palka3XStart = 36;
  const palka4XStart = 44;
  const palkaCenterLeftXStart = 20;
  const palkaCenterRightXStart = 28;
  const palkaLeftCenterXStart = 8;
  const palkaRightCenterXStart = 36;
  const palkaCenterMiddleXStart = 24;
  const palkaLeftLeftCenterXStart = 0;
  const palkaRightRightCenterXStart = 48;
  const baseXStart = 22;
  const baseRightXStart = 28;

  const palkaWidthBlocksAmount = 4;
  const palkaTopYStart = 4;
  const palkaTopHeightBlocksAmount = 18;
  const palkaBottomYStart = 34;
  const palkaBottomHeightBlocksAmount = 14;
  const palkaCenterLeftHeightBlocksAmount = 14;
  const palkaCenterMiddleYStart = 22;
  const palkaBottomMiddleYStart = 30;
  const palkaCenterMiddleHeightBlocksAmount = 4;
  const palkaMiddleMiddleHeightBlocksAmount = 12;
  const palkaRightCenterMiddleHeightBlocksAmount = 4;
  const palkaRightCenterMiddleWidthBlocksAmount = 8;
  const palkaLeftCenterMiddleYStart = 26;
  const palkaCenterMiddleWidthBlocksAmount = 4;
  const palkaCenterMiddleCenterYStart = 32;
  const palkaLeftLeftYStart = 26;
  const palkaLeftLeftWidthBlocksAmount = 4;
  const palkaLeftLeftHeightBlocksAmount = 2;
  const baseTopYStart = 46;
  const baseLeftYStart = 48;
  const baseTopWidthBlocksAmount = 8;
  const baseTopHeightBlocksAmount = 2;
  const baseLeftWidthBlocksAmount = 2;
  const baseLeftHeightBlocksAmount = 4;

  const leftCellGap = 1;

  // palka 1
  for (let i = palka1XStart; i < palka1XStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaTopYStart; j < palkaTopYStart + palkaTopHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 2
  for (let i = palka2XStart; i < palka2XStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaTopYStart; j < palkaTopYStart + palkaTopHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 3
  for (let i = palka3XStart; i < palka3XStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaTopYStart; j < palkaTopYStart + palkaTopHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 4
  for (let i = palka4XStart; i < palka4XStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaTopYStart; j < palkaTopYStart + palkaTopHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 5
  for (let i = palka1XStart; i < palka1XStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaBottomYStart; j < palkaBottomYStart + palkaBottomHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 6
  for (let i = palka2XStart; i < palka2XStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaBottomYStart; j < palkaBottomYStart + palkaBottomHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 7
  for (let i = palka3XStart; i < palka3XStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaBottomYStart; j < palkaBottomYStart + palkaBottomHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 8
  for (let i = palka4XStart; i < palka4XStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaBottomYStart; j < palkaBottomYStart + palkaBottomHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 9 (center - top - left)
  for (let i = palkaCenterLeftXStart; i < palkaCenterLeftXStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaTopYStart; j < palkaTopYStart + palkaCenterLeftHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 10 (center - top - right)
  for (let i = palkaCenterRightXStart; i < palkaCenterRightXStart + palkaWidthBlocksAmount; i++) {
    for (let j = palkaTopYStart; j < palkaTopYStart + palkaCenterLeftHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 11 (center - middle - left)
  for (let i = palkaCenterLeftXStart; i < palkaCenterLeftXStart + palkaWidthBlocksAmount; i++) {
    for (
      let j = palkaCenterMiddleYStart;
      j < palkaCenterMiddleYStart + palkaCenterMiddleHeightBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 12 (center - middle - right)
  for (let i = palkaCenterRightXStart; i < palkaCenterRightXStart + palkaWidthBlocksAmount; i++) {
    for (
      let j = palkaCenterMiddleYStart;
      j < palkaCenterMiddleYStart + palkaCenterMiddleHeightBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 13 (center - bottom - left)
  for (let i = palkaCenterLeftXStart; i < palkaCenterLeftXStart + palkaWidthBlocksAmount; i++) {
    for (
      let j = palkaBottomMiddleYStart;
      j < palkaBottomMiddleYStart + palkaMiddleMiddleHeightBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 14 (center - bottom - right)
  for (let i = palkaCenterRightXStart; i < palkaCenterRightXStart + palkaWidthBlocksAmount; i++) {
    for (
      let j = palkaBottomMiddleYStart;
      j < palkaBottomMiddleYStart + palkaMiddleMiddleHeightBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 15 (left - center - middle)

  palkaRightCenterMiddleHeightBlocksAmount;
  for (
    let i = palkaLeftCenterXStart;
    i < palkaLeftCenterXStart + palkaRightCenterMiddleWidthBlocksAmount;
    i++
  ) {
    for (
      let j = palkaLeftCenterMiddleYStart;
      j < palkaLeftCenterMiddleYStart + palkaRightCenterMiddleHeightBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 16 (right - center - middle)
  for (
    let i = palkaRightCenterXStart;
    i < palkaRightCenterXStart + palkaRightCenterMiddleWidthBlocksAmount;
    i++
  ) {
    for (
      let j = palkaLeftCenterMiddleYStart;
      j < palkaLeftCenterMiddleYStart + palkaRightCenterMiddleHeightBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 17 ( center - middle)
  for (
    let i = palkaCenterMiddleXStart;
    i < palkaCenterMiddleXStart + palkaCenterMiddleWidthBlocksAmount;
    i++
  ) {
    for (
      let j = palkaCenterMiddleCenterYStart;
      j < palkaCenterMiddleCenterYStart + palkaCenterMiddleWidthBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 18 ( left - left  middle)
  for (
    let i = palkaLeftLeftCenterXStart;
    i < palkaLeftLeftCenterXStart + palkaLeftLeftWidthBlocksAmount;
    i++
  ) {
    for (
      let j = palkaLeftLeftYStart;
      j < palkaLeftLeftYStart + palkaLeftLeftHeightBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // palka 19 ( right - right  middle)
  for (
    let i = palkaRightRightCenterXStart;
    i < palkaRightRightCenterXStart + palkaLeftLeftWidthBlocksAmount;
    i++
  ) {
    for (
      let j = palkaLeftLeftYStart;
      j < palkaLeftLeftYStart + palkaLeftLeftHeightBlocksAmount;
      j++
    ) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // base

  // base top
  for (let i = baseXStart; i < baseXStart + baseTopWidthBlocksAmount; i++) {
    for (let j = baseTopYStart; j < baseTopYStart + baseTopHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // base left
  for (let i = baseXStart; i < baseXStart + baseLeftWidthBlocksAmount; i++) {
    for (let j = baseLeftYStart; j < baseLeftYStart + baseLeftHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  // base right
  for (let i = baseRightXStart; i < baseRightXStart + baseLeftWidthBlocksAmount; i++) {
    for (let j = baseLeftYStart; j < baseLeftYStart + baseLeftHeightBlocksAmount; j++) {
      const brick = new Brick(cellSize);
      brick.setX(sceneX + (cellSize * i + leftCellGap));
      brick.setY(sceneY + (cellSize * j + leftCellGap));
      bricks.push(brick);
    }
  }

  return bricks;
}
