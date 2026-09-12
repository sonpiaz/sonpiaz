import { llmsSummary } from '../lib/markdown';

export async function GET() {
  return new Response(await llmsSummary(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
