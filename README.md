# SF Innovator

Personal Salesforce learning blog + portfolio. Built with Astro, MDX, and Tailwind CSS.
Static-first for top SEO and fast loads; deployable on Azure Static Web Apps (now) and
Cloudflare Pages (later) with zero code changes.

## Tech stack

| Layer     | Choice                            |
| --------- | --------------------------------- |
| Framework | Astro 6 (static output)           |
| Styling   | Tailwind CSS v4                   |
| Content   | MDX via Astro Content Collections |
| Language  | TypeScript (strict)               |
| SEO       | Sitemap, RSS, OG, JSON-LD         |

## Local development

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:4321
npm run build      # production build -> ./dist
npm run preview    # preview the production build locally
npm run format     # format with Prettier
```

Requires Node 18.20+ / 20.3+ / 22+.

## Project structure

See [`PROJECT.md`](./PROJECT.md) for the full architecture, roadmap, and folder map.

## Branching & deploy

- `main` → production (sfinnovator.com)
- `develop` → staging / integration
- `feature/*` → one feature per branch, opened as a PR into `develop`

Pushing to the deploy branch triggers an automatic build & deploy (CI/CD).
