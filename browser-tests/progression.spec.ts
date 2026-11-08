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
  await expect(page.locator('#game')).toHaveAttribute('data-desk-accessory-mesh-count', '9');
  await expect(page.locator('#game')).toHaveAttribute('data-desk-chair-detail-mesh-count', '9');
  await expect(page.locator('#game')).toHaveAttribute('data-desk-monitor-ui-count', '3');
  await expect(page.locator('#game')).toHaveAttribute('data-worker-leg-mesh-count', '5');
  await expect(page.locator('#game')).toHaveAttribute('data-worker-necktie-mesh-count', '1');
  const materialCountBeforeHire = await page.locator('#game').getAttribute('data-scene-material-count');

  const rows = page.locator('.objectives .objective');
  await expect(rows.nth(0)).toHaveClass(/is-complete/);
  await expect(page.locator('.progress-heading')).toContainText('20 / 100 XP');

  await page.locator('#hire').click();
  await expect(page.locator('#game')).toHaveAttribute('data-worker-model-count', '2');
  await expect(page.locator('#game')).toHaveAttribute('data-worker-appearance-variant-count', '2');
  await expect(page.locator('#game')).toHaveAttribute('data-walking-worker-count', '1');
  await expect.poll(async () => Number(await page.locator('#game').getAttribute('data-worker-shin-swing'))).toBeGreaterThan(0);
  await expect(page.locator('#game')).toHaveAttribute('data-worker-leg-mesh-count', '10');
  await expect(page.locator('#game')).toHaveAttribute('data-worker-necktie-mesh-count', '2');
  await expect(page.locator('#game')).toHaveAttribute('data-walking-worker-count', '0', { timeout: 12000 });
  await expect(page.locator('#game')).toHaveAttribute('data-scene-material-count', String(Number(materialCountBeforeHire) + 5));
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
    const expectedMaterials = initialMaterials + Math.min(workerCount - 1, 3) * 5;
    await expect(canvas).toHaveAttribute('data-scene-material-count', String(expectedMaterials));
  }
});


test('office shell has an open entrance, framed windows and layered lighting', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/');
  const canvas = page.locator('#game');
  await expect(canvas).toHaveAttribute('data-office-wall-segment-count', '5');
  await expect(canvas).toHaveAttribute('data-office-floor-joint-count', '18');
  await expect(canvas).toHaveAttribute('data-office-window-count', '3');
  await expect(canvas).toHaveAttribute('data-office-window-transom-count', '3');
  await expect(canvas).toHaveAttribute('data-office-window-center-mullion-count', '3');
  await expect(canvas).toHaveAttribute('data-office-entrance-part-count', '5');
  await expect(canvas).toHaveAttribute('data-office-light-count', '5');
  await expect(canvas).toHaveAttribute('data-office-ceiling-panel-count', '3');
  await expect(canvas).toHaveAttribute('data-office-furniture-count', '5');
  await expect(canvas).toHaveAttribute('data-office-book-material-count', '4');
  await expect(canvas).toHaveAttribute('data-office-plant-foliage-mesh-count', '2');
  await expect(canvas).toHaveAttribute('data-office-planter-detail-count', '4');
  await expect(canvas).toHaveAttribute('data-office-entry-detail-count', '9');
  await expect(canvas).toHaveAttribute('data-office-notice-board-mesh-count', '8');
  await expect(canvas).toHaveAttribute('data-office-notice-board-mounted', 'rear-wall');
  await expect(canvas).toHaveAttribute('data-office-clock-mounted', 'right-wall');
  await expect(canvas).toHaveAttribute('data-office-clock-detail-count', '15');
  await expect(canvas).toHaveAttribute('data-office-waiting-area-mesh-count', '5');
  expect(pageErrors).toEqual([]);
});

test('each office desk includes a monitor stand, base, keyboard and mouse', async ({ page }) => {
  await seedSave(page, {
    version: 4, cash: 100000, workers: 1, level: 1,
    desks: [{ x: -2, z: -1 }, { x: 1, z: -1 }, { x: 4, z: 2 }],
    lifetimeEarned: 0, lastSavedAt: Date.now(),
    playerXp: 0, completedObjectives: [], tutorialDismissed: true
  });
  await page.goto('/');
  await expect(page.locator('#game')).toHaveAttribute('data-desk-detail-mesh-count', '12');
  await expect(page.locator('#game')).toHaveAttribute('data-desk-storage-mesh-count', '6');
  await expect(page.locator('#game')).toHaveAttribute('data-desk-chair-detail-mesh-count', '9');
  await expect(page.locator('#game')).toHaveAttribute('data-desk-monitor-ui-count', '3');
});

test('seated workers cycle through distinct typing, reviewing and thinking poses', async ({ page }) => {
  await seedSave(page, {
    version: 4, cash: 100000, workers: 3, level: 1,
    desks: [{ x: -2, z: -1 }, { x: 1, z: -1 }, { x: 4, z: 2 }, { x: -4, z: 2 }],
    lifetimeEarned: 0, lastSavedAt: Date.now(),
    playerXp: 0, completedObjectives: [], tutorialDismissed: true
  });
  await page.goto('/');
  const canvas = page.locator('#game');
  await expect(canvas).toHaveAttribute('data-worker-model-count', '3');
  await expect(canvas).toHaveAttribute('data-worker-idle-pose-types', 'typing,reviewing,thinking');
  await expect(canvas).toHaveAttribute('data-worker-animation-update-hz', '30');
  await expect(canvas).toHaveAttribute('data-walking-worker-count', '0');
});
test('rapid consecutive hires reserve separate entrance corridors', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await seedSave(page, {
    version: 4, cash: 100000, workers: 1, level: 1,
    desks: [
      { x: -2, z: -1 }, { x: 1, z: -1 }, { x: 4, z: 2 },
      { x: -4, z: 2 }, { x: 0, z: 0 }
    ],
    lifetimeEarned: 0, lastSavedAt: Date.now(),
    playerXp: 0, completedObjectives: [], tutorialDismissed: true
  });
  await page.goto('/');
  const canvas = page.locator('#game');

  for (let workerCount = 2; workerCount <= 4; workerCount++) {
    await page.locator('#hire').click();
    await expect(canvas).toHaveAttribute('data-worker-model-count', String(workerCount));

  }

  await expect(canvas).toHaveAttribute('data-walking-worker-count', '0', { timeout: 5500 });
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(saved.workers).toBe(4);
  expect(pageErrors).toEqual([]);
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

test('main character is visible and worker models include facial features', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const desks = [{ x: -2, z: -1 }, { x: 1, z: -1 }];
  await seedSave(page, {
    version: 4, cash: 100000, workers: 2, level: 1, desks,
    lifetimeEarned: 0, lastSavedAt: Date.now(),
    playerXp: 0, completedObjectives: [], tutorialDismissed: true
  });
  await page.goto('/');
  const canvas = page.locator('#game');
  await expect(canvas).toHaveAttribute('data-main-character-present', 'true');
  await expect(canvas).toHaveAttribute('data-main-character-role', 'player-founder');
  await expect(canvas).toHaveAttribute('data-main-character-nameplate', 'true');
  await expect(canvas).toHaveAttribute('data-office-feature-wall-slat-count', '5');
  await expect(canvas).toHaveAttribute('data-worker-model-count', '2');
  await expect.poll(async () => Number(await canvas.getAttribute('data-worker-face-detail-mesh-count'))).toBeGreaterThanOrEqual(12);
  await expect.poll(async () => Number(await canvas.getAttribute('data-main-character-face-detail-count'))).toBeGreaterThanOrEqual(12);
});
test('player founder faces the camera and moves with WASD and arrow keys', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await seedSave(page, { version: 4, cash: 100000, workers: 0, level: 1, desks: [], lifetimeEarned: 0, lastSavedAt: Date.now(), playerXp: 0, completedObjectives: [], tutorialDismissed: true });
  await page.goto('/');
  const canvas = page.locator('#game');
  await expect(canvas).toHaveAttribute('data-player-controls', 'WASD+ArrowKeys');
  await expect(canvas).toHaveAttribute('data-player-facing-camera', 'true');
  await expect(canvas).toHaveAttribute('data-worker-facing-camera', 'true');
  await expect(page.locator('.movement-hint').first()).toContainText('WASD');
  const initialZ = Number(await canvas.getAttribute('data-player-z'));
  const initialX = Number(await canvas.getAttribute('data-player-x'));
  const initialHeadX = Number(await canvas.getAttribute('data-player-head-world-x'));
  const initialAlpha = await canvas.getAttribute('data-camera-alpha');
  await page.keyboard.down('ArrowUp');
  await expect.poll(async () => Number(await canvas.getAttribute('data-player-z'))).toBeLessThan(initialZ - 0.25);
  await page.keyboard.up('ArrowUp');
  await expect(canvas).toHaveAttribute('data-camera-alpha', initialAlpha!);
  const afterForward = Number(await canvas.getAttribute('data-player-z'));
  await page.keyboard.down('a');
  await expect.poll(async () => Number(await canvas.getAttribute('data-player-x'))).toBeLessThan(initialX - 0.15);
  await expect.poll(async () => Number(await canvas.getAttribute('data-player-head-world-x'))).toBeLessThan(initialHeadX - 0.1);
  await page.keyboard.up('a');
  await expect(canvas).toHaveAttribute('data-player-moving', 'false');
  expect(afterForward).toBeLessThan(initialZ);
});
test('office upgrades visibly transform room finishes and unlock decor tiers', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await seedSave(page, { version: 4, cash: 100000, workers: 0, level: 1, desks: [], lifetimeEarned: 0, lastSavedAt: Date.now(), playerXp: 0, completedObjectives: [], tutorialDismissed: true });
  await page.goto('/');
  const canvas = page.locator('#game');
  await expect(canvas).toHaveAttribute('data-office-visual-tier', '1');
  await expect(canvas).toHaveAttribute('data-office-upgrade-decor-count', '0');
  await page.locator('#upgrade').click();
  await expect(canvas).toHaveAttribute('data-office-visual-tier', '2');
  await expect(canvas).toHaveAttribute('data-office-upgrade-decor-count', '10');
  await page.locator('#upgrade').click();
  await expect(canvas).toHaveAttribute('data-office-visual-tier', '3');
  await expect(canvas).toHaveAttribute('data-office-upgrade-decor-count', '19');
  await page.reload();
  await expect(canvas).toHaveAttribute('data-office-visual-tier', '3');
  await expect(canvas).toHaveAttribute('data-office-upgrade-decor-count', '19');
});test('scene profiling compares zero, five, ten, twelve and twenty-worker CPU/render resource metrics', async ({ page }) => {
  test.setTimeout(210000);
  await page.setViewportSize({ width: 1280, height: 720 });
  const desks = [-3, -1, 1, 3].flatMap(z => [-4, -2, 0, 2, 4].map(x => ({ x, z })));
  const save = workers => ({
    version: 4, cash: 100000, workers, level: 1, desks,
    lifetimeEarned: 0, lastSavedAt: Date.now(),
    playerXp: 0, completedObjectives: [], tutorialDismissed: true
  });
  await seedSave(page, save(0));
  await page.goto('/?profile=1');
  const canvas = page.locator('#game');
  const readMetrics = () => canvas.evaluate(el => ({
    average: Number(el.getAttribute('data-frame-cpu-ms-avg')),
    p95: Number(el.getAttribute('data-frame-cpu-ms-p95')),
    max: Number(el.getAttribute('data-frame-cpu-ms-max')),
    meshes: Number(el.getAttribute('data-scene-mesh-count')),
    activeMeshes: Number(el.getAttribute('data-scene-active-mesh-count')),
    materials: Number(el.getAttribute('data-scene-material-count')),
    lights: Number(el.getAttribute('data-scene-light-count'))
  }));

  await expect.poll(async () => Number(await canvas.getAttribute('data-frame-cpu-ms-avg')), { timeout: 45000 }).toBeGreaterThan(0);
  const zeroWorkers = await readMetrics();

  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: SAVE_KEY, value: save(5) });
  await page.reload();
  await expect(canvas).toHaveAttribute('data-worker-model-count', '5');
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame-cpu-ms-avg')), { timeout: 45000 }).toBeGreaterThan(0);
  const fiveWorkers = await readMetrics();

  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: SAVE_KEY, value: save(10) });
  await page.reload();
  await expect(canvas).toHaveAttribute('data-worker-model-count', '10');
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame-cpu-ms-avg')), { timeout: 45000 }).toBeGreaterThan(0);
  const tenWorkers = await readMetrics();

  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: SAVE_KEY, value: save(12) });
  await page.reload();
  await expect(canvas).toHaveAttribute('data-worker-model-count', '12');
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame-cpu-ms-avg')), { timeout: 45000 }).toBeGreaterThan(0);
  const twelveWorkers = await readMetrics();

  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: SAVE_KEY, value: save(20) });
  await page.reload();
  await expect(canvas).toHaveAttribute('data-worker-model-count', '20');
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame-cpu-ms-avg')), { timeout: 45000 }).toBeGreaterThan(0);
  const twentyWorkers = await readMetrics();
  console.log('Scene profile samples', JSON.stringify({ zeroWorkers, fiveWorkers, tenWorkers, twelveWorkers, twentyWorkers }));

  for (const metrics of [zeroWorkers, fiveWorkers, tenWorkers, twelveWorkers, twentyWorkers]) {
    expect(metrics.average).toBeGreaterThan(0);
    expect(metrics.p95).toBeGreaterThan(0);
    expect(metrics.max).toBeGreaterThanOrEqual(metrics.p95);
    expect(metrics.meshes).toBeGreaterThan(0);
    expect(metrics.activeMeshes).toBeGreaterThan(0);
    expect(metrics.activeMeshes).toBeLessThanOrEqual(metrics.meshes);
    expect(metrics.materials).toBeGreaterThan(0);
    expect(metrics.lights).toBeGreaterThan(0);
  }
  expect(fiveWorkers.meshes).toBeGreaterThan(zeroWorkers.meshes);
  expect(tenWorkers.meshes).toBeGreaterThan(fiveWorkers.meshes);
  expect(twelveWorkers.meshes).toBeGreaterThan(tenWorkers.meshes);
  expect(twentyWorkers.meshes).toBeGreaterThan(twelveWorkers.meshes);
  expect(fiveWorkers.materials).toBeGreaterThanOrEqual(zeroWorkers.materials);
  expect(tenWorkers.materials).toBeGreaterThanOrEqual(fiveWorkers.materials);
  expect(twelveWorkers.materials).toBeGreaterThanOrEqual(tenWorkers.materials);
  expect(twentyWorkers.materials).toBeGreaterThanOrEqual(twelveWorkers.materials);
});

test('account dialog exposes modal semantics, traps focus and restores its opener', async ({ page }) => {
  await page.goto('/');
  const opener = page.locator('#account');
  await opener.focus();
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  const email = dialog.getByLabel('Email');
  const password = dialog.getByLabel('Password');
  const close = dialog.getByRole('button', { name: 'Close' });
  await expect(email).toBeFocused();
  await expect(password).toBeVisible();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator('#switch')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(opener).toBeFocused();
});

test('desk placement can be cancelled by Escape or the visible cancel action', async ({ page }) => {
  await page.goto('/');
  const build = page.locator('#build');
  await build.click();
  await expect(page.locator('#cancel-build')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#cancel-build')).toHaveCount(0);
  await build.click();
  await expect(page.locator('#cancel-build')).toBeVisible();
  await page.locator('#cancel-build').click();
  await expect(page.locator('#cancel-build')).toHaveCount(0);
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(saved.desks).toHaveLength(2);
});

test('office camera zoom stays within safe viewing limits', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const canvas = page.locator('#game');
  const betaMin = Number(await canvas.getAttribute('data-camera-beta-min'));
  const betaMax = Number(await canvas.getAttribute('data-camera-beta-max'));
  const radiusMin = Number(await canvas.getAttribute('data-camera-radius-min'));
  const radiusMax = Number(await canvas.getAttribute('data-camera-radius-max'));
  const initialRadius = Number(await canvas.getAttribute('data-camera-radius'));

  await page.mouse.move(300, 330);
  await page.mouse.wheel(0, -500);
  await expect.poll(async () => Number(await canvas.getAttribute('data-camera-radius'))).not.toBe(initialRadius);
  await expect.poll(async () => Number(await canvas.getAttribute('data-camera-radius'))).toBeLessThanOrEqual(radiusMax);
  await page.mouse.wheel(0, 5000);
  await expect.poll(async () => Number(await canvas.getAttribute('data-camera-radius'))).toBeGreaterThanOrEqual(radiusMin);

  const beta = Number(await canvas.getAttribute('data-camera-beta'));
  const radius = Number(await canvas.getAttribute('data-camera-radius'));
  expect(beta).toBeGreaterThanOrEqual(betaMin);
  expect(beta).toBeLessThanOrEqual(betaMax);
  expect(radius).toBeGreaterThanOrEqual(radiusMin);
  expect(radius).toBeLessThanOrEqual(radiusMax);
});

test('office canvas and action toolbar fit narrow, tablet and wide viewports', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 }
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    const metrics = await page.evaluate(() => {
      const canvas = document.querySelector('#game').getBoundingClientRect();
      const toolbar = document.querySelector('.toolbar').getBoundingClientRect();
      return {
        viewportWidth: document.documentElement.clientWidth,
        viewportHeight: document.documentElement.clientHeight,
        documentWidth: document.documentElement.scrollWidth,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        toolbarLeft: toolbar.left,
        toolbarRight: toolbar.right,
        toolbarTop: toolbar.top,
        toolbarBottom: toolbar.bottom,
        cameraBeta: Number(document.querySelector('#game').getAttribute('data-camera-beta')),
        cameraBetaMin: Number(document.querySelector('#game').getAttribute('data-camera-beta-min')),
        cameraBetaMax: Number(document.querySelector('#game').getAttribute('data-camera-beta-max')),
        cameraRadius: Number(document.querySelector('#game').getAttribute('data-camera-radius')),
        cameraRadiusMin: Number(document.querySelector('#game').getAttribute('data-camera-radius-min')),
        cameraRadiusMax: Number(document.querySelector('#game').getAttribute('data-camera-radius-max'))
      };
    });
    expect(metrics.documentWidth).toBe(metrics.viewportWidth);
    expect(metrics.canvasWidth).toBe(metrics.viewportWidth);
    expect(metrics.canvasHeight).toBe(metrics.viewportHeight);
    expect(metrics.toolbarLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.toolbarRight).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.toolbarTop).toBeGreaterThanOrEqual(0);
    expect(metrics.toolbarBottom).toBeLessThanOrEqual(metrics.viewportHeight);
    expect(metrics.cameraBeta).toBeGreaterThanOrEqual(metrics.cameraBetaMin);
    expect(metrics.cameraBeta).toBeLessThanOrEqual(metrics.cameraBetaMax);
    expect(metrics.cameraRadius).toBeGreaterThanOrEqual(metrics.cameraRadiusMin);
    expect(metrics.cameraRadius).toBeLessThanOrEqual(metrics.cameraRadiusMax);
  }
});

test('office camera responds to pointer drag while keeping tilt and zoom bounded', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  const canvas = page.locator('#game');
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();
  const initialAlpha = Number(await canvas.getAttribute('data-camera-alpha'));
  const initialBeta = Number(await canvas.getAttribute('data-camera-beta'));
  const initialRadius = Number(await canvas.getAttribute('data-camera-radius'));
  const betaMin = Number(await canvas.getAttribute('data-camera-beta-min'));
  const betaMax = Number(await canvas.getAttribute('data-camera-beta-max'));
  const radiusMin = Number(await canvas.getAttribute('data-camera-radius-min'));
  const radiusMax = Number(await canvas.getAttribute('data-camera-radius-max'));

  await page.mouse.move(bounds.x + bounds.width * 0.55, bounds.y + bounds.height * 0.55);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.72, bounds.y + bounds.height * 0.55, { steps: 8 });
  await page.mouse.up();

  await expect.poll(async () => Number(await canvas.getAttribute('data-camera-alpha'))).not.toBe(initialAlpha);
  const beta = Number(await canvas.getAttribute('data-camera-beta'));
  const radius = Number(await canvas.getAttribute('data-camera-radius'));
  expect(beta).toBeGreaterThanOrEqual(betaMin);
  expect(beta).toBeLessThanOrEqual(betaMax);
  expect(radius).toBeGreaterThanOrEqual(radiusMin);
  expect(radius).toBeLessThanOrEqual(radiusMax);

  const reset = page.locator('#camera-reset');
  await expect(reset).toHaveAttribute('aria-label', 'Reset camera view');
  await reset.click();
  await expect.poll(async () => Number(await canvas.getAttribute('data-camera-alpha'))).toBe(initialAlpha);
  await expect.poll(async () => Number(await canvas.getAttribute('data-camera-beta'))).toBe(initialBeta);
  await expect.poll(async () => Number(await canvas.getAttribute('data-camera-radius'))).toBe(initialRadius);
  await page.locator('#lang').click();
  await expect(reset).toHaveAttribute('aria-label', 'بازنشانی نمای دوربین');
});

test('three rapid arrivals find valid paths in alternate desk layouts', async ({ browser }) => {
  const layouts = [
    [
      { x: -3, z: -2 }, { x: 0, z: -2 }, { x: 3, z: -2 },
      { x: -3, z: 1 }, { x: 3, z: 1 }
    ],
    [
      { x: -3, z: -2 }, { x: 0, z: -2 }, { x: 3, z: 0 },
      { x: -3, z: 1 }, { x: 1, z: 2 }
    ]
  ];

  for (const desks of layouts) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await seedSave(page, {
      version: 4, cash: 100000, workers: 1, level: 1,
      desks, lifetimeEarned: 0, lastSavedAt: Date.now(),
      playerXp: 0, completedObjectives: [], tutorialDismissed: true
    });
    await page.goto('/');
    const canvas = page.locator('#game');

    for (let workerCount = 2; workerCount <= 4; workerCount++) {
      await page.locator('#hire').click();
      await expect(canvas).toHaveAttribute('data-worker-model-count', String(workerCount));
    }
    // Walking workers may finish before the browser assertion under a busy headless renderer.
    const waypointCounts = await canvas.getAttribute('data-worker-arrival-waypoint-counts');
    const counts = waypointCounts.split(',').map(Number);
    expect(counts).toHaveLength(4);
    expect(counts.slice(1).every(count => count > 1)).toBe(true);
    await expect(canvas).toHaveAttribute('data-walking-worker-count', '0', { timeout: 5500 });
    expect(pageErrors).toEqual([]);
    await context.close();
  }
});

test('desk placement preview distinguishes invalid and valid spots before charging', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('#game');
  await expect(canvas).toHaveAttribute('data-desk-placement-preview-count', '1');
  const bounds = await canvas.boundingBox();
  expect(bounds).not.toBeNull();

  await page.locator('#build').click();
  let invalidPoint: { x: number; y: number } | undefined;
  for (const py of [240, 320, 400, 480, 560]) {
    for (const px of [320, 480, 640, 800, 960]) {
      await page.mouse.move(px, py);
      await page.waitForTimeout(30);
      if (await canvas.getAttribute('data-desk-placement-floor-hit') === 'true') {
        invalidPoint = { x: px, y: py };
        break;
      }
    }
    if (invalidPoint) break;
  }
  expect(invalidPoint).toBeDefined();
  await expect(canvas).toHaveAttribute('data-desk-placement-preview-visible', 'true');
  await expect(canvas).toHaveAttribute('data-desk-placement-valid', 'false');
  await page.mouse.click(invalidPoint.x, invalidPoint.y);
  let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(saved.cash).toBe(12000);
  expect(saved.desks).toHaveLength(2);
  await expect(page.locator('#cancel-build')).toBeVisible();
  await page.locator('#cancel-build').click();
  await expect(canvas).toHaveAttribute('data-desk-placement-preview-visible', 'false');

  await page.locator('#build').click();
  let validPoint: { x: number; y: number } | undefined;
  for (const py of [200, 280, 360, 440, 520, 600]) {
    for (const px of [240, 360, 480, 600, 720, 840, 960, 1080]) {
      await page.mouse.move(px, py);
      await page.waitForTimeout(30);
      if (await canvas.getAttribute('data-desk-placement-valid') === 'true') {
        validPoint = { x: px, y: py };
        break;
      }
    }
    if (validPoint) break;
  }
  expect(validPoint).toBeDefined();
  await page.mouse.click(validPoint.x, validPoint.y);
  saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(saved.cash).toBeGreaterThanOrEqual(11000);
  expect(saved.cash).toBeLessThan(13000);
  expect(saved.desks).toHaveLength(3);
  await expect(page.locator('#cancel-build')).toHaveCount(0);
  await expect(canvas).toHaveAttribute('data-desk-placement-preview-visible', 'false');
});

test('touch desk placement previews on the first tap and commits on the second tap', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true
  });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem('eoc-lang', 'en'));
  await page.goto('/');
  const canvas = page.locator('#game');
  await page.locator('#build').click();

  let validPoint: { x: number; y: number } | undefined;
  for (const y of [240, 300, 360, 420, 480, 540]) {
    for (const x of [60, 120, 180, 240, 300, 360]) {
      await page.touchscreen.tap(x, y);
      if (await canvas.getAttribute('data-desk-placement-valid') === 'true') {
        validPoint = { x, y };
        break;
      }
    }
    if (validPoint) break;
  }

  expect(validPoint).toBeDefined();
  await expect(canvas).toHaveAttribute('data-desk-placement-preview-visible', 'true');
  await expect(page.locator('.panel .panel-notice')).toContainText('Tap the same spot again');
  await expect(page.locator('.toast')).toHaveCount(0);
  let saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(saved.desks).toHaveLength(2);
  expect(saved.cash).toBe(12000);

  await page.touchscreen.tap(validPoint.x, validPoint.y);
  saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(saved.desks).toHaveLength(3);
  await expect(page.locator('#cancel-build')).toHaveCount(0);
  await expect(canvas).toHaveAttribute('data-desk-placement-preview-visible', 'false');
  await context.close();
});
test('mobile build-mode toolbar keeps all five actions inside narrow viewports', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 375, height: 667 }, { width: 320, height: 568 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await page.locator('#build').click();
    await expect(page.locator('.panel .panel-notice')).toBeVisible();
    await expect(page.locator('.toast')).toHaveCount(0);
    const metrics = await page.evaluate(() => {
      const toolbar = document.querySelector('.toolbar').getBoundingClientRect();
      const topbar = document.querySelector('.topbar').getBoundingClientRect();
      const notice = document.querySelector('.panel-notice').getBoundingClientRect();
      const buttons = [...document.querySelectorAll('.toolbar .action')].map(button => {
        const rect = button.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      });
      return { width: document.documentElement.clientWidth, toolbarLeft: toolbar.left, toolbarRight: toolbar.right, toolbarTop: toolbar.top, topbarBottom: topbar.bottom, noticeTop: notice.top, panelBottom: document.querySelector('.panel').getBoundingClientRect().bottom, buttons };
    });
    expect(metrics.buttons).toHaveLength(5);
    expect(metrics.toolbarLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.toolbarRight).toBeLessThanOrEqual(metrics.width);
    expect(metrics.panelBottom).toBeLessThanOrEqual(metrics.toolbarTop);
    expect(metrics.noticeTop).toBeGreaterThan(metrics.topbarBottom);
    for (const button of metrics.buttons) {
      expect(button.left).toBeGreaterThanOrEqual(0);
      expect(button.right).toBeLessThanOrEqual(metrics.width);
    }
  }
});
