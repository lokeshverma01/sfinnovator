# SF Innovator — Project Plan & Architecture

Living document. Tracks the architecture, decisions, and phased roadmap.

---

## 1. Vision

A fast, SEO-optimized, scalable Salesforce blog + portfolio that grows into a
full content platform with a writer/admin portal and CMS — built in small,
learnable increments.

## 2. Architecture (target)

```
Readers ─► CDN edge (static HTML) ─► fastest load + best SEO
                                        │
                Astro app (this repo) ──┤ public blog + portfolio (static)
                                        └ future: /admin portal + CMS
                                              │
                              future: Postgres (Neon) + object storage (R2)
```

Today the site is **fully static** (`output: 'static'`). The portal/CMS and
database plug in later without restructuring (Astro supports server/hybrid
rendering via a config flag).

## 3. Tech decisions

| Decision      | Choice                    | Why                                            |
| ------------- | ------------------------- | ---------------------------------------------- |
| Framework     | Astro 6                   | Zero-JS by default → speed + SEO               |
| Styling       | Tailwind CSS v4           | Utility-first, tiny output                     |
| Content       | MDX + Content Collections | Type-safe, version-controlled                  |
| Language      | TypeScript (strict)       | Maintainability                                |
| Hosting       | Cloudflare Pages          | Root-domain serving, free, previews            |
| Hosting (alt) | Azure SWA (config kept)   | Parity only; `lokesh-portfolio` stays on Azure |
| Theme         | CSS vars + inline JS      | Smooth dark/light, no flash                    |

## 4. Folder map

```
public/            static assets (favicon, robots.txt, images)
src/
  components/
    ui/            generic: Container, ThemeToggle
    layout/        Header, Footer
    sections/      Hero, Features  (landing-page blocks)
  layouts/         BaseLayout (SEO + theme + shell)
  pages/           file = route  (index, 404, blog/, portfolio/, rss)
  content/         blog .mdx + schema (config.ts)  ← content backend
  lib/             seo.ts and future helpers
  styles/          global.css (Tailwind + theme tokens)
  consts.ts        site-wide constants
```

## 5. Roadmap

| Phase | Goal                                     | Status       |
| ----- | ---------------------------------------- | ------------ |
| 0     | Scaffold, git, deploy pipeline           | ✅ Done      |
| 1     | Landing page (hero, features, theme)     | ✅ Built     |
| 1.5   | Design finalisation (mockup → code)      | ✅ Done      |
| 1.6   | Docs system + security baseline (CSP)    | ✅ Done      |
| 1.7   | Cloudflare Pages config (\_headers etc.) | ✅ Done      |
| 1b    | Push to GitHub + connect Cloudflare Git  | ⬜ Your step |
| 2     | Blog: listing + post pages from MDX      | ⬜ Next      |
| 2b    | SEO polish: per-post OG, Lighthouse 95+  | ⬜           |
| 3     | Portfolio page                           | ⬜           |
| 5     | Database (Neon) + CMS/portal             | ⬜ Future    |
| 6     | Writer/Admin RBAC + approval workflow    | ⬜ Future    |
| 7     | Media library (R2), search, analytics    | ⬜ Future    |

## 5b. Documentation system

Living docs in [`docs/`](./docs/), updated in the same commit as the code:

- `IMPLEMENTATION_GUIDE.md` — step-by-step rebuild journal
- `COMPONENT_REFERENCE.md` — every file/component mapped
- `TROUBLESHOOTING.md` — failure → file → fix runbook
- `SECURITY.md` — posture + checklist
- `CONVENTIONS.md` — coding/component standards

## 5c. Security baseline

- Strict **CSP** with build-time hashed inline scripts (no `unsafe-inline`) — `astro.config.mjs`
- Host **security headers** (HSTS, frame-options, nosniff, referrer, permissions) — `public/_headers` (Cloudflare) + `public/staticwebapp.config.json` (Azure parity)
- Secrets gitignored; `npm audit` before deploys. Full detail in `docs/SECURITY.md`.

## 6. SEO checklist (baked in)

- [x] Per-page `<title>` + meta description
- [x] Canonical URLs
- [x] Open Graph + Twitter cards
- [x] JSON-LD structured data
- [x] sitemap (auto) + robots.txt
- [x] RSS feed
- [ ] Per-post OG images (Phase 2)
- [ ] Lighthouse 95+ verification (Phase 2b)

## 7. Decision log

- **2026-06-20** — Chose Astro+MDX over Next.js for the public site (speed/SEO,
  simplicity). Portal/CMS deferred to a later phase.
- **2026-06-20** — Accent color: Salesforce blue (#0176D3).
- **2026-06-20** — Stay on Azure SWA now; migrate to Cloudflare Pages once the
  repo + first page are live.
- **2026-06-20** — Upgraded Astro 5 → 6 to clear a high-severity XSS advisory; pinned
  `vite@^7` via overrides to keep one Vite in the tree. Accepted a low, dev-only,
  Windows-only esbuild advisory (see `docs/SECURITY.md`).
- **2026-06-20** — Chose **Cloudflare Pages** as the host for `claudeterminal` (root-domain
  serving, free, per-branch previews). Added `public/_headers` + `_redirects`; kept the
  Azure config for parity. Existing `lokesh-portfolio` (Azure CI/CD) left untouched. A
  separate near-duplicate repo `sfinnovator-extension` exists on GitHub but we proceed with
  `claudeterminal`.
