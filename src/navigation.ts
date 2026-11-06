export interface DeskObstacle { x: number; z: number }
export interface ArrivalPoint { x: number; y: number; z: number }

const HALF_WIDTH = 1.05;
const HALF_DEPTH = 0.68;
const GRID = 0.25;
const OFFICE_MIN_X = -4.4;
const OFFICE_MAX_X = 4.4;
const OFFICE_MIN_Z = -3.3;
const OFFICE_MAX_Z = 5.2;

interface Node {
  x: number;
  z: number;
  g: number;
  f: number;
  key: string;
  parent?: string;
}

function key(x: number, z: number): string {
  return `${x},${z}`;
}

function distance(ax: number, az: number, bx: number, bz: number): number {
  return Math.hypot(bx - ax, bz - az);
}

function pointBlocked(x: number, z: number, obstacles: DeskObstacle[]): boolean {
  return obstacles.some(o =>
    Math.abs(x - o.x) < HALF_WIDTH && Math.abs(z - o.z) < HALF_DEPTH
  );
}

/**
 * Plans a deterministic local-space route around desk footprints using a bounded
 * A* grid. Coordinates are relative to the assigned desk because the worker
 * model is parented to that desk. The route stays inside the open office bounds.
 */
export function planWorkerArrivalPath(
  ownDesk: DeskObstacle,
  desks: DeskObstacle[]
): ArrivalPoint[] {
  const obstacles = desks
    .filter(d => d.x !== ownDesk.x || d.z !== ownDesk.z)
    .map(d => ({ x: d.x - ownDesk.x, z: d.z - ownDesk.z }));

  const minX = Math.ceil((OFFICE_MIN_X - ownDesk.x) / GRID);
  const maxX = Math.floor((OFFICE_MAX_X - ownDesk.x) / GRID);
  const minZ = Math.ceil((OFFICE_MIN_Z - ownDesk.z) / GRID);
  const maxZ = Math.floor((OFFICE_MAX_Z - ownDesk.z) / GRID);
  const start = { x: 0, z: Math.round(2.25 / GRID) };
  const goal = { x: 0, z: 0 };
  const startKey = key(start.x, start.z);
  const goalKey = key(goal.x, goal.z);

  const blocked = (x: number, z: number) =>
    x < minX || x > maxX || z < minZ || z > maxZ ||
    pointBlocked(x * GRID, z * GRID, obstacles);

  if (blocked(start.x, start.z) || blocked(goal.x, goal.z)) {
    return [{ x: 0, y: 0, z: 2.1 }, { x: 0, y: 0, z: 0 }];
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
        if (index === 0) return { x: 0, y: 0, z: 2.1 };
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
      // Prevent diagonal corner cutting through touching desk footprints.
      if (dx !== 0 && dz !== 0 && (blocked(current.x + dx, current.z) || blocked(current.x, current.z + dz))) continue;
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

  // Safe deterministic fallback; this only occurs for invalid or fully blocked layouts.
  return [{ x: 0, y: 0, z: 2.1 }, { x: 0, y: 0, z: 0 }];
}