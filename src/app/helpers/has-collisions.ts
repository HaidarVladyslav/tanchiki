import { Container } from 'pixi.js';
import { Direction } from '../types/direction';

export function hasCollisions(
  currentTarget: Container,
  nextTarget: Container,
): { [key in Direction]: boolean } {
  return {
    right:
      currentTarget.x + currentTarget.width >= nextTarget.x &&
      currentTarget.x + currentTarget.width <= nextTarget.x + nextTarget.width &&
      currentTarget.y + currentTarget.height > nextTarget.y &&
      currentTarget.y < nextTarget.y + nextTarget.height,
    left:
      currentTarget.x <= nextTarget.x + nextTarget.width + 1 &&
      currentTarget.x >= nextTarget.x &&
      currentTarget.y + currentTarget.height > nextTarget.y &&
      currentTarget.y < nextTarget.y + nextTarget.height,
    top:
      currentTarget.y <= nextTarget.y + nextTarget.height + 1 &&
      currentTarget.y >= nextTarget.y &&
      currentTarget.x + currentTarget.width > nextTarget.x &&
      currentTarget.x < nextTarget.x + nextTarget.width,
    bottom:
      currentTarget.y + currentTarget.height >= nextTarget.y &&
      currentTarget.y + currentTarget.height <= nextTarget.y + nextTarget.height &&
      currentTarget.x + currentTarget.width > nextTarget.x &&
      currentTarget.x < nextTarget.x + nextTarget.width,
  };
}
