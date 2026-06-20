// @ts-check
import { createHash } from 'node:crypto';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { PREPAINT_THEME_SCRIPT } from './src/lib/themeScript.mjs';

// Compute the CSP hash for our one unavoidable inline script (the no-flash
// theme bootstrap). Derived from the SAME string the layout renders, so the
// hash can never drift from the script. Astro auto-hashes all OTHER (bundled)
// scripts; this covers the is:inline one it can't see.
const prepaintHash =
  'sha256-' + createHash('sha256').update(PREPAINT_THEME_SCRIPT, 'utf8').digest('base64');

// https://astro.build/config
export default defineConfig({
  // IMPORTANT: set this to your live domain. Used for canonical URLs,
  // sitemap, and RSS. Update if the domain ever changes.
  site: 'https://sfinnovator.com',

  // Fully static output -> deploys identically on Azure Static Web Apps
  // today and Cloudflare Pages later. No rework when you migrate.
  output: 'static',

  // Integrations:
  //  - mdx:     write blog posts in Markdown + components
  //  - sitemap: auto-generates /sitemap-index.xml for SEO
  integrations: [mdx(), sitemap()],

  // Syntax highlighting: Prism (class-based) instead of the default Shiki.
  // Shiki emits inline `style=` on every token, which violates our strict
  // `style-src` CSP. Prism emits `<span class="token …">` styled by our own
  // stylesheet (src/styles/prism.css) — fully CSP-compatible.
  markdown: {
    syntaxHighlight: 'prism',
  },

  // Tailwind v4 is wired through the Vite plugin (no tailwind.config.js needed).
  vite: {
    plugins: [tailwindcss()],
  },

  // Content Security Policy (security-first). Stable as of Astro 6.
  // Astro auto-hashes bundled scripts/styles and emits a strict CSP <meta> on
  // every page — no `unsafe-inline`. We add the one is:inline theme script's
  // hash explicitly (Astro can't see inline scripts). For static builds the
  // policy is delivered via <meta http-equiv="content-security-policy">.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
      // Allow our no-flash inline theme bootstrap (hash auto-derived above).
      scriptDirective: {
        hashes: [prepaintHash],
      },
    },
  },
});
