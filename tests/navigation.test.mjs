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
      if (Math.abs(x - center.x) < obstacle.halfWidth && Math.abs(z - center.z) < obstacle.halfDepth) return true;
    }
  }
  return false;
}

test('arrival route starts at the shared entrance and reaches its assigned desk', () => {
  const ownDesk = { x: -2, z: -1 };
  const path = planWorkerArrivalPath(ownDesk, [ownDesk, { x: 1, z: -1 }]);

  assert.deepEqual(path[0], { x: 2, y: 0, z: 4.45 });
  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  assert.ok(path.length > 2);
});

test('arrival route detours around a desk placed directly in the approach lane', () => {
  const ownDesk = { x: 0, z: 0 };
  const obstacle = { x: 0, z: 2.1, halfWidth: 1.05, halfDepth: 0.68 };
  const path = planWorkerArrivalPath(ownDesk, [ownDesk, obstacle]);

  assert.ok(path.length > 4);
  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  assert.equal(routeIntersectsObstacle(path, obstacle, ownDesk), false);
});

test('arrival route avoids fixed planter and wall-footprint obstacles', () => {
  const ownDesk = { x: -2, z: -1 };
  const planter = { x: -2, z: 2.8, halfWidth: 0.48, halfDepth: 0.48 };
  const wallSegment = { x: 2.2, z: 1.1, halfWidth: 0.12, halfDepth: 1.3 };
  const path = planWorkerArrivalPath(ownDesk, [ownDesk, { x: 1, z: -1 }], [planter, wallSegment]);

  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  assert.equal(routeIntersectsObstacle(path, planter, ownDesk), false);
  assert.equal(routeIntersectsObstacle(path, wallSegment, ownDesk), false);
});

test('arrival route is deterministic for the same desk layout and fixed obstacles', () => {
  const ownDesk = { x: 0, z: 0 };
  const desks = [ownDesk, { x: 0, z: 1.3 }, { x: 2, z: 0 }];
  const obstacles = [{ x: -2, z: 2, halfWidth: 0.5, halfDepth: 0.5 }];
  const first = planWorkerArrivalPath(ownDesk, desks, obstacles).map(point => [point.x, point.y, point.z]);
  const second = planWorkerArrivalPath(ownDesk, desks, obstacles).map(point => [point.x, point.y, point.z]);
  assert.deepEqual(first, second);
});

test('arrival path remains within the office bounds for an edge desk', () => {
  const ownDesk = { x: 4, z: 2 };
  const path = planWorkerArrivalPath(ownDesk, [ownDesk, { x: 1, z: 0 }]);

  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  for (const point of path) {
    assert.ok(ownDesk.x + point.x >= -4.4 && ownDesk.x + point.x <= 4.4);
    assert.ok(ownDesk.z + point.z >= -3.3 && ownDesk.z + point.z <= 3.65);
  }
});

test('blocked entrance falls back to a stationary safe arrival', () => {
  const ownDesk = { x: 0, z: 0 };
  const entranceBlocker = { x: 0, z: 3.45, halfWidth: 0.8, halfDepth: 0.3 };
  const path = planWorkerArrivalPath(ownDesk, [ownDesk], [entranceBlocker]);
  assert.deepEqual(path, [{ x: 0, y: 0, z: 0 }]);
});
test('a second hire can use an alternate entrance lane around a reserved worker route', () => {
  const ownDesk = { x: 2, z: -1 };
  const reservedEntranceLane = { x: 0, z: 3.45, halfWidth: 0.42, halfDepth: 0.42 };
  const path = planWorkerArrivalPath(ownDesk, [ownDesk], [reservedEntranceLane], 0.8);

  assert.equal(path[0].x, -1.2);
  assert.equal(path[0].z, 4.45);
  assert.deepEqual(path.at(-1), { x: 0, y: 0, z: 0 });
  assert.equal(routeIntersectsObstacle(path, reservedEntranceLane, ownDesk), false);
});

test('edge-of-office desk layouts keep every entrance-lane route inside bounds and clear of scene obstacles', () => {
  const existingDesks = [{ x: -2, z: -1 }, { x: 1, z: -1 }];
  const fixedObstacles = [
    { x: -4, z: 3, halfWidth: 0.48, halfDepth: 0.48 },
    { x: 4, z: -2, halfWidth: 0.48, halfDepth: 0.48 },
    { x: -5, z: 0, halfWidth: 0.09, halfDepth: 4 },
    { x: 0, z: -4, halfWidth: 5, halfDepth: 0.09 }
  ];
  const edgeDesks = [
    { x: -4, z: -3 }, { x: -4, z: 0 }, { x: -4, z: 2 },
    { x: -3, z: 3 }, { x: 0, z: 3 }, { x: 3, z: 3 },
    { x: 4, z: 2 }, { x: 4, z: 0 }, { x: 4, z: -3 },
    { x: -3, z: -3 }, { x: 0, z: -3 }, { x: 3, z: -3 }
  ];
  const entranceOffsets = [0, -0.8, 0.8, -1.6, 1.6, -2.4, 2.4];

  for (const ownDesk of edgeDesks) {
    const desks = [...existingDesks, ownDesk];
    const deskObstacles = existingDesks.map(desk => ({
      ...desk,
      halfWidth: 1.05,
      halfDepth: 0.68
    }));
    const allObstacles = [...fixedObstacles, ...deskObstacles];

    for (const entranceOffset of entranceOffsets) {
      const path = planWorkerArrivalPath(ownDesk, desks, fixedObstacles, entranceOffset);

      assert.ok(path.length > 1, `expected a route for desk ${JSON.stringify(ownDesk)} from lane ${entranceOffset}`);
      for (const point of path) {
        const x = ownDesk.x + point.x;
        const z = ownDesk.z + point.z;
        assert.ok(x >= -4.4 && x <= 4.4, `x out of bounds: ${x}`);
        assert.ok(z >= -3.3 && z <= 3.65, `z out of bounds: ${z}`);
      }
      for (const obstacle of allObstacles) {
        assert.equal(
          routeIntersectsObstacle(path, obstacle, ownDesk),
          false,
          `route for desk ${JSON.stringify(ownDesk)} lane ${entranceOffset} intersects obstacle ${JSON.stringify(obstacle)}`
        );
      }
    }
  }
});
