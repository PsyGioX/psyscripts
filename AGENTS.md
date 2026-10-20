# AGENTS.md — instructions for AI coding agents

This file is for AI agents (Claude Code, Codex, Cursor, Copilot, Gemini CLI, etc.) that **work on this repository**.
If you only need to **use PsyScripts on someone's website**, read [`AI-INTEGRATION.md`](AI-INTEGRATION.md) instead.

## Project
- **PsyScripts 2.1.0** — 31 dependency-free browser scripts + one CSS file, configuration API, RU/EN docs. MIT.
- **Production domain: `https://psyscripts.vercel.app`** (canonical base URL for every public asset).
- Repo: https://github.com/PsyGioX/psyscripts

## Layout
| Path | What it is | Edit by hand? |
|---|---|---|
| `src/*.js` | Source of every script (`core.js` is required by all) | **yes** |
| `css/*.css` | Source styles (`psyscripts.css`, `tabs.css`, `icons.css`, `site.css`, `fonts.css`) | **yes** |
| `index.html`, `js/demo.js` | Landing page and catalog | **yes** |
| `locales/*.json`, `locales/docs/*.json` | UI / docs translations (generated, see below) | via `scripts/*.py` |
| `scripts/docs-data.py`, `scripts/docs-content.py` | **Generators of `docs.html`** and docs translations | **yes** (not `docs.html`) |
| `scripts/locales-site.py`, `scripts/locales-v21.py` | Site translation strings merged into `locales/*.json` | **yes** |
| `dist/` | Build output (min JS/CSS, `manifest.json` with SRI) | **no** — `npm run build` |
| `public/` | Deployable site copied by the build (`outputDirectory`) | **no** — generated, git-ignored |
| `vendor/` | Icon fonts copied by `npm run icons` | **no** |
| `tests/` | `node --test` suites (security corpus, tools, smoke test) | yes |

## Commands
```bash
npm ci               # exact versions from package-lock.json (install scripts are disabled by .npmrc)
npm run build        # dist/*, manifest.json (SRI), docs.html, public/
npm test             # 24 regression tests — must pass before finishing
npm run audit        # npm audit --audit-level=low
```

## URL rules (important)
1. **Every path shown to users as a copy-paste include must be absolute**, with the domain:
   `https://psyscripts.vercel.app/dist/<file>.min.js` — never `dist/<file>.min.js`.
   This applies to `index.html`, `README.md`, the docs generators (`scripts/docs-data.py`, `scripts/docs-content.py`),
   the translation strings, the “copy include” button in `js/demo.js`, and all `*.md` files.
2. **The site's own runtime assets stay relative** (`<script src="dist/psyscripts.bundle.min.js">`, `css/...`, `js/demo.js`,
   `fetch('dist/manifest.json')`, `locales/{lang}.json`). They must work on previews and localhost, and the CSP is `'self'`.
3. Do not hard-code SRI hashes by hand: they come from `dist/manifest.json` and change on every build.
4. When you add a new public file, also add it to the copy list in `scripts/build.js` and, if it is a page, to `sitemap.xml`.

## Security constraints (do not weaken)
- Insert text with `textContent`; HTML only via `PsyScripts.Sanitize.set(el, html)`.
- No `eval`, `new Function`, `document.write`, inline `<script>`/`style`/handlers, cookies, third-party requests.
- Merging config must ignore `__proto__`, `constructor`, `prototype`. URLs go through the scheme allow-list.
- Site must keep working under `script-src 'self'; style-src 'self'` and Trusted Types policy `psyscripts` (see `vercel.json`).
- Report vulnerabilities per `SECURITY.md`; never open public issues for them.

## Conventions
- Vanilla ES2017+, no dependencies, no build-time transforms beyond minification. Each `src/<name>.js` registers via `PsyScripts.define(...)`.
- File name = lower-case kebab name (`CommandPalette` → `command-palette.js` → `dist/command-palette.min.js`).
- Options priority: `data-*` attribute → `PsyScripts.opts(el, …)` → `PsyScripts.configure()` → default.
- Respect `prefers-reduced-motion`, keep ARIA/keyboard support, keep text contrast ≥ 4.5:1.
- Docs and UI strings need **both RU and EN**. Russian is the default language.
- Add a line to `CHANGELOG.md` for user-visible changes.

## Definition of done
`npm run build` succeeds → `npm test` passes → no new relative `dist/` paths in user-facing snippets
(`grep -rn 'src="dist/' index.html README.md docs.html` should only show the site's own bundle tag).
