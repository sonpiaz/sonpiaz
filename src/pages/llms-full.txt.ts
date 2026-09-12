import { llmsFull } from '../lib/markdown';

export async function GET() {
  return new Response(await llmsFull(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
