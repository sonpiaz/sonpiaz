import { defineConfig } from 'astro/config';
import headingAnchors from './src/lib/heading-anchors.mjs';
import agentSurfaceProvenance from './scripts/agent-surface-provenance.mjs';

export default defineConfig({
  site: 'https://sonpiaz.com',
  output: 'static',
  markdown: { rehypePlugins: [headingAnchors] },
  integrations: [agentSurfaceProvenance()],
});
