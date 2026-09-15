import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const CONTRIBUTIONS_URL = 'https://github.com/users/sonpiaz/contributions';
export const MAX_RESPONSE_BYTES = 300 * 1024;
export const FETCH_TIMEOUT_MS = 8_000;
export const SNAPSHOT_PATH = 'data/github-contributions.json';
export const OUTPUT_PATH = 'public/github-contributions.svg';

const unsafeMarkup = /<script\b|javascript:|\bon[a-z]+\s*=/i;
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[character]);
}

function dayNumber(date) {
  return Date.parse(`${date}T00:00:00Z`) / 86_400_000;
}

export function validateContributionDays(value) {
  if (!Array.isArray(value) || value.length < 365 || value.length > 371) {
    throw new Error('Contribution data must contain 365 to 371 days');
  }
  const days = value.map((item, index) => {
    if (!item || typeof item !== 'object' || Object.keys(item).sort().join(',') !== 'date,level') {
      throw new Error(`Contribution day ${index} has an invalid schema`);
    }
    if (typeof item.date !== 'string' || !isoDate.test(item.date)
      || new Date(`${item.date}T00:00:00Z`).toISOString().slice(0, 10) !== item.date) {
      throw new Error(`Contribution day ${index} has an invalid date`);
    }
    if (!Number.isInteger(item.level) || item.level < 0 || item.level > 4) {
      throw new Error(`Contribution day ${index} has an invalid level`);
    }
    return { date: item.date, level: item.level };
  }).sort((a, b) => a.date.localeCompare(b.date));
  if (new Set(days.map(day => day.date)).size !== days.length) {
    throw new Error('Contribution data contains duplicate dates');
  }
  for (let index = 1; index < days.length; index += 1) {
    if (dayNumber(days[index].date) !== dayNumber(days[index - 1].date) + 1) {
      throw new Error('Contribution dates must be consecutive');
    }
  }
  return days;
}

export function parseContributionHtml(html) {
  if (typeof html !== 'string') throw new Error('Contribution response must be text');
  if (Buffer.byteLength(html) > MAX_RESPONSE_BYTES) throw new Error('Contribution response exceeds size limit');
  if (unsafeMarkup.test(html)) throw new Error('Contribution response contains unsafe markup');
  const days = [];
  for (const match of html.matchAll(/<td\b[^>]{0,2048}>/gi)) {
    const tag = match[0];
    const dateAttributes = [...tag.matchAll(/\bdata-date="([^"]*)"/gi)];
    const levelAttributes = [...tag.matchAll(/\bdata-level="([^"]*)"/gi)];
    if (dateAttributes.length === 0 && levelAttributes.length === 0) continue;
    if (dateAttributes.length !== 1 || levelAttributes.length !== 1) {
      throw new Error('Contribution cell must have one date and one level');
    }
    const date = dateAttributes[0][1];
    const level = levelAttributes[0][1];
    if (!isoDate.test(date) || !/^[0-4]$/.test(level)) {
      throw new Error('Contribution cell has a malformed date or level');
    }
    days.push({ date, level: Number(level) });
  }
  return validateContributionDays(days);
}

async function readBoundedBody(response) {
  if (!response.body) throw new Error('Contribution response has no body');
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error('Contribution response exceeds size limit');
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks, size).toString('utf8');
}

export async function fetchContributionDays(fetchImpl = fetch) {
  const response = await fetchImpl(CONTRIBUTIONS_URL, {
    headers: {
      accept: 'text/html',
      'user-agent': 'sonpiaz-site-build',
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (response.status !== 200) throw new Error(`Contribution response status ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  if (!/^text\/html(?:;|$)/i.test(contentType)) throw new Error('Contribution response is not HTML');
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
    throw new Error('Contribution response exceeds size limit');
  }
  return parseContributionHtml(await readBoundedBody(response));
}

export function renderContributionSvg(input) {
  const days = validateContributionDays(input);
  const first = dayNumber(days[0].date);
  const cell = 9;
  const step = 12;
  const left = 28;
  const top = 22;
  const startDay = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const columns = Math.ceil((days.length + startDay) / 7);
  if (columns > 53) throw new Error('Contribution data exceeds the SVG grid');
  const width = 680;
  const height = 114;
  const monthLabels = [];
  const seenMonths = new Set();
  const cells = days.map(day => {
    const date = new Date(`${day.date}T00:00:00Z`);
    const offset = dayNumber(day.date) - first + startDay;
    const column = Math.floor(offset / 7);
    const row = date.getUTCDay();
    const month = day.date.slice(0, 7);
    if (!seenMonths.has(month) && date.getUTCDate() <= 7) {
      seenMonths.add(month);
      monthLabels.push(`<text x="${left + column * step}" y="11">${escapeXml(new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(date))}</text>`);
    }
    const title = `${day.date}: contribution level ${day.level}`;
    return `<rect class="level-${day.level}" x="${left + column * step}" y="${top + row * step}" width="${cell}" height="${cell}" rx="2"><title>${escapeXml(title)}</title></rect>`;
  });
  const labels = [[1, 'Mon'], [3, 'Wed'], [5, 'Fri']]
    .map(([row, label]) => `<text x="0" y="${top + Number(row) * step + 8}">${escapeXml(label)}</text>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">
<title id="title">Son Piaz GitHub contributions over the last year</title>
<desc id="description">A build-time snapshot from GitHub. Darker squares indicate higher contribution levels.</desc>
<style>
text{fill:#737373;font:9px ui-monospace,SFMono-Regular,Menlo,monospace}.level-0{fill:#ebedf0}.level-1{fill:#c6c6c6}.level-2{fill:#969696}.level-3{fill:#626262}.level-4{fill:#262626}
@media(prefers-color-scheme:dark){text{fill:#8a8a8a}.level-0{fill:#262626}.level-1{fill:#505050}.level-2{fill:#797979}.level-3{fill:#a7a7a7}.level-4{fill:#e5e5e5}}
</style>
${monthLabels.join('')}
${labels.join('')}
${cells.join('')}
</svg>
`;
}

function writeIfChanged(path, contents) {
  let existing;
  try { existing = readFileSync(path, 'utf8'); } catch {}
  if (existing !== contents) writeFileSync(path, contents);
}

export async function generateContributionAsset({
  root = process.cwd(),
  fetchImpl = fetch,
  updateSnapshot = false,
  warn = message => console.warn(message),
} = {}) {
  const snapshotPath = resolve(root, SNAPSHOT_PATH);
  const outputPath = resolve(root, OUTPUT_PATH);
  let days;
  let source = 'github';
  try {
    days = await fetchContributionDays(fetchImpl);
  } catch (error) {
    if (updateSnapshot) throw error;
    source = 'snapshot';
    warn(`GitHub contribution fetch failed; using committed snapshot: ${error.message}`);
    days = validateContributionDays(JSON.parse(readFileSync(snapshotPath, 'utf8')));
  }
  if (updateSnapshot) writeIfChanged(snapshotPath, `${JSON.stringify(days, null, 2)}\n`);
  writeIfChanged(outputPath, renderContributionSvg(days));
  return { source, days: days.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await generateContributionAsset({ updateSnapshot: process.argv.includes('--update-snapshot') });
  console.log(`Generated ${OUTPUT_PATH} from ${result.source} (${result.days} days)`);
}
