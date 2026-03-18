import { ENEMIES_COLORS } from '../constants/colors';

export function getRandomColor(): (typeof ENEMIES_COLORS)[number] {
  const colors = ENEMIES_COLORS;

  return colors[Math.floor(Math.random() * colors.length)];
}
