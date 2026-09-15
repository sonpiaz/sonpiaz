import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkSiteDetails } from './check-site-details.mjs';
import {
  MAX_RESPONSE_BYTES,
  generateContributionAsset,
  parseContributionHtml,
  renderContributionSvg,
  validateContributionDays,
} from './github-contributions.mjs';
import { sourceState } from './agent-surface-provenance.mjs';

const makeDays = (count = 365) => Array.from({ length: count }, (_, index) => {
  const date = new Date(Date.UTC(2025, 0, 1 + index)).toISOString().slice(0, 10);
  return { date, level: index % 5 };
});
const makeHtml = days => days.map(day => `<td class="ContributionCalendar-day" data-date="${day.date}" data-level="${day.level}"></td>`).join('');

const days = makeDays();
assert.deepEqual(parseContributionHtml(makeHtml(days)), days);
assert.match(renderContributionSvg(days), /^<svg[\s\S]*<\/svg>\n$/);
assert.throws(() => parseContributionHtml(`${makeHtml(days)}<script>alert(1)</script>`), /unsafe markup/);
assert.throws(() => parseContributionHtml(makeHtml(days).replace('data-level="0"', 'data-level="9"')), /malformed|365 to 371/);
assert.throws(() => parseContributionHtml('x'.repeat(MAX_RESPONSE_BYTES + 1)), /size limit/);
assert.throws(() => validateContributionDays([...days.slice(0, -1), days[0]]), /duplicate|consecutive/);

const response = (body, { status = 200, type = 'text/html; charset=utf-8', length } = {}) => new Response(body, {
  status,
  headers: {
    'content-type': type,
    ...(length === undefined ? {} : { 'content-length': String(length) }),
  },
});
const generated = mkdtempSync(join(tmpdir(), 'sonpiaz-contributions-'));
try {
  mkdirSync(join(generated, 'data'));
  mkdirSync(join(generated, 'public'));
  writeFileSync(join(generated, 'data/github-contributions.json'), `${JSON.stringify(days)}\n`);
  const warnings = [];
  const result = await generateContributionAsset({
    root: generated,
    fetchImpl: async (_url, options) => {
      assert(options.signal instanceof AbortSignal, 'Contribution fetch lacks a timeout signal');
      throw new Error('offline fixture');
    },
    warn: message => warnings.push(message),
  });
  assert.equal(result.source, 'snapshot');
  assert.equal(warnings.length, 1);
  assert.match(readFileSync(join(generated, 'public/github-contributions.svg'), 'utf8'), /build-time snapshot/);
  await assert.rejects(
    generateContributionAsset({ root: generated, fetchImpl: async () => response('no', { status: 503 }), updateSnapshot: true }),
    /status 503/,
  );
  await assert.rejects(
    generateContributionAsset({ root: generated, fetchImpl: async () => response(makeHtml(days), { type: 'application/json' }), updateSnapshot: true }),
    /not HTML/,
  );
  await assert.rejects(
    generateContributionAsset({ root: generated, fetchImpl: async () => response(makeHtml(days), { length: MAX_RESPONSE_BYTES + 1 }), updateSnapshot: true }),
    /size limit/,
  );
  await assert.rejects(
    generateContributionAsset({ root: generated, fetchImpl: async () => response('x'.repeat(MAX_RESPONSE_BYTES + 1)), updateSnapshot: true }),
    /size limit/,
  );
} finally {
  rmSync(generated, { recursive: true, force: true });
}

const root = process.cwd();
const before = sourceState(root);
checkSiteDetails(root);
const fixture = mkdtempSync(join(tmpdir(), 'sonpiaz-site-details-'));
try {
  for (const folder of ['content', 'src', 'scripts', 'public', '.github', 'intent', 'dist']) {
    cpSync(join(root, folder), join(fixture, folder), { recursive: true });
  }
  cpSync(join(root, 'README.md'), join(fixture, 'README.md'));
  checkSiteDetails(fixture);
  const stackPath = join(fixture, 'dist/stack/index.html');
  const stack = readFileSync(stackPath, 'utf8');
  writeFileSync(stackPath, stack.replaceAll('utm_source=sonpiaz.com', 'utm_source=example.com'));
  assert.throws(() => checkSiteDetails(fixture), /wrong utm_source/);
  writeFileSync(stackPath, stack);
  const aboutPath = join(fixture, 'dist/about.md');
  const about = readFileSync(aboutPath, 'utf8');
  writeFileSync(aboutPath, about.replaceAll('/projects/affitor', '/projects/z-affitor'));
  assert.throws(() => checkSiteDetails(fixture), /missing \/projects\/affitor/);
  writeFileSync(aboutPath, about);
  checkSiteDetails(fixture);
  assert.deepEqual(sourceState(root), before, 'Original source changed during site-detail negative tests');
  checkSiteDetails(root);
  console.log('PASS: contribution schema, size, content-type, status, injection, fallback, Stack UTM, and product-order negative cases fail in isolation; original source remains unchanged.');
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
