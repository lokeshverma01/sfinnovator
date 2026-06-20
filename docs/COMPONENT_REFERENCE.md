# Component & File Reference

> A map of **every file that matters**, what it does, what it depends on, and what it
> exposes. Use this when you need to find where something lives or understand what a
> change will ripple into. Pair with [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) when
> something breaks.

Last verified against the codebase: **Phase 1.6**.

---

## Full file map

```
claudeterminal/
├── astro.config.mjs              # Astro config: site URL, static output, integrations, CSP
├── tsconfig.json                 # strict TS + path aliases (@/, @components/, …)
├── package.json                  # deps + scripts (dev/build/preview/format/lint)
├── .prettierrc                   # formatting rules (+ astro & tailwind plugins)
├── .gitignore
│
├── public/                       # served as-is (NOT processed by the build)
│   ├── favicon.svg
│   ├── robots.txt                # crawler rules + sitemap pointer
│   ├── staticwebapp.config.json  # Azure SWA: security headers, caching, 404
│   └── images/                   # og-default.png (add), logos, etc.
│
├── src/
│   ├── consts.ts                 # SITE, NAV_LINKS, SOCIAL_LINKS, BLOG_CATEGORIES
│   ├── content.config.ts         # blog collection schema (frontmatter validation)
│   │
│   ├── lib/
│   │   ├── seo.ts                # buildSeo() — central meta builder
│   │   └── themeScript.mjs       # the is:inline theme bootstrap (shared w/ CSP hash)
│   │
│   ├── styles/
│   │   └── global.css            # Tailwind import + theme tokens (light/.dark)
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro       # page shell: <head> SEO, theme bootstrap, header/footer
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Container.astro     # max-width + responsive padding wrapper
│   │   │   └── ThemeToggle.astro   # light/dark button + persistence
│   │   ├── layout/
│   │   │   ├── Header.astro        # logo badge, nav, toggle
│   │   │   └── Footer.astro        # copyright + social links
│   │   └── sections/
│   │       ├── Hero.astro          # headline, CTAs, grid bg, stat row
│   │       ├── Features.astro      # 3 category cards
│   │       └── LatestPosts.astro   # recent posts list + empty state
│   │
│   ├── content/
│   │   └── blog/                   # blog posts (.mdx) — empty for now (.gitkeep)
│   │
│   └── pages/                      # FILE = ROUTE
│       ├── index.astro             # /            landing page
│       ├── 404.astro               # /404         not found
│       ├── rss.xml.ts              # /rss.xml     RSS feed
│       ├── blog/index.astro        # /blog        listing (skeleton)
│       └── portfolio/index.astro   # /portfolio   showcase (skeleton)
│
├── docs/                           # ← living documentation (this folder)
└── design/
    └── mockup.html                 # approved visual reference
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

### `Features.astro`

- **Path:** `src/components/sections/Features.astro`
- **Purpose:** Three category cards (Implementations / Use Cases / Debugging).
- **Notes:** card data is a local array; category links point at
  `/blog/category/<slug>` (built in Phase 2).

### `LatestPosts.astro`

- **Path:** `src/components/sections/LatestPosts.astro`
- **Purpose:** Lists the 5 most recent non-draft posts; shows an empty-state card when
  there are none.
- **Depends on:** `astro:content` (`getCollection('blog')`), `consts.ts` (category labels).
- **Notes:** sorts by `publishedAt` desc; links use `post.id` (Astro 5 glob-loader id).

---

## Configuration & data files

### `consts.ts`

- **Exposes:** `SITE` (name, title, description, url, ogImage, author, locale),
  `NAV_LINKS`, `SOCIAL_LINKS`, `BLOG_CATEGORIES`.
- **Rule:** branding/nav/categories change **here only**.

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

- **Defines:** the `blog` collection + Zod schema (title, description, category,
  publishedAt, updatedAt?, draft, tags, image?).
- **Effect:** invalid frontmatter **fails the build** — bad data never ships.

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
