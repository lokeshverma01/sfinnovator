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
  /**
   * Series membership (optional). Set `series` to a series slug (the file name
   * in src/content/series/) and `seriesOrder` to this post's position (1, 2, …).
   * A post with no `series` behaves exactly as before — fully optional.
   */
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
  /** Pin to the homepage "Featured" slot. */
  featured: z.boolean().default(false),
  /** Custom social share image; falls back to the site default. */
  image: z.string().optional(),
  /**
   * Visibility switch — the single control for whether a post is live.
   *   true  (default) → built, deployed, public.
   *   false           → excluded from the build entirely (private/inactive);
   *                     no page, not in listings, RSS, sitemap, or search.
   * Flip this in frontmatter to take a post public or private without
   * deleting it. Enforced centrally via getPublishedPosts() in src/lib/posts.ts.
   */
  published: z.boolean().default(true),
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

/**
 * Portfolio collection — one .mdx file per solution.
 *
 * FLEXIBLE BY DESIGN: only `title` and `summary` are required. Every action
 * link and metadata field is optional — the card and detail page render only
 * what you provide, so a write-up-only project and a fully interactive app use
 * the same template without looking broken.
 *
 * Drop a file in src/content/portfolio/ and it automatically becomes a card on
 * /portfolio, a /portfolio/<slug> detail page, and (if featured) a homepage tile.
 */
const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string().max(90),
    summary: z.string().max(200),
    /** Optional longer one-liner shown on the detail page hero. */
    tagline: z.string().optional(),
    /** Lifecycle badge. Omit to show none. */
    status: z.enum(['shipped', 'in-progress', 'concept']).optional(),
    /** Free-form tech badges, e.g. [Flow, LWC, Apex]. */
    tech: z.array(z.string()).default([]),
    /** Action links — each is optional; the button shows only if present. */
    useUrl: z.string().optional(), // try it live
    validateUrl: z.string().optional(), // verify it yourself (test org / steps)
    repoUrl: z.string().optional(), // source code
    blogSlug: z.string().optional(), // related blog post id → /blog/<slug>
    /** Optional metadata for the detail-page sidecard. */
    role: z.string().optional(),
    completedAt: z.coerce.date().optional(),
    /** Optional thumbnail/social image in /public/images; falls back to initials. */
    image: z.string().optional(),
    /** Sort weight on the listing (lower = earlier). Ties break by title. */
    order: z.number().default(100),
    /** Pin to the homepage "Featured work" strip. */
    featured: z.boolean().default(false),
    /** Visibility switch — same semantics as blog posts. */
    published: z.boolean().default(true),
  }),
});

/**
 * Series collection — one .mdx file per multi-part series.
 *
 * The file NAME is the series slug that posts reference via their `series`
 * field (e.g. src/content/series/authentication.mdx → series: authentication).
 * The body is the series intro shown on the landing page.
 *
 * `upcoming` lets you tease parts not written yet (shown greyed on the landing
 * page as a roadmap). Optional — omit it to show only published parts.
 */
const series = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/series' }),
  schema: z.object({
    title: z.string().max(90),
    description: z.string().max(200),
    tags: z.array(z.string()).default([]),
    /** Sort weight on the /blog/series index (lower = earlier). */
    order: z.number().default(100),
    /** Optional roadmap of not-yet-written parts (titles only). */
    upcoming: z.array(z.string()).default([]),
    /** Visibility switch — same semantics as posts. */
    published: z.boolean().default(true),
  }),
});

export const collections = { blog, portfolio, series };
