export const stackGroups = [
  { id: 'coding-agents', label: 'Coding agents', anchor: 'coding-agents' },
  { id: 'workspace', label: 'Editors, terminal, browser, and source control', anchor: 'editors-terminal-browser-and-source-control' },
  { id: 'ai-models', label: 'AI and local model apps', anchor: 'ai-and-local-model-apps' },
  { id: 'languages-frameworks', label: 'Languages, runtimes, and frameworks', anchor: 'languages-runtimes-and-frameworks' },
  { id: 'infrastructure', label: 'Infrastructure, hosting, and delivery', anchor: 'infrastructure-hosting-and-delivery' },
  { id: 'data-storage', label: 'Data and storage', anchor: 'data-and-storage' },
  { id: 'business', label: 'Business, payments, CRM, and secrets', anchor: 'business-payments-crm-and-secrets' },
  { id: 'communication', label: 'Email and communication', anchor: 'email-and-communication' },
  { id: 'analytics-seo', label: 'Analytics and SEO', anchor: 'analytics-and-seo' },
  { id: 'design-content', label: 'Design and content', anchor: 'design-and-content' },
  { id: 'planning-knowledge', label: 'Planning and knowledge', anchor: 'planning-and-knowledge' },
  { id: 'tools-built', label: 'Tools and products I built', anchor: 'tools-and-products-i-built' },
] as const;

export type StackGroupId = (typeof stackGroups)[number]['id'];
export const stackGroupIds = stackGroups.map(group => group.id) as [StackGroupId, ...StackGroupId[]];
