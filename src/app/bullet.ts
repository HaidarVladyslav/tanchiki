import { Container, Graphics } from 'pixi.js';
import { Direction } from './types/direction';

export class Bullet {
  public container = new Container();

  public direction: Direction;
  constructor(cellSize: number, direction: Direction) {
    this.direction = direction;
    const rect = new Graphics().rect(0, 0, cellSize, cellSize).fill({ color: 'yellow' });
    this.container.addChild(rect);
  }
}
