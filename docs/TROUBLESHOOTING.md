# Troubleshooting Runbook

> When something breaks, start here. Each entry is: **Symptom → Likely cause → Where to
> look (exact file/path) → How to fix → How to confirm.** Designed so you can pinpoint
> the component and configuration fast, without re-reading the whole codebase.

## How to use this doc

1. Find the symptom that matches.
2. Go to the **exact file path** listed.
3. Apply the fix, then run the **confirm** command.
4. If it's a new failure mode, **add an entry here** in the same commit as the fix.

General first moves:

```bash
npm run build      # reproduces most issues with a clear error + file + line
npm run dev        # live reload for UI issues
rm -rf node_modules .astro dist && npm install   # nuclear reset if state is weird
```

---

## A. Build & tooling

### A1. `npm run build` fails with a content/collection schema error

- **Cause:** a blog post's frontmatter doesn't match the schema (missing field, bad
  date, unknown category).
- **Look:** the offending `.mdx` in `src/content/blog/`, and the schema in
  `src/content.config.ts`.
- **Fix:** make the frontmatter satisfy the Zod schema — `title`, `description`,
  `category` (one of `BLOG_CATEGORIES` in `consts.ts`), `publishedAt` (a valid date).
- **Confirm:** `npm run build` completes.

### A2. Message: "The collection 'blog' does not exist or is empty"

- **Status:** **Not an error.** Expected while there are no posts. `LatestPosts.astro`
  and `rss.xml.ts` handle the empty case.
- **Action:** none, until Phase 2 adds the first post.

### A3. `npm run build` fails after editing the content schema

- **Cause:** generated types are stale.
- **Look:** `.astro/` (generated), `src/content.config.ts`.
- **Fix:** `rm -rf .astro && npm run build` (regenerates `astro:content` types).

### A4. TypeScript path alias (`@components/…`) not resolving

- **Look:** `tsconfig.json` → `compilerOptions.paths`.
- **Fix:** ensure the alias exists and the import matches. Restart the TS server in VS
  Code (Cmd+Shift+P → "Restart TS Server").

### A5. Port already in use on `npm run dev`

- **Status:** harmless — Astro auto-picks the next free port; read the printed URL.
- **Fix (optional):** `lsof -ti:4321 | xargs kill` to free the default port.

---

## B. Styling & theme

### B1. Dark/light toggle does nothing

- **Look (in order):**
  1. `src/components/ui/ThemeToggle.astro` — the click handler script present?
  2. `src/layouts/BaseLayout.astro` — the pre-paint bootstrap script present in `<head>`?
  3. `src/styles/global.css` — the `@custom-variant dark (...)` line present?
- **Cause:** toggle adds/removes `.dark` on `<html>`; CSS reacts via that class. If any
  of the three pieces is missing, it breaks.
- **Confirm:** in browser DevTools, click toggle → `<html>` gains/loses `class="dark"`.

### B2. Flash of wrong theme on page load (FOUC)

- **Look:** `BaseLayout.astro` — the bootstrap `<script is:inline>` must be in `<head>`
  and run **before** the body.
- **Cause:** script moved/removed, or made non-inline (deferred).
- **Fix:** keep it inline in `<head>`. After any edit, **rebuild** so its CSP hash updates
  (see C1).

### B3. A colour looks wrong / doesn't switch with theme

- **Cause:** a hardcoded hex instead of a token.
- **Look:** the component's classes — should use `var(--bg)`, `var(--text)`,
  `var(--border)`, `var(--accent)`, etc., defined in `src/styles/global.css`.
- **Fix:** replace the literal colour with the matching token.

### B4. Tailwind classes not applying

- **Look:** `src/styles/global.css` (must start with `@import 'tailwindcss';`) and
  `astro.config.mjs` (the `@tailwindcss/vite` plugin must be in `vite.plugins`).
- **Fix:** restore whichever is missing; restart `npm run dev`.

---

## C. Security (CSP & headers)

### C1. Browser console: "Refused to execute inline script … CSP"

- **Cause:** an inline script's content changed but its hash wasn't regenerated, or a new
  inline script was added by hand.
- **Look:** `astro.config.mjs` → `experimental.csp`; the script in
  `BaseLayout.astro` / `ThemeToggle.astro`.
- **Fix:** run `npm run build` — Astro re-hashes all inline scripts. Never add
  `'unsafe-inline'` to fix this.
- **Confirm:** `grep -c 'sha256-' dist/index.html` returns > 0, and the console error is
  gone.

### C2. A third-party embed/script/image is blocked

- **Cause:** CSP `default-src 'self'` blocks external origins by design.
- **Look:** `astro.config.mjs` → `experimental.csp.directives`.
- **Fix:** add the specific origin to the right directive (e.g.
  `img-src 'self' data: https://trusted-cdn.com`). Add the **narrowest** source possible —
  never `*`.
- **Confirm:** rebuild; the embed loads and no other resource is newly allowed.

### C3. Security headers missing in production

- **Cause:** host not reading the config, or wrong host config file.
- **Look:** `public/staticwebapp.config.json` (Azure). It must ship to `dist/`
  (`ls dist/staticwebapp.config.json`).
- **Fix:** ensure it's in `public/`. On Cloudflare Pages, headers come from a `_headers`
  file instead (add when migrating — see SECURITY.md §Migration).
- **Confirm:** `curl -sI https://sfinnovator.com | grep -i strict-transport-security`.

---

## D. SEO & metadata

### D1. Wrong/missing page title or description

- **Look:** the page passes props to `BaseLayout` (`title`, `description`); defaults come
  from `SITE` in `consts.ts`; assembly is in `lib/seo.ts`.
- **Fix:** set the props on the page, or update `SITE` defaults.

### D2. Social share shows no image

- **Cause:** `public/images/og-default.png` doesn't exist, or a post lacks an `image`.
- **Look:** `consts.ts` → `SITE.ogImage`; `lib/seo.ts` (resolves to absolute URL).
- **Fix:** add a 1200×630 PNG at that path.

### D3. Sitemap or canonical URLs use the wrong domain

- **Cause:** `site` is wrong.
- **Look:** `astro.config.mjs` → `site`; mirror in `public/robots.txt`.
- **Fix:** set both to the live domain; rebuild.

### D4. RSS feed empty or 404

- **Look:** `src/pages/rss.xml.ts`.
- **Cause:** no published (non-draft) posts yet → feed is empty by design. A 404 means the
  file/route is missing.
- **Confirm:** `ls dist/rss.xml` after build.

---

## E. Routing & pages

### E1. New page returns 404

- **Cause:** Astro routes by file. The file must be under `src/pages/` with a `.astro`/
  `.md`/`.mdx` extension.
- **Look:** the file's location/name; `dist/` for the generated `.html`.
- **Fix:** place it correctly (e.g. `src/pages/about.astro` → `/about`); rebuild.

### E2. 404 page not showing on the host

- **Look:** `src/pages/404.astro` (built to `dist/404.html`) and
  `public/staticwebapp.config.json` → `responseOverrides.404`.

---

## F. Deployment (Azure Static Web Apps)

### F1. Push to `main` didn't deploy

- **Look:** GitHub → Actions tab → the "Azure Static Web Apps CI/CD" run.
- **Common causes:** missing `AZURE_STATIC_WEB_APPS_API_TOKEN` secret; wrong
  `output_location` (must be `dist`); build failed in CI.
- **Fix:** add/verify the secret; confirm `app_location: '/'` and `output_location: 'dist'`
  in `.github/workflows/azure-static-web-apps.yml`.

### F2. Site deploys but assets 404 / styles missing

- **Cause:** wrong `output_location`, or `site` base mismatch.
- **Look:** the workflow YAML and `astro.config.mjs` → `site`.

### F3. Custom domain not working / no HTTPS

- **Look:** Azure Portal → Static Web App → Custom domains; your DNS provider's records.
- **Fix:** add the CNAME/TXT records Azure shows; wait for validation; HTTPS is automatic
  once validated.

---

## Escalation checklist (when nothing above matches)

1. Reproduce with `npm run build` — read the **file + line** in the error.
2. `git diff` / `git log` — what changed since it last worked?
3. Reset state: `rm -rf node_modules .astro dist && npm install && npm run build`.
4. Check the dependency's changelog if a version was bumped (Astro/Tailwind majors move
   fast).
5. Once solved, **add the new symptom to this runbook.**
