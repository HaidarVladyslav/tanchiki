import { Component, inject, signal } from '@angular/core';
import { Application } from 'pixi.js';
import { Controller } from './controller';
import { Scene } from './scene';
import { Tank } from './tank';
import { ControllerState } from './types/controller-state';
import { Brick } from './brick';
import { COUNT_TO_UPDATE_LOCATION } from './constants/count-to-update-location';
import { generateBricksHelper } from './helpers/generate-bricks';

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

      const countToUpdate = COUNT_TO_UPDATE_LOCATION;
      let count = 0;
      const bricks: Brick[] = [];

      const tank = new Tank(cellSize);

      app.stage.addChild(scene.container);
      app.stage.addChild(tank.container);

      tank.setX(scene.container.x);
      tank.setY(scene.container.y);

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

      function updateTankLocation(state: ControllerState) {
        if (++count >= countToUpdate) {
          const noWallOnTheRight =
            tank.container.x <
            scene.container.x + scene.container.width - tank.container.width - moveStep;
          const noWallOnTheLeft = tank.container.x > scene.container.x;
          const noWallAtTop = tank.container.y > scene.container.y;
          const noWallAtBottom =
            tank.container.y <
            scene.container.y + scene.container.height - tank.container.height - moveStep;

          const hasBrickOnTheRight = bricks.find((brick) => {
            const hasXCollisionOnNextStep =
              tank.container.x + tank.container.width >= brick.container.x &&
              tank.container.x + tank.container.width <= brick.container.x + brick.container.width;
            const hasYCollisionOnNextStep =
              tank.container.y + tank.container.height > brick.container.y &&
              tank.container.y < brick.container.y + brick.container.height;

            return hasXCollisionOnNextStep && hasYCollisionOnNextStep;
          });

          const hasBrickOnTheLeft = bricks.find((brick) => {
            const hasXCollision =
              tank.container.x <= brick.container.x + brick.container.width &&
              tank.container.x >= brick.container.x;
            const hasYCollision =
              tank.container.y + tank.container.height > brick.container.y &&
              tank.container.y < brick.container.y + brick.container.height;
            return hasXCollision && hasYCollision;
          });

          const hasBrickAtBottom = bricks.find((brick) => {
            const hasYCollision =
              tank.container.y + tank.container.height >= brick.container.y &&
              tank.container.y + tank.container.height <=
                brick.container.y + brick.container.height;
            const hasXCollision =
              tank.container.x + tank.container.width > brick.container.x &&
              tank.container.x < brick.container.x + brick.container.width;

            return hasXCollision && hasYCollision;
          });

          const hasBrickAtTop = bricks.find((brick) => {
            const hasYCollision =
              tank.container.y <= brick.container.y + brick.container.height &&
              tank.container.y >= brick.container.y;
            const hasXCollision =
              tank.container.x + tank.container.width > brick.container.x &&
              tank.container.x < brick.container.x + brick.container.width;

            return hasXCollision && hasYCollision;
          });

          if (state.right.pressed) {
            if (noWallOnTheRight && !hasBrickOnTheRight) {
              tank.container.x += moveStep;
            }
          } else if (state.left.pressed) {
            if (noWallOnTheLeft && !hasBrickOnTheLeft) {
              tank.container.x -= moveStep;
            }
          } else if (state.top.pressed) {
            if (noWallAtTop && !hasBrickAtTop) {
              tank.container.y -= moveStep;
            }
          } else if (state.bottom.pressed) {
            if (noWallAtBottom && !hasBrickAtBottom) {
              tank.container.y += moveStep;
            }
          }

          count = 0;
        }
      }

      generateBricks();

      app.ticker.add((time) => {
        const state = this.controller.stateExposed();

        updateTankDirection(state);
        updateTankLocation(state);
      });
    })();
  }
}
