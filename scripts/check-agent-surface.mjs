import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { files, fingerprint, manifestPath, sourceState } from './agent-surface-provenance.mjs';

const providerNames = /\b(?:Vercel|Cloudflare|Netlify|Supabase|Upstash|Neon|Railway|Heroku|DigitalOcean|Hetzner|AWS|Amazon Web Services|Google Cloud|Azure)\b|\b(?:fly\.io|render\.com|vercel\.app|workers\.dev)\b/i;
const demote = text => text.replace(/^(#{1,4}) /gm, '##$1 ');
const approvedStackProviderLine = '- [Vercel](https://vercel.com/?utm_source=sonpiaz.com&utm_medium=referral&utm_campaign=stack&utm_content=vercel): The deployment platform that publishes this static site from its reviewed main branch.';
const withoutApprovedStackProvider = (text, path) => (
  ['dist/stack.md', 'dist/llms.txt', 'dist/llms-full.txt'].includes(path)
    ? text.replaceAll(approvedStackProviderLine, '')
    : text
);

export function checkAgentSurface(root = process.cwd()) {
  const read = path => readFileSync(join(root, path), 'utf8');
  assert(existsSync(join(root, manifestPath)), 'Missing build provenance; run npm run build');
  const manifest = JSON.parse(read(manifestPath));
  assert.equal(manifest.format, 1, 'Unsupported provenance format');
  const current = sourceState(root);
  assert.deepEqual(current.inputs, manifest.inputs, 'Stale source: source fingerprints differ from built inputs');
  assert.deepEqual(current.generator, manifest.generator, 'Stale generator: rebuild with current generator');
  const artifacts = fingerprint(join(root, 'dist'), files(join(root, 'dist'), '.').map(path => path.slice(2)));
  assert.deepEqual(artifacts, manifest.artifacts, 'Generated output changed or missing since build');
  const urls = [...read('dist/sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
  const htmlUrls = urls.filter(url => !url.endsWith('.md'));
  const mdUrls = urls.filter(url => url.endsWith('.md'));
  const markdownFiles = files(root, 'dist').filter(path => path.endsWith('.md'));
  for (const file of markdownFiles) assert(!providerNames.test(withoutApprovedStackProvider(read(file), file)), `Infrastructure provider name in Markdown: ${file}`);
  assert.deepEqual(markdownFiles, mdUrls.map(url => `dist${new URL(url).pathname}`).sort(), 'Orphan or missing Markdown outside sitemap');
  assert.equal(htmlUrls.length, mdUrls.length, 'Sitemap must contain one Markdown twin per HTML page');
  const htmlFiles = files(root, 'dist').filter(path => path.endsWith('.html') && path !== 'dist/404.html');
  assert.equal(htmlFiles.length, htmlUrls.length, 'Sitemap must cover every non-404 HTML page');
  const summary = read('dist/llms.txt');
  const full = read('dist/llms-full.txt');
  assert(Buffer.byteLength(summary) < 10000, 'llms.txt must stay below 10 KB');
  const seenIds = new Set();
  const manifestIds = [];
  for (const url of htmlUrls) {
    assert(url.startsWith('https://sonpiaz.com/'), 'Unexpected sitemap origin');
    const path = new URL(url).pathname;
    const mdPath = path === '/' ? '/index.md' : `${path}.md`;
    const mdUrl = `https://sonpiaz.com${mdPath}`;
    assert(mdUrls.includes(mdUrl), `Missing sitemap twin: ${url}`);
    assert(summary.includes(`](${mdUrl})`), `Missing llms index link: ${mdUrl}`);
    const html = read(`dist${path === '/' ? '/index.html' : `${path}/index.html`}`);
    const markdown = read(`dist${mdPath}`);
    const expectedId = `${url}#entity`;
    const id = markdown.match(/^ID: (\S+)$/m)?.[1];
    assert.equal(id, expectedId, `Invalid stable ID: ${mdPath}`);
    assert(!seenIds.has(id), `Duplicate stable ID: ${id}`);
    seenIds.add(id);
    assert(summary.includes(`ID: ${id}`), `Missing llms index ID: ${mdPath}`);
    assert(html.includes(`data-entity-id="${id}"`), `HTML identity mismatch: ${path}`);
    const graphs = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(match => {
      const data = JSON.parse(match[1]);
      return data['@graph'] || [data];
    });
    assert(graphs.some(item => item['@id'] === id), `JSON-LD identity missing: ${path}`);
    assert(html.includes(`type="text/markdown" href="${mdUrl}"`), `Missing HTML alternate: ${path}`);
    assert(markdown.startsWith('# ') && !markdown.startsWith('---'), `Invalid Markdown header: ${mdPath}`);
    assert(markdown.includes(`Source: ${url}\n`), `Markdown source missing: ${mdPath}`);
    assert(!/<\/?[a-z][^>]*>/i.test(markdown), `Raw HTML decoration in Markdown: ${mdPath}`);
    assert(!/^## Links\s*$/.test(markdown.trim().split(/\n(?=## )/).at(-1) || ''), `Empty Links section: ${mdPath}`);
    assert(full.includes(demote(markdown)), `Full export lost document: ${mdPath}`);
    if (path.startsWith('/projects/')) {
      const source = read(`content/projects/${path.split('/').at(-1)}.md`);
      const privateSource = /^visibility:\s*private\s*$/m.test(source);
      assert.equal(/^Status:.*\bPrivate\b/m.test(markdown), privateSource, `Private Markdown mismatch: ${path}`);
      assert.equal(/class="meta">Private<\/span>/.test(html), privateSource, `Private HTML mismatch: ${path}`);
    }
    manifestIds.push(id);
  }
  assert(!providerNames.test(withoutApprovedStackProvider(summary, 'dist/llms.txt')), 'Infrastructure provider name in llms.txt outside approved Stack entry');
  assert(!providerNames.test(withoutApprovedStackProvider(full, 'dist/llms-full.txt')), 'Infrastructure provider name in llms-full.txt outside approved Stack entry');
  const sourceCount = files(root, 'content').filter(path => path.endsWith('.md') && !path.split('/').at(-1).startsWith('_')).length + 2;
  assert.equal(htmlUrls.length, sourceCount, 'Published surface does not cover all content sources and indexes');
  return { html: htmlUrls.length, markdown: mdUrls.length, stableIds: manifestIds.length, llmsBytes: Buffer.byteLength(summary), generator: current.generator.version };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(checkAgentSurface(resolve(process.argv[2] || '.')), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
