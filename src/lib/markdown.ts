import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { firstParagraph, isoDate, projectSections, projectUpdated, productFor, site, sourceUpdated, entityId } from './site';
import { aboutProjectSlugs, compareProjects } from './projects';
import { compareStackEntries, stackUrl } from './stack';
import { stackGroups } from './stack-groups';

const heading = (title: string, path: string) => `# ${title}\n\nSource: ${site}${path}\nID: ${entityId(path)}\n\n`;
const evidence = (item: { claim: string; source?: string }) => item.source ? `[${item.claim}](${item.source})` : item.claim;

export function projectMarkdown(project: CollectionEntry<'projects'>, posts: CollectionEntry<'posts'>[]) {
  const { data } = project;
  const related = posts.filter(post => post.data.product?.id === project.id);
  return heading(data.name, `/projects/${data.slug}`)
    + `${data.one_liner}\n\nStatus: ${data.status}${data.visibility === 'private' ? ' · Private' : ''}\nStarted: ${data.started}\n${Object.values(data.links).some(Boolean) ? `Updated: ${isoDate(projectUpdated(project))}\n` : ''}Tier: ${data.tier}\n\n`
    + projectSections.map(([title, field]) => `## ${title}\n\n${data[field].trim()}\n\n`).join('')
    + `## Evidence\n\n${data.evidence.map(item => `- ${evidence(item)}`).join('\n')}\n\n`
    + (related.length ? `## Writing about this\n\n${related.map(({ data }) => `- [${data.title}](${site}/writing/${data.slug}) (${isoDate(data.date)})`).join('\n')}\n\n` : '')
    + (project.body?.trim() ? `## Notes\n\n${project.body.trim()}\n\n` : '')
    + (Object.values(data.links).some(Boolean) ? `## Links\n\n${Object.entries(data.links).filter(([, href]) => href).map(([label, href]) => `- [${label}](${href})`).join('\n')}\n` : '');
}

export async function postMarkdown(post: CollectionEntry<'posts'>) {
  const { data } = post;
  const product = await productFor(post);
  return heading(data.title, `/writing/${data.slug}`)
    + `Date: ${isoDate(data.date)}\n${data.source_url ? `Original source: ${data.source_url}\n` : ''}\n${data.description}\n\n`
    + (data.quote ? `> ${data.quote}\n\n` : '')
    + `${post.body?.trim() || ''}\n`
    + (product ? `\n## The problem this came from\n\n${data.problem}\n\n[${product.data.name}](${site}/projects/${product.data.slug}) · ${product.data.status}\n\n${product.data.one_liner}\n\n→ ${site}/projects/${product.data.slug}\n` : '');
}

export async function markdownDocuments() {
  const projects = (await getCollection('projects')).sort(compareProjects);
  const posts = (await getCollection('posts')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const pages = await getCollection('pages');
  const stackEntries = (await getCollection('stack')).sort(compareStackEntries);
  const documents = new Map<string, string>();
  const projectRow = ({ data }: CollectionEntry<'projects'>) => `- [${data.name}](${site}/projects/${data.slug}): ${data.one_liner} Status: ${data.status}${data.visibility === 'private' ? ' · Private' : ''}. ${evidence(data.evidence[0])}`;
  for (const project of projects) documents.set(`projects/${project.data.slug}`, projectMarkdown(project, posts));
  for (const post of posts) documents.set(`writing/${post.data.slug}`, await postMarkdown(post));
  for (const page of pages.filter(page => !['home', 'about', 'stack'].includes(page.id))) {
    documents.set(page.id, heading(page.data.title!, `/${page.id}`) + `Updated: ${isoDate(sourceUpdated(`content/pages/${page.id}.md`))}\n\n` + (page.data.description ? `${page.data.description}\n\n` : '') + `${page.body?.trim() || ''}\n`);
  }
  const about = pages.find(page => page.id === 'about')!;
  const aboutIncluded = new Set<string>(aboutProjectSlugs);
  const aboutProjects = projects.filter(project => aboutIncluded.has(project.data.slug));
  documents.set('about', heading(about.data.title!, '/about')
    + `Updated: ${isoDate(sourceUpdated('content/pages/about.md'))}\n\n${about.body?.trim() || ''}\n\n`
    + `## What I have shipped\n\n### Products\n\n${aboutProjects.filter(project => project.data.tier === 'main').map(projectRow).join('\n')}\n\n`
    + `### Side projects and skills\n\n${aboutProjects.filter(project => project.data.tier === 'side').map(projectRow).join('\n')}\n`);
  const stack = pages.find(page => page.id === 'stack')!;
  documents.set('stack', heading(stack.data.title!, '/stack')
    + `Updated: ${isoDate(sourceUpdated('content/pages/stack.md'))}\n\n${stack.data.description}\n\n`
    + stackGroups.map(group => `## ${group.label}\n\n${stackEntries.filter(entry => entry.data.group === group.id).map(entry => `- [${entry.data.name}](${stackUrl(entry)}): ${entry.data.description}`).join('\n')}`).join('\n\n')
    + `\n\n`
    + `${stack.body?.trim() || ''}\n`);
  const writing = posts.map(({ data }) => `- [${data.title}](${site}/writing/${data.slug}) (${isoDate(data.date)})`).join('\n');
  const home = pages.find(page => page.id === 'home')!;
  const projectsUpdated = new Date(Math.max(sourceUpdated('src/pages/projects/index.astro').valueOf(), ...projects.map(project => projectUpdated(project).valueOf())));
  const writingUpdated = new Date(Math.max(sourceUpdated('src/pages/writing/index.astro').valueOf(), ...posts.map(post => sourceUpdated(`content/posts/${post.id}.md`).valueOf())));
  const homeUpdated = new Date(Math.max(sourceUpdated('content/pages/home.md').valueOf(), projectsUpdated.valueOf(), writingUpdated.valueOf()));
  documents.set('index', heading(home.data.headline!, '/') + `Updated: ${isoDate(homeUpdated)}\n\n${home.body?.trim()}\n\n`
    + home.data.intro_links.map(link => `[${link.label}](${link.href})`).join(' · ')
    + `\n\n## Products\n\n${projects.filter(({ data }) => data.tier === 'main').map(projectRow).join('\n')}\n\n`
    + `## Side projects\n\n${projects.filter(({ data }) => data.tier === 'side' && data.featured).map(projectRow).join('\n')}\n\n[All projects](${site}/projects)\n\n`
    + `## Writing\n\n${writing}\n\n## Timeline\n\n${home.data.timeline.map(item => `- ${item.date}: [${item.text}](${site}${item.href})`).join('\n')}\n`);
  const statuses = ['Live', 'Building', 'Paused', 'Archived', 'Sold'];
  documents.set('projects', heading('Projects', '/projects') + `Updated: ${isoDate(projectsUpdated)}\n\n` + [['main', 'Products'], ['side', 'Side projects']].map(([tier, label]) => `## ${label}\n\n` + statuses.map(status => {
    const group = projects.filter(({ data }) => data.tier === tier && data.status === status);
    return group.length ? `### ${status}\n\n${group.map(projectRow).join('\n')}\n\n` : '';
  }).join('')).join(''));
  documents.set('writing', heading('Writing', '/writing') + `Updated: ${isoDate(writingUpdated)}\n\n` + writing + '\n');
  for (const [path, markdown] of documents) documents.set(path, readableMarkdown(markdown));
  return documents;
}

export async function llmsSummary() {
  const home = (await getEntry('pages', 'home'))!;
  const projects = (await getCollection('projects')).sort(compareProjects);
  const posts = (await getCollection('posts')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const pages = (await getCollection('pages')).filter(page => page.id !== 'home');
  const stackEntries = (await getCollection('stack')).sort(compareStackEntries);
  return `# Son Piaz\n\n> ${home.data.headline} ${firstParagraph(home.body).split(/(?<=[.!?])\s+/)[0]}\n\n`
    + [['main', 'Products'], ['side', 'Side projects']].map(([tier, title]) => `## ${title}\n\n` + projects.filter(({ data }) => data.tier === tier).map(({ data }) => `- [${data.name}](${site}/projects/${data.slug}.md): ${data.one_liner} ${data.status}${data.visibility === 'private' ? ' · Private' : ''}. ID: ${entityId(`/projects/${data.slug}`)}`).join('\n')).join('\n\n')
    + `\n\n## Stack\n\n${stackGroups.map(group => {
      const count = stackEntries.filter(entry => entry.data.group === group.id).length;
      return `- [${group.label}](${site}/stack.md#${group.anchor}): ${count} ${count === 1 ? 'tool' : 'tools'}`;
    }).join('\n')}\n\n- [Full grouped stack](${site}/stack.md) · ID: ${entityId('/stack')}`
    + `\n\n## Writing\n\n${posts.map(({ data }) => `- [${data.title}](${site}/writing/${data.slug}.md) (${isoDate(data.date)}): ${data.description}${data.quote ? ` Quote: "${data.quote}"` : ''} ID: ${entityId(`/writing/${data.slug}`)}`).join('\n')}`
    + `\n\n## Pages\n\n- [Home](${site}/index.md) · ID: ${entityId('/')}\n- [All projects](${site}/projects.md) · ID: ${entityId('/projects')}\n- [All writing](${site}/writing.md) · ID: ${entityId('/writing')}\n${pages.map(page => `- [${page.data.title}](${site}/${page.id}.md) · ID: ${entityId(`/${page.id}`)}`).join('\n')}\n\n## Full text\n\n- [Full content](${site}/llms-full.txt)\n`;
}

export async function llmsFull() {
  const documents = await markdownDocuments();
  const projects = (await getCollection('projects')).sort(compareProjects);
  const keys = [...documents.keys()];
  const groups: [string, string[]][] = [
    ['Products', projects.filter(({ data }) => data.tier === 'main').map(({ data }) => `projects/${data.slug}`)],
    ['Side projects', projects.filter(({ data }) => data.tier === 'side').map(({ data }) => `projects/${data.slug}`)],
    ['Writing', keys.filter(key => key.startsWith('writing/'))],
    ['Pages', keys.filter(key => !key.includes('/'))],
  ];
  return '# Son Piaz\n\n' + groups.map(([title, paths]) => `## ${title}\n\n` + paths.map(path => documents.get(path)!.replace(/^(#{1,4}) /gm, '##$1 ')).join('\n')).join('\n');
}

function readableMarkdown(markdown: string) {
  const decode = (value: string) => value.replace(/<[^>]+>/g, '').replace(/&#(x[0-9a-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code))).replace(/&(amp|lt|gt|quot|apos);/g, (_, key) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" } as Record<string, string>)[key]!).replace(/\s+/g, ' ').trim();
  return markdown.replace(/<figure\b[^>]*>([\s\S]*?)<\/figure>/gi, (original, figure: string) => {
    if (!/<svg\b/i.test(figure)) return original;
    const description = figure.match(/aria-label="([^"]*)"/i)?.[1];
    const labels = [...figure.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)].map(match => decode(match[1]));
    const caption = figure.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1];
    return [description && decode(description), labels.length && labels.join('; '), caption && decode(caption)].filter(Boolean).join('\n\n');
  });
}
