import type { GameState } from './economy';

export const XP_PER_LEVEL = 100;

export const OBJECTIVES = [
  { id: 'first-desk', rewardCash: 500, rewardXp: 20, titleKey: 'objectiveDesk', hintKey: 'objectiveDeskHint' },
  { id: 'first-hire', rewardCash: 750, rewardXp: 30, titleKey: 'objectiveHire', hintKey: 'objectiveHireHint' },
  { id: 'first-upgrade', rewardCash: 1_000, rewardXp: 50, titleKey: 'objectiveUpgrade', hintKey: 'objectiveUpgradeHint' }
] as const;

export type ObjectiveId = typeof OBJECTIVES[number]['id'];

export function playerLevelForXp(xp: number): number {
  return Math.min(100, 1 + Math.floor(Math.max(0, xp) / XP_PER_LEVEL));
}

export function xpIntoCurrentLevel(xp: number): number {
  const safeXp = Math.max(0, xp);
  return playerLevelForXp(safeXp) >= 100 ? XP_PER_LEVEL : safeXp % XP_PER_LEVEL;
}

export function syncObjectives(state: GameState): ObjectiveId[] {
  const knownIds = new Set<string>(OBJECTIVES.map(objective => objective.id));
  const completed = new Set(state.completedObjectives.filter(id => knownIds.has(id)));
  if (!completed.has('first-desk')) completed.delete('first-hire');
  if (!completed.has('first-hire')) completed.delete('first-upgrade');
  const newlyCompleted: ObjectiveId[] = [];

  for (const objective of OBJECTIVES) {
    if (completed.has(objective.id)) continue;

    const achieved = objective.id === 'first-desk'
      ? state.desks.length >= 3
      : objective.id === 'first-hire'
        ? completed.has('first-desk') && state.workers >= 2
        : completed.has('first-hire') && state.level >= 2;

    if (!achieved) continue;
    completed.add(objective.id);
    newlyCompleted.push(objective.id);
    state.cash += objective.rewardCash;
    state.playerXp += objective.rewardXp;
  }

  state.completedObjectives = [...completed];
  if (state.completedObjectives.length === OBJECTIVES.length) state.tutorialDismissed = true;
  return newlyCompleted;
}
