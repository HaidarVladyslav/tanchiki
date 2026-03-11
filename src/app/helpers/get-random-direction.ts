import { Direction } from '../types/direction';

export function getRandomDirection() {
  const directions: Direction[] = [
    'bottom',
    'bottom',
    'bottom',
    'right',
    'top',
    'left',
    'left',
    'top',
    'top',
    'right',
    'right',
    'left',
  ];
  return directions[Math.floor(Math.random() * directions.length)];
}
