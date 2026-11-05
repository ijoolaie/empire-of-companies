import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildDesk, createInitialState, earnForElapsed, hireWorker, incomePerSecond,
  OFFLINE_CAP_SECONDS, parseGameState, serializeGameState, upgradeCost, upgradeOffice
} from '../src/economy.ts';

test('new game has valid starter economy', () => {
  const state = createInitialState(1_000);
  assert.equal(state.cash, 12_000);
  assert.equal(state.workers, 1);
  assert.equal(state.desks.length, 2);
  assert.equal(incomePerSecond(state), 5);
});

test('hiring requires an empty desk and enough cash', () => {
  const state = createInitialState();
  assert.equal(hireWorker(state), true);
  assert.equal(state.workers, 2);
  assert.equal(state.cash, 9_500);
  assert.equal(hireWorker(state), false);
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

test('legacy save shape is migrated and worker count is bounded by desks', () => {
  const legacy = JSON.stringify({
    version: 2, cash: 5_000, workers: 8, level: 3,
    desks: [{ x: -2, z: -1 }, { x: 1, z: -1 }],
    lastSavedAt: 5_000
  });
  const loaded = parseGameState(legacy, 5_000);
  assert.equal(loaded.state.version, 3);
  assert.equal(loaded.state.workers, 2);
  assert.equal(loaded.state.cash, 5_000);
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
