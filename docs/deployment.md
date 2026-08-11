# Deployment

The build output is static files. Any host that serves a directory will do.

```bash
npm ci          # reproducible install from the lockfile
npm run build   # typecheck, then build → dist/
npm run preview # serve dist/ locally to check it before shipping
```

**Requirements:** Node 20.19+ or 22.12+ (Vite 8). Built and verified on Node 24.
**Output:** `dist/` — one HTML file, one CSS file, four JS chunks, one SVG favicon.
**Server requirements:** none. No SSR, no Node runtime, no environment variables, no API.

---

## Before you deploy

- [ ] Replaced the sample projects and timeline in `site.config.ts` — they are fiction
- [ ] Updated `<title>`, the meta description, and the OG tags in `index.html`
- [ ] Set a real `email`, `location` and `timezone`, and checked the clock in the nav
- [ ] Pointed the `links` at your actual profiles
- [ ] Checked both themes (`T`) and a narrow viewport
- [ ] Checked it with reduced motion on
- [ ] Tabbed through the whole page
- [ ] Ran `npm run check`

---

## Hosts

### Netlify

```
Build command:     npm run build
Publish directory: dist
```

Add `public/_redirects` if you later introduce client-side routes. The site is currently one
page, so you do not need it.

### Vercel

Vercel detects Vite. If you set it manually: build `npm run build`, output `dist`.

### Cloudflare Pages

Build `npm run build`, output `dist`. Set `NODE_VERSION` to `22` or higher in the environment
variables — the default is often older than Vite 8 requires.

### GitHub Pages

Only if you are serving from a subpath (`user.github.io/portfolio`), set the base first:

```ts
// vite.config.ts
export default defineConfig({ base: '/portfolio/', … })
```

Then a minimal workflow:

```yaml
name: Deploy
on:
  push: { branches: [main] }
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

For a custom domain or a user site served from the root, leave `base` alone.

### Any static server

```bash
npx serve dist
```

---

## Caching

Vite fingerprints every asset filename, so:

- `/assets/*` — `Cache-Control: public, max-age=31536000, immutable`
- `/index.html` — `Cache-Control: no-cache` (must be revalidated, or visitors keep getting the
  old asset URLs)

Netlify, Vercel and Cloudflare Pages all do this correctly by default.

---

## Headers worth setting

The site loads no third-party scripts and makes no network requests of its own. The only
external origins are Google Fonts, which disappear from this list once the fonts are self-hosted
(see [performance.md](performance.md)).

```
Content-Security-Policy: default-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data:;
  script-src 'self' 'unsafe-inline';
  object-src 'none';
  base-uri 'self';
  frame-ancestors 'none'
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
```

`script-src 'unsafe-inline'` is required by the theme-resolution script in `index.html`. If you
want to remove it, replace the inline script with a hash-based CSP entry — the script is short
and does not change often.

---

## After deploying

- Check the page on a real phone, on cellular. That is the visitor you are optimising for.
- Run Lighthouse against the deployed URL, not localhost — the network profile is different.
- Confirm the fonts load. A font that 404s degrades to a fallback that will not match the
  metrics, and the layout is tuned to Fraunces.
- View the source and confirm your name and description are in the HTML, not just rendered by
  React. Some crawlers do not execute JavaScript, which is why the title and meta tags live in
  `index.html`.
