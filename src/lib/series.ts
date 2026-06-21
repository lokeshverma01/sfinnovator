/**
 * Series query helpers — group published posts into ordered multi-part series.
 *
 * A "series" is a file in src/content/series/; posts join it via their
 * `series` (slug) + `seriesOrder` (position) frontmatter. All visibility goes
 * through getPublishedPosts(), so unpublished parts never leak.
 */
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { getPublishedPosts } from './posts';

/** All published series, ordered by `order` then title. */
export async function getSeriesList(): Promise<CollectionEntry<'series'>[]> {
  const all = await getCollection('series', ({ data }) => data.published !== false);
  return all.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title)
  );
}

/** One series entry by slug (or undefined). */
export async function getSeries(slug: string): Promise<CollectionEntry<'series'> | undefined> {
  return (await getSeriesList()).find((s) => s.id === slug);
}

/**
 * Published posts in a series, ordered by `seriesOrder` (then date as a
 * fallback). Returns [] if the series has no posts yet.
 */
export async function getSeriesPosts(slug: string): Promise<CollectionEntry<'blog'>[]> {
  const posts = (await getPublishedPosts()).filter((p) => p.data.series === slug);
  return posts.sort((a, b) => {
    const ao = a.data.seriesOrder ?? Infinity;
    const bo = b.data.seriesOrder ?? Infinity;
    return ao - bo || a.data.publishedAt.valueOf() - b.data.publishedAt.valueOf();
  });
}

export interface SeriesContext {
  series: CollectionEntry<'series'>;
  parts: CollectionEntry<'blog'>[];
  index: number; // 0-based position of the current post
  total: number;
  prev?: CollectionEntry<'blog'>;
  next?: CollectionEntry<'blog'>;
}

/**
 * For a given post, resolve its series context (the series entry, the ordered
 * parts, this post's position, and prev/next). Returns null if the post isn't
 * in a series or the series entry doesn't exist.
 */
export async function getSeriesContext(
  post: CollectionEntry<'blog'>
): Promise<SeriesContext | null> {
  const slug = post.data.series;
  if (!slug) return null;
  const series = await getSeries(slug);
  if (!series) return null;

  const parts = await getSeriesPosts(slug);
  const index = parts.findIndex((p) => p.id === post.id);
  if (index === -1) return null;

  return {
    series,
    parts,
    index,
    total: parts.length,
    prev: index > 0 ? parts[index - 1] : undefined,
    next: index < parts.length - 1 ? parts[index + 1] : undefined,
  };
}
