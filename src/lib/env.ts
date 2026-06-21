/**
 * Deploy-environment helpers — decide search-engine indexability automatically,
 * so you never hand-edit index/noindex per page or per deploy.
 *
 * THE RULE: a build is indexable ONLY when the env var `SEO_INDEX` === 'true'.
 *   - Set `SEO_INDEX=true` in the Cloudflare **Production** environment (at launch).
 *   - Do NOT set it for Preview/branch builds, and it's absent locally.
 *
 * Result (fully automatic):
 *   - Production (main → sfinnovator.com)  → indexable
 *   - Preview deployments (feature/* )      → noindex
 *   - Local builds                          → noindex
 *
 * Fail-safe: if the flag is missing for ANY reason, the site is noindex — we
 * can never accidentally index an unfinished preview. The only thing to
 * remember is to set SEO_INDEX=true on production at launch (it's in the
 * launch checklist in docs/SEO.md).
 *
 * Read at BUILD time (Node), so the decision is baked into the static HTML.
 */
export function isIndexable(): boolean {
  return process.env.SEO_INDEX === 'true';
}
