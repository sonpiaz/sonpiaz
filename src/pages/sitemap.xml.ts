import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET({ site }: APIContext) {
  const projects = await getCollection('projects');
  const posts = await getCollection('posts');
  const paths = ['/', '/projects', '/writing', '/about', '/stack',
    ...projects.map(({ data }) => `/projects/${data.slug}`),
    ...posts.map(({ data }) => `/writing/${data.slug}`),
  ];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.flatMap(path => [path, path === '/' ? '/index.md' : `${path}.md`]).map(path => `<url><loc>${new URL(path, site).href}</loc></url>`).join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
