/**
 * Deploy-environment helpers — decide search-engine indexability automatically,
 * so you never hand-edit index/noindex per page or per deploy.
 *
 * THE RULE: a build is indexable only when it is the PRODUCTION build.
 * Production is detected automatically, with no dashboard setup required:
 *
 *   1. Cloudflare Workers Builds injects `WORKERS_CI_BRANCH` on every build.
 *      We treat the `main` branch as production → indexable.
 *   2. `SEO_INDEX=true` is an optional manual override (Settings → Build →
 *      "Build variables and secrets") if you ever want to force-index a build.
 *
 * Result (fully automatic, nothing to remember at launch):
 *   - Production  (main branch on Cloudflare)  → indexable
 *   - Preview     (feature/* branch builds)     → noindex
 *   - Local       (`npm run build`, no CI vars) → noindex
 *
 * Fail-safe: if neither signal says production, the build is noindex — we can
 * never accidentally index an unfinished preview or a local build.
 *
 * Read at BUILD time (Node), so the decision is baked into the static HTML.
 *
 * Local production simulation:  WORKERS_CI_BRANCH=main npm run build
 *                          or:  SEO_INDEX=true npm run build
 */
export function isIndexable(): boolean {
  if (process.env.SEO_INDEX === 'true') return true; // manual override
  return process.env.WORKERS_CI_BRANCH === 'main'; // Cloudflare production build
}
