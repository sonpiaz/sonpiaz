import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const home = (await getEntry('pages', 'home'))!;
  return rss({
    title: 'Son Piaz Writing',
    description: home.data.headline!,
    site: context.site!,
    items: posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()).map(({ data }) => ({
      title: data.title,
      description: data.description,
      pubDate: data.date,
      link: `/writing/${data.slug}`,
    })),
    customData: '<language>en-us</language>',
  });
}
