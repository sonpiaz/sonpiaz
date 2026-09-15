import type { CollectionEntry } from 'astro:content';

export const canonicalProductSlugs = ['kyma', 'affitor', 'mandeck', 'build-to-own'] as const;
const productRank = new Map<string, number>(canonicalProductSlugs.map((slug, index) => [slug, index]));

export const aboutProjectSlugs = [
  ...canonicalProductSlugs,
  'affiliate-skills',
  'open-affiliate',
  'watch-cli',
  'haynoi',
] as const;

export const projectLogos: Partial<Record<(typeof canonicalProductSlugs)[number], {
  src: string;
  kind: 'image' | 'mask';
}>> = {
  kyma: { src: '/images/projects/kyma.svg', kind: 'mask' },
  affitor: { src: '/images/projects/affitor.svg', kind: 'image' },
  mandeck: { src: '/images/projects/mandeck.png', kind: 'image' },
  'build-to-own': { src: '/images/projects/build-to-own.svg', kind: 'image' },
};

export function compareProjects(a: CollectionEntry<'projects'>, b: CollectionEntry<'projects'>) {
  const tier = Number(a.data.tier === 'side') - Number(b.data.tier === 'side');
  if (tier) return tier;
  if (a.data.tier === 'main') {
    const rank = (productRank.get(a.data.slug) ?? Number.MAX_SAFE_INTEGER)
      - (productRank.get(b.data.slug) ?? Number.MAX_SAFE_INTEGER);
    if (rank) return rank;
  }
  return a.data.order - b.data.order || a.data.slug.localeCompare(b.data.slug);
}
