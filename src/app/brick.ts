import { Container, Graphics } from 'pixi.js';
import {
  DEFAULT_BRICK_COLOR,
  DEFAULT_BRICK_BORDER_COLOR,
  STONE_BRICK_COLOR,
} from './constants/brick-colors';
import { BRICK_RECT_GAPS_FROM_SIDES } from './constants/brick-rect-gaps-from-sides';

export class Brick {
  private rect: Graphics = new Graphics();
  private cellSize: number;
  public container = new Container();
  public canBeDestroyed: boolean;

  constructor(cellSize: number, canBeDestroyed: boolean = true) {
    this.canBeDestroyed = canBeDestroyed;
    this.cellSize = cellSize;
    this.generateRect();
    this.container.addChild(this.rect);
  }

  public setX(value: number): void {
    this.container.x = value;
  }

  public setY(value: number): void {
    this.container.y = value;
  }

  private generateRect(): void {
    const color = this.canBeDestroyed ? DEFAULT_BRICK_COLOR : STONE_BRICK_COLOR;
    this.rect = new Graphics()
      .rect(
        0,
        0,
        this.cellSize - BRICK_RECT_GAPS_FROM_SIDES,
        this.cellSize - BRICK_RECT_GAPS_FROM_SIDES,
      )
      .fill({ color })
      .stroke({ color: DEFAULT_BRICK_BORDER_COLOR });
  }
}
