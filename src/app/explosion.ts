import { Application, Container, Graphics } from 'pixi.js';
import { BULLET_COLOR } from './constants/bullet-color';

const AMOUNT = 6;
const SIZE = 4;
const MILLISECINDS_TO_BE_REMOVED = 200;
const PARTICLES_MOVEMENT_SPEED_MILTIPLIER = 6;

export class Explosion {
  private particles: Graphics[] = [];
  private container = new Container();

  public isRemoved = false;

  constructor(app: Application, x: number, y: number) {
    for (let i = 0; i < AMOUNT; i++) {
      const particle = new Graphics().roundRect(0, 0, SIZE, SIZE, 99).fill({ color: BULLET_COLOR });
      this.particles.push(particle);
      this.container.addChild(particle);
    }
    this.container.x = x;
    this.container.y = y;
    app.stage.addChild(this.container);

    setTimeout(() => {
      this.container.removeFromParent();
      this.isRemoved = true;
    }, MILLISECINDS_TO_BE_REMOVED);
  }

  public moveParticles() {
    this.particles.forEach((particle) => {
      const sign = Math.random() > 0.5 ? 1 : -1;
      particle.x = particle.x + Math.random() * sign * PARTICLES_MOVEMENT_SPEED_MILTIPLIER;
      particle.y = particle.y + Math.random() * sign * PARTICLES_MOVEMENT_SPEED_MILTIPLIER;
    });
  }
}
