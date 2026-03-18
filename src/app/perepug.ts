import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { TANK_SIZE_CELLS } from './constants/tank-size-cells';

export class Perepug {
  public container = new Container();
  constructor(cellSize: number, texture: Texture) {
    const rect = new Graphics()
      .rect(0, 0, TANK_SIZE_CELLS * cellSize, TANK_SIZE_CELLS * cellSize)
      .fill({ color: 'lightskyblue' })
      .stroke({ color: 0xffffff, width: 1 });

    const sprite = new Sprite({
      texture: texture,
      width: TANK_SIZE_CELLS * cellSize,
      height: TANK_SIZE_CELLS * cellSize,
    });
    this.container.addChild(rect, sprite);
  }
}
