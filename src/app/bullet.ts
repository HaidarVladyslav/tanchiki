import { Container, Graphics } from 'pixi.js';
import { Direction } from './types/direction';
import { BULLET_COLOR } from './constants/bullet-color';

export class Bullet {
  public container = new Container();

  public direction: Direction;
  constructor(cellSize: number, direction: Direction) {
    this.direction = direction;
    const rect = new Graphics().rect(0, 0, cellSize, cellSize).fill({ color: BULLET_COLOR });
    this.container.addChild(rect);
  }
}
