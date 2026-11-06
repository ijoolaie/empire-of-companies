export interface DeskPosition { x: number; z: number }

export interface GameState {
  version: 4;
  cash: number;
  workers: number;
  level: number;
  desks: DeskPosition[];
  lifetimeEarned: number;
  lastSavedAt: number;
  playerXp: number;
  completedObjectives: string[];
  tutorialDismissed: boolean;
}

export const SAVE_KEY = 'eoc-save-v4';
export const LEGACY_SAVE_KEYS = ['eoc-save-v3', 'eoc-save-v2', 'eoc-save'];
export const DESK_COST = 1_000;
export const HIRE_COST = 2_500;
export const UPGRADE_BASE_COST = 5_000;
export const OFFLINE_CAP_SECONDS = 8 * 60 * 60;
export const STARTING_CASH = 12_000;
export const STARTING_DESKS: DeskPosition[] = [{ x: -2, z: -1 }, { x: 1, z: -1 }];

export function incomePerSecond(state: Pick<GameState, 'workers' | 'level'>): number {
  return state.workers * 5 * Math.max(1, state.level);
}

export function upgradeCost(state: Pick<GameState, 'level'>): number {
  return UPGRADE_BASE_COST * Math.max(1, state.level);
}

export function createInitialState(now = Date.now()): GameState {
  return {
    version: 4,
    cash: STARTING_CASH,
    workers: 1,
    level: 1,
    desks: STARTING_DESKS.map(d => ({ ...d })),
    lifetimeEarned: 0,
    lastSavedAt: now,
    playerXp: 0,
    completedObjectives: [],
    tutorialDismissed: false
  };
}

function finiteNonNegative(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function validDeskPosition(value: unknown): value is DeskPosition {
  if (!value || typeof value !== 'object') return false;
  const d = value as Record<string, unknown>;
  return Number.isInteger(d.x) && Number.isInteger(d.z)
    && (d.x as number) >= -4 && (d.x as number) <= 4
    && (d.z as number) >= -3 && (d.z as number) <= 3;
}

export function parseGameState(raw: string | null, now = Date.now()): { state: GameState; offlineEarned: number } {
  const fresh = createInitialState(now);
  if (!raw) return { state: fresh, offlineEarned: 0 };

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return { state: fresh, offlineEarned: 0 };
    const old = parsed as Record<string, unknown>;
    const desks = Array.isArray(old.desks)
      ? old.desks.filter(validDeskPosition).slice(0, 200).map(d => ({ x: d.x, z: d.z }))
      : fresh.desks;
    const completedObjectives = Array.isArray(old.completedObjectives)
      ? old.completedObjectives.filter((id): id is string => typeof id === 'string' && id.length <= 64).slice(0, 100)
      : [];
    const state: GameState = {
      version: 4,
      cash: Math.floor(finiteNonNegative(old.cash, fresh.cash)),
      workers: Math.max(1, Math.min(200, Math.floor(finiteNonNegative(old.workers, fresh.workers)))),
      level: Math.max(1, Math.min(100, Math.floor(finiteNonNegative(old.level, fresh.level)))),
      desks: desks.length ? desks : fresh.desks,
      lifetimeEarned: Math.floor(finiteNonNegative(old.lifetimeEarned, 0)),
      lastSavedAt: Math.min(now, finiteNonNegative(old.lastSavedAt, now)),
      playerXp: Math.floor(finiteNonNegative(old.playerXp, 0)),
      completedObjectives: [...new Set(completedObjectives)],
      tutorialDismissed: old.tutorialDismissed === true
    };
    state.workers = Math.min(state.workers, state.desks.length);
    const elapsed = Math.min(OFFLINE_CAP_SECONDS, Math.max(0, (now - state.lastSavedAt) / 1000));
    const offlineEarned = Math.floor(incomePerSecond(state) * elapsed);
    state.cash += offlineEarned;
    state.lifetimeEarned += offlineEarned;
    state.lastSavedAt = now;
    return { state, offlineEarned };
  } catch {
    return { state: fresh, offlineEarned: 0 };
  }
}

export function earnForElapsed(state: GameState, elapsedSeconds: number): number {
  const safeElapsed = Number.isFinite(elapsedSeconds)
    ? Math.min(OFFLINE_CAP_SECONDS, Math.max(0, elapsedSeconds))
    : 0;
  const earned = Math.floor(incomePerSecond(state) * safeElapsed);
  state.cash += earned;
  state.lifetimeEarned += earned;
  return earned;
}

export function hireWorker(state: GameState): boolean {
  if (state.workers >= state.desks.length || state.cash < HIRE_COST) return false;
  state.cash -= HIRE_COST;
  state.workers += 1;
  return true;
}

export function buildDesk(state: GameState, position: DeskPosition): boolean {
  if (state.cash < DESK_COST || state.desks.length >= 200 || !validDeskPosition(position)) return false;
  const overlaps = state.desks.some(d => Math.abs(d.x - position.x) < 2 && Math.abs(d.z - position.z) < 2);
  if (overlaps) return false;
  state.cash -= DESK_COST;
  state.desks.push({ x: position.x, z: position.z });
  return true;
}

export function upgradeOffice(state: GameState): boolean {
  const cost = upgradeCost(state);
  if (state.cash < cost || state.level >= 100) return false;
  state.cash -= cost;
  state.level += 1;
  return true;
}

export function serializeGameState(state: GameState, now = Date.now()): string {
  state.lastSavedAt = now;
  return JSON.stringify({ ...state, version: 4 });
}
