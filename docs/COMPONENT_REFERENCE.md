# Component & File Reference

> A map of **every file that matters**, what it does, what it depends on, and what it
> exposes. Use this when you need to find where something lives or understand what a
> change will ripple into. Pair with [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) when
> something breaks.
>
> **Looking at the live page and want to edit a specific element** (the navbar, the hero
> headline, a button)? Start with the page-first [`EDITING_GUIDE.md`](./EDITING_GUIDE.md).

Last verified against the codebase: **Phase 2 (blog + portfolio + series + search)**.

---

## Full file map

```
claudeterminal/
├── astro.config.mjs              # site URL, static output, integrations, markdown(prism), CSP
├── wrangler.jsonc                # Cloudflare deploy config (assets → dist)
├── package.json                  # deps + scripts (build runs astro + pagefind)
│
├── public/                       # served as-is (NOT processed by the build)
│   ├── favicon.svg · robots.txt
│   ├── _headers · _redirects     # Cloudflare security headers / redirects
│   ├── staticwebapp.config.json  # Azure SWA parity (ignored by Cloudflare)
│   └── images/                   # og-default.png, screenshots, etc.
│
├── src/
│   ├── consts.ts                 # SITE, AUTHOR, NAV_LINKS, SOCIAL_LINKS, POST_TYPES,
│   │                             #   POST_STATUSES, DIFFICULTY_LEVELS, POSTS_PER_PAGE
│   ├── content.config.ts         # blog + portfolio + series collection schemas
│   │
│   ├── lib/                      # posts.ts, portfolio.ts, series.ts (queries+visibility),
│   │                             #   seo.ts, readingTime.ts, solution.ts, themeScript.mjs
│   ├── styles/                   # global.css (tokens, badges, callouts, prose), prism.css
│   ├── layouts/                  # BaseLayout, BlogListing, BlogPost
│   │
│   ├── components/
│   │   ├── ui/                   # Container, ThemeToggle
│   │   ├── layout/               # Header, Footer
│   │   ├── sections/             # Hero, Features, LatestPosts, FeaturedWork (homepage)
│   │   ├── blog/                 # Badge, Callout, PostMeta, PostCard, FilterTabs,
│   │   │                         #   Pagination, SearchBox, SeriesBox, TableOfContents
│   │   └── portfolio/            # AuthorIntro, PortfolioCard
│   │
│   ├── content/                  # YOUR CONTENT (.mdx)
│   │   ├── blog/                 # blog posts
│   │   ├── portfolio/            # portfolio solutions
│   │   └── series/               # series definitions
│   │
│   └── pages/                    # FILE = ROUTE
│       ├── index.astro                         # /
│       ├── 404.astro · rss.xml.ts
│       ├── blog/[...page].astro                # /blog, /blog/2 …
│       ├── blog/[...slug].astro                # /blog/<post>
│       ├── blog/category/[type]/[...page].astro# /blog/category/<type>
│       ├── blog/series/index.astro             # /blog/series
│       ├── blog/series/[slug].astro            # /blog/series/<name>
│       └── portfolio/index.astro · [...slug].astro
│
├── docs/                         # ← living documentation (incl. templates/)
└── design/                       # approved HTML mockups (reference)
```

---

## Components in detail

Each entry: **Path · Purpose · Props · Depends on · Used by · Notes.**

### `BaseLayout.astro`

- **Path:** `src/layouts/BaseLayout.astro`
- **Purpose:** The shell wrapped around every page. Renders `<head>` (SEO meta, OG,
  Twitter, JSON-LD), the pre-paint theme bootstrap script, and Header + Footer around a
  `<slot/>`.
- **Props** (all optional — see `SeoInput` in `lib/seo.ts`): `title`, `description`,
  `image`, `type` (`'website' | 'article'`), `noindex`.
- **Depends on:** `lib/seo.ts`, `lib/themeScript.mjs`, `consts.ts`, `Header`, `Footer`,
  `styles/global.css`.
- **Used by:** every page.
- **Notes:** renders the inline theme script from `lib/themeScript.mjs` via `set:html`;
  its CSP hash is derived from the same source in `astro.config.mjs`.

### `Container.astro`

- **Path:** `src/components/ui/Container.astro`
- **Purpose:** Constrains width (`max-w-5xl`) and adds responsive horizontal padding.
- **Props:** `class?` (extra classes, appended).
- **Used by:** Header, Footer, Hero, Features, LatestPosts, page bodies.
- **Notes:** the one place to change the site's content width.

### `ThemeToggle.astro`

- **Path:** `src/components/ui/ThemeToggle.astro`
- **Purpose:** The sun/moon button. Toggles `.dark` on `<html>` and saves the choice to
  `localStorage`.
- **Props:** none.
- **Depends on:** the theme bootstrap in `BaseLayout` (sets the _initial_ theme).
- **Notes:** icon swap is pure CSS (`dark:` variants). Its `<script>` is a **processed**
  script (no `is:inline`) so Astro bundles and auto-hashes it for CSP.

### `Header.astro`

- **Path:** `src/components/layout/Header.astro`
- **Purpose:** Sticky translucent header — logo badge, nav links, theme toggle.
- **Depends on:** `Container`, `ThemeToggle`, `consts.ts` (`SITE`, `NAV_LINKS`).
- **Notes:** to add a nav item, edit `NAV_LINKS` in `consts.ts` — do **not** hardcode here.

### `Footer.astro`

- **Path:** `src/components/layout/Footer.astro`
- **Purpose:** Copyright + social/RSS links.
- **Depends on:** `Container`, `consts.ts` (`SITE`, `SOCIAL_LINKS`).

### `Hero.astro`

- **Path:** `src/components/sections/Hero.astro`
- **Purpose:** Landing hero — eyebrow pill, headline w/ gradient phrase, masked grid
  background, two CTAs, stat row.
- **Depends on:** `Container`, theme tokens (`global.css`).
- **Edit:** the headline **"Salesforce, explained well."**, subtext, buttons, and stat row
  are hardcoded here (this is the homepage hero copy). See EDITING_GUIDE.md → Home page.

### `Features.astro`

- **Path:** `src/components/sections/Features.astro`
- **Purpose:** Three category cards (Implementations / Use Cases / Debugging).
- **Notes:** card data is a local array; category links point at
  `/blog/category/<slug>` (built in Phase 2).

### `LatestPosts.astro`

- **Path:** `src/components/sections/LatestPosts.astro`
- **Purpose:** Lists the 5 most recent published posts; shows an empty-state card when
  there are none.
- **Depends on:** `lib/posts.ts` (`getPublishedPosts`), `consts.ts` (`postType`).

### `FeaturedWork.astro`

- **Path:** `src/components/sections/FeaturedWork.astro`
- **Purpose:** Homepage 3-tile strip of `featured` portfolio solutions; renders nothing if
  none are featured.
- **Depends on:** `lib/portfolio.ts` (`getFeaturedSolutions`), `lib/solution.ts` (`initialsOf`).

---

## Blog components (`src/components/blog/`)

### `Badge.astro`

- **Purpose:** Pill for a post type or status. Colour via class-based `.badge-*` variants
  (CSP-safe). Props: `variant`, `label`, `dot?`.

### `Callout.astro`

- **Purpose:** Labeled colored box for a structured frontmatter field (Symptom, Root cause,
  Resolution, Objective, Prerequisites, Scenario…). Props: `kind`, `label`, `icon?`,
  `text?` (or slotted content).

### `PostMeta.astro`

- **Purpose:** The metadata row under a post title: published/updated dates, reading time,
  difficulty. Props: `publishedAt`, `updatedAt?`, `readingTime`, `difficulty?`.

### `PostCard.astro`

- **Purpose:** A post's card in any listing (blog, category, homepage). Type/status badges,
  title, excerpt, date, reading time, tags. Prop: `post`.

### `FilterTabs.astro`

- **Purpose:** "All / Implementation / Use Case / Debugging" pills linking to the listing +
  category pages. Driven by `POST_TYPES`. Prop: `active?`.

### `Pagination.astro`

- **Purpose:** Prev / numbered / next controls for `/blog` and category pages. Props:
  `currentPage`, `lastPage`, `baseUrl`.

### `SearchBox.astro`

- **Purpose:** Mounts the Pagefind static-search UI on `#search`. Loads `/pagefind/*` (built
  by the `pagefind` step). Works in build/preview/prod, not `dev`. (🔴 leave wiring alone.)

### `SeriesBox.astro`

- **Purpose:** In-post series nav: "Part X of N" + ordered outline (current highlighted) +
  link to the series. Prop: `ctx` (from `lib/series.ts`). `N` = published + `upcoming`.

### `TableOfContents.astro`

- **Purpose:** Sticky "On this page" built from the post's H2/H3; scroll-spy highlights the
  active section. Prop: `headings` (Astro `MarkdownHeading[]`).

---

## Portfolio components (`src/components/portfolio/`)

### `AuthorIntro.astro`

- **Purpose:** The /portfolio header — avatar (photo or initials), name, role, bio, links.
  All content from `AUTHOR` in `consts.ts`.

### `PortfolioCard.astro`

- **Purpose:** A solution tile: thumbnail (image or initials), status badge, title, summary,
  tech badges, and only-the-actions-that-exist links. Prop: `solution`.

---

## Layouts (`src/layouts/`)

### `BlogListing.astro`

- **Purpose:** Shared shell for `/blog` and category pages — heading, search box, filter
  tabs, post cards, pagination. Props: `title`, `subtitle`, `posts`, `activeType?`,
  pagination props.

### `BlogPost.astro`

- **Purpose:** The single, consistent post template — badges, meta, series box, auto
  callouts (by type), the MDX body, tags, prev/next, TOC. Props: `data`, `headings`,
  `body?`, `seriesCtx?`.

---

## Configuration & data files

### `consts.ts`

- **Exposes:** `SITE` (name/title/description/url/ogImage/author/locale), `AUTHOR`
  (portfolio intro), `NAV_LINKS`, `SOCIAL_LINKS`, `POST_TYPES` (+ `postType()`),
  `POST_STATUSES`, `DIFFICULTY_LEVELS`, `POSTS_PER_PAGE`.
- **Rule:** branding, nav, author intro, post types/statuses change **here only**.

### `lib/seo.ts`

- **Exposes:** `buildSeo(input): SeoOutput`, types `SeoInput` / `SeoOutput`.
- **Behaviour:** fills defaults from `SITE`, resolves canonical + image to absolute URLs.

### `lib/themeScript.mjs`

- **Exposes:** `PREPAINT_THEME_SCRIPT` (string).
- **Why:** the no-flash theme bootstrap must run `is:inline` before paint, which Astro
  can't auto-hash for CSP. This single string is consumed by **both** `BaseLayout`
  (rendered via `set:html`) **and** `astro.config.mjs` (hashed into the CSP). One source →
  the hash can never drift from the script.
- **Gotcha:** editing this changes the hash; just rebuild — the config recomputes it.

### `content.config.ts`

- **Defines:** three collections — `blog` (discriminated union by `type`:
  implementation/use-case/debugging, with per-type fields + `published`, `series`,
  `seriesOrder`), `portfolio` (solutions), and `series`.
- **Effect:** invalid frontmatter **fails the build** — bad data never ships.

### `lib/posts.ts` · `lib/portfolio.ts` · `lib/series.ts`

- **Purpose:** central query helpers enforcing the `published` rule + ordering.
  `getPublishedPosts`, `getPublishedSolutions`/`getFeaturedSolutions`,
  `getSeriesList`/`getSeries`/`getSeriesPosts`/`getSeriesContext`.

### `lib/readingTime.ts` · `lib/solution.ts`

- **Purpose:** small presentation helpers — reading-time estimate; solution status badge,
  action-link list, and title initials.

### `astro.config.mjs`

- **Sets:** `site` (canonical/sitemap base), `output: 'static'`, integrations
  (`mdx`, `sitemap`), Tailwind Vite plugin, and **`security.csp`** (directives +
  `scriptDirective.hashes` with the auto-derived hash of `lib/themeScript.mjs`).

### `public/_headers` + `public/_redirects` (Cloudflare Pages — primary host)

- **`_headers`:** host security headers (HSTS, nosniff, frame-options, referrer,
  permissions, COOP) + cache rules for `/_astro/*` and `/images/*`.
- **`_redirects`:** redirect/rewrite rules (none needed yet; Astro's static `404.html` is
  served automatically).
- **Scope:** Cloudflare Pages reads these from the deployed `dist/`.

### `public/staticwebapp.config.json` (Azure — parity only)

- **Sets:** the same host security headers/caching for Azure Static Web Apps.
- **Scope:** ignored by Cloudflare; kept so an Azure deploy stays possible.

---

## How to add a new component (the convention)

1. Pick the folder by role: `ui/` (generic), `layout/` (page furniture), `sections/`
   (page-specific blocks).
2. Start with a `---`-fenced doc comment: what it is, props, dependencies.
3. Use theme tokens (`var(--bg)`, `var(--text)`, …) — never hardcode hex.
4. Wrap content in `Container` if it's full-width.
5. Add an entry to this file in the same commit.
