# SEO — What We Do, and How to Maintain It

> Everything this site does for search engines and social sharing, why, where it lives,
> and how to keep it healthy as you publish. SEO here is **built into the platform**, so
> for normal posts you get good SEO automatically — you don't hand-tune each one.

---

## Why this site is inherently SEO-strong

- **Static HTML, pre-rendered** — every page ships complete HTML (no client-side
  rendering), so crawlers see full content instantly. Fastest possible load.
- **Served from Cloudflare's edge** — low latency worldwide → good Core Web Vitals, which
  are a ranking factor.
- **Zero-JS by default (Astro)** — minimal blocking scripts; great mobile performance.
- **Semantic markup** — real `<header>/<main>/<article>/<nav>/<footer>`, one `<h1>` per
  page, ordered headings.

These are architectural, not add-ons — they come from the Astro + static + Cloudflare
choices recorded in `PROJECT.md`.

---

## What's implemented (the checklist)

| Signal                                                                                   | Status      | Where                                 |
| ---------------------------------------------------------------------------------------- | ----------- | ------------------------------------- |
| Per-page `<title>` (+ site suffix)                                                       | ✅          | `lib/seo.ts` → `BaseLayout.astro`     |
| Meta description                                                                         | ✅          | same                                  |
| Canonical URL                                                                            | ✅          | `BaseLayout` `<link rel="canonical">` |
| Open Graph (title/desc/url/image/site_name/type)                                         | ✅          | `BaseLayout`                          |
| Article OG (`published_time`, `modified_time`, `author`)                                 | ✅          | `BaseLayout` (posts only)             |
| Twitter `summary_large_image` card                                                       | ✅          | `BaseLayout`                          |
| **JSON-LD: `BlogPosting`** (headline, dates, author, publisher, image, mainEntityOfPage) | ✅          | `lib/seo.ts`                          |
| **JSON-LD: `WebSite` + `Person`** (homepage/pages)                                       | ✅          | `lib/seo.ts`                          |
| **JSON-LD: `BreadcrumbList`**                                                            | ✅          | posts pass a trail to `seo.ts`        |
| `sitemap-index.xml` (auto, all pages)                                                    | ✅          | `@astrojs/sitemap`                    |
| `robots.txt` (+ sitemap pointer)                                                         | ✅          | `public/robots.txt`                   |
| RSS feed                                                                                 | ✅          | `src/pages/rss.xml.ts`                |
| Default social share image (1200×630 PNG)                                                | ✅          | `public/images/og-default.png`        |
| Per-post custom share image                                                              | ✅ (opt-in) | post frontmatter `image:`             |
| `noindex` control for private pages                                                      | ✅          | `seo.ts` `noindex`, 404 uses it       |
| Static search (helps users, not a direct ranking factor)                                 | ✅          | Pagefind                              |
| Reduced-motion / accessible, responsive                                                  | ✅          | `global.css`                          |

---

## Where SEO lives (one place to tune)

- **`src/lib/seo.ts`** — `buildSeo()` is the single source. It computes the title,
  canonical, image, and the **JSON-LD graph**. Change SEO logic here once; every page
  inherits it.
- **`src/layouts/BaseLayout.astro`** — renders the `<head>` tags + the JSON-LD `<script>`
  from `buildSeo()` output. Every page goes through this.
- **`src/consts.ts` → `SITE`** — the defaults: `name`, `title`, `description`, `url`,
  `ogImage`, `author`. **Update `SITE.url` to the real domain before launch** (it drives
  canonical, sitemap, and absolute image URLs).

### How a post gets its SEO (automatic)

`src/pages/blog/[...slug].astro` → `BlogPost.astro` passes the post's `title`,
`description`, `image`, `type: 'article'`, `publishedTime`, `modifiedTime`, and a
**breadcrumb trail** into `BaseLayout`. You write normal frontmatter; correct SEO falls
out. Nothing per-post to configure beyond a good `title` + `description`.

---

## The default share image

- Source: **`scripts/og-default.svg`** → rasterized to **`public/images/og-default.png`**
  (1200×630, the size LinkedIn/X/Facebook/Slack expect).
- Regenerate after editing the SVG:
  ```bash
  node scripts/build-og.mjs
  ```
  (Uses `sharp`, already installed. SVG isn't used directly because social platforms
  don't reliably render SVG OG images — they need a raster PNG/JPG.)
- **Per-post override:** set `image: /images/my-post.png` in a post's frontmatter to use a
  custom share image for that post; otherwise the default is used.

---

## Decisions & non-goals (deliberate)

- **Sitemap `lastmod` is not emitted.** Google has stated it largely ignores untrusted
  `lastmod`. The trustworthy freshness signals — `article:modified_time` (OG) and
  `dateModified` (JSON-LD) — are present per post. Not worth the fragile config plumbing.
- **No keyword stuffing / meta keywords.** `<meta keywords>` is ignored by Google and
  skipped intentionally.
- **No third-party SEO/analytics scripts yet.** They'd add JS weight and a CSP exception.
  When you add privacy-friendly analytics (Cloudflare Web Analytics / Plausible), do it
  via the documented CSP process in `SECURITY.md`.

---

## Security note (SEO didn't weaken it)

All SEO output is static `<head>` markup + a **non-executable** `application/ld+json`
script (exempt from `script-src`), so the strict CSP is unchanged:

- ✅ No `unsafe-inline`, no new script origins, no inline `style=`.
- ✅ The only new asset is a static PNG (same-origin, covered by `img-src 'self'`).
- Re-verify after SEO changes:
  ```bash
  npm run build
  grep -c 'unsafe-inline' dist/index.html        # 0
  grep -c 'application/ld+json' dist/blog/*/index.html | head   # 1 per post
  ```

See `SECURITY.md` for the full posture.

---

## Launch & maintenance checklist

**Before pointing the real domain live:**

- [ ] `SITE.url` in `consts.ts` = `https://sfinnovator.com` (drives canonical/sitemap/OG).
- [ ] `og-default.png` exists and looks right (open it, or share-preview a URL).
- [ ] Each post has a specific, < 160-char `description`.

**After launch (one-time):**

- [ ] Add the site to **Google Search Console**; submit `https://sfinnovator.com/sitemap-index.xml`.
- [ ] (Optional) Bing Webmaster Tools — same sitemap.
- [ ] Validate a post in Google's **Rich Results Test** (expect: Article + Breadcrumb).
- [ ] Check a shared link preview on LinkedIn/X/Slack (expect the OG card).

**Ongoing (mostly automatic):**

- [ ] Write a clear `title` + `description` per post — the one human SEO step that matters.
- [ ] Use real `## headings` in posts (they build the TOC and help search structure).
- [ ] Set `updatedAt` when you meaningfully revise a post (refreshes `dateModified`).

---

## Tools to verify SEO

- **Google Rich Results Test** — https://search.google.com/test/rich-results (paste a post URL)
- **Google Search Console** — indexing status, queries, coverage
- **Schema validator** — https://validator.schema.org
- **Social preview** — LinkedIn Post Inspector, X Card Validator, or just paste a link in Slack
- **Lighthouse** (Chrome DevTools) — SEO + performance + accessibility score
