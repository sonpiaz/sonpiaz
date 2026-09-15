import type { CollectionEntry } from 'astro:content';

const attribution = {
  utm_source: 'sonpiaz.com',
  utm_medium: 'referral',
  utm_campaign: 'stack',
} as const;

export const compareStackEntries = (a: CollectionEntry<'stack'>, b: CollectionEntry<'stack'>) =>
  a.data.order - b.data.order || a.data.slug.localeCompare(b.data.slug);

export function stackUrl(entry: CollectionEntry<'stack'>) {
  const url = new URL(entry.data.url);
  for (const [name, value] of Object.entries(attribution)) url.searchParams.set(name, value);
  url.searchParams.set('utm_content', entry.data.slug);
  return url.href;
}
