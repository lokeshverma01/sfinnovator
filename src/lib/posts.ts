/**
 * Post query helpers — the ONE place visibility and ordering are decided.
 *
 * Every page/route that lists or renders posts goes through here, so the
 * `published` rule is enforced consistently: a post with `published: false`
 * is never built into a page, listing, RSS item, sitemap entry, or search
 * index. Flip `published` in frontmatter to take a post public/private.
 */
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

/** All published posts, newest first. */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => data.published !== false);
  return posts.sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
}

/** Published posts of a single type, newest first. */
export async function getPublishedPostsByType(type: string): Promise<CollectionEntry<'blog'>[]> {
  return (await getPublishedPosts()).filter((p) => p.data.type === type);
}
