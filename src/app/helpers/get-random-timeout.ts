export function getRandomTimeout(): number {
  const times = [1000, 120, 400, 320, 2000, 1250, 1300, 600, 500, 1400, 1700];
  return times[Math.floor(Math.random() * times.length)];
}
