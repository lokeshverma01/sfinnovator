# VS Code + GitHub — Local Editing & Publishing

> How to connect VS Code to the GitHub repo, pull the latest files, create/edit a post,
> preview it locally, and push so it deploys. This is the **desktop** companion to the
> phone/web workflow in [AUTHORING.md](./AUTHORING.md).
>
> Repo: `https://github.com/lokeshverma01/sfinnovator`
> Production branch: `main` (pushing here triggers the live Cloudflare deploy)

---

## One-time setup

### 0. Install the tools (once per machine)

- **VS Code** — https://code.visualstudio.com
- **Git** — https://git-scm.com/downloads (Mac: `git` ships with Xcode tools)
- **Node.js 20+** — https://nodejs.org (needed to preview locally)
- In VS Code, install the extensions: **Astro**, **Tailwind CSS IntelliSense**,
  **Prettier** (the repo already recommends these — VS Code will prompt you).

### 1. Sign in to GitHub from VS Code

1. Open VS Code.
2. Click the **Accounts** icon (bottom-left circle) → **Sign in with GitHub**.
3. A browser opens → **Authorize**. Done — VS Code can now pull/push.

> Alternative (terminal): `gh auth login` then follow the prompts. On this Mac it's
> already authenticated as `lokeshverma01`.

---

## Getting the files

You only do **ONE** of these.

### Option A — Use the copy that already exists on this machine

The project is already cloned at:

```
/Users/l.verma/claude/claudeterminal
```

In VS Code: **File → Open Folder…** → choose that folder. You're connected. Skip to
"Daily workflow".

### Option B — Clone a fresh copy (new machine, or a clean location)

**Easiest (VS Code UI):**

1. **View → Command Palette** (`Cmd+Shift+P`).
2. Type **Git: Clone**, press Enter.
3. Paste the repo URL: `https://github.com/lokeshverma01/sfinnovator.git`
4. Pick a folder to clone into (e.g. `~/projects`).
5. When prompted, **Open** the cloned repo.

**Or terminal:**

```bash
cd ~/projects                       # wherever you keep code
git clone https://github.com/lokeshverma01/sfinnovator.git
cd sfinnovator
npm install                         # install dependencies (first time only)
```

---

## Daily workflow (pull → edit → preview → push)

### Step 1 — Pull the latest first (always)

Get any changes made elsewhere (phone, web editor, this AI session) before you start.

- VS Code: **Source Control** panel → **… menu → Pull**, or click the sync icon (bottom bar).
- Terminal: `git pull`

> Make sure you're on `main`: the branch name shows in the bottom-left of VS Code.

### Step 2 — Create or edit a file

To add a new blog post:

1. In the **Explorer**, open `src/content/blog/`.
2. Right-click → **New File** → name it `my-post-slug.mdx` (lowercase, hyphens; the file
   name becomes the URL).
3. Open `docs/templates/blog-debugging.mdx` (or implementation / use-case), copy its
   contents into your new file, fill in the fields and write the body.
   (Full field reference: [AUTHORING.md](./AUTHORING.md).)

Portfolio item? Same idea in `src/content/portfolio/` using `templates/portfolio-solution.mdx`.

### Step 3 — Preview it locally (optional but recommended)

In the VS Code terminal (**Terminal → New Terminal**):

```bash
npm run dev        # fast live preview at http://localhost:4321
```

Edit and the browser refreshes instantly. Press `Ctrl+C` to stop.

> Note: **search (Pagefind) does NOT work in `npm run dev`** — it needs a build. To test
> search locally instead:
>
> ```bash
> npm run build && npm run preview     # http://localhost:4321, includes search
> ```

### Step 4 — Commit your change

In the **Source Control** panel (the branch icon on the left, or `Cmd+Shift+G`):

1. You'll see your new/changed files listed.
2. Hover the file → click **+** to **Stage** it (or stage all).
3. Type a short message in the box, e.g. `Add post: SOQL 101 fix`.
4. Click **✓ Commit**.

Terminal equivalent:

```bash
git add .
git commit -m "Add post: SOQL 101 fix"
```

### Step 5 — Push (this is what deploys)

- VS Code: click **Sync Changes** (the ↑↓ in the bottom bar), or **… → Push**.
- Terminal: `git push`

Pushing to `main` → Cloudflare rebuilds → **live in ~1–2 minutes** at your domain.

---

## Two ways to push — pick your safety level

| Approach                         | How                                                           | When to use                          |
| -------------------------------- | ------------------------------------------------------------- | ------------------------------------ |
| **Straight to `main`** (simple)  | Edit on `main`, commit, push. Goes live immediately.          | Solo, confident changes              |
| **Branch + Pull Request** (safe) | Make a branch, push it, open a PR, get a preview, then merge. | Reviewed changes, a delegated writer |

### Branch + PR (the reviewed flow)

```bash
git switch -c post/soql-101 main     # new branch off main
# ...create your file, commit...
git push -u origin post/soql-101     # push the branch
```

Then on GitHub: **Compare & pull request** → Cloudflare posts a **preview URL** on the PR →
review it → **Merge** → it goes live. This is how a future writer should work so nothing
hits production unreviewed.

---

## Common issues

| Problem                                              | Fix                                                                                                                                            |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| "Updates were rejected" on push                      | Someone pushed first. Run **Pull**, resolve if asked, push again.                                                                              |
| Push asks for username/password                      | Sign in via the Accounts icon (above), or `gh auth login`.                                                                                     |
| Changed files I didn't expect (dist/, node_modules/) | These are gitignored and won't be committed — ignore them.                                                                                     |
| Build fails after a commit                           | The PR/commit check shows the file + line. Usually a missing field or a stray `:` in a title — see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md). |
| Search empty when testing                            | You used `npm run dev`. Use `npm run build && npm run preview`.                                                                                |

---

## The mental model

```
GitHub (origin/main)  ⇄  your VS Code folder (local clone)
        │                         │
   git pull  ◄───────────────────┘   (get latest before editing)
        │
   edit file → commit → git push ──►  GitHub main
                                          │
                                   Cloudflare builds & deploys
                                          │
                                     live site
```

Pull before you start, push when you're done. That's the whole loop.
