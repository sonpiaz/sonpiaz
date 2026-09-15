import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { stackGroupIds } from './lib/stack-groups';

const projects = defineCollection({
  loader: glob({ pattern: '!(_)*.md', base: './content/projects' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    one_liner: z.string(),
    status: z.enum(['Live', 'Building', 'Paused', 'Archived', 'Sold']),
    visibility: z.enum(['private', 'public']).optional(),
    tier: z.enum(['main', 'side']),
    started: z.string().regex(/^\d{4}-\d{2}$/),
    order: z.number().int(),
    featured: z.boolean(),
    problem: z.string(),
    approach: z.string(),
    stage: z.string(),
    vision: z.string(),
    evidence: z.array(z.object({ claim: z.string(), source: z.string().url().optional() })).min(1),
    links: z.object({
      site: z.string().url().optional(),
      repo: z.string().url().optional(),
      docs: z.string().url().optional(),
    }),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '!(_)*.md', base: './content/posts' }),
  schema: z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    date: z.coerce.date(),
    description: z.string(),
    product: reference('projects').optional(),
    problem: z.string().optional(),
    quote: z.string().optional(),
    source_url: z.string().url().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '!(_)*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    headline: z.string().optional(),
    intro_links: z.array(z.object({ label: z.string(), href: z.string().url() })).default([]),
    timeline: z.array(z.object({
      date: z.string(),
      text: z.string(),
      href: z.string(),
    })).default([]),
  }),
});

const stack = defineCollection({
  loader: file('content/stack.json'),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    logo: z.string().regex(/^\/images\/(?:projects|stack)\/[a-z0-9.-]+$/).optional(),
    monochrome: z.boolean().default(false),
    group: z.enum(stackGroupIds),
    order: z.number().int().nonnegative(),
  }).refine(data => data.id === data.slug, 'Stack id and slug must match'),
});

export const collections = { projects, posts, pages, stack };
