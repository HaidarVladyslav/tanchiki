import { Container, Graphics } from 'pixi.js';
import { buildGrid } from './helpers/build-grid';

export class Scene {
  private width: number;
  private height: number;
  private x: number;
  private y: number;
  public container: Container;
  public cellSize: number;
  public cellsAmount: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.width = width;
    this.height = height;
    this.x = x - this.width / 2;
    this.y = height / 4;

    this.container = new Container();
    this.container.x = this.x;
    this.container.y = (height - width) / 2;

    const gridParams = buildGrid(new Graphics(), width);
    const gridPixel = gridParams.graphics.stroke({
      color: 0xffffff,
      pixelLine: false,
      width: 2,
    });
    this.cellSize = gridParams.cellSize;
    this.cellsAmount = gridParams.cellsAmount;

    this.container.addChild(gridPixel);
  }
}
