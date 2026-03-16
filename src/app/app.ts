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
import { BULLET_SPEED } from './constants/bullet-speed';
import { MILLISECONDS_TO_BE_UNKILLABLE } from './constants/time-to-be-unkillable';

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
      const bulletSpeed = BULLET_SPEED;
      let count = 0;
      let countOfBulletPing = 0;
      const bricks: Brick[] = [];

      let mainTank: Tank | null = null;

      const enemies: Tank[] = [];

      let bullet: null | Bullet = null;

      app.stage.addChild(scene.container);

      function addMainTank() {
        mainTank = new Tank(cellSize);
        app.stage.addChild(mainTank.container);

        mainTank.setX(scene.container.x + 16 * cellSize);
        mainTank.setY(scene.container.y + scene.container.width - mainTank.container.height - 1);
        mainTank.setCanBeKilled(false);

        setTimeout(() => {
          if (mainTank) {
            mainTank.setCanBeKilled(true);
          }
        }, MILLISECONDS_TO_BE_UNKILLABLE);
      }

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

            const hasMainTankAtTop =
              mainTank && hasCollisions(enemy.container, mainTank.container).top;
            const hasMainTankAtBottom =
              mainTank && hasCollisions(enemy.container, mainTank.container).bottom;
            const hasMainTankOnTheLeft =
              mainTank && hasCollisions(enemy.container, mainTank.container).left;
            const hasMainTankOnTheRight =
              mainTank && hasCollisions(enemy.container, mainTank.container).right;

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

      function shootFromEnemies() {
        enemies.forEach((enemy, index) => {
          if (enemy.bullet) {
            updateBulletPosition(enemy.bullet);
            checkEnemyBulletCollision(enemy, enemy.bullet);
            return;
          }

          if (enemy.willHaveBullet) {
            return;
          }

          enemy.setWillHaveBullet(true);

          const enemyDirection = enemy.direction;
          const bullet = new Bullet(cellSize, enemyDirection);
          app.stage.addChild(bullet.container);
          enemy.setBullet(bullet);

          enemy.setWillHaveBullet(false);

          const enemyPosition = { x: enemy.container.x, y: enemy.container.y };

          if (enemyDirection === 'right') {
            bullet.container.x = enemyPosition.x + enemy.container.width;
            bullet.container.y =
              enemyPosition.y + enemy.container.height / 2 - bullet.container.height / 2;
          }

          if (enemyDirection === 'left') {
            bullet.container.x = enemyPosition.x;
            bullet.container.y =
              enemyPosition.y + enemy.container.height / 2 - bullet.container.height / 2;
          }

          if (enemyDirection === 'top') {
            bullet.container.x =
              enemyPosition.x + enemy.container.width / 2 - bullet.container.height / 2;
            bullet.container.y = enemyPosition.y;
          }

          if (enemyDirection === 'bottom') {
            bullet.container.x =
              enemyPosition.x + enemy.container.width / 2 - bullet.container.height / 2;
            bullet.container.y = enemyPosition.y + enemy.container.height;
          }
        });
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
        if (!mainTank) {
          return;
        }
        if (state.right.pressed) {
          mainTank.rotateFront('right');
        } else if (state.left.pressed) {
          mainTank.rotateFront('left');
        } else if (state.top.pressed) {
          mainTank.rotateFront('top');
        } else if (state.bottom.pressed) {
          mainTank.rotateFront('bottom');
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

        if (!mainTank) {
          return;
        }

        const tankDirection = mainTank.direction;
        bullet = new Bullet(cellSize, tankDirection);
        app.stage.addChild(bullet.container);

        const tankPosition = { x: mainTank.container.x, y: mainTank.container.y };

        if (tankDirection === 'right') {
          bullet.container.x = tankPosition.x + mainTank.container.width;
          bullet.container.y =
            tankPosition.y + mainTank.container.height / 2 - bullet.container.height / 2;
        }

        if (tankDirection === 'left') {
          bullet.container.x = tankPosition.x;
          bullet.container.y =
            tankPosition.y + mainTank.container.height / 2 - bullet.container.height / 2;
        }

        if (tankDirection === 'top') {
          bullet.container.x =
            tankPosition.x + mainTank.container.width / 2 - bullet.container.height / 2;
          bullet.container.y = tankPosition.y;
        }

        if (tankDirection === 'bottom') {
          bullet.container.x =
            tankPosition.x + mainTank.container.width / 2 - bullet.container.height / 2;
          bullet.container.y = tankPosition.y + mainTank.container.height;
        }
      }

      function updateBulletPosition(bullet: Bullet | null) {
        if (!bullet) {
          return;
        }

        if (!bullet.container) {
          return;
        }

        if (bullet.direction === 'right') {
          bullet.container.x += bulletSpeed;
        }

        if (bullet.direction === 'left') {
          bullet.container.x -= bulletSpeed;
        }

        if (bullet.direction === 'top') {
          bullet.container.y -= bulletSpeed;
        }

        if (bullet.direction === 'bottom') {
          bullet.container.y += bulletSpeed;
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
            const index = enemies.findIndex(
              (allEnemy) => allEnemy.container.uid === enemy.container.uid,
            );

            if (index !== -1) {
              enemies.splice(index, 1);
            }

            removeLocalEnemyBullet(enemy, enemy.bullet);
            enemy.container.removeFromParent();
            addEnemy(Math.min(enemies.length * enemiesXMultiplier, cellsAmount - TANK_SIZE_CELLS));
          });
          removeBullet(bullet);
        }
      }

      function checkEnemyBulletCollision(enemy: Tank, bullet: Bullet | null) {
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

        let hasMainTankCollision: boolean = false;

        if (bullet) {
          hasMainTankCollision =
            !!mainTank &&
            (hasCollisions(bullet.container, mainTank.container).left ||
              hasCollisions(bullet.container, mainTank.container).right ||
              hasCollisions(bullet.container, mainTank.container).top ||
              hasCollisions(bullet.container, mainTank.container).bottom);
        }

        if (hasCollisionsBricks.length || isOutOfScene || hasMainTankCollision) {
          hasCollisionsBricks.forEach((brick) => {
            brick.container.removeFromParent();
            const index = bricks.findIndex(
              (allBrick) => allBrick.container.uid === brick.container.uid,
            );
            if (index !== -1) {
              bricks.splice(index, 1);
            }
          });

          if (hasMainTankCollision && mainTank && mainTank.canBeKilled) {
            removeBullet(mainTank.bullet);
            mainTank.container.removeFromParent();
            mainTank = null;
          }

          if (hasMainTankCollision && mainTank && !mainTank.canBeKilled) {
            return;
          }

          removeLocalEnemyBullet(enemy, bullet);
        }
      }

      function removeBullet(localBullet: Bullet | null) {
        console.log('REMOVE BULLET');
        // add sparkle effect

        setTimeout(() => {
          if (bullet) {
            bullet.container.removeFromParent();
            bullet = null;
          }
          if (localBullet) {
            localBullet.container.removeFromParent();
            localBullet = null;
          }
        }, 50);
      }

      function removeLocalEnemyBullet(enemy: Tank, localBullet: Bullet | null) {
        console.log('REMOVE BULLET');
        // add sparkle effect

        setTimeout(() => {
          if (enemy.bullet) {
            enemy.bullet.container.removeFromParent();
            enemy.setBullet(null);
          }
          if (localBullet) {
            localBullet.container.removeFromParent();
            if (enemy && enemy.bullet) {
              enemy.setBullet(null);
            }
          }
        }, 50);
      }

      function updateTankLocation(state: ControllerState) {
        if (!mainTank) {
          return;
        }

        const noWallOnTheRight =
          mainTank.container.x <
          scene.container.x + scene.container.width - mainTank.container.width - moveStep;
        const noWallOnTheLeft = mainTank.container.x > scene.container.x;
        const noWallAtTop = mainTank.container.y > scene.container.y;
        const noWallAtBottom =
          mainTank.container.y <
          scene.container.y + scene.container.height - mainTank.container.height - moveStep;

        const hasBrickOnTheRight = bricks.find((brick) => {
          return !!mainTank && hasCollisions(mainTank.container, brick.container).right;
        });

        const hasTankOnTheRight = enemies.find((enemy) => {
          return !!mainTank && hasCollisions(mainTank.container, enemy.container).right;
        });

        const hasBrickOnTheLeft = bricks.find((brick) => {
          return !!mainTank && hasCollisions(mainTank.container, brick.container).left;
        });

        const hasTankOnTheLeft = enemies.find((enemy) => {
          return !!mainTank && hasCollisions(mainTank.container, enemy.container).left;
        });

        const hasBrickAtBottom = bricks.find((brick) => {
          return !!mainTank && hasCollisions(mainTank.container, brick.container).bottom;
        });

        const hasTankAtBottom = enemies.find((enemy) => {
          return !!mainTank && hasCollisions(mainTank.container, enemy.container).bottom;
        });

        const hasBrickAtTop = bricks.find((brick) => {
          return !!mainTank && hasCollisions(mainTank.container, brick.container).top;
        });

        const hasTankAtTop = enemies.find((enemy) => {
          return !!mainTank && hasCollisions(mainTank.container, enemy.container).top;
        });

        if (state.right.pressed) {
          if (noWallOnTheRight && !hasBrickOnTheRight && !hasTankOnTheRight) {
            mainTank.container.x += moveStep;
          }
        } else if (state.left.pressed) {
          if (noWallOnTheLeft && !hasBrickOnTheLeft && !hasTankOnTheLeft) {
            mainTank.container.x -= moveStep;
          }
        } else if (state.top.pressed) {
          if (noWallAtTop && !hasBrickAtTop && !hasTankAtTop) {
            mainTank.container.y -= moveStep;
          }
        } else if (state.bottom.pressed) {
          if (noWallAtBottom && !hasBrickAtBottom && !hasTankAtBottom) {
            mainTank.container.y += moveStep;
          }
        }
      }

      generateBricks();
      addMainTank();
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
        shootFromEnemies();
      });
    })();
  }
}
