// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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

  // Tailwind v4 is wired through the Vite plugin (no tailwind.config.js needed).
  vite: {
    plugins: [tailwindcss()],
  },
});
