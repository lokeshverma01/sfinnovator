/**
 * Content Collections schema — the "authoring contract".
 *
 * This is your file-based content backend. It validates the frontmatter of
 * every blog post at build time, so a missing/typo'd field fails the build
 * instead of shipping broken SEO or a half-rendered template.
 *
 * Posts live as .mdx files in src/content/blog/. Author by copying a starter
 * from docs and filling the fields — you never edit site code to publish.
 *
 * The schema is a DISCRIMINATED UNION on `type`: every post shares the base
 * fields, and each type adds its own structured callout fields. Fill only the
 * fields for your post's type; the template renders the matching callouts.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { POST_TYPES, POST_STATUSES, DIFFICULTY_LEVELS } from './consts';

const typeSlugs = POST_TYPES.map((t) => t.slug) as [string, ...string[]];
const statusSlugs = POST_STATUSES.map((s) => s.slug) as [string, ...string[]];

/** Fields shared by every post type. */
const baseFields = {
  /** H1 + SEO title. Keep it specific. */
  title: z.string().max(90),
  /** 1–2 lines: card excerpt + meta description. */
  description: z.string().max(160),
  publishedAt: z.coerce.date(),
  /** Shows "Updated …" when set. */
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(DIFFICULTY_LEVELS).optional(),
  /** Pin to the homepage "Featured" slot. */
  featured: z.boolean().default(false),
  /** Custom social share image; falls back to the site default. */
  image: z.string().optional(),
  /** Draft posts are excluded from the production build. */
  draft: z.boolean().default(false),
};

/**
 * Implementation posts — building an OOTB feature end to end.
 * Callouts: Objective (top), Prerequisites (top), Outcome (bottom).
 */
const implementationSchema = z.object({
  ...baseFields,
  type: z.literal('implementation'),
  objective: z.string(),
  prerequisites: z.array(z.string()).default([]),
  outcome: z.string().optional(),
});

/**
 * Use-case posts — a real business scenario solved with Salesforce.
 * Callouts: Scenario (top), Business value (top), Solution (bottom).
 */
const useCaseSchema = z.object({
  ...baseFields,
  type: z.literal('use-case'),
  scenario: z.string(),
  businessValue: z.string().optional(),
  solution: z.string().optional(),
});

/**
 * Debugging posts — error → root cause → fix (Known-Issues style).
 * Callouts: Symptom + Environment + Root cause (top), Resolution (bottom).
 * `status` drives the colour-coded status badge.
 */
const debuggingSchema = z.object({
  ...baseFields,
  type: z.literal('debugging'),
  symptom: z.string(),
  environment: z.string().optional(),
  status: z.enum(statusSlugs).default('solved'),
  rootCause: z.string().optional(),
  resolution: z.string().optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  // discriminatedUnion gives clear, field-level errors per type at build time.
  schema: z.discriminatedUnion('type', [implementationSchema, useCaseSchema, debuggingSchema]),
});

export const collections = { blog };
