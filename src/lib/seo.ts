/**
 * Centralized SEO helper.
 * Build a consistent set of meta values for any page from one place.
 * BaseLayout consumes the output to render <head> tags + JSON-LD.
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
}

export interface SeoOutput {
  title: string;
  description: string;
  canonical: string;
  image: string;
  type: 'website' | 'article';
  noindex: boolean;
}

/** Resolve a possibly-relative URL against the site origin. */
function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  return new URL(pathOrUrl, SITE.url).toString();
}

export function buildSeo(input: SeoInput = {}): SeoOutput {
  const title = input.title ? `${input.title} — ${SITE.name}` : SITE.title;
  return {
    title,
    description: input.description ?? SITE.description,
    canonical: absoluteUrl(input.pathname ?? '/'),
    image: absoluteUrl(input.image ?? SITE.ogImage),
    type: input.type ?? 'website',
    noindex: input.noindex ?? false,
  };
}
