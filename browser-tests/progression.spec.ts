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
    await expect(canvas).toHaveAttribute('data-walking-worker-count', String(workerCount - 1));
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

test('scene profiling compares zero-worker and five-worker CPU/render resource metrics', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  const desks = [{ x: -2, z: -1 }, { x: 1, z: -1 }, { x: 4, z: 2 }, { x: -4, z: 2 }, { x: 0, z: 3 }];
  const save = workers => ({
    version: 4, cash: 100000, workers, level: 1, desks,
    lifetimeEarned: 0, lastSavedAt: Date.now(),
    playerXp: 0, completedObjectives: [], tutorialDismissed: true
  });
  await seedSave(page, save(0));
  await page.goto('/');
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

  await expect.poll(async () => Number(await canvas.getAttribute('data-frame-cpu-ms-avg')), { timeout: 15000 }).toBeGreaterThan(0);
  const zeroWorkers = await readMetrics();

  await page.evaluate(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: SAVE_KEY, value: save(5) });
  await page.reload();
  await expect(canvas).toHaveAttribute('data-worker-model-count', '5');
  await expect.poll(async () => Number(await canvas.getAttribute('data-frame-cpu-ms-avg')), { timeout: 15000 }).toBeGreaterThan(0);
  const fiveWorkers = await readMetrics();

  for (const metrics of [zeroWorkers, fiveWorkers]) {
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
  expect(fiveWorkers.materials).toBeGreaterThanOrEqual(zeroWorkers.materials);
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
    await expect(canvas).toHaveAttribute('data-walking-worker-count', '3');
    const waypointCounts = await canvas.getAttribute('data-worker-arrival-waypoint-counts');
    const counts = waypointCounts.split(',').map(Number);
    expect(counts).toHaveLength(4);
    expect(counts.slice(1).every(count => count > 1)).toBe(true);
    await expect(canvas).toHaveAttribute('data-walking-worker-count', '0', { timeout: 5500 });
    expect(pageErrors).toEqual([]);
    await context.close();
  }
});
