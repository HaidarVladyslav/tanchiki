import { Container, Graphics, Sprite, Texture } from 'pixi.js';
import { TANK_SIZE_CELLS } from './constants/tank-size-cells';

export class Perepug {
  public container = new Container();
  private sprite: Sprite;
  constructor(cellSize: number, texture: Texture) {
    const rect = new Graphics()
      .rect(0, 0, TANK_SIZE_CELLS * cellSize, TANK_SIZE_CELLS * cellSize)
      .fill({ color: 'lightskyblue' })
      .stroke({ color: 0xffffff, width: 1 });

    this.sprite = new Sprite({
      texture: texture,
      width: TANK_SIZE_CELLS * cellSize,
      height: TANK_SIZE_CELLS * cellSize,
    });
    this.container.addChild(rect, this.sprite);
  }

  public scaleConstantly(): void {
    let i = 0;
    let interval = setInterval(() => {
      if (++i >= 10) {
        clearInterval(interval);
        return;
      }
      this.sprite.scale.set(this.sprite.scale.x * 1.2, this.sprite.scale.y * 1.2);
    }, 50);
  }
}
