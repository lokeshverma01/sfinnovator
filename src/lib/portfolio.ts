/**
 * Portfolio query helpers — the single place visibility + ordering are decided
 * for solutions (mirrors lib/posts.ts for the blog).
 *
 * Ordering: by `order` ascending, then title — so you control prominence from
 * frontmatter without touching code.
 */
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

/** All published solutions, ordered by `order` then title. */
export async function getPublishedSolutions(): Promise<CollectionEntry<'portfolio'>[]> {
  const items = await getCollection('portfolio', ({ data }) => data.published !== false);
  return items.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title)
  );
}

/** Featured solutions for the homepage strip (capped). */
export async function getFeaturedSolutions(limit = 3): Promise<CollectionEntry<'portfolio'>[]> {
  return (await getPublishedSolutions()).filter((s) => s.data.featured).slice(0, limit);
}
