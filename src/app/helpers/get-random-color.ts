import { ColorSource } from 'pixi.js';

export function getRandomColor(): ColorSource {
  const colors = [0x0000ff, 0xffff00, 0xff00ff];

  return colors[Math.floor(Math.random() * colors.length)];
}
