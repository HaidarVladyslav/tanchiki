import { Container, Graphics } from 'pixi.js';

export class Brick {
  public container = new Container();
  private x: number = 0;
  private y: number = 0;

  constructor(cellSize: number) {
    const rect = new Graphics()
      .rect(0, 0, cellSize, cellSize)
      .fill({ color: 'red' })
      // .stroke({ color: 'green' });
    this.container.addChild(rect);
  }

  public setX(value: number): void {
    this.container.x = value;
    this.x = value;
  }

  public setY(value: number): void {
    this.container.y = value;
    this.y = value;
  }
}
