import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { getEntry, type CollectionEntry } from 'astro:content';

export const site = 'https://sonpiaz.com';
export const entityId = (path: string) => `${site}${path.replace(/\/$/, '') || '/'}#entity`;
export const person = { '@type': 'Person', '@id': `${site}/#person`, name: 'Son Piaz', url: `${site}/` };
export const monthYear = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
export const fullDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
export const projectSections = [
  ['The problem', 'problem'], ['The approach', 'approach'],
  ['Where it is now', 'stage'], ['What happens if this works', 'vision'],
] as const;

export function firstParagraph(body = '') {
  return body.trim().split(/\n\s*\n/)[0].replace(/\s+/g, ' ').trim();
}

const updatedDates = new Map<string, Date>();
export function sourceUpdated(path: string) {
  if (!updatedDates.has(path)) {
    let committed = '';
    try {
      committed = execFileSync('git', ['log', '-1', '--format=%cs', '--', path], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {}
    updatedDates.set(path, committed ? new Date(`${committed}T00:00:00Z`) : statSync(path).mtime);
  }
  return updatedDates.get(path)!;
}

export function projectUpdated(project: CollectionEntry<'projects'>) {
  return sourceUpdated(`content/projects/${project.id}.md`);
}

export async function productFor(post: CollectionEntry<'posts'>) {
  if (!post.data.product) return undefined;
  const product = await getEntry(post.data.product);
  if (!product) throw new Error(`Missing product for post ${post.id}`);
  if (!post.data.problem) throw new Error(`Missing problem for product-linked post ${post.id}`);
  return product;
}
