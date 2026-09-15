import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { files } from './agent-surface-provenance.mjs';

const productSlugs = ['kyma', 'affitor', 'mandeck', 'build-to-own'];
const productNames = ['Kyma API', 'Affitor', 'Mandeck', 'Build to Own'];
const importedPosts = [
  'why-saas-startups-get-stuck-on-growth',
  'building-a-product-is-hard-getting',
];
const stackGroups = [
  ['coding-agents', 'Coding agents', 'coding-agents'],
  ['workspace', 'Editors, terminal, browser, and source control', 'editors-terminal-browser-and-source-control'],
  ['ai-models', 'AI and local model apps', 'ai-and-local-model-apps'],
  ['languages-frameworks', 'Languages, runtimes, and frameworks', 'languages-runtimes-and-frameworks'],
  ['infrastructure', 'Infrastructure, hosting, and delivery', 'infrastructure-hosting-and-delivery'],
  ['data-storage', 'Data and storage', 'data-and-storage'],
  ['business', 'Business, payments, CRM, and secrets', 'business-payments-crm-and-secrets'],
  ['communication', 'Email and communication', 'email-and-communication'],
  ['analytics-seo', 'Analytics and SEO', 'analytics-and-seo'],
  ['design-content', 'Design and content', 'design-and-content'],
  ['planning-knowledge', 'Planning and knowledge', 'planning-and-knowledge'],
  ['tools-built', 'Tools and products I built', 'tools-and-products-i-built'],
];
const privateStackNames = ['Mercury', 'Strava', 'Uber', 'Gmail', 'Google Calendar', 'Google Drive', 'Goodnotes', 'Telegram', '1Password', 'LastPass CLI'];

function inOrder(text, values, label) {
  let previous = -1;
  for (const value of values) {
    const position = text.indexOf(value, previous + 1);
    assert(position >= 0, `${label} is missing ${value}`);
    assert(position > previous, `${label} has the wrong canonical product order`);
    previous = position;
  }
}

function decodeHtml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&#38;', '&');
}

export function checkSiteDetails(root = process.cwd()) {
  const read = path => readFileSync(join(root, path), 'utf8');
  const groupRank = new Map(stackGroups.map(([id], index) => [id, index]));
  const stackEntries = JSON.parse(read('content/stack.json')).sort((a, b) =>
    groupRank.get(a.group) - groupRank.get(b.group) || a.order - b.order || a.slug.localeCompare(b.slug));
  assert.equal(stackEntries.length, 87, 'Stack must contain the complete approved inventory');
  assert.equal(new Set(stackEntries.map(entry => entry.slug)).size, stackEntries.length, 'Stack slugs must be unique');
  assert.deepEqual([...new Set(stackEntries.map(entry => entry.group))], stackGroups.map(([id]) => id), 'Stack groups differ or are out of order');
  for (const [group] of stackGroups) {
    const entries = stackEntries.filter(entry => entry.group === group);
    assert(entries.length > 0, `Stack group is empty: ${group}`);
    assert.deepEqual(entries.map(entry => entry.order), entries.map((_, index) => index + 1), `Stack group order differs: ${group}`);
  }

  const orderSurfaces = [
    ['Home HTML', read('dist/index.html'), productSlugs.map(slug => `/projects/${slug}`)],
    ['Projects HTML', read('dist/projects/index.html'), productSlugs.map(slug => `/projects/${slug}`)],
    ['About HTML', read('dist/about/index.html'), productSlugs.map(slug => `/projects/${slug}`)],
    ['Home Markdown', read('dist/index.md'), productSlugs.map(slug => `/projects/${slug}`)],
    ['Projects Markdown', read('dist/projects.md'), productSlugs.map(slug => `/projects/${slug}`)],
    ['About Markdown', read('dist/about.md'), productSlugs.map(slug => `/projects/${slug}`)],
    ['llms.txt', read('dist/llms.txt'), productSlugs.map(slug => `/projects/${slug}.md`)],
    ['llms-full.txt', read('dist/llms-full.txt'), productSlugs.map(slug => `/projects/${slug}`)],
    ['README', read('README.md'), productNames],
  ];
  for (const [label, text, values] of orderSurfaces) inOrder(text, values, label);
  const homeHtml = read('dist/index.html');
  const linkedData = JSON.parse(homeHtml.match(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1] || '{}');
  const person = linkedData['@graph']?.find(item => item['@type'] === 'Person');
  assert.deepEqual(person?.knowsAbout, productNames, 'Person JSON-LD product order differs');
  assert.equal(person?.image, 'https://sonpiaz.com/images/son-piaz.webp', 'Person JSON-LD portrait differs');
  assert(person?.sameAs?.includes('https://www.youtube.com/sonpiaz'), 'Person JSON-LD lacks YouTube');

  const stackHtml = read('dist/stack/index.html');
  const stackMarkdown = read('dist/stack.md');
  const llmsSummary = read('dist/llms.txt');
  const llms = `${llmsSummary}\n${read('dist/llms-full.txt')}`;
  inOrder(stackHtml, stackGroups.map(([, label]) => `>${label}</h2>`), 'Stack HTML groups');
  inOrder(stackMarkdown, stackGroups.map(([, label]) => `## ${label}`), 'Stack Markdown groups');
  for (const [, label, anchor] of stackGroups) {
    assert(llmsSummary.includes(`[${label}](https://sonpiaz.com/stack.md#${anchor})`), `llms.txt lacks Stack group: ${label}`);
  }
  assert.equal(stackEntries.filter(entry => entry.logo).length, 73, 'Stack logo coverage differs');
  for (const entry of stackEntries) {
    for (const [label, text] of [['Stack HTML', stackHtml], ['Stack Markdown', stackMarkdown], ['LLM exports', llms]]) {
      const candidates = [...text.matchAll(/(?:href="([^"]+)"|\]\((https?:\/\/[^)]+)\))/g)]
        .map(match => decodeHtml(match[1] || match[2]))
        .filter(href => {
          try { return new URL(href).searchParams.get('utm_content') === entry.slug; }
          catch { return false; }
        });
      assert(candidates.length > 0, `${label} is missing attributed URL for ${entry.slug}`);
      for (const href of candidates) {
        const url = new URL(href);
        assert.equal(url.searchParams.getAll('utm_source').length, 1, `${label} duplicates utm_source for ${entry.slug}`);
        assert.equal(url.searchParams.get('utm_source'), 'sonpiaz.com', `${label} has wrong utm_source for ${entry.slug}`);
        assert.equal(url.searchParams.getAll('utm_medium').length, 1, `${label} duplicates utm_medium for ${entry.slug}`);
        assert.equal(url.searchParams.get('utm_medium'), 'referral', `${label} has wrong utm_medium for ${entry.slug}`);
        assert.equal(url.searchParams.getAll('utm_campaign').length, 1, `${label} duplicates utm_campaign for ${entry.slug}`);
        assert.equal(url.searchParams.get('utm_campaign'), 'stack', `${label} has wrong utm_campaign for ${entry.slug}`);
        assert.equal(url.searchParams.getAll('utm_content').length, 1, `${label} duplicates utm_content for ${entry.slug}`);
        assert.equal(url.searchParams.get('utm_content'), entry.slug, `${label} has wrong utm_content for ${entry.slug}`);
      }
    }
    if (entry.logo) {
      assert(entry.logo.startsWith('/images/'), `Stack logo must be self-hosted: ${entry.slug}`);
      assert(existsSync(join(root, 'public', entry.logo)), `Stack logo is missing: ${entry.logo}`);
      assert(stackHtml.includes(`src="${entry.logo}"`), `Stack HTML lacks logo for ${entry.slug}`);
    }
  }
  for (const name of privateStackNames) {
    assert(!stackEntries.some(entry => entry.name === name), `Private Stack candidate was published: ${name}`);
    assert(!stackHtml.includes(`>${name}<`) && !stackMarkdown.includes(`[${name}](`), `Private Stack candidate leaked to generated output: ${name}`);
  }
  assert(!/<img\b[^>]*\bsrc=""/i.test(stackHtml), 'Stack rendered an empty image');
  assert(!/https?:\/\/[^"']+github-contributions/i.test(stackHtml), 'Contribution graph makes a runtime external request');
  assert(/src="\/github-contributions\.svg"[^>]*width="680"[^>]*height="114"[^>]*loading="lazy"/.test(stackHtml), 'Contribution graph lacks its self-hosted fixed-size lazy image');
  assert(existsSync(join(root, 'public/github-contributions.svg')), 'Generated contribution SVG is missing');
  assert(/src="\/images\/son-piaz\.webp"[^>]*width="160"[^>]*height="160"[^>]*alt="Son Piaz speaking into a microphone"/.test(read('dist/about/index.html')), 'About portrait markup differs');
  const ogImage = readFileSync(join(root, 'public/og-default.png'));
  assert.equal(ogImage.readUInt32BE(0), 0x89504e47, 'Default OG image is not a PNG');
  assert.equal(ogImage.readUInt32BE(16), 1200, 'Default OG image width differs');
  assert.equal(ogImage.readUInt32BE(20), 630, 'Default OG image height differs');
  assert(ogImage.byteLength < 1_000_000, 'Default OG image exceeds 1 MB');
  for (const path of files(root, 'dist').filter(path => path.endsWith('.html'))) {
    const html = read(path);
    assert(/<meta property="og:title" content="[^"]+">/.test(html), `Missing og:title: ${path}`);
    assert(/<meta property="og:description" content="[^"]+">/.test(html), `Missing og:description: ${path}`);
    assert(/<meta property="og:url" content="https:\/\/sonpiaz\.com\/[^"]*">/.test(html), `Missing absolute og:url: ${path}`);
    assert(html.includes('<meta property="og:image" content="https://sonpiaz.com/og-default.png">'), `Missing default og:image: ${path}`);
    assert(html.includes('<meta property="og:image:width" content="1200">'), `Missing OG width: ${path}`);
    assert(html.includes('<meta property="og:image:height" content="630">'), `Missing OG height: ${path}`);
    assert(html.includes('<meta property="og:image:type" content="image/png">'), `Missing OG type: ${path}`);
    assert(html.includes('<meta name="twitter:card" content="summary_large_image">'), `Missing Twitter card: ${path}`);
    assert(html.includes('<meta name="twitter:image" content="https://sonpiaz.com/og-default.png">'), `Missing Twitter image: ${path}`);
  }
  const css = read('src/styles/global.css');
  assert(/\.about-avatar\s*\{[^}]*filter:\s*grayscale\(1\)/s.test(css), 'About portrait is not grayscale');
  assert(/@media \(max-width: 599px\)[\s\S]*\.about-avatar\s*\{[^}]*width:\s*112px;[^}]*height:\s*112px;/s.test(css), 'About portrait mobile dimensions differ');
  assert(/@media \(prefers-reduced-motion: reduce\)[\s\S]*scroll-behavior:\s*auto/s.test(css), 'Reduced-motion behavior is missing');
  for (const slug of productSlugs) {
    const source = slug === 'build-to-own' ? 'build-to-own.svg' : slug === 'mandeck' ? 'mandeck.png' : `${slug}.svg`;
    assert(existsSync(join(root, `public/images/projects/${source}`)), `Main product logo is missing: ${slug}`);
  }

  const sitemap = read('dist/sitemap.xml');
  const rss = read('dist/rss.xml');
  for (const slug of importedPosts) {
    const html = read(`dist/writing/${slug}/index.html`);
    assert(html.includes(`<link rel="canonical" href="https://sonpiaz.com/writing/${slug}">`), `Imported post canonical differs: ${slug}`);
    assert(html.includes(`"isBasedOn":"https://sonpiaz.substack.com/p/${slug}"`), `Imported post provenance differs: ${slug}`);
    for (const path of [`https://sonpiaz.com/writing/${slug}`, `https://sonpiaz.com/writing/${slug}.md`]) {
      assert(sitemap.includes(`<loc>${path}</loc>`), `Sitemap is missing ${path}`);
    }
    assert(rss.includes(`/writing/${slug}`), `RSS is missing ${slug}`);
    assert(llms.includes(`/writing/${slug}.md`), `LLM exports are missing ${slug}`);
    const body = read(`content/posts/${slug}.md`).replace(/^---[\s\S]*?---\s*/, '');
    assert(!/[$€£]|\b(?:USD|ARR|MRR|CAC|LTV|ROI)\b|\b\d+(?:[.,]\d+)?\s*(?:%|percent|million|billion|thousand)\b/i.test(body), `Imported post contains a prohibited figure: ${slug}`);
  }

  const publicTextFiles = [
    ...files(root, 'content'),
    ...files(root, 'src'),
    ...files(root, 'scripts'),
    ...files(root, '.github'),
    ...files(root, 'intent'),
    'README.md',
  ].filter(path => /\.(?:astro|css|html|js|json|md|mjs|ts|txt|ya?ml)$/.test(path));
  for (const path of publicTextFiles) {
    const text = read(path);
    assert(!text.includes('\u2014'), `Em dash in public source: ${path}`);
    assert(!/\/Users\/|file:\/\/|W\d{2}-\d+/.test(text), `Internal path or ticket ID in public source: ${path}`);
  }
  for (const path of files(root, 'dist').filter(path => /\.(?:html|md|txt|xml)$/.test(path))) {
    const text = read(path);
    assert(!text.includes('\u2014'), `Em dash in generated output: ${path}`);
    assert(!/\/Users\/|file:\/\/|W\d{2}-\d+/.test(text), `Internal path or ticket ID in generated output: ${path}`);
    if (path.endsWith('.html')) {
      for (const match of text.matchAll(/<img\b[^>]*\bsrc="([^"]*)"/g)) {
        assert(match[1].startsWith('/'), `Runtime image hotlink in ${path}: ${match[1]}`);
      }
    }
  }

  const workflow = read('.github/workflows/daily-rebuild.yml');
  assert(/schedule:/.test(workflow) && /workflow_dispatch:/.test(workflow), 'Daily workflow lacks schedule or manual trigger');
  assert(!/^\s+(?:push|pull_request|pull_request_target):/m.test(workflow), 'Daily workflow has an unapproved trigger');
  assert(/permissions:\s*\n\s+contents: write/.test(workflow), 'Daily workflow lacks minimal contents write permission');
  assert(/vars\.DAILY_REBUILD_ENABLED != 'false'/.test(workflow), 'Daily workflow lacks its kill switch');
  assert(!/\$\{\{\s*github\.event\./.test(workflow), 'Daily workflow interpolates untrusted event data');
  assert(/npm run verify:site/.test(workflow), 'Daily workflow does not run the full verification suite');
  assert(workflow.indexOf('npm run verify:site') < workflow.indexOf('git commit --allow-empty'), 'Daily workflow commits before verification');
  assert(/git commit --allow-empty/.test(workflow) && /git push origin HEAD:main/.test(workflow), 'Daily workflow does not create and push one empty main commit');
  assert(/concurrency:/.test(workflow), 'Daily workflow lacks a concurrency lock');
  return { products: productSlugs.length, stack: stackEntries.length, stackGroups: stackGroups.length, posts: importedPosts.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(checkSiteDetails(resolve(process.argv[2] || '.')), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
