/**
 * Centralized SEO helper.
 * Builds a consistent set of <head> values + JSON-LD structured data for any
 * page, from one place. BaseLayout consumes the output. Keeping this central
 * means every page gets correct, identical-shape metadata and we tune SEO once.
 */
import { SITE } from '../consts';

export interface SeoInput {
  /** Page title (without the site-name suffix). */
  title?: string;
  /** Page meta description. Falls back to the site default. */
  description?: string;
  /** Path or absolute URL of the share image. Falls back to site default. */
  image?: string;
  /** The current page path, e.g. Astro.url.pathname. Used for canonical URL. */
  pathname?: string;
  /** 'website' for pages, 'article' for blog posts. */
  type?: 'website' | 'article';
  /** Set true on pages you do NOT want indexed (e.g. future admin pages). */
  noindex?: boolean;
  /** Article-only: ISO date strings for structured data + article OG tags. */
  publishedTime?: string;
  modifiedTime?: string;
  /** Article-only: author name (defaults to the site author). */
  author?: string;
  /** Optional breadcrumb trail: [{name, url(path)}] innermost last. */
  breadcrumbs?: { name: string; path: string }[];
}

export interface SeoOutput {
  title: string;
  description: string;
  canonical: string;
  image: string;
  type: 'website' | 'article';
  noindex: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  author: string;
  /** Ready-to-serialize JSON-LD graph (array of schema.org objects). */
  jsonLd: Record<string, unknown>;
}

/** Resolve a possibly-relative URL against the site origin. */
function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return new URL(pathOrUrl, SITE.url).toString();
}

/** The Organization/Person publisher block, reused across schemas. */
function publisher() {
  return {
    '@type': 'Person',
    name: SITE.author,
    url: SITE.url,
  };
}

export function buildSeo(input: SeoInput = {}): SeoOutput {
  const title = input.title ? `${input.title} — ${SITE.name}` : SITE.title;
  const description = input.description ?? SITE.description;
  const canonical = absoluteUrl(input.pathname ?? '/');
  const image = absoluteUrl(input.image ?? SITE.ogImage);
  const type = input.type ?? 'website';
  const author = input.author ?? SITE.author;

  // Build the JSON-LD graph. Posts → BlogPosting; other pages → WebSite.
  const graph: Record<string, unknown>[] = [];

  if (type === 'article') {
    graph.push({
      '@type': 'BlogPosting',
      headline: input.title ?? SITE.title,
      description,
      url: canonical,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      image,
      datePublished: input.publishedTime,
      dateModified: input.modifiedTime ?? input.publishedTime,
      author: { '@type': 'Person', name: author, url: SITE.url },
      publisher: publisher(),
    });
  } else {
    graph.push({
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      publisher: publisher(),
    });
  }

  // Optional breadcrumb trail.
  if (input.breadcrumbs && input.breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: input.breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: absoluteUrl(b.path),
      })),
    });
  }

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph };

  return {
    title,
    description,
    canonical,
    image,
    type,
    noindex: input.noindex ?? false,
    publishedTime: input.publishedTime,
    modifiedTime: input.modifiedTime ?? input.publishedTime,
    author,
    jsonLd,
  };
}
