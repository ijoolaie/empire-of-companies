export interface DeskObstacle { x: number; z: number }
export interface NavigationObstacle {
  x: number;
  z: number;
  halfWidth: number;
  halfDepth: number;
}
export interface ArrivalPoint { x: number; y: number; z: number }

const DESK_HALF_WIDTH = 1.05;
const DESK_HALF_DEPTH = 0.68;
const GRID = 0.25;
const OFFICE_MIN_X = -4.4;
const OFFICE_MAX_X = 4.4;
const OFFICE_MIN_Z = -3.3;
const OFFICE_MAX_Z = 3.65;
const ENTRANCE = { x: 0, z: 3.45 };

interface Node {
  x: number;
  z: number;
  g: number;
  f: number;
  key: string;
}

function key(x: number, z: number): string {
  return `${x},${z}`;
}

function distance(ax: number, az: number, bx: number, bz: number): number {
  return Math.hypot(bx - ax, bz - az);
}

function pointBlocked(x: number, z: number, obstacles: NavigationObstacle[]): boolean {
  return obstacles.some(o =>
    Math.abs(x - o.x) < o.halfWidth && Math.abs(z - o.z) < o.halfDepth
  );
}

/**
 * Plans a deterministic bounded A* route from the office entrance to a desk.
 * All returned points are local to the target desk because worker models are
 * parented to their assigned desk. Desk, planter and structural footprints are
 * treated as solid obstacles.
 */
export function planWorkerArrivalPath(
  ownDesk: DeskObstacle,
  desks: DeskObstacle[],
  fixedObstacles: NavigationObstacle[] = [],
  entranceOffsetX = 0
): ArrivalPoint[] {
  const obstacles: NavigationObstacle[] = [
    ...desks
      .filter(d => d.x !== ownDesk.x || d.z !== ownDesk.z)
      .map(d => ({
        x: d.x - ownDesk.x,
        z: d.z - ownDesk.z,
        halfWidth: DESK_HALF_WIDTH,
        halfDepth: DESK_HALF_DEPTH
      })),
    ...fixedObstacles.map(o => ({
      x: o.x - ownDesk.x,
      z: o.z - ownDesk.z,
      halfWidth: o.halfWidth,
      halfDepth: o.halfDepth
    }))
  ];

  const minX = Math.ceil((OFFICE_MIN_X - ownDesk.x) / GRID);
  const maxX = Math.floor((OFFICE_MAX_X - ownDesk.x) / GRID);
  const minZ = Math.ceil((OFFICE_MIN_Z - ownDesk.z) / GRID);
  const maxZ = Math.floor((OFFICE_MAX_Z - ownDesk.z) / GRID);
  const start = {
    x: Math.round((ENTRANCE.x + entranceOffsetX - ownDesk.x) / GRID),
    z: Math.round((ENTRANCE.z - ownDesk.z) / GRID)
  };
  const goal = { x: 0, z: 0 };
  const startKey = key(start.x, start.z);
  const goalKey = key(goal.x, goal.z);

  const blocked = (x: number, z: number) =>
    x < minX || x > maxX || z < minZ || z > maxZ ||
    pointBlocked(x * GRID, z * GRID, obstacles);

  // If an invalid custom layout blocks the entrance or target, keep the worker
  // at its assigned desk instead of producing a route through solid geometry.
  if (blocked(start.x, start.z) || blocked(goal.x, goal.z)) {
    return [{ x: 0, y: 0, z: 0 }];
  }

  const open: Node[] = [{
    ...start, g: 0,
    f: distance(start.x, start.z, goal.x, goal.z),
    key: startKey
  }];
  const best = new Map<string, number>([[startKey, 0]]);
  const parents = new Map<string, string>();
  const closed = new Set<string>();
  const directions = [
    [0, -1, 1], [-1, 0, 1], [1, 0, 1], [0, 1, 1],
    [-1, -1, Math.SQRT2], [1, -1, Math.SQRT2],
    [-1, 1, Math.SQRT2], [1, 1, Math.SQRT2]
  ] as const;

  while (open.length) {
    open.sort((a, b) => a.f - b.f || a.g - b.g || a.key.localeCompare(b.key));
    const current = open.shift()!;
    if (closed.has(current.key)) continue;
    if (current.key === goalKey) {
      const cells = [goalKey];
      let cursor = goalKey;
      while (cursor !== startKey) {
        const parent = parents.get(cursor);
        if (!parent) break;
        cells.push(parent);
        cursor = parent;
      }
      cells.reverse();
      return cells.map((cell, index) => {
        if (index === 0) {
          return { x: ENTRANCE.x + entranceOffsetX - ownDesk.x, y: 0, z: ENTRANCE.z - ownDesk.z };
        }
        const [x, z] = cell.split(',').map(Number);
        return { x: x * GRID, y: 0, z: z * GRID };
      });
    }
    closed.add(current.key);

    for (const [dx, dz, cost] of directions) {
      const x = current.x + dx;
      const z = current.z + dz;
      const nextKey = key(x, z);
      if (closed.has(nextKey) || blocked(x, z)) continue;
      // Prevent diagonal corner cutting through touching obstacle footprints.
      if (dx !== 0 && dz !== 0 &&
        (blocked(current.x + dx, current.z) || blocked(current.x, current.z + dz))) continue;
      const tentative = current.g + cost;
      if (tentative >= (best.get(nextKey) ?? Infinity)) continue;
      best.set(nextKey, tentative);
      parents.set(nextKey, current.key);
      open.push({
        x, z, g: tentative,
        f: tentative + distance(x, z, goal.x, goal.z),
        key: nextKey
      });
    }
  }

  // No valid path: keep the worker at its desk rather than crossing obstacles.
  return [{ x: 0, y: 0, z: 0 }];
}