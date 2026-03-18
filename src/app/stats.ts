import { Application, Container, Graphics, Sprite, Text, Texture } from 'pixi.js';
import { ENEMIES_COLORS } from './constants/colors';
import { CharacterColor } from './types/character-color';
import { LIVES_AMOUNT } from './constants/lives-amount';
import { RECT_WIDTH, RECT_HEIGHT, GAP_BETWEEN_HEARTS } from './constants/stats-settings';

export class Stats {
  private state = {
    lives: LIVES_AMOUNT,
    enemies: ENEMIES_COLORS.reduce(
      (acc, current) => {
        acc[current.name] = {
          color: current.color,
          value: 0,
        };
        return acc;
      },
      {} as {
        [key: CharacterColor['name']]: {
          color: CharacterColor['color'];
          value: number;
        };
      },
    ),
  };

  private container: Container = new Container();
  private rect: Graphics;
  private livesContainer: Graphics;
  private heart: Texture;

  public get lives(): number {
    return this.state.lives;
  }

  constructor(app: Application, svgHeart: Texture) {
    this.rect = new Graphics().rect(0, 0, 100, 100).fill({ color: 'red' });
    this.livesContainer = new Graphics()
      .rect(0, 0, RECT_WIDTH, RECT_HEIGHT)
      .stroke({ color: '#fff', width: 2 })
      .fill({ color: '#ffffff' });
    this.heart = svgHeart;
    this.reRender();
    this.container.addChild(this.rect);
    app.stage.addChild(this.container);
  }

  public updateEnemiesKilled(key: CharacterColor['name']): void {
    this.state.enemies[key].value++;
    this.reRender();
  }

  public reduceLives(): void {
    this.state.lives--;
    this.reRender();
  }

  private reRender() {
    this.livesContainer.destroy();
    this.rect.clear();

    const enemiesData = Object.entries(this.state.enemies).forEach((element, index) => {
      const text = new Text({
        text: element[1].value,
        style: {
          fill: '#000',
          fontSize: 28,
          fontFamily: 'MyFont',
        },
        anchor: 0.5,
      });
      const subRect = new Graphics()
        .rect(0, 0, RECT_WIDTH, RECT_HEIGHT)
        .fill(element[1].color)
        .stroke({ color: '#ffffff', width: 2 });
      subRect.y = index * RECT_HEIGHT;
      this.rect.addChild(subRect);
      text.x = subRect.x + subRect.width / 2;
      text.y = subRect.y + subRect.height / 2;
      this.rect.addChild(text);
    });

    this.livesContainer = new Graphics()
      .rect(0, 0, RECT_WIDTH, RECT_HEIGHT)
      .stroke({ color: '#fff', width: 2 })
      .fill({ color: '#ffffff' });

    this.livesContainer.y = this.rect.height + this.livesContainer.height;

    for (let i = 0; i < this.state.lives; i++) {
      const heart = new Sprite({
        texture: this.heart,
        width: this.livesContainer.width / LIVES_AMOUNT - GAP_BETWEEN_HEARTS,
        height: this.livesContainer.height - GAP_BETWEEN_HEARTS,
      });
      heart.x =
        (this.livesContainer.children.at(-1)?.x || 0) +
        (this.livesContainer.children.at(-1)?.width || 0) +
        GAP_BETWEEN_HEARTS * (i === 0 ? 0.5 : 1);
      heart.y = this.livesContainer.height / 2 - heart.height / 2;
      this.livesContainer.addChild(heart);
    }

    this.rect.addChild(this.livesContainer);
  }
}
