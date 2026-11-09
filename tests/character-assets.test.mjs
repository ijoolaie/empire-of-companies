import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const assetPath = new URL('../assets/character-source/innerscene/harper-locomotion.glb', import.meta.url);
const licensePath = new URL('../assets/character-source/innerscene/README.md', import.meta.url);

test('Harper candidate remains a valid rigged GLB with the expected animation inventory', async () => {
  const bytes = await readFile(assetPath);
  assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);

  const jsonLength = bytes.readUInt32LE(12);
  const jsonType = bytes.readUInt32LE(16);
  assert.equal(jsonType, 0x4e4f534a);
  const gltf = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLength));

  assert.equal(gltf.skins?.length, 1);
  assert.equal(gltf.skins[0].joints.length, 56);
  assert.equal(gltf.meshes?.length, 12);
  assert.equal(gltf.materials?.length, 12);
  assert.deepEqual(
    gltf.animations.map((clip) => clip.name),
    ['Idle_Standing', 'Walk_Relaxed', 'Walk_Brisk', 'Jog', 'Run', 'Walk_Carry', 'Sit_Stand'],
  );
});

test('Harper candidate has its CC0 source and license provenance recorded', async () => {
  const readme = await readFile(licensePath, 'utf8');
  assert.match(readme, /CC0 1\.0/);
  assert.match(readme, /innerscene\.com\/tools\/library/);
  assert.match(readme, /MakeHuman \/ MPFB/);
});
