# Implementation Guide — Build SF Innovator From Scratch

> **Who this is for:** anyone (including future-you, or someone you delegate to) who
> wants to rebuild this site step by step. Written in plain language first, with the
> exact commands and the "why" beside each step. Follow it top to bottom and you get
> the same site.
>
> **How to read the boxes:** 🧠 = the idea in plain words · ⌨️ = the exact command ·
> 📁 = files touched · ✅ = how to confirm it worked.

This guide is **append-only and chronological**. Every phase adds a new section; we
never delete history, so the document doubles as a decision log.

---

## Table of contents

- [Phase 0 — Foundation & tooling](#phase-0--foundation--tooling)
- [Phase 1 — The landing page](#phase-1--the-landing-page)
- [Phase 1.5 — Design finalisation](#phase-15--design-finalisation)
- [Phase 1.6 — Documentation & security baseline](#phase-16--documentation--security-baseline)
- [Phase 2 — The blog (planned)](#phase-2--the-blog-planned)

---

## Phase 0 — Foundation & tooling

### 0.1 Prerequisites

🧠 You need three tools on your machine. Node runs the build, npm installs packages,
git tracks history.

⌨️ Check they exist:

```bash
node --version   # need 18.20+, 20.3+, or 22+
npm --version
git --version
```

If Node is missing, install the LTS build from <https://nodejs.org> (or via `nvm`).

**Editor:** VS Code + extensions: _Astro_, _Tailwind CSS IntelliSense_, _Prettier_.
The repo recommends these automatically (`.vscode/extensions.json`).

### 0.2 Why this stack (the architect's reasoning)

| Choice            | Why                                                               |
| ----------------- | ----------------------------------------------------------------- |
| **Astro 6**       | Ships **zero JavaScript by default** → fastest load, best SEO.    |
| **static output** | Pre-built HTML on a CDN → cheap, scalable, identical on any host. |
| **Tailwind v4**   | Utility CSS → tiny output, fast to build a consistent UI.         |
| **MDX**           | Write posts in Markdown + components. Version-controlled.         |
| **TypeScript**    | Catches mistakes before they ship.                                |

### 0.3 Create the project files

🧠 Rather than the interactive `npm create astro`, this repo defines its files
explicitly so the setup is reproducible. The key files:

📁 `package.json` (dependencies + scripts), `astro.config.mjs` (Astro + integrations),
`tsconfig.json` (strict TS + path aliases), `.prettierrc`, `.gitignore`.

⌨️ Install dependencies:

```bash
npm install
```

✅ Confirm:

```bash
npm run build   # should end with "[build] Complete!"
```

### 0.4 Git foundation & branching

🧠 `main` is the live site. `develop` is staging. Real changes happen on
`feature/*` branches that open a Pull Request into `develop`. This is the
"small parts, one at a time" workflow.

⌨️

```bash
git init
git add -A
git commit -m "Phase 0+1: scaffold"
git branch -M main
git branch develop
```

Later, per feature:

```bash
git switch -c feature/<short-name> develop
# ...work...
git push -u origin feature/<short-name>   # open a PR into develop
```

---

## Phase 1 — The landing page

🧠 Goal: a fast, SEO-clean home page with a smooth dark/light toggle, plus empty
"skeleton" folders so adding blogs later is drop-in, not a rebuild.

### 1.1 The shape of the project

📁 See [`docs/COMPONENT_REFERENCE.md`](./COMPONENT_REFERENCE.md) for the full file map.
The mental model:

```
src/
  pages/        a file here = a URL  (index.astro -> /)
  layouts/      the page shell (BaseLayout) — <head>, header, footer
  components/   reusable pieces (ui / layout / sections)
  content/      blog posts (.mdx) + their schema  ← the "content backend"
  styles/       global.css = Tailwind + the colour tokens
  lib/          helpers (seo.ts)
  consts.ts     one place for site name, nav links, categories
```

### 1.2 Site constants — single source of truth

🧠 Site name, description, nav links, and the three blog categories live in **one
file** so you change them once. 📁 `src/consts.ts`.

### 1.3 The SEO helper

🧠 Every page needs a title, description, canonical URL, and social-share tags.
Instead of repeating that, one function builds it. 📁 `src/lib/seo.ts` →
`buildSeo({ title, description, ... })`.

### 1.4 BaseLayout — the shell every page uses

🧠 This holds the `<head>` (all SEO tags + JSON-LD structured data), the
**no-flash theme bootstrap**, and the shared Header/Footer with a `<slot/>`
where each page's content drops in. 📁 `src/layouts/BaseLayout.astro`.

> **No-flash trick:** a tiny inline script runs _before_ the page paints, reads the
> saved theme (or system preference), and sets the `dark` class on `<html>`. So the
> user never sees a white flash before dark mode kicks in.

### 1.5 The theme tokens & dark mode

🧠 Colours are defined as CSS variables once, with a `.dark` override block. Switching
theme just toggles one class; every colour updates via the variables.
📁 `src/styles/global.css`.

### 1.6 Components

📁 Built in this order (each is small and reusable):

1. `components/ui/Container.astro` — width + padding wrapper used everywhere.
2. `components/ui/ThemeToggle.astro` — the sun/moon button.
3. `components/layout/Header.astro` — logo badge, nav, toggle.
4. `components/layout/Footer.astro` — copyright + links.
5. `components/sections/Hero.astro` — headline block.
6. `components/sections/Features.astro` — the 3 category cards.
7. `components/sections/LatestPosts.astro` — recent-posts list (with empty state).

### 1.7 Pages

📁 `pages/index.astro` composes Hero + Features + LatestPosts. `pages/404.astro` is the
not-found page. `pages/blog/index.astro` and `pages/portfolio/index.astro` are
skeletons. `pages/rss.xml.ts` generates the RSS feed.

### 1.8 SEO plumbing

📁 `public/robots.txt` (crawler rules + sitemap pointer), `@astrojs/sitemap` integration
(auto `sitemap-index.xml`), `public/favicon.svg`.

✅ Confirm SEO output:

```bash
npm run build
grep -o '<title>[^<]*' dist/index.html
grep -o 'canonical[^>]*' dist/index.html
ls dist/sitemap-index.xml dist/robots.txt dist/rss.xml
```

### 1.9 Run it

⌨️

```bash
npm run dev      # http://localhost:4321 (or next free port)
```

✅ You should see the landing page; clicking the toggle flips light/dark with no flash.

---

## Phase 1.5 — Design finalisation

🧠 Before investing in real components, the design was finalised using an **interactive
HTML mockup** (`design/mockup.html`) — opened in a browser, themes toggled, approved.
Then the exact tokens, hero, cards, and a new "Latest writing" list were ported into the
real Astro components.

**Design system locked:**

- Accent: `#0176D3` (light) / `#2a9bf4` (dark)
- Type: Inter (UI) + monospace (dates/metadata)
- Radii: 7px logo → 10px buttons → 14px cards
- Surfaces: `bg` / `bg-subtle` / `bg-card` + one soft shadow
- Motion: 0.3s colour fade; `prefers-reduced-motion` respected

📁 `design/mockup.html` is kept as the visual reference of record.

---

## Phase 1.6 — Documentation & security baseline

🧠 Two non-negotiables added side by side with the code: **living documentation** and a
**security-first posture**.

### 1.6.1 Documentation system

📁 Created `docs/`:

- `IMPLEMENTATION_GUIDE.md` — this file (step-by-step rebuild journal).
- `COMPONENT_REFERENCE.md` — every component: path, purpose, props, dependencies.
- `TROUBLESHOOTING.md` — "if X fails, look here" runbook.
- `SECURITY.md` — security posture + checklist.
- `CONVENTIONS.md` — coding & component standards.

**Rule:** every future phase updates these in the _same_ commit as the code.

### 1.6.2 Security baseline

🧠 A blog has a small attack surface, but we still apply defence-in-depth.

📁 Changes:

1. **Upgraded to Astro 6** — to clear a **high-severity XSS** advisory in Astro 5. Added a
   `vite@^7` override in `package.json` so a single Vite version is used (Astro 6 +
   `@tailwindcss/vite` otherwise pull two, which breaks the Tailwind build).
2. **Content Security Policy** — `astro.config.mjs` → `security.csp` (stable in Astro 6).
   Astro auto-hashes bundled scripts/styles; the one unavoidable `is:inline` theme
   bootstrap lives in `src/lib/themeScript.mjs` and its hash is computed from that same
   string and added via `scriptDirective.hashes` — so it can never drift. Strict
   `script-src`/`style-src`, **no `unsafe-inline`**. Delivered as a `<meta>` per page.
3. **Removed inline `style=` attributes** — moved into `.header-blur` / `.hero-grid`
   classes in `global.css` so `style-src 'self'` holds.
4. **Host security headers** — `public/staticwebapp.config.json`: HSTS,
   `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`,
   `Permissions-Policy`, `Cross-Origin-Opener-Policy`.
5. **Caching** — immutable long-cache for hashed `/_astro/*` assets.

✅ Confirm CSP shipped, with the inline script's hash matching the policy:

```bash
npm run build
grep -o 'content-security-policy[^>]*' dist/index.html | head -c 300
grep -c 'sha256-' dist/index.html      # > 0: scripts/styles are hashed
grep -c 'unsafe-inline' dist/index.html # must be 0
```

See [`SECURITY.md`](./SECURITY.md) for the full rationale and the go-live checklist.

---

## Phase 1.7 — Cloudflare Pages deploy (chosen host)

🧠 Decision: host on **Cloudflare Pages** (root-domain serving, unlimited bandwidth, free,
per-branch previews). The existing `lokesh-portfolio` repo on Azure is left untouched.

### 1.7.1 Host-specific config

📁 Added:

- `public/_headers` — Cloudflare's security-headers + caching file (mirrors the Azure
  `staticwebapp.config.json`). Ships to `dist/_headers`.
- `public/_redirects` — redirect rules (empty; Astro's `404.html` is auto-served).

✅ Confirm they ship:

```bash
npm run build
ls dist/_headers dist/_redirects
```

### 1.7.2 Rehearse the deploy locally (no install needed)

🧠 `wrangler` is Cloudflare's CLI. We use `npx` so nothing is installed globally.

⌨️ One-time auth (interactive — run it yourself in the terminal):

```bash
! npx wrangler login
```

⌨️ Build, then deploy to a throwaway Pages project to rehearse:

```bash
npm run build
npx wrangler pages deploy dist --project-name sfinnovator
```

✅ Wrangler prints a `*.pages.dev` preview URL. Open it; verify the page, theme toggle,
and (via `curl -sI <url>`) the security headers.

### 1.7.3 Git-based auto-deploy (the "push = deploy" you liked)

🧠 The durable setup connects the **GitHub repo** to Cloudflare Pages so every push
builds & deploys — same as the Azure behaviour, no tokens in the repo.

Steps (in the Cloudflare dashboard, after the repo is on GitHub):

1. Workers & Pages → Create → Pages → **Connect to Git** → pick the repo.
2. Build command: `npm run build` · Output dir: `dist` · Framework preset: **Astro**.
3. Production branch: `main`. Every other branch → automatic **preview** deployment.
4. Custom domain: add `sfinnovator.com` (later) → Cloudflare manages DNS + HTTPS.

✅ Push to `main` → build runs → site live. Push a `feature/*` branch → unique preview URL.

> **Note:** there is **no token/secret to store** with the Git integration — Cloudflare
> pulls from GitHub directly. (The `npx wrangler pages deploy` path above is only for
> manual rehearsal.)

---

## Phase 2 — The blog (planned)

> Not built yet. When we do it, this section gets the exact steps. Planned scope:
>
> - `pages/blog/[...slug].astro` — render a single post from MDX.
> - Update `pages/blog/index.astro` — list all posts (real data).
> - `pages/blog/category/[category].astro` — filter by category.
> - Per-post SEO (`type: 'article'`, per-post OG image).
> - Syntax highlighting for code blocks (Shiki, built into Astro).
> - First real post: `src/content/blog/<slug>.mdx`.
