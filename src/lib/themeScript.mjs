/**
 * The pre-paint theme bootstrap script, as a string.
 *
 * Why a shared string? This script MUST run inline & synchronously in <head>
 * (before paint) to avoid a flash of the wrong theme — so Astro can't bundle &
 * auto-hash it for CSP. Instead it lives here once and is consumed in two places:
 *   1. BaseLayout renders it via <script is:inline set:html={...}>.
 *   2. astro.config.mjs hashes THIS exact string and adds it to the CSP.
 * Single source of truth → the CSP hash can never drift from the script.
 *
 * If you edit this script, the hash is recomputed automatically on next build.
 */
export const PREPAINT_THEME_SCRIPT = `(function () {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored ?? (prefersDark ? 'dark' : 'light');
  if (theme === 'dark') document.documentElement.classList.add('dark');
})();`;
