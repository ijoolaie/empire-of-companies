import test from 'node:test';
import assert from 'node:assert/strict';
import { planWorkerArrivalPath } from '../src/navigation.ts';

function routeIntersectsObstacle(path, obstacle, ownDesk) {
  const center = { x: obstacle.x - ownDesk.x, z: obstacle.z - ownDesk.z };
  for (let segment = 1; segment < path.length; segment++) {
    const from = path[segment - 1];
    const to = path[segment];
    const steps = Math.ceil(Math.hypot(to.x-from.x,to.z-from.z) / 0.025);
    for (let step = 1; step < steps; step++) {
      const t = step / steps;
      const x = from.x + (to.x - from.x) * t;
      const z = from.z + (to.z - from.z) * t;
      if (Math.abs(x - center.x) < 1.05 && Math.abs(z - center.z) < 0.68) return true;
    }
  }
  return false;
}

test('arrival route detours around a desk placed directly in the approach lane', () => {
  const ownDesk = { x: 0, z: 0 };
  const obstacle = { x: 0, z: 1.35 };
  const path = planWorkerArrivalPath(ownDesk, [ownDesk, obstacle]);

  assert.ok(path.length >= 4);
  assert.equal(path[0].z, 2.1);
  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  assert.equal(routeIntersectsObstacle(path, obstacle, ownDesk), false);
});

test('arrival path remains finite and reaches its assigned desk with nearby obstacles', () => {
  const ownDesk = { x: -2, z: -1 };
  const desks = [ownDesk, { x: -0.2, z: 0.2 }, { x: 1, z: -1 }, { x: 4, z: 2 }];
  const path = planWorkerArrivalPath(ownDesk, desks);

  assert.ok(path.every(point => Number.isFinite(point.x) && Number.isFinite(point.z)));
  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  for (const obstacle of desks.slice(1)) {
    assert.equal(routeIntersectsObstacle(path, obstacle, ownDesk), false);
  }
});

test('arrival route is deterministic for the same desk layout', () => {
  const desks = [{ x: 0, z: 0 }, { x: 0, z: 1.3 }, { x: 2, z: 0 }];
  const first = planWorkerArrivalPath(desks[0], desks).map(point => [point.x, point.y, point.z]);
  const second = planWorkerArrivalPath(desks[0], desks).map(point => [point.x, point.y, point.z]);
  assert.deepEqual(first, second);
});
test('A* detours when both simple lateral approach lanes are obstructed', () => {
  const ownDesk = { x: 0, z: 0 };
  const desks = [
    ownDesk,
    { x: -1.35, z: 1.65 },
    { x: 1.35, z: 1.65 }
  ];
  const path = planWorkerArrivalPath(ownDesk, desks);

  assert.ok(path.length > 2);
  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  for (const obstacle of desks.slice(1)) {
    assert.equal(routeIntersectsObstacle(path, obstacle, ownDesk), false);
  }
});

test('arrival path remains within the office bounds for an edge desk', () => {
  const ownDesk = { x: 4, z: 2 };
  const path = planWorkerArrivalPath(ownDesk, [ownDesk, { x: 1, z: 0 }]);

  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  for (const point of path) {
    assert.ok(ownDesk.x + point.x >= -4.4 && ownDesk.x + point.x <= 4.4);
    assert.ok(ownDesk.z + point.z >= -3.3 && ownDesk.z + point.z <= 5.2);
  }
});
