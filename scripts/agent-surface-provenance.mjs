import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const manifestPath = '.astro/agent-surface-manifest.json';
export const hash = value => createHash('sha256').update(value).digest('hex');
export function files(root, folder) {
  const directory = join(root, folder);
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = `${folder}/${entry.name}`;
    return entry.isDirectory() ? files(root, path) : entry.isFile() ? [path] : [];
  }).sort();
}
export function fingerprint(root, paths) {
  return Object.fromEntries([...paths].sort().map(path => [path, hash(readFileSync(join(root, path)))]));
}
export function sourceState(root) {
  const paths = ['content', 'src', 'scripts', 'public', '.github'].flatMap(folder => files(root, folder));
  paths.push('package.json', 'package-lock.json', 'astro.config.ts', 'tsconfig.json');
  if (existsSync(join(root, 'vercel.json'))) paths.push('vercel.json');
  const inputs = fingerprint(root, paths);
  const generator = Object.fromEntries(Object.entries(inputs).filter(([path]) => !path.startsWith('content/')));
  const astro = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8')).packages['node_modules/astro'].version;
  return { inputs, generator: { name: 'sonpiaz-agent-surface', version: hash(JSON.stringify(generator)), astro } };
}
export default function agentSurfaceProvenance() {
  let root;
  let before;
  return {
    name: 'agent-surface-provenance',
    hooks: {
      'astro:config:done': ({ config }) => { root = fileURLToPath(config.root); },
      'astro:build:start': () => { before = sourceState(root); },
      'astro:build:done': ({ dir }) => {
        const after = sourceState(root);
        if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error('Agent surface: source changed during build');
        const installed = JSON.parse(readFileSync(join(root, 'node_modules/astro/package.json'), 'utf8')).version;
        if (installed !== after.generator.astro) throw new Error('Agent surface: installed Astro differs from lockfile');
        const output = fileURLToPath(dir);
        const artifacts = fingerprint(output, files(output, '.').map(path => path.slice(2)));
        mkdirSync(join(root, '.astro'), { recursive: true });
        writeFileSync(join(root, manifestPath), JSON.stringify({ format: 1, ...after, artifacts }, null, 2) + '\n');
      },
    },
  };
}
