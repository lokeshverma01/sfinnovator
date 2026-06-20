# Security Posture & Checklist

> Security is a **non-negotiable** for this project. This document records what we do,
> why, and the checklist to keep it true as the site grows. A static blog has a small
> attack surface today — but the moment we add the writer/admin portal and a database,
> the surface grows, so we build the good habits now.

## Threat model (current: static site)

| Asset                 | Threat                          | Mitigation                                         |
| --------------------- | ------------------------------- | -------------------------------------------------- |
| Page HTML/JS          | XSS / script injection          | Strict CSP with hashed inline scripts              |
| The site in an iframe | Clickjacking                    | `X-Frame-Options: DENY` + `frame-ancestors`        |
| Traffic in transit    | MITM / downgrade                | HTTPS + HSTS (preload)                             |
| MIME confusion        | Drive-by via wrong content-type | `X-Content-Type-Options: nosniff`                  |
| Referrer leakage      | Privacy / info disclosure       | `Referrer-Policy: strict-origin-when-cross-origin` |
| Device APIs           | Abuse of camera/mic/geo         | `Permissions-Policy` denies all                    |
| Secrets               | Leaked keys                     | `.env` gitignored; no secrets in client code       |
| Dependencies          | Supply-chain vulns              | `npm audit`; pin majors; review updates            |

> The biggest practical risk for a content site is a **malicious dependency** or an
> **accidentally committed secret** — both are covered below.

## Controls in place

### 1. Content Security Policy (CSP)

- **Where:** `astro.config.mjs` → `security.csp` (stable in Astro 6).
- **What:** `default-src 'self'`; images/fonts allow `data:`; `frame-ancestors 'none'`;
  `base-uri 'self'`; `form-action 'self'`. Strict `script-src`/`style-src` — **no
  `unsafe-inline`**.
- **Bundled scripts/styles:** Astro auto-hashes them (SHA-256) and adds them to the
  policy. The theme **toggle** handler is a _processed_ script, so it's covered
  automatically.
- **The one inline script:** the no-flash theme bootstrap **must** be `is:inline` (run
  before paint). Astro can't see inline scripts, so its body lives in
  `src/lib/themeScript.mjs` and `astro.config.mjs` computes its hash from that **same
  string** and adds it via `scriptDirective.hashes`. The hash therefore can never drift.
- **Delivery:** for static builds, the policy ships as
  `<meta http-equiv="content-security-policy">` on every page.
- **No inline `style=` attributes:** moved to classes (`.header-blur`, `.hero-grid`) so
  `style-src 'self'` holds without `unsafe-inline`.
- **Golden rule:** to fix a CSP error, **add the narrowest source/hash** or rebuild —
  **never** add `'unsafe-inline'` or `*`.

### 2. Host security headers

- **Where (primary, Cloudflare Pages):** `public/_headers` (ships to `dist/_headers`).
- **Where (Azure SWA, kept for parity):** `public/staticwebapp.config.json`. Harmless on
  Cloudflare, which ignores it.
- **Headers (both):** `Strict-Transport-Security` (2y, includeSubDomains, preload),
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` (camera/mic/geo denied, `interest-cohort` off),
  `Cross-Origin-Opener-Policy: same-origin`.

### 3. Transport

- HTTPS everywhere (Azure SWA / Cloudflare provide certs automatically).
- HSTS tells browsers to never use plain HTTP for this domain.

### 4. Secrets hygiene

- `.env*` files are gitignored. **No secret is ever read in client-side code** — a static
  site ships everything to the browser, so anything in a component is public.
- Tokens (e.g. the Azure deploy token) live in **GitHub Actions secrets**, never in the repo.

### 5. Dependencies

- `npm audit` reviewed before deploys.
- Major version bumps (Astro/Tailwind) are reviewed on a `feature/*` branch, never merged
  blind.
- **Pinned to Astro 6** specifically to clear a **high-severity XSS** advisory present in
  Astro 5 (`GHSA-j687-52p2-xcff` and related). A `vite@^7` override keeps a single Vite
  in the tree (Astro 6 + `@tailwindcss/vite` otherwise pull two).

**Accepted (won't-fix) advisories — reviewed 2026-06-20:**

| Advisory                                             | Severity | Why accepted                                                                                                                                                                                                                       |
| ---------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| esbuild dev-server file read (`GHSA-g7r4-m6w7-qqqr`) | low      | **Dev-server only, Windows only.** Does not affect the static production build. The only "fix" downgrades Astro to 5.x, which **reintroduces the high-severity XSS** — net negative. Re-evaluate when Astro ships an esbuild bump. |

Re-check this table whenever `npm audit` output changes.

## Verify the posture

```bash
# CSP present with hashed inline scripts:
npm run build
grep -o 'content-security-policy[^>]*' dist/index.html | head -c 300
grep -c 'sha256-' dist/index.html          # expect > 0

# Host config shipped (Cloudflare primary; Azure kept for parity):
ls dist/_headers dist/_redirects dist/staticwebapp.config.json

# After deploy, confirm live headers (use the *.pages.dev URL pre-domain):
curl -sI https://sfinnovator.com | grep -iE 'strict-transport|x-frame|x-content-type|referrer-policy'
```

External audits (run after go-live):

- <https://securityheaders.com> — aim for **A/A+**.
- <https://observatory.mozilla.org> — Mozilla Observatory.
- Browser DevTools → Console — zero CSP violations.

## Go-live security checklist

- [ ] `npm audit` shows no **high/critical** vulns (or they're triaged & documented).
- [ ] No secrets in the repo (`git log -p | grep -iE 'key|secret|token|password'` spot-check).
- [ ] `.env` is gitignored and not committed.
- [ ] CSP `<meta>` present on every page with `sha256-` hashes.
- [ ] Security headers present in production (`curl -sI`).
- [ ] HTTPS enforced; HTTP redirects to HTTPS.
- [ ] `securityheaders.com` grade ≥ A.
- [ ] 404 page works and doesn't leak internals.

## Hosting note (Cloudflare Pages — primary)

Cloudflare Pages is the chosen host. It reads `public/_headers` (security headers) and
`public/_redirects` from the build output. The CSP (from Astro `<meta>`) is host-agnostic.
`staticwebapp.config.json` is kept only for optional Azure parity and is ignored by
Cloudflare. After deploy, re-run the verification commands above against the
`*.pages.dev` preview URL, then again after the custom domain is attached.

## Future: when the portal + database arrive

This is **not built yet**, but the principles to apply when it is:

- **AuthN/AuthZ:** real auth provider (e.g. Auth.js / a managed IdP); enforce
  **role-based access control** (writer vs admin) on the **server**, never the client.
- **Input validation:** validate & sanitise every input server-side (never trust the client).
- **Output encoding:** escape user-generated content before render (prevent stored XSS).
- **CSRF protection** on state-changing requests; **rate limiting** on auth + write APIs.
- **Least privilege** DB credentials; parameterised queries only (no string-built SQL).
- **Secrets** in the host's secret store; rotate regularly.
- **Audit logging** for publish/approve actions.
- Revisit this threat model and CSP (`connect-src` will need the API origin).
