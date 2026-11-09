import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDesk, canPlaceDesk, createInitialState, earnForElapsed, hireWorker, incomePerSecond,
  OFFLINE_CAP_SECONDS, parseGameState, serializeGameState, upgradeCost, upgradeOffice
} from '../src/economy.ts';
import { OBJECTIVES, playerLevelForXp, syncObjectives, xpIntoCurrentLevel } from '../src/progression.ts';
import { canDeskFitOffice } from '../src/office-layout.ts';

test('new game has valid starter economy and progression defaults', () => {
  const state = createInitialState(1_000);
  assert.equal(state.cash, 12_000);
  assert.equal(state.workers, 1);
  assert.equal(state.desks.length, 2);
  assert.equal(incomePerSecond(state), 5);
  assert.equal(state.version, 4);
  assert.equal(state.playerXp, 0);
  assert.deepEqual(state.completedObjectives, []);
  assert.equal(state.tutorialDismissed, false);
});

test('hiring requires an empty desk and enough cash', () => {
  const state = createInitialState();
  assert.equal(hireWorker(state), true);
  assert.equal(state.workers, 2);
  assert.equal(state.cash, 9_500);
  assert.equal(hireWorker(state), false);
});

test('desk preview validation matches the build rules without mutating state', () => {
  const state = createInitialState();
  const cash = state.cash;
  assert.equal(canPlaceDesk(state, { x: 4, z: 2 }), true);
  assert.equal(canPlaceDesk(state, { x: 0, z: -1 }), false);
  assert.equal(canPlaceDesk(state, { x: 9, z: 9 }), false);
  assert.equal(state.cash, cash);
  assert.equal(state.desks.length, 2);
});

test('building a desk charges once and rejects overlap or invalid coordinates', () => {
  const state = createInitialState();
  assert.equal(buildDesk(state, { x: 4, z: 2 }), true);
  assert.equal(state.cash, 11_000);
  assert.equal(buildDesk(state, { x: 3, z: 2 }), false);
  assert.equal(buildDesk(state, { x: 9, z: 9 }), false);
  assert.equal(buildDesk(state, { x: 1.5, z: 1 }), false);
  assert.equal(state.cash, 11_000);
});

test('upgrade cost scales with level and increases income', () => {
  const state = createInitialState();
  assert.equal(upgradeCost(state), 5_000);
  assert.equal(upgradeOffice(state), true);
  assert.equal(state.level, 2);
  assert.equal(state.cash, 7_000);
  assert.equal(incomePerSecond(state), 10);
  assert.equal(upgradeCost(state), 10_000);
});

test('elapsed income is capped and rejects invalid elapsed values', () => {
  const state = createInitialState();
  assert.equal(earnForElapsed(state, OFFLINE_CAP_SECONDS * 3), 144_000);
  assert.equal(earnForElapsed(state, -100), 0);
  assert.equal(earnForElapsed(state, Number.NaN), 0);
  assert.equal(state.cash, 156_000);
});

test('save parsing restores state and calculates offline earnings', () => {
  const saved = createInitialState(10_000);
  saved.cash = 8_000;
  const raw = serializeGameState(saved, 10_000);
  const loaded = parseGameState(raw, 12_000);
  assert.equal(loaded.state.cash, 8_010);
  assert.equal(loaded.offlineEarned, 10);
  assert.equal(loaded.state.lastSavedAt, 12_000);
});

test('offline earnings never exceed eight hours', () => {
  const saved = createInitialState(1_000);
  const loaded = parseGameState(serializeGameState(saved, 1_000), 1_000 + 24 * 60 * 60 * 1000);
  assert.equal(loaded.offlineEarned, 144_000);
});

test('legacy v2 and v3 saves migrate to v4 without losing game progress', () => {
  const legacy = JSON.stringify({
    version: 3, cash: 5_000, workers: 2, level: 3,
    desks: [{ x: -2, z: -1 }, { x: 1, z: -1 }, { x: 4, z: 2 }],
    lastSavedAt: 5_000
  });
  const loaded = parseGameState(legacy, 5_000);
  assert.equal(loaded.state.version, 4);
  assert.equal(loaded.state.workers, 2);
  assert.equal(loaded.state.cash, 5_000);
  assert.equal(loaded.state.playerXp, 0);
  assert.deepEqual(loaded.state.completedObjectives, []);
  assert.equal(loaded.state.tutorialDismissed, false);
});

test('malformed saves recover to a fresh state', () => {
  assert.equal(parseGameState('{broken', 123).state.cash, 12_000);
  assert.equal(parseGameState('null', 123).state.lastSavedAt, 123);
});

test('future save timestamps do not suppress future offline earnings', () => {
  const saved = createInitialState(50_000);
  const loaded = parseGameState(serializeGameState(saved, 50_000), 40_000);
  assert.equal(loaded.offlineEarned, 0);
  assert.equal(loaded.state.lastSavedAt, 40_000);
});

test('objectives award cash and XP exactly once and unlock player level 2', () => {
  const state = createInitialState();
  assert.deepEqual(syncObjectives(state), []);
  assert.equal(buildDesk(state, { x: 4, z: 2 }), true);
  assert.deepEqual(syncObjectives(state), ['first-desk']);
  assert.equal(state.cash, 11_500);
  assert.equal(state.playerXp, 20);

  assert.equal(hireWorker(state), true);
  assert.deepEqual(syncObjectives(state), ['first-hire']);
  assert.equal(state.cash, 9_750);
  assert.equal(state.playerXp, 50);

  assert.equal(upgradeOffice(state), true);
  assert.deepEqual(syncObjectives(state), ['first-upgrade']);
  assert.equal(state.cash, 5_750);
  assert.equal(state.playerXp, 100);
  assert.equal(playerLevelForXp(state.playerXp), 2);
  assert.equal(state.tutorialDismissed, true);
  assert.deepEqual(syncObjectives(state), []);
  assert.equal(state.cash, 5_750);
});

test('objectives respect the tutorial order even when later actions happen early', () => {
  const state = createInitialState();
  assert.equal(hireWorker(state), true);
  assert.equal(upgradeOffice(state), true);
  assert.deepEqual(syncObjectives(state), []);
  assert.equal(state.playerXp, 0);

  assert.equal(buildDesk(state, { x: 4, z: 2 }), true);
  assert.deepEqual(syncObjectives(state), ['first-desk', 'first-hire', 'first-upgrade']);
  assert.equal(state.playerXp, 100);
  assert.equal(state.tutorialDismissed, true);
});

test('objective synchronization ignores unknown IDs and preserves completed rewards', () => {
  const state = createInitialState();
  state.completedObjectives = ['first-desk', 'not-a-real-objective'];
  state.desks.push({ x: 4, z: 2 });
  assert.deepEqual(syncObjectives(state), []);
  assert.deepEqual(state.completedObjectives, ['first-desk']);
  assert.equal(state.playerXp, 0);
});

test('player XP maps to bounded levels and progress within the current level', () => {
  assert.equal(playerLevelForXp(0), 1);
  assert.equal(playerLevelForXp(99), 1);
  assert.equal(playerLevelForXp(100), 2);
  assert.equal(playerLevelForXp(250), 3);
  assert.equal(playerLevelForXp(1_000_000), 100);
  assert.equal(xpIntoCurrentLevel(250), 50);
  assert.equal(xpIntoCurrentLevel(1_000_000), 100);
  assert.equal(OBJECTIVES.length, 3);
});

test('desk footprint must fit the office and avoid fixed furniture', () => {
  assert.equal(canDeskFitOffice({ x: 2, z: 2 }), true);
  assert.equal(canDeskFitOffice({ x: 4, z: -2 }), false); // planter
  assert.equal(canDeskFitOffice({ x: 4, z: -1 }), false); // bookcase
  assert.equal(canDeskFitOffice({ x: -4, z: 1 }), false); // waiting bench
  assert.equal(canDeskFitOffice({ x: 0, z: 3 }), false); // entrance mat / front edge
});