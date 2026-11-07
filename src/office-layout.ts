import type { DeskPosition } from './economy';

interface Obstacle {
  x: number;
  z: number;
  halfWidth: number;
  halfDepth: number;
}

const FIXED_OBSTACLES: Obstacle[] = [
  { x: -4, z: 3, halfWidth: .48, halfDepth: .48 },
  { x: 4, z: -2, halfWidth: .48, halfDepth: .48 },
  { x: 4.48, z: -.55, halfWidth: .38, halfDepth: .95 },
  { x: -4.48, z: 1.1, halfWidth: .48, halfDepth: .9 },
  { x: 0, z: 3.42, halfWidth: .925, halfDepth: .31 }
];

/** Checks the full desk-and-chair footprint against fixed office geometry. */
export function canDeskFitOffice(position: DeskPosition): boolean {
  const left = position.x - .75;
  const right = position.x + .75;
  const back = position.z - .375;
  const front = position.z + 1.06;

  // Keep the complete furniture footprint inside the office shell.
  if (left < -4.91 || right > 4.91 || back < -3.91 || front > 3.91) return false;

  // The front wall is open only across the central 2.5-metre entrance.
  if (front > 3.91 && (left < -1.25 || right > 1.25)) return false;

  return !FIXED_OBSTACLES.some(obstacle =>
    left < obstacle.x + obstacle.halfWidth &&
    right > obstacle.x - obstacle.halfWidth &&
    back < obstacle.z + obstacle.halfDepth &&
    front > obstacle.z - obstacle.halfDepth
  );
}