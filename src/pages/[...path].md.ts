import type { APIContext } from 'astro';
import { markdownDocuments } from '../lib/markdown';

export async function getStaticPaths() {
  return [...await markdownDocuments()].map(([path, markdown]) => ({ params: { path }, props: { markdown } }));
}

export function GET({ props }: APIContext) {
  return new Response(props.markdown, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
