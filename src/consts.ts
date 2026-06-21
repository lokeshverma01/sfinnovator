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

/**
 * Author profile — shown in the portfolio intro (and reusable elsewhere).
 * Single source of truth for "who built this". Edit here, not in components.
 *   initials → used for the avatar when no photo is set
 *   photo    → optional path to a real headshot in /public/images
 *   links    → quick links shown under the bio (label + href)
 */
export const AUTHOR = {
  name: 'Lokesh Verma',
  role: 'Salesforce Developer & Architect',
  initials: 'LV',
  photo: undefined as string | undefined,
  bio: 'I build and document Salesforce solutions end to end — from out-of-the-box features to debugging the gnarly stuff. Everything here is real, working, and verifiable: a portfolio should let you try the thing, not just read about it.',
  links: [
    { label: 'GitHub', href: 'https://github.com/lokeshverma01' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/verma-lokesh/' },
    { label: 'Read the blog', href: '/blog' },
  ] as { label: string; href: string }[],
} as const;

/** Contact email — used by the footer "Write us" link and elsewhere. */
export const CONTACT_EMAIL = 'contact@sfinnovator.com';

/** Primary navigation. Add links here; Header renders them automatically. */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Blog', href: '/blog' },
  { label: 'Series', href: '/blog/series' },
  { label: 'Portfolio', href: '/portfolio' },
];

/** External / social links shown in the footer. */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: 'GitHub', href: 'https://github.com/lokeshverma01' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/verma-lokesh/' },
  { label: 'Write us', href: `mailto:${CONTACT_EMAIL}` },
  { label: 'RSS', href: '/rss.xml' },
];

/**
 * Post types — the three kinds of writing on this site.
 * This is the single source of truth: the content schema validates against
 * these slugs, the listing filters use these labels, and the badge colours
 * are driven by the same `slug`. Add a type here only if the template + schema
 * are updated to match.
 *
 *   slug   → frontmatter `type:` value + URL (/blog/category/<slug>)
 *   label  → human label on badges, tabs, headings
 *   icon   → emoji shown on tabs/cards
 *   blurb  → one-liner used on the homepage feature cards
 */
export const POST_TYPES = [
  {
    slug: 'implementation',
    label: 'Implementation',
    icon: '📘',
    blurb: 'End-to-end builds of Salesforce out-of-the-box features, start to finish.',
  },
  {
    slug: 'use-case',
    label: 'Use Case',
    icon: '🧩',
    blurb: 'Real business scenarios solved with Salesforce — the why and the how.',
  },
  {
    slug: 'debugging',
    label: 'Debugging',
    icon: '🐞',
    blurb: 'Error scenarios, root-cause analysis, and the solutions that fixed them.',
  },
] as const;

export type PostTypeSlug = (typeof POST_TYPES)[number]['slug'];

/** Lookup helper: slug → type definition. */
export const postType = (slug: string) => POST_TYPES.find((t) => t.slug === slug);

/**
 * Status values for debugging posts (mirrors the Salesforce Known Issues feel).
 * `slug` → frontmatter `status:` value; drives the colour-coded status badge.
 */
export const POST_STATUSES = [
  { slug: 'solved', label: 'Solved' },
  { slug: 'workaround', label: 'Workaround' },
  { slug: 'investigating', label: 'Investigating' },
] as const;

export type PostStatusSlug = (typeof POST_STATUSES)[number]['slug'];

/** Difficulty levels (optional metadata on any post). */
export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

/**
 * Blog listing pagination — posts per page on /blog and /blog/[page].
 */
export const POSTS_PER_PAGE = 10;
