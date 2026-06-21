# Authoring Guide — Publish Without Touching Code

> This is the no-code workflow. To publish a blog post or a portfolio solution you
> **add one text file** and the site rebuilds and deploys itself. You never edit a
> component, never run a build, never touch `.astro` files. You can do it from a laptop
> or from your phone in the GitHub website.

---

## The 30-second version

1. Copy a starter template from [`docs/templates/`](./templates/).
2. Save it as a new `.mdx` file in the right folder (see below).
3. Fill in the fields, write your content.
4. Commit to `main` (or open a PR). Cloudflare rebuilds → it's **live in ~1–2 minutes**.

| To publish a…  | Put the file in…         | It becomes…              |
| -------------- | ------------------------ | ------------------------ |
| Blog post      | `src/content/blog/`      | `/blog/<file-name>`      |
| Portfolio item | `src/content/portfolio/` | `/portfolio/<file-name>` |

The **file name is the URL**. `src/content/blog/soql-101.mdx` → `sfinnovator.com/blog/soql-101`.
Use lowercase words with hyphens, no spaces.

---

## What is an `.mdx` file?

It's a normal text file with two parts:

```
---
title: 'My title'        ← FRONTMATTER: the fields (between the --- lines)
type: debugging
---

## My heading            ← BODY: your writing, in Markdown
Some text...
```

- **Frontmatter** (between the `---` lines) = the structured fields. These fill the
  badges, callout boxes, dates, tags, etc.
- **Body** (after the second `---`) = your detailed write-up in Markdown.

You don't need to memorize the fields — the templates have them all, labeled.

---

## Publishing a BLOG POST (step by step)

1. Decide the **type**: is it an _implementation_, a _use-case_, or a _debugging_ post?
2. Open the matching template and copy everything:
   - [`templates/blog-implementation.mdx`](./templates/blog-implementation.mdx)
   - [`templates/blog-use-case.mdx`](./templates/blog-use-case.mdx)
   - [`templates/blog-debugging.mdx`](./templates/blog-debugging.mdx)
3. Create a new file in `src/content/blog/` named after your post, e.g.
   `bulk-api-timeout.mdx`. Paste the template in.
4. Fill the frontmatter (delete the `#` comment lines as you go) and write the body.
5. Set `published: true` when it's ready (or `false` to keep it a private draft).
6. Save/commit. Done.

### Blog field reference

**Every post has these:**

| Field         | Required | What it is                                                                    |
| ------------- | -------- | ----------------------------------------------------------------------------- |
| `type`        | yes      | `implementation` \| `use-case` \| `debugging` (don't change it in a template) |
| `title`       | yes      | The headline (H1 + browser/Google title)                                      |
| `description` | yes      | 1–2 lines; shows on cards and in search results. Keep < 160 chars             |
| `publishedAt` | yes      | `YYYY-MM-DD`                                                                  |
| `updatedAt`   | no       | Show a "Updated …" date when you revise                                       |
| `tags`        | no       | `[Apex, Flow]` — topic labels                                                 |
| `difficulty`  | no       | `Beginner` \| `Intermediate` \| `Advanced`                                    |
| `featured`    | no       | `true` pins it to the homepage                                                |
| `published`   | no       | Defaults `true`. Set `false` to hide entirely.                                |
| `image`       | no       | Custom social-share image path                                                |

**Type-specific fields** (these become the colored callout boxes — fill only your type's):

| Type             | Fields                                                              |
| ---------------- | ------------------------------------------------------------------- |
| `implementation` | `objective` (req), `prerequisites` (list), `outcome`                |
| `use-case`       | `scenario` (req), `businessValue`, `solution`                       |
| `debugging`      | `symptom` (req), `environment`, `status`, `rootCause`, `resolution` |

`status` (debugging only): `solved` · `workaround` · `investigating` → drives the colored badge.

---

## Publishing a PORTFOLIO SOLUTION

1. Copy [`templates/portfolio-solution.mdx`](./templates/portfolio-solution.mdx).
2. Create a file in `src/content/portfolio/`, e.g. `case-router.mdx`.
3. Fill `title` and `summary` (the only required fields). Add any action links you have.
4. Commit. It automatically appears as a card on `/portfolio`, gets its own detail page,
   and (if `featured: true`) shows on the homepage.

### Portfolio field reference

| Field         | Required | What it is                                             |
| ------------- | -------- | ------------------------------------------------------ |
| `title`       | yes      | Solution name                                          |
| `summary`     | yes      | One line for the card (< 200 chars)                    |
| `tagline`     | no       | Longer line on the detail-page hero                    |
| `status`      | no       | `shipped` \| `in-progress` \| `concept` (badge)        |
| `tech`        | no       | `[Flow, LWC, Apex]` badges                             |
| `useUrl`      | no       | ▶ "Use it live" button (demo / app)                    |
| `validateUrl` | no       | ✓ "Validate" button (test org / verification steps)    |
| `repoUrl`     | no       | 👁 "Source" button                                     |
| `blogSlug`    | no       | 📝 link to a related blog post (that post's file name) |
| `role`        | no       | Shown in the detail sidecard                           |
| `completedAt` | no       | Date, shown in the sidecard                            |
| `order`       | no       | Lower = appears earlier on /portfolio (default 100)    |
| `featured`    | no       | `true` = homepage "Featured work" strip                |
| `published`   | no       | Defaults `true`. `false` hides it.                     |
| `image`       | no       | Thumbnail; falls back to the title's initials          |

**The buttons are flexible:** a button appears only if you provide its URL. A write-up-only
project with no links just shows no buttons — that's fine and intended.

---

## The `published` switch (taking things public / private)

Every post and solution has `published`:

- `published: true` (default) → built, live, public, searchable.
- `published: false` → **completely hidden**: no page is generated, and it won't appear in
  any listing, category, the homepage, RSS, the sitemap, or search.

Use `false` for drafts or to retire something without deleting it. Flip to `true` to publish.

---

## Adding images

1. Put the image file in `public/images/` (e.g. `public/images/my-flow.png`).
2. Reference it in your body with a leading slash: `![Describe it](/images/my-flow.png)`.
3. Always write meaningful alt text (the part in `[...]`) — it helps SEO and accessibility.

---

## Writing from your phone / browser (no laptop needed)

You can publish entirely from the GitHub website:

1. Go to the repo → `src/content/blog/` (or `portfolio/`).
2. **Add file → Create new file**. Name it `your-slug.mdx`.
3. Paste a template (open it from `docs/templates/` in another tab), fill it in.
4. Scroll down → **Commit new file** → commit to `main` (or create a branch + PR).
5. Cloudflare rebuilds automatically. Live in ~1–2 minutes.

> Tip: commit to a **new branch** and open a Pull Request instead of committing straight to
> `main` if you'd like a preview + a review step before it goes public. This is how a
> delegated writer should work (see below).

---

## How it goes live (what happens after you commit)

```
You add/commit an .mdx file
        │
        ▼
GitHub (main branch)  ──►  Cloudflare Pages detects the push
        │
        ▼
Cloudflare runs:  npm run build   (Astro builds pages + Pagefind builds search index)
        │
        ▼
New static site deployed to the CDN  ──►  live at your domain
```

No servers, no database, no manual deploy. Just a file.

---

## Quick rules & gotchas

- **File name = URL.** Lowercase, hyphens, `.mdx` extension. No spaces.
- **Keep the `---` lines.** The frontmatter must sit between two `---` lines at the very top.
- **Quote titles with colons:** `title: 'Error: too many queries'` (a bare colon breaks YAML).
- **Dates are `YYYY-MM-DD`.**
- **Don't change `type`** in a blog template — it selects which callouts render.
- **Lists** (tags, prerequisites) use `[a, b]` or one `- item` per line.
- If a build ever fails, the commit's checks will show the exact file + line — usually a
  missing required field or a stray colon. See `docs/TROUBLESHOOTING.md`.

---

## Delegating to a writer (future)

Today this is a Git-based flow, which is perfect for a reviewed workflow:

- Give the writer access to the repo.
- They create posts on a **branch** and open a **Pull Request** (never commit to `main`).
- Each PR gets an automatic **preview deployment** to review.
- You (admin) review and **merge** → it goes live.

That gives you the writer → admin → publish approval flow with zero extra tooling. (A
visual CMS editor on top of these same files can be added later if you want a non-technical
writing UI — it's optional sugar over this exact system.)
