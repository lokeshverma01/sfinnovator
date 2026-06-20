# Coding & Component Conventions

> The standards that keep this codebase reusable, readable, and consistent. New code —
> yours or a collaborator's — should match these. When in doubt, copy the pattern of an
> existing, recently-touched file.

## Principles

1. **Reusable over repeated.** If a piece of UI appears twice, it's a component. If a
   value appears twice (a colour, a string, a link), it's a token/constant.
2. **One source of truth.** Branding, nav, categories → `src/consts.ts`. Colours →
   tokens in `src/styles/global.css`. SEO → `src/lib/seo.ts`.
3. **Comment the _why_, not the _what_.** The code shows what; comments explain intent,
   trade-offs, and gotchas.
4. **Secure & accessible by default.** No hardcoded secrets; semantic HTML; keyboard-
   reachable interactive elements.
5. **Document in the same commit.** Code change → update the relevant `docs/` file too.

## Component rules

- **Folder by role:**
  - `components/ui/` — generic, reused anywhere (Container, ThemeToggle, future Button/Card).
  - `components/layout/` — page furniture (Header, Footer).
  - `components/sections/` — page-specific blocks (Hero, Features, LatestPosts).
- **Every component opens with a doc comment** in its frontmatter fence describing:
  purpose, props, dependencies. Example:

  ```astro
  ---
  /**
   * ComponentName — one-line purpose.
   * Props: foo (what it does), bar?
   * Depends on: Container, consts.ts
   */
  ---
  ```

- **Props are typed.** Use an `interface Props { … }` (or the shared type from `lib/`).
- **No hardcoded colours.** Use `var(--bg)`, `var(--text)`, `var(--border)`,
  `var(--accent)`, etc. This is what makes dark mode and re-theming work.
- **No hardcoded site strings.** Pull names/links from `consts.ts`.
- **Full-width content is wrapped in `Container`** for consistent measure & padding.

## Styling

- Tailwind utility classes for layout/spacing/typography.
- Theme-dependent colours via the CSS variables (token names in `global.css`).
- Arbitrary values (`text-[15px]`, `rounded-[14px]`) are fine to match the design spec,
  but prefer the scale when it fits.
- Respect `prefers-reduced-motion` (already handled globally in `global.css`).

## TypeScript

- `strict` mode (via `astro/tsconfigs/strict`). No `any` without a comment justifying it.
- Use the path aliases (`@components/*`, `@lib/*`, …) for non-relative imports.

## Accessibility (baseline)

- Use semantic elements (`<header>`, `<nav>`, `<main>`, `<footer>`, headings in order).
- Interactive elements are real `<button>`/`<a>` with `aria-label` where the purpose
  isn't textual (e.g. the theme toggle).
- Visible focus states (`focus-visible:ring-*`) on interactive elements.
- Colour is never the only signal; contrast meets WCAG AA in both themes.

## Git & commits

- **Branches:** `feature/<short-name>` off `develop`; PR into `develop`; `develop` → `main`
  for release. `main` is always deployable.
- **Commit messages:** imperative summary line, then a short body explaining _why_.
  Group a code change with its doc update in the same commit.
- **One logical change per PR.** Small, reviewable units (the "small parts" philosophy).

## Definition of done (per change)

- [ ] `npm run build` passes with no new warnings.
- [ ] Works in **both** light and dark themes.
- [ ] Responsive (checked at mobile width).
- [ ] Uses tokens/constants — no hardcoded colours or site strings.
- [ ] Component has a doc comment; `COMPONENT_REFERENCE.md` updated if added/changed.
- [ ] Relevant `docs/` updated (implementation step, troubleshooting entry, etc.).
- [ ] No secrets committed; no CSP violations in the browser console.
