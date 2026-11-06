import { test, expect } from '@playwright/test';

const SAVE_KEY = 'eoc-save-v4';

async function seedSave(page, state) {
  await page.addInitScript(({ key, value }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(value));
    localStorage.setItem('eoc-lang', 'en');
  }, { key: SAVE_KEY, value: state });
}

test('first-run tutorial can be skipped and language direction switches', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.tutorial')).toBeVisible();
  await expect(page.locator('.objectives .objective')).toHaveCount(3);

  await page.locator('#lang').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('.tutorial')).toContainText('قدم‌های اول');

  await page.locator('#lang').click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await page.locator('#tutorial-skip').click();
  await expect(page.locator('.tutorial')).toHaveCount(0);

  await page.reload();
  await expect(page.locator('.tutorial')).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test('progression rewards are granted once and persist after reload', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const seeded = {
    version: 4, cash: 12000, workers: 1, level: 1,
    desks: [{ x: -2, z: -1 }, { x: 1, z: -1 }, { x: 4, z: 2 }],
    lifetimeEarned: 0, lastSavedAt: Date.now(),
    playerXp: 0, completedObjectives: [], tutorialDismissed: false
  };
  await seedSave(page, seeded);
  await page.goto('/');
  await expect(page.locator('#game')).toHaveAttribute('data-worker-model-count', '1');
  await expect(page.locator('#game')).toHaveAttribute('data-worker-leg-mesh-count', '6');
  const materialCountBeforeHire = await page.locator('#game').getAttribute('data-scene-material-count');

  const rows = page.locator('.objectives .objective');
  await expect(rows.nth(0)).toHaveClass(/is-complete/);
  await expect(page.locator('.progress-heading')).toContainText('20 / 100 XP');

  await page.locator('#hire').click();
  await expect(page.locator('#game')).toHaveAttribute('data-worker-model-count', '2');
  await expect(page.locator('#game')).toHaveAttribute('data-walking-worker-count', '1');
  await expect(page.locator('#game')).toHaveAttribute('data-worker-leg-mesh-count', '12');
  await expect(page.locator('#game')).toHaveAttribute('data-walking-worker-count', '0', { timeout: 4000 });
  await expect(page.locator('#game')).toHaveAttribute('data-scene-material-count', String(Number(materialCountBeforeHire) + 1));
  await expect(rows.nth(1)).toHaveClass(/is-complete/);
  await expect(page.locator('.progress-heading')).toContainText('50 / 100 XP');

  await page.locator('#upgrade').click();
  await expect(rows.nth(2)).toHaveClass(/is-complete/);
  await expect(page.locator('.stat').filter({ hasText: 'Player level' })).toContainText('2');
  await expect(page.locator('.tutorial')).toHaveCount(0);

  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(saved.version).toBe(4);
  expect(saved.completedObjectives).toEqual(['first-desk', 'first-hire', 'first-upgrade']);
  expect(saved.playerXp).toBe(100);
  const cashAfterCompletion = saved.cash;

  await page.reload();
  const restored = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(restored.cash).toBeGreaterThanOrEqual(cashAfterCompletion);
  expect(restored.completedObjectives).toHaveLength(3);
  await expect(page.locator('#game')).toHaveAttribute('data-walking-worker-count', '0');
  expect(pageErrors).toEqual([]);
});

test('worker material variants are reused instead of allocating one material set per employee', async ({ page }) => {
  await seedSave(page, {
    version: 4, cash: 100000, workers: 1, level: 1,
    desks: [{ x: -2, z: -1 }, { x: 1, z: -1 }, { x: 4, z: 2 }, { x: -4, z: 2 }, { x: 0, z: 3 }],
    lifetimeEarned: 0, lastSavedAt: Date.now(),
    playerXp: 0, completedObjectives: [], tutorialDismissed: true
  });
  await page.goto('/');
  const canvas = page.locator('#game');
  const initialMaterials = Number(await canvas.getAttribute('data-scene-material-count'));

  for (let workerCount = 2; workerCount <= 5; workerCount++) {
    await page.locator('#hire').click();
    await expect(canvas).toHaveAttribute('data-worker-model-count', String(workerCount));
    const expectedMaterials = initialMaterials + Math.min(workerCount - 1, 3);
    await expect(canvas).toHaveAttribute('data-scene-material-count', String(expectedMaterials));
  }
});

test('offline earnings are shown after restoring a saved game', async ({ page }) => {
  const seeded = {
    version: 4, cash: 8000, workers: 1, level: 1,
    desks: [{ x: -2, z: -1 }, { x: 1, z: -1 }],
    lifetimeEarned: 0, lastSavedAt: Date.now() - 60_000,
    playerXp: 0, completedObjectives: [], tutorialDismissed: true
  };
  await seedSave(page, seeded);
  await page.goto('/');
  await expect(page.locator('.panel')).toContainText('Offline earnings:');
  await expect(page.locator('.panel')).toContainText('+30');
});

test('320x568 viewport has no horizontal overflow or toolbar-panel overlap', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const metrics = await page.evaluate(() => {
    const panel = document.querySelector('.panel').getBoundingClientRect();
    const toolbar = document.querySelector('.toolbar').getBoundingClientRect();
    return {
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      panelBottom: panel.bottom,
      toolbarTop: toolbar.top
    };
  });
  expect(metrics.documentWidth).toBe(metrics.viewportWidth);
  expect(metrics.panelBottom).toBeLessThanOrEqual(metrics.toolbarTop);
});

test('mobile office panel stays compact while tutorial and progression remain reachable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const panel = page.locator('.panel');
  await expect(panel).toBeVisible();
  await expect(panel.locator('.tutorial')).toBeVisible();
  await expect(panel.locator('.objectives')).toBeHidden();
  const panelMetrics = await panel.evaluate(el => ({ width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height }));
  expect(panelMetrics.width).toBeLessThanOrEqual(210);
  expect(panelMetrics.height).toBeLessThan(300);
  await page.locator('#progress').click();
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('progression screen explains current milestones and planned future unlocks', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  await page.locator('#progress').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Your milestone path');
  await expect(dialog).toContainText('Build your first extra desk');
  await expect(dialog).toContainText('Expand to a new floor');
  await expect(dialog).toContainText('Create departments');
  await expect(dialog).toContainText('Launch another company');
  await expect(dialog.locator('.future-item em')).toHaveCount(3);
  await expect(dialog).toContainText('not available in this build yet');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test('progression screen is localized and fits a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.locator('#progress').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Your milestone path');
  const englishMetrics = await dialog.evaluate(el => ({
    width: el.scrollWidth,
    clientWidth: el.clientWidth,
    sheetHeight: el.querySelector('.progress-sheet').getBoundingClientRect().height,
    viewportHeight: window.innerHeight
  }));
  expect(englishMetrics.width).toBeLessThanOrEqual(englishMetrics.clientWidth);
  expect(englishMetrics.sheetHeight).toBeLessThanOrEqual(englishMetrics.viewportHeight);

  await page.keyboard.press('Escape');
  await page.locator('#lang').click();
  await page.locator('#progress').click();
  await expect(dialog).toContainText('مسیر مأموریت‌ها');
  await expect(dialog).toContainText('گسترش به طبقه جدید');
  await expect(dialog).toContainText('در برنامه توسعه هستند');
});

test('progression dialog traps keyboard focus and restores the opener on close', async ({ page }) => {
  await page.goto('/');
  const opener = page.locator('#progress');
  await opener.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog');
  const close = dialog.getByRole('button', { name: 'Close' });
  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('progression dialog fits common mobile, tablet and desktop viewport widths', async ({ page }) => {
  for (const viewport of [
    { width: 375, height: 667 },
    { width: 768, height: 1024 },
    { width: 1366, height: 768 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.locator('#progress').click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const metrics = await dialog.evaluate(el => ({
      width: el.scrollWidth,
      clientWidth: el.clientWidth,
      sheetHeight: el.querySelector('.progress-sheet').getBoundingClientRect().height,
      viewportHeight: window.innerHeight
    }));
    expect(metrics.width).toBeLessThanOrEqual(metrics.clientWidth);
    expect(metrics.sheetHeight).toBeLessThanOrEqual(metrics.viewportHeight);
    await page.keyboard.press('Escape');
  }
});