# Editing Guide — "I see this on the page; how do I change it?"

> A **page-first** map of the site. For each page, every visible element is listed with:
> **what it is** (the component), **the file**, and **how to edit it**. Use this when you're
> looking at the live site and want to change a specific piece.
>
> For **publishing posts/series/projects** (which is content, not page furniture), see
> [AUTHORING.md](./AUTHORING.md). For the full technical component map, see
> [COMPONENT_REFERENCE.md](./COMPONENT_REFERENCE.md).

## How to read this

Each item is tagged so you know how safe an edit is:

- 🟢 **Safe text edit** — change wording/links; low risk.
- 🟡 **Structural** — changes layout/behavior; preview before pushing.
- 🔴 **Ask/learn first** — logic or shared code; a mistake can break the build.

After any edit: `npm run dev` to preview, then commit + push (see [DEV_SETUP.md](./DEV_SETUP.md)).
The build will fail loudly if something's wrong, so you can't silently break the live site.

---

## Site-wide elements (appear on every page)

These live in **one place** and show everywhere — change once, updates sitewide.

### The top navigation bar

- **Component:** `src/components/layout/Header.astro` (the bar itself)
- **What it shows:** the "SF" logo badge, the site name, the nav links (Blog · Series ·
  Portfolio), and the light/dark toggle.
- **How to edit:**
  - 🟢 **Site name / wordmark** ("SF Innovator") → `src/consts.ts`, the `SITE.name` value.
  - 🟢 **The nav links** (add / remove / rename / reorder) → `src/consts.ts`, the
    `NAV_LINKS` array. Each entry is `{ label: 'Blog', href: '/blog' }`. The header renders
    them automatically — **don't** hardcode links in `Header.astro`.
  - 🟢 **The "SF" badge letters** → `Header.astro`, the `<span>` containing `SF`.
  - 🟡 **Layout/stickiness/blur** → `Header.astro` classes.

### The light/dark toggle

- **Component:** `src/components/ui/ThemeToggle.astro`
- 🔴 Mostly leave alone — it's wired to the no-flash theme system. Icons are the two SVGs
  inside it if you ever want to swap them.

### The footer

- **Component:** `src/components/layout/Footer.astro`
- **What it shows:** the copyright line + social/RSS links.
- **How to edit:**
  - 🟢 **Footer links** (GitHub, RSS…) → `src/consts.ts`, the `SOCIAL_LINKS` array.
  - 🟢 **Copyright name** → comes from `SITE.name` in `src/consts.ts`. The year is automatic.

### Brand color, fonts, light/dark colors

- **File:** `src/styles/global.css`
- 🟡 **Accent color** (Salesforce blue) → the `--accent` variables (one under `:root` for
  light, one under `.dark` for dark). Change both.
- 🔴 Other color tokens (`--bg`, `--text`, badge/callout colors) — change carefully and
  preview both themes.

### Page titles, SEO, social-share defaults

- **File:** `src/consts.ts` → the `SITE` object (`title`, `description`, `url`, `ogImage`).
- **Logic:** `src/lib/seo.ts` + `src/layouts/BaseLayout.astro` (🔴 don't edit unless needed).

---

## The Home page ( / )

File that assembles it: `src/pages/index.astro` (it just stacks the sections below).

### 1. Hero — the big headline block

- **Component:** `src/components/sections/Hero.astro`
- **What it is:** the top section with the pill badge, the large headline, the subtext, two
  buttons, and the small stat row.
- **How to edit (all 🟢 in this file):**
  - **Eyebrow pill text** ("Salesforce, from hands-on work") → line with that text.
  - **The headline** — the words **"Salesforce, explained well."** The "explained well."
    part is the blue gradient phrase. Edit the two pieces of the `<h1>`.
  - **Subtext** ("Real implementations, use-case solutions…") → the `<p>` under the headline.
  - **Buttons** — "Read the blog →" (links to `/blog`) and "View portfolio" (links to
    `/portfolio`). Edit the link text and `href`s on the two `<a>` tags.
  - **Stat row** ("OOTB implementations · Real use cases · Root-cause debugging") → the
    three `<span>`s near the bottom.
  - 🟡 The faint grid background is the `.hero-grid` div + class in `global.css`.

### 2. Features — the three category cards

- **Component:** `src/components/sections/Features.astro`
- **What it is:** "What you'll find here" + three cards (Implementations / Use Cases /
  Debugging).
- **How to edit:**
  - 🟢 **Section heading + subtitle** ("What you'll find here" / "Three kinds of writing…")
    → the `<h2>` and `<p>` in `Features.astro`.
  - 🟢 **The three cards' titles, icons, and blurbs** → these come from `POST_TYPES` in
    `src/consts.ts` (each has `label`, `icon`, `blurb`). Edit there so the blog filters stay
    in sync. The card links go to `/blog/category/<slug>` automatically.

### 3. Latest writing — recent posts list

- **Component:** `src/components/sections/LatestPosts.astro`
- **What it is:** "Latest writing" heading + the 5 newest posts (or an empty-state message).
- **How to edit:**
  - 🟢 **Heading / subtitle** ("Latest writing" / "Fresh from the workbench.") → the `<h2>`
    and `<p>`.
  - 🟡 **How many posts show** → the `.slice(0, 5)` number in the frontmatter script.
  - The actual posts are your content (see AUTHORING.md) — not edited here.

### 4. Featured work — portfolio strip

- **Component:** `src/components/sections/FeaturedWork.astro`
- **What it is:** "Featured work" heading + up to 3 featured solutions. **Hidden entirely**
  if no solution is marked `featured`.
- **How to edit:**
  - 🟢 **Heading / subtitle** ("Featured work" / "A few solutions you can try…") → the `<h2>`
    and `<p>`.
  - **Which projects appear** → set `featured: true` on a solution file (see AUTHORING.md),
    not here.

> Want to add/remove/reorder whole sections on the home page? 🟡 Edit the list of
> components in `src/pages/index.astro` (e.g. remove `<FeaturedWork />`).

---

## The Blog listing ( /blog and /blog/2 … )

- **Page:** `src/pages/blog/[...page].astro` → uses the shared layout
  `src/layouts/BlogListing.astro`.
- **Visible elements & where to edit (in `BlogListing.astro` unless noted):**
  - 🟢 **Page title + subtitle** ("Blog" / "End-to-end implementations…") → these are passed
    in from `src/pages/blog/[...page].astro` (the `title`/`subtitle` props).
  - **Search box** → `src/components/blog/SearchBox.astro` (🔴 wired to Pagefind — leave).
  - **Filter tabs** (All / Implementation / Use Case / Debugging) →
    `src/components/blog/FilterTabs.astro`; the options come from `POST_TYPES` in `consts.ts`.
  - **Each post card** → `src/components/blog/PostCard.astro` (badges, title, excerpt, date,
    tags). 🟡 Edit card layout here; it's reused everywhere a post is listed.
  - **Pager (1 · 2 · ›)** → `src/components/blog/Pagination.astro`. 🟢 Posts-per-page is
    `POSTS_PER_PAGE` in `consts.ts`.

## Category pages ( /blog/category/debugging … )

- **Page:** `src/pages/blog/category/[type]/[...page].astro` — same `BlogListing` layout.
  Title/blurb come from `POST_TYPES` in `consts.ts`.

---

## A blog post ( /blog/<post> )

- **Template:** `src/layouts/BlogPost.astro` (this is the one consistent post layout).
- **Visible elements:**
  - **Type + status badges** → `src/components/blog/Badge.astro`.
  - **Title + meta row** (date, reading time, difficulty) → `src/components/blog/PostMeta.astro`.
  - **Series box** (if the post is in a series) → `src/components/blog/SeriesBox.astro`.
  - **Colored callout boxes** (Symptom, Root cause, Resolution, etc.) →
    `src/components/blog/Callout.astro`. **Their text is your post's frontmatter** (AUTHORING.md).
  - **Table of contents** (right side) → `src/components/blog/TableOfContents.astro` (auto from
    your `##` headings).
  - **The article body** → your `.mdx` content. Styling of body text is `.prose` in `global.css`.
- 🟢 To change a post's words → edit the post's `.mdx` file (AUTHORING.md).
- 🟡 To change the post **template/layout** (applies to all posts) → `BlogPost.astro`.

---

## Series pages

- **All-series index ( /blog/series ):** `src/pages/blog/series/index.astro` — 🟢 heading
  text editable here.
- **One series landing ( /blog/series/<name> ):** `src/pages/blog/series/[slug].astro` — the
  intro text + roadmap come from the **series file** (`src/content/series/<name>.mdx`),
  edited as content (AUTHORING.md), not in the page.
- **The in-post "Part X of N" box:** `src/components/blog/SeriesBox.astro`.

---

## The Portfolio ( /portfolio )

- **Page:** `src/pages/portfolio/index.astro`.
  - **Your intro** (name, role, bio, photo/initials, links) → 🟢 the `AUTHOR` object in
    `src/consts.ts`. (The component that renders it is
    `src/components/portfolio/AuthorIntro.astro`.)
  - **Each project card** (thumbnail, status, tech, action buttons) →
    `src/components/portfolio/PortfolioCard.astro`. The card **content** is each solution's
    file (AUTHORING.md).
- **A project detail page ( /portfolio/<name> ):** `src/pages/portfolio/[...slug].astro`.

---

## The 404 (not found) page

- **File:** `src/pages/404.astro` — 🟢 edit the message text directly.

---

## Quick "where do I change…?" cheat sheet

| I want to change…                          | Edit this                                               |
| ------------------------------------------ | ------------------------------------------------------- |
| Site name / brand wordmark                 | `src/consts.ts` → `SITE.name`                           |
| Top nav links                              | `src/consts.ts` → `NAV_LINKS`                           |
| Footer links                               | `src/consts.ts` → `SOCIAL_LINKS`                        |
| Your portfolio intro (name, bio, links)    | `src/consts.ts` → `AUTHOR`                              |
| Brand/accent color                         | `src/styles/global.css` → `--accent` (light + dark)     |
| Home hero headline / buttons / subtext     | `src/components/sections/Hero.astro`                    |
| The 3 category cards (labels/icons/blurbs) | `src/consts.ts` → `POST_TYPES`                          |
| "Latest writing" / "Featured work" titles  | `LatestPosts.astro` / `FeaturedWork.astro`              |
| Posts per page                             | `src/consts.ts` → `POSTS_PER_PAGE`                      |
| A post's / project's / series' content     | its `.mdx` file (see AUTHORING.md)                      |
| The look of all post pages                 | `src/layouts/BlogPost.astro` + `.prose` in `global.css` |
| 404 message                                | `src/pages/404.astro`                                   |

> Golden rule: **content** (the words of a post/project/series) lives in `.mdx` files;
> **page furniture** (nav, hero, footer, headings) lives in components; **shared values**
> (names, links, colors, types) live in `src/consts.ts`. When in doubt, check `consts.ts`
> first — most "global" edits are there.
