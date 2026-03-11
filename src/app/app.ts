import { Component, inject, signal } from '@angular/core';
import { Application } from 'pixi.js';
import { Controller } from './controller';
import { Scene } from './scene';
import { Tank } from './tank';
import { ControllerState } from './types/controller-state';
import { Brick } from './brick';
import {
  COUNT_TO_UPDATE_BULLET,
  COUNT_TO_UPDATE_LOCATION,
} from './constants/count-to-update-location';
import { generateBricksHelper } from './helpers/generate-bricks';
import { hasCollisions } from './helpers/has-collisions';
import { Bullet } from './bullet';
import { getRandomDirection } from './helpers/get-random-direction';
import { getRandomTimeout } from './helpers/get-random-timeout';
import { getRandomColor } from './helpers/get-random-color';
import { TANK_SIZE_CELLS } from './constants/tank-size-cells';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('tanchiki');

  private readonly controller = inject(Controller);

  constructor() {
    (async () => {
      // Create a new application
      const app = new Application();

      // Initialize the application
      await app.init({ background: '#000000', resizeTo: window });

      // Append the application canvas to the document body
      document.body.appendChild(app.canvas);

      const width = app.screen.width;
      const height = app.screen.height;
      const sceneWidth = Math.max(width / 2, 400);

      const scene = new Scene(width / 2, height / 2, sceneWidth, height);
      const cellSize = scene.cellSize;
      const cellsAmount = scene.cellsAmount;
      const moveStep = cellSize / 2;
      const enemiesXMultiplier = 16;

      const countToUpdate = COUNT_TO_UPDATE_LOCATION;
      const countToUpdateBullet = COUNT_TO_UPDATE_BULLET;
      let count = 0;
      let countOfBulletPing = 0;
      const bricks: Brick[] = [];

      const tank = new Tank(cellSize);

      const enemies: Tank[] = [];

      let bullet: null | Bullet = null;

      app.stage.addChild(scene.container);
      app.stage.addChild(tank.container);

      tank.setX(scene.container.x + 16 * cellSize);
      tank.setY(scene.container.y + scene.container.width - tank.container.height - 1);

      function addEnemies() {
        addEnemy(enemies.length * enemiesXMultiplier);
        addEnemy(enemies.length * enemiesXMultiplier);
        addEnemy(enemies.length * enemiesXMultiplier);
      }

      function addEnemy(index: number) {
        const enemy = new Tank(cellSize, getRandomColor());
        enemies.push(enemy);
        app.stage.addChild(enemy.container);
        enemy.setX(scene.container.x + cellSize * index);
        enemy.setY(scene.container.y);
        enemy.rotateFront(getRandomDirection());
      }

      function moveEnemies() {
        if (count >= countToUpdate) {
          enemies.forEach((enemy, index) => {
            if (
              enemy.container.x + enemy.container.width >=
                scene.container.x + scene.container.width &&
              enemy.direction === 'right'
            ) {
              // right limit
              enemy.setX(scene.container.x + scene.container.width - enemy.container.width);
              enemy.rotateFront(getRandomDirection());
            }
            if (enemy.container.x <= scene.container.x && enemy.direction === 'left') {
              // left limit
              enemy.setX(scene.container.x);
              enemy.rotateFront(getRandomDirection());
            }
            if (
              enemy.container.y + enemy.container.height >=
                scene.container.y + scene.container.height &&
              enemy.direction === 'bottom'
            ) {
              // bottom limit
              enemy.setY(scene.container.y + scene.container.height - enemy.container.height);
              enemy.rotateFront(getRandomDirection());
            }
            if (enemy.container.y <= scene.container.y && enemy.direction === 'top') {
              // top limit
              enemy.setY(scene.container.y);
              enemy.rotateFront(getRandomDirection());
            }

            const hasBrickOnTheRight = bricks.find(
              (brick) => hasCollisions(enemy.container, brick.container).right,
            );

            const hasOtherEnemyOnTheRight = enemies.find((otherEnemy) => {
              if (otherEnemy.container.uid === enemy.container.uid) {
                return false;
              }
              return hasCollisions(enemy.container, otherEnemy.container).right;
            });

            const hasBrickOnTheLeft = bricks.find(
              (brick) => hasCollisions(enemy.container, brick.container).left,
            );

            const hasOtherEnemyOnTheLeft = enemies.find((otherEnemy) => {
              if (otherEnemy.container.uid === enemy.container.uid) {
                return false;
              }
              return hasCollisions(enemy.container, otherEnemy.container).left;
            });

            const hasBrickAtBottom = bricks.find(
              (brick) => hasCollisions(enemy.container, brick.container).bottom,
            );

            const hasOtherEnemyAtBottom = enemies.find((otherEnemy) => {
              if (otherEnemy.container.uid === enemy.container.uid) {
                return false;
              }
              return hasCollisions(enemy.container, otherEnemy.container).bottom;
            });

            const hasBrickAtTop = bricks.find(
              (brick) => hasCollisions(enemy.container, brick.container).top,
            );

            const hasOtherEnemyAtTop = enemies.find((otherEnemy) => {
              if (otherEnemy.container.uid === enemy.container.uid) {
                return false;
              }
              return hasCollisions(enemy.container, otherEnemy.container).top;
            });

            const hasMainTankAtTop = hasCollisions(enemy.container, tank.container).top;
            const hasMainTankAtBottom = hasCollisions(enemy.container, tank.container).bottom;
            const hasMainTankOnTheLeft = hasCollisions(enemy.container, tank.container).left;
            const hasMainTankOnTheRight = hasCollisions(enemy.container, tank.container).right;
            if (enemy.willBeRotated) {
              return;
            }

            if (enemy.direction === 'left') {
              if (!hasOtherEnemyOnTheLeft && !hasBrickOnTheLeft && !hasMainTankOnTheLeft) {
                enemy.container.x -= moveStep;
              } else {
                enemy.setWillBeRotated(true);
                setTimeout(() => {
                  enemy.setWillBeRotated(false);
                  enemy.rotateFront(getRandomDirection());
                }, getRandomTimeout());
              }
            }
            if (enemy.direction === 'right') {
              if (!hasOtherEnemyOnTheRight && !hasBrickOnTheRight && !hasMainTankOnTheRight) {
                enemy.container.x += moveStep;
              } else {
                enemy.setWillBeRotated(true);
                setTimeout(() => {
                  enemy.setWillBeRotated(false);
                  enemy.rotateFront(getRandomDirection());
                }, getRandomTimeout());
              }
            }
            if (enemy.direction === 'top') {
              if (!hasOtherEnemyAtTop && !hasBrickAtTop && !hasMainTankAtTop) {
                enemy.container.y -= moveStep;
              } else {
                enemy.setWillBeRotated(true);
                setTimeout(() => {
                  enemy.setWillBeRotated(false);
                  enemy.rotateFront(getRandomDirection());
                }, getRandomTimeout());
              }
            }
            if (enemy.direction === 'bottom') {
              if (!hasOtherEnemyAtBottom && !hasBrickAtBottom && !hasMainTankAtBottom) {
                enemy.container.y += moveStep;
              } else {
                enemy.setWillBeRotated(true);
                setTimeout(() => {
                  enemy.setWillBeRotated(false);
                  enemy.rotateFront(getRandomDirection());
                }, getRandomTimeout());
              }
            }
          });
        }
      }

      function generateBricks() {
        const generatedBricks = generateBricksHelper(
          scene.container.x,
          scene.container.y,
          cellSize,
          cellsAmount,
        );
        generatedBricks.forEach((brick) => {
          app.stage.addChild(brick.container);
          bricks.push(brick);
        });
      }

      function updateTankDirection(state: ControllerState) {
        if (state.right.pressed) {
          tank.rotateFront('right');
        } else if (state.left.pressed) {
          tank.rotateFront('left');
        } else if (state.top.pressed) {
          tank.rotateFront('top');
        } else if (state.bottom.pressed) {
          tank.rotateFront('bottom');
        }
      }

      function shootBullet(state: ControllerState) {
        if (!state.shoot.pressed) {
          return;
        }

        if (++countOfBulletPing > countToUpdateBullet) {
          countOfBulletPing = 0;
        } else {
          return;
        }

        if (bullet) {
          return;
        }

        const tankDirection = tank.direction;
        bullet = new Bullet(cellSize, tankDirection);
        app.stage.addChild(bullet.container);

        const tankPosition = { x: tank.container.x, y: tank.container.y };

        if (tankDirection === 'right') {
          bullet.container.x = tankPosition.x + tank.container.width;
          bullet.container.y =
            tankPosition.y + tank.container.height / 2 - bullet.container.height / 2;
        }

        if (tankDirection === 'left') {
          bullet.container.x = tankPosition.x;
          bullet.container.y =
            tankPosition.y + tank.container.height / 2 - bullet.container.height / 2;
        }

        if (tankDirection === 'top') {
          bullet.container.x =
            tankPosition.x + tank.container.width / 2 - bullet.container.height / 2;
          bullet.container.y = tankPosition.y;
        }

        if (tankDirection === 'bottom') {
          bullet.container.x =
            tankPosition.x + tank.container.width / 2 - bullet.container.height / 2;
          bullet.container.y = tankPosition.y + tank.container.height;
        }
      }

      function updateBulletPosition(bullet: Bullet | null) {
        if (!bullet) {
          return;
        }

        if (!bullet.container) {
          return;
        }

        const speed = 6;
        if (bullet.direction === 'right') {
          bullet.container.x += speed;
        }

        if (bullet.direction === 'left') {
          bullet.container.x -= speed;
        }

        if (bullet.direction === 'top') {
          bullet.container.y -= speed;
        }

        if (bullet.direction === 'bottom') {
          bullet.container.y += speed;
        }
      }

      function checkBulletCollision(bullet: Bullet | null) {
        const isOutOfScene =
          bullet &&
          (bullet.container.x + bullet.container.width >=
            scene.container.x + scene.container.width || // right
            bullet.container.x < scene.container.x || // left
            bullet.container.y < scene.container.y || // top
            bullet.container.y >= scene.container.y + scene.container.height);

        const hasCollisionsBricks = bricks.filter((brick) => {
          if (!bullet) {
            return false;
          }

          const xCollision =
            (bullet.container.x >= brick.container.x &&
              bullet.container.x <= brick.container.x + brick.container.width) ||
            (bullet.container.x + bullet.container.width >= brick.container.x &&
              bullet.container.x + bullet.container.width <=
                brick.container.x + brick.container.width);

          const yCollision =
            (bullet.container.y >= brick.container.y &&
              bullet.container.y <= brick.container.y + brick.container.height) ||
            (bullet.container.y + bullet.container.height >= brick.container.y &&
              bullet.container.y + bullet.container.height <=
                brick.container.y + brick.container.height);

          return xCollision && yCollision;
        });

        const hasEnemiesCollision = enemies.filter((enemy) => {
          if (!bullet) {
            return false;
          }
          const xCollision =
            bullet.container.x >= enemy.container.x &&
            bullet.container.x <= enemy.container.x + enemy.container.width;
          const yCollision =
            bullet.container.y >= enemy.container.y &&
            bullet.container.y <= enemy.container.y + enemy.container.height;

          return xCollision && yCollision;
        });

        if (hasCollisionsBricks.length || isOutOfScene || hasEnemiesCollision.length) {
          hasCollisionsBricks.forEach((brick) => {
            brick.container.removeFromParent();
            const index = bricks.findIndex(
              (allBrick) => allBrick.container.uid === brick.container.uid,
            );
            if (index !== -1) {
              bricks.splice(index, 1);
            }
          });
          hasEnemiesCollision.forEach((enemy) => {
            enemy.container.removeFromParent();
            const index = enemies.findIndex(
              (allEnemy) => allEnemy.container.uid === enemy.container.uid,
            );
            if (index !== -1) {
              enemies.splice(index, 1);
            }

            addEnemy(Math.min(enemies.length * enemiesXMultiplier, cellsAmount - TANK_SIZE_CELLS));
          });
          removeBullet(bullet);
        }
      }

      function removeBullet(localBullet: Bullet | null) {
        console.log('REMOVE BULLET');
        // add sparkle effect
        if (bullet) {
          bullet.container.removeFromParent();
          bullet = null;
        }
        if (localBullet) {
          localBullet.container.removeFromParent();
          localBullet = null;
        }
      }

      function updateTankLocation(state: ControllerState) {
        const noWallOnTheRight =
          tank.container.x <
          scene.container.x + scene.container.width - tank.container.width - moveStep;
        const noWallOnTheLeft = tank.container.x > scene.container.x;
        const noWallAtTop = tank.container.y > scene.container.y;
        const noWallAtBottom =
          tank.container.y <
          scene.container.y + scene.container.height - tank.container.height - moveStep;

        const hasBrickOnTheRight = bricks.find((brick) => {
          return hasCollisions(tank.container, brick.container).right;
        });

        const hasTankOnTheRight = enemies.find((enemy) => {
          return hasCollisions(tank.container, enemy.container).right;
        });

        const hasBrickOnTheLeft = bricks.find((brick) => {
          return hasCollisions(tank.container, brick.container).left;
        });

        const hasTankOnTheLeft = enemies.find((enemy) => {
          return hasCollisions(tank.container, enemy.container).left;
        });

        const hasBrickAtBottom = bricks.find((brick) => {
          return hasCollisions(tank.container, brick.container).bottom;
        });

        const hasTankAtBottom = enemies.find((enemy) => {
          return hasCollisions(tank.container, enemy.container).bottom;
        });

        const hasBrickAtTop = bricks.find((brick) => {
          return hasCollisions(tank.container, brick.container).top;
        });

        const hasTankAtTop = enemies.find((enemy) => {
          return hasCollisions(tank.container, enemy.container).top;
        });

        if (state.right.pressed) {
          if (noWallOnTheRight && !hasBrickOnTheRight && !hasTankOnTheRight) {
            tank.container.x += moveStep;
          }
        } else if (state.left.pressed) {
          if (noWallOnTheLeft && !hasBrickOnTheLeft && !hasTankOnTheLeft) {
            tank.container.x -= moveStep;
          }
        } else if (state.top.pressed) {
          if (noWallAtTop && !hasBrickAtTop && !hasTankAtTop) {
            tank.container.y -= moveStep;
          }
        } else if (state.bottom.pressed) {
          if (noWallAtBottom && !hasBrickAtBottom && !hasTankAtBottom) {
            tank.container.y += moveStep;
          }
        }
      }

      generateBricks();
      addEnemies();

      app.ticker.add((time) => {
        const state = this.controller.stateExposed();

        function moveTick() {
          if (++count >= countToUpdate) {
            moveEnemies();
            updateTankLocation(state);
            count = 0;
          }
        }

        moveTick();
        updateTankDirection(state);
        shootBullet(state);
        checkBulletCollision(bullet);
        updateBulletPosition(bullet);
      });
    })();
  }
}
