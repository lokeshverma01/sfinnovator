/**
 * Content Collections schema (Astro 5 API).
 * This is your file-based "content backend" — it validates the frontmatter
 * of every blog post at build time, so broken/missing fields fail fast
 * instead of shipping bad SEO to production.
 *
 * Blog posts live as .mdx files in src/content/blog/.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { BLOG_CATEGORIES } from './consts';

const categorySlugs = BLOG_CATEGORIES.map((c) => c.slug) as [string, ...string[]];

const blog = defineCollection({
  // glob loader (Astro 5): picks up .md/.mdx files in the blog folder
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(80),
    description: z.string().max(160), // keep SEO descriptions tight
    category: z.enum(categorySlugs),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Draft posts are excluded from the production build. */
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    /** Optional custom share image; falls back to site default. */
    image: z.string().optional(),
  }),
});

export const collections = { blog };
