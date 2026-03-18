import { Component, inject, signal } from '@angular/core';
import { Application, Assets } from 'pixi.js';
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
import { BULLET_REAPPEAR_SPEED, BULLET_SPEED } from './constants/bullet-speed';
import { MILLISECONDS_TO_BE_UNKILLABLE } from './constants/time-to-be-unkillable';
import { MILLISECONDS_TIME_TANK_REAPPEARANCE } from './constants/time-tank-reappeareance';
import { Explosion } from './explosion';
import { MAIN_TANK_SETTINGS } from './constants/main-tank-settings';
import { Stats } from './stats';
import { Perepug } from './perepug';

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

      const svgHeart = await Assets.load('heart.svg');
      const perepugTexture = await Assets.load('perepug-dendy-full.png');

      const width = app.screen.width;
      const height = app.screen.height;
      const sceneWidth = Math.max(width / 2, 400);

      const scene = new Scene(width / 2, height / 2, sceneWidth, height);
      const cellSize = scene.cellSize;
      const cellsAmount = scene.cellsAmount;
      const moveStep = cellSize / 2;

      const countToUpdate = COUNT_TO_UPDATE_LOCATION;
      const countToUpdateBullet = COUNT_TO_UPDATE_BULLET;
      const bulletSpeed = BULLET_SPEED;
      let count = 0;
      let countOfBulletPing = 0;
      let isGameEnded: boolean = false;
      const bricks: Brick[] = [];
      const explosions: Explosion[] = [];

      let mainTank: Tank | null = null;
      let mainBullet: null | Bullet = null;
      let perepug: Perepug | null = null;
      let isPerepugDead: boolean = false;
      let previouslyGeneratedEnemyXPosition = 0;

      const enemies: Tank[] = [];

      app.stage.addChild(scene.container);

      const stats = new Stats(app, svgHeart);

      function addMainTank() {
        mainTank = new Tank(cellSize, MAIN_TANK_SETTINGS.color);
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
        addEnemy();
        addEnemy();
        addEnemy();
        addEnemy();
      }

      function addEnemy() {
        const enemy = new Tank(cellSize, getRandomColor());
        enemies.push(enemy);
        app.stage.addChild(enemy.container);
        enemy.setX(scene.container.x + cellSize * previouslyGeneratedEnemyXPosition);
        enemy.setY(scene.container.y);
        const newX = Math.floor(Math.random() * cellsAmount);
        previouslyGeneratedEnemyXPosition = Math.min(
          Math.abs(previouslyGeneratedEnemyXPosition - newX) <= TANK_SIZE_CELLS
            ? newX + TANK_SIZE_CELLS
            : newX,
          cellsAmount - TANK_SIZE_CELLS,
        );
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
              (brick) => hasCollisions(enemy.container, brick.container, cellSize).right,
            );

            const hasOtherEnemyOnTheRight = enemies.find((otherEnemy) => {
              if (otherEnemy.container.uid === enemy.container.uid) {
                return false;
              }
              return hasCollisions(enemy.container, otherEnemy.container, cellSize).right;
            });

            const hasBrickOnTheLeft = bricks.find(
              (brick) => hasCollisions(enemy.container, brick.container, cellSize).left,
            );

            const hasOtherEnemyOnTheLeft = enemies.find((otherEnemy) => {
              if (otherEnemy.container.uid === enemy.container.uid) {
                return false;
              }
              return hasCollisions(enemy.container, otherEnemy.container, cellSize).left;
            });

            const hasBrickAtBottom = bricks.find(
              (brick) => hasCollisions(enemy.container, brick.container, cellSize).bottom,
            );

            const hasOtherEnemyAtBottom = enemies.find((otherEnemy) => {
              if (otherEnemy.container.uid === enemy.container.uid) {
                return false;
              }
              return hasCollisions(enemy.container, otherEnemy.container, cellSize).bottom;
            });

            const hasBrickAtTop = bricks.find(
              (brick) => hasCollisions(enemy.container, brick.container, cellSize).top,
            );

            const hasOtherEnemyAtTop = enemies.find((otherEnemy) => {
              if (otherEnemy.container.uid === enemy.container.uid) {
                return false;
              }
              return hasCollisions(enemy.container, otherEnemy.container, cellSize).top;
            });

            const hasMainTankAtTop =
              mainTank && hasCollisions(enemy.container, mainTank.container, cellSize).top;
            const hasMainTankAtBottom =
              mainTank && hasCollisions(enemy.container, mainTank.container, cellSize).bottom;
            const hasMainTankOnTheLeft =
              mainTank && hasCollisions(enemy.container, mainTank.container, cellSize).left;
            const hasMainTankOnTheRight =
              mainTank && hasCollisions(enemy.container, mainTank.container, cellSize).right;

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

          setTimeout(() => {
            const ifEnemyStillExists = enemies.find(
              (allEnemy) => allEnemy.container.uid === enemy.container.uid,
            );
            if (!ifEnemyStillExists) {
              return;
            }
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
          }, getRandomTimeout() * BULLET_REAPPEAR_SPEED);
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

      function generatePerepugPosition() {
        perepug = new Perepug(cellSize, perepugTexture);

        perepug.container.x =
          TANK_SIZE_CELLS * 7 * cellSize + scene.container.x - perepug.container.width + 1;
        perepug.container.y = scene.container.y + scene.container.height - perepug.container.height;

        app.stage.addChild(perepug.container);
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

        if (mainBullet) {
          return;
        }

        if (!mainTank) {
          return;
        }

        const tankDirection = mainTank.direction;
        mainBullet = new Bullet(cellSize, tankDirection);
        app.stage.addChild(mainBullet.container);

        const tankPosition = { x: mainTank.container.x, y: mainTank.container.y };

        if (tankDirection === 'right') {
          mainBullet.container.x = tankPosition.x + mainTank.container.width;
          mainBullet.container.y =
            tankPosition.y + mainTank.container.height / 2 - mainBullet.container.height / 2;
        }

        if (tankDirection === 'left') {
          mainBullet.container.x = tankPosition.x;
          mainBullet.container.y =
            tankPosition.y + mainTank.container.height / 2 - mainBullet.container.height / 2;
        }

        if (tankDirection === 'top') {
          mainBullet.container.x =
            tankPosition.x + mainTank.container.width / 2 - mainBullet.container.height / 2;
          mainBullet.container.y = tankPosition.y;
        }

        if (tankDirection === 'bottom') {
          mainBullet.container.x =
            tankPosition.x + mainTank.container.width / 2 - mainBullet.container.height / 2;
          mainBullet.container.y = tankPosition.y + mainTank.container.height;
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
            (bullet.container.x + bullet.container.width >= brick.container.x &&
              bullet.container.x <= brick.container.x + brick.container.width) || // to right
            (bullet.container.x >= brick.container.x && // to left
              bullet.container.x <= brick.container.x + brick.container.width);

          const yCollision =
            (bullet.container.y + bullet.container.height >= brick.container.y && // to bottom
              bullet.container.y + bullet.container.height <=
                brick.container.y + brick.container.height) ||
            (bullet.container.y >= brick.container.y && // to top
              bullet.container.y <= brick.container.y + brick.container.height);

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
            if (!brick.canBeDestroyed) {
              return;
            }
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
            stats.updateEnemiesKilled(enemy.colorName);
            addEnemy();
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
        let hasMainTankBulletCollision: boolean = false;
        let hasPerepugCollision: boolean = false;

        if (bullet) {
          hasMainTankCollision =
            !!mainTank &&
            (hasCollisions(bullet.container, mainTank.container, cellSize).left ||
              hasCollisions(bullet.container, mainTank.container, cellSize).right ||
              hasCollisions(bullet.container, mainTank.container, cellSize).top ||
              hasCollisions(bullet.container, mainTank.container, cellSize).bottom);

          hasMainTankBulletCollision =
            !!mainBullet &&
            (hasCollisions(bullet.container, mainBullet.container, cellSize).left ||
              hasCollisions(bullet.container, mainBullet.container, cellSize).right ||
              hasCollisions(bullet.container, mainBullet.container, cellSize).top ||
              hasCollisions(bullet.container, mainBullet.container, cellSize).bottom);

          hasPerepugCollision =
            !!perepug &&
            (hasCollisions(bullet.container, perepug.container, cellSize).left ||
              hasCollisions(bullet.container, perepug.container, cellSize).right ||
              hasCollisions(bullet.container, perepug.container, cellSize).top ||
              hasCollisions(bullet.container, perepug.container, cellSize).bottom);
        }

        if (hasMainTankBulletCollision) {
          if (mainBullet) {
            removeBullet(mainBullet);
            mainBullet = null;
          }

          removeLocalEnemyBullet(enemy, bullet);
        }

        if (hasCollisionsBricks.length || isOutOfScene || hasMainTankCollision) {
          hasCollisionsBricks.forEach((brick) => {
            if (!brick.canBeDestroyed) {
              return;
            }
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
            stats.reduceLives();
            setTimeout(() => {
              addMainTank();
            }, MILLISECONDS_TIME_TANK_REAPPEARANCE);
          }

          if (hasMainTankCollision && mainTank && !mainTank.canBeKilled) {
            return;
          }

          removeLocalEnemyBullet(enemy, bullet);
        }

        if (hasPerepugCollision && perepug) {
          removeLocalEnemyBullet(enemy, bullet);
          isPerepugDead = true;
        }
      }

      function removeBullet(localBullet: Bullet | null) {
        if (mainBullet) {
          const explosion = new Explosion(app, mainBullet.container.x, mainBullet.container.y);
          explosions.push(explosion);
        }
        if (mainBullet) {
          mainBullet.container.removeFromParent();
          mainBullet = null;
        }
        if (localBullet) {
          localBullet.container.removeFromParent();
          localBullet = null;
        }
      }

      function removeLocalEnemyBullet(enemy: Tank, localBullet: Bullet | null) {
        if (enemy.bullet) {
          const explosion = new Explosion(app, enemy.bullet.container.x, enemy.bullet.container.y);
          explosions.push(explosion);
        }
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
          return !!mainTank && hasCollisions(mainTank.container, brick.container, cellSize).right;
        });

        const hasTankOnTheRight = enemies.find((enemy) => {
          return !!mainTank && hasCollisions(mainTank.container, enemy.container, cellSize).right;
        });

        const hasBrickOnTheLeft = bricks.find((brick) => {
          return !!mainTank && hasCollisions(mainTank.container, brick.container, cellSize).left;
        });

        const hasTankOnTheLeft = enemies.find((enemy) => {
          return !!mainTank && hasCollisions(mainTank.container, enemy.container, cellSize).left;
        });

        const hasBrickAtBottom = bricks.find((brick) => {
          return !!mainTank && hasCollisions(mainTank.container, brick.container, cellSize).bottom;
        });

        const hasTankAtBottom = enemies.find((enemy) => {
          return !!mainTank && hasCollisions(mainTank.container, enemy.container, cellSize).bottom;
        });

        const hasBrickAtTop = bricks.find((brick) => {
          return !!mainTank && hasCollisions(mainTank.container, brick.container, cellSize).top;
        });

        const hasTankAtTop = enemies.find((enemy) => {
          return !!mainTank && hasCollisions(mainTank.container, enemy.container, cellSize).top;
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

      function moveExplosionParticles() {
        explosions.forEach((explosion) => {
          if (explosion) {
            explosion.moveParticles();
          }
        });
      }

      function removeExplosion() {
        explosions.forEach((explosion, index) => {
          if (explosion.isRemoved) {
            explosions.splice(index, 1);
          }
        });
      }

      function checkIfGameEnded() {
        if (isPerepugDead || stats.lives === 0) {
          isGameEnded = true;
          alert(
            'HAAAAAAAAAAAAAAAAAAA POPUSK !!! ' + isPerepugDead ? 'PEREPUG POMER' : 'NEMA JYTTIV',
          );
          if (isPerepugDead) {
            perepug?.scaleConstantly();
          }
        }
      }

      generateBricks();
      addMainTank();
      addEnemies();
      generatePerepugPosition();

      app.ticker.add((time) => {
        if (isGameEnded) {
          return;
        }

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
        checkBulletCollision(mainBullet);
        updateBulletPosition(mainBullet);
        shootFromEnemies();
        moveExplosionParticles();
        removeExplosion();
        checkIfGameEnded();
      });
    })();
  }
}
