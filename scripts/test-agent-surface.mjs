import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { checkAgentSurface } from './check-agent-surface.mjs';
import { files, fingerprint, manifestPath, sourceState } from './agent-surface-provenance.mjs';

const root = process.cwd();
const before = sourceState(root);
checkAgentSurface(root);
const parent = join(root, '.internal/agent-readable-surface-negative');
mkdirSync(parent, { recursive: true });
const fixture = mkdtempSync(join(parent, 'fixture-'));
try {
  for (const file of Object.keys(before.inputs)) {
    mkdirSync(join(fixture, file, '..'), { recursive: true });
    cpSync(join(root, file), join(fixture, file));
  }
  cpSync(join(root, 'dist'), join(fixture, 'dist'), { recursive: true });
  mkdirSync(join(fixture, '.astro'), { recursive: true });
  cpSync(join(root, manifestPath), join(fixture, manifestPath));
  checkAgentSurface(fixture);
  const markdownPath = join(fixture, 'dist/about.md');
  const markdown = readFileSync(markdownPath);
  writeFileSync(markdownPath, 'Stale or corrupted output\n');
  assert.throws(() => checkAgentSurface(fixture), /Generated output changed/);
  writeFileSync(markdownPath, markdown);
  checkAgentSurface(fixture);
  rmSync(markdownPath);
  assert.throws(() => checkAgentSurface(fixture), /Generated output changed/);
  writeFileSync(markdownPath, markdown);
  const sourcePath = join(fixture, 'content/pages/about.md');
  const source = readFileSync(sourcePath);
  writeFileSync(sourcePath, Buffer.concat([source, Buffer.from('\nChanged source fixture.\n')]));
  assert.throws(() => checkAgentSurface(fixture), /Stale source/);
  writeFileSync(sourcePath, source);
  const generatorPath = join(fixture, 'src/lib/markdown.ts');
  const generator = readFileSync(generatorPath);
  writeFileSync(generatorPath, Buffer.concat([generator, Buffer.from('\n// Changed generator fixture.\n')]));
  assert.throws(() => checkAgentSurface(fixture), /Stale source|Stale generator/);
  writeFileSync(generatorPath, generator);
  checkAgentSurface(fixture);
  const fixtureManifestPath = join(fixture, manifestPath);
  const originalManifest = readFileSync(fixtureManifestPath);
  const refreshArtifactProof = () => {
    const manifest = JSON.parse(originalManifest);
    manifest.artifacts = fingerprint(join(fixture, 'dist'), files(join(fixture, 'dist'), '.').map(path => path.slice(2)));
    writeFileSync(fixtureManifestPath, JSON.stringify(manifest));
  };
  const summaryPath = join(fixture, 'dist/llms.txt');
  const summary = readFileSync(summaryPath);
  writeFileSync(summaryPath, summary.toString().replace(' · ID: https://sonpiaz.com/about#entity', ''));
  refreshArtifactProof();
  assert.throws(() => checkAgentSurface(fixture), /Missing llms index ID/);
  writeFileSync(summaryPath, summary);
  writeFileSync(fixtureManifestPath, originalManifest);
  checkAgentSurface(fixture);
  const extraMarkdownPath = join(fixture, 'dist/debug.md');
  writeFileSync(extraMarkdownPath, '# Debug\n\nHosted on Vercel.\n');
  refreshArtifactProof();
  assert.throws(() => checkAgentSurface(fixture), /Infrastructure provider name in Markdown/);
  writeFileSync(extraMarkdownPath, '# Debug\n\nUnlisted document.\n');
  refreshArtifactProof();
  assert.throws(() => checkAgentSurface(fixture), /Orphan or missing Markdown/);
  rmSync(extraMarkdownPath);
  writeFileSync(fixtureManifestPath, originalManifest);
  checkAgentSurface(fixture);
  assert.deepEqual(sourceState(root), before, 'Original source changed during negative tests');
  checkAgentSurface(root);
  console.log('PASS: isolated corrupted Markdown, missing Markdown, stale source, stale generator, missing index ID, provider-bearing extra Markdown, and orphan Markdown each fail; semantic cases use refreshed artifact hashes; restored fixture and original pass.');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
