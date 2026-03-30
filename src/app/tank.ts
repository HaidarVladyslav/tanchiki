import { ColorSource, Container, Graphics } from 'pixi.js';
import { TANK_SIZE_CELLS } from './constants/tank-size-cells';
import { Direction } from './types/direction';
import { Bullet } from './bullet';
import { CharacterColor } from './types/character-color';
import { BULLET_COLOR } from './constants/bullet-color';

export class Tank {
  public container: Container;
  public front: Graphics;

  private x: number = 0;
  private y: number = 0;
  private tankSize: number;
  private rect: Graphics = new Graphics();
  private color: ColorSource;

  public direction: Direction = 'top';
  public willBeRotated: boolean = false;
  public willHaveBullet: boolean = false;
  public bullet: Bullet | null = null;
  public canBeKilled: boolean = true;
  public colorName: string;

  constructor(cellSize: number, color: CharacterColor) {
    this.container = new Container();
    this.tankSize = cellSize * TANK_SIZE_CELLS;
    this.colorName = color.name;
    this.color = color.color;
    this.setRect();
    this.front = new Graphics()
      .rect(0, 0, this.rect.width / 6, this.rect.width / 6)
      .fill({ color: BULLET_COLOR });

    this.rect.addChild(this.front);
    this.container.addChild(this.rect);

    this.rotateFront(this.direction);
  }

  public setX(value: number): void {
    this.x = value;
    this.container.x = value;
  }

  public setY(value: number): void {
    this.y = value;
    this.container.y = value;
  }

  public rotateFront(direction: Direction): void {
    this.direction = direction;
    if (direction === 'top') {
      this.front.x = this.tankSize / 3 + this.front.width / 2;
      this.front.y = 0;
    }

    if (direction === 'bottom') {
      this.front.x = this.tankSize / 3 + this.front.width / 2;
      this.front.y = this.tankSize - this.front.height;
    }

    if (direction === 'left') {
      this.front.x = 0;
      this.front.y = this.tankSize / 3 + this.front.width / 2;
    }

    if (direction === 'right') {
      this.front.x = this.tankSize - this.front.width;
      this.front.y = this.tankSize / 3 + this.front.width / 2;
    }
  }

  public setWillBeRotated(value: boolean): void {
    this.willBeRotated = value;
  }

  public setBullet(bullet: Bullet | null): void {
    this.bullet = bullet;
  }

  public setWillHaveBullet(value: boolean): void {
    this.willHaveBullet = value;
  }

  public setCanBeKilled(value: boolean): void {
    this.canBeKilled = value;
    this.rect.alpha = value ? 1 : 0.5;
  }

  private setRect(): void {
    this.rect = new Graphics()
      .rect(0, 0, this.tankSize - 1, this.tankSize - 1)
      .fill({ color: this.color })
      .stroke({ color: 0x05faf7 });
  }
}
