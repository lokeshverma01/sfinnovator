/**
 * Site-wide constants.
 * Single source of truth for branding, navigation, and default SEO.
 * Change things here once and they update everywhere.
 */

export const SITE = {
  /** Brand name shown in header, titles, structured data. */
  name: 'SF Innovator',
  /** Default <title> suffix and homepage title. */
  title: 'SF Innovator — Salesforce, explained well.',
  /** Default meta description (homepage / fallback). Keep under ~160 chars. */
  description:
    'Real Salesforce implementations, use-case solutions, and debugging walkthroughs from hands-on work. Practical guides for builders and admins.',
  /** Canonical production URL. Must match astro.config.mjs `site`. */
  url: 'https://sfinnovator.com',
  /** Default Open Graph / social share image (lives in /public/images). */
  ogImage: '/images/og-default.png',
  /** Author / owner. */
  author: 'SF Innovator',
  /** Locale for <html lang> and OG. */
  locale: 'en',
} as const;

/** Primary navigation. Add links here; Header renders them automatically. */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Portfolio', href: '/portfolio' },
];

/** External / social links shown in the footer. */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'RSS', href: '/rss.xml' },
];

/**
 * Blog categories — these map to your three blog types.
 * Used later for the blog listing filters and post frontmatter validation.
 */
export const BLOG_CATEGORIES = [
  { slug: 'implementations', label: 'Implementations' },
  { slug: 'use-cases', label: 'Use Cases' },
  { slug: 'debugging', label: 'Debugging' },
] as const;
