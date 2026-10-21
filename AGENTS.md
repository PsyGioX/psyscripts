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
npm test             # 29 regression tests — must pass before finishing
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

## Pull Requests and Issues (mandatory)
The **original repository** is `PsyGioX/psyscripts` (https://github.com/PsyGioX/psyscripts). Every change you make must reach it through GitHub — never leave work only in a local checkout, a fork, or a chat reply.
1. **Issue first.** Before changing anything, search existing issues (`gh issue list --repo PsyGioX/psyscripts --search "<keywords>"`). If none matches, open one in the original repository describing the problem or feature (what, why, expected result). Reuse an existing issue if there is one.
2. **Branch and PR.** Work on a separate branch (`fix/<short-name>`, `feat/<short-name>`, `docs/<short-name>`) — never push directly to `main`. When done, open a **Pull Request into `PsyGioX/psyscripts`**. If you work from a fork, the PR must target the original repository, not the fork.
3. **Link them.** The PR description must reference the issue (`Closes #<number>`) and contain: a short summary, the list of changed files, how you tested it (`npm run build`, `npm test`), and whether `CHANGELOG.md` was updated.
4. **Issues for everything you find but do not fix.** Bugs, inconsistencies, outdated docs, or ideas noticed along the way but out of scope for the current PR → open a separate issue in the original repository. Do not silently ignore them and do not bundle unrelated fixes into one PR.
5. **Do not open a PR with failing checks.** `npm run build` and `npm test` must pass first.
6. **Security exception.** Vulnerabilities are **never** reported as public issues or PRs — follow `SECURITY.md` (see "Security constraints").
7. **If you cannot create the PR/issue** (no `gh`, no token, no network), do not skip it silently: tell the user explicitly, and leave the branch pushed (or a patch) plus ready-to-paste issue and PR texts.

Example:
```bash
gh issue create --repo PsyGioX/psyscripts --title "<title>" --body "<description>"
git switch -c fix/<short-name>
# ...changes, npm run build, npm test...
git push -u origin fix/<short-name>
gh pr create --repo PsyGioX/psyscripts --base main --title "<title>" --body "Closes #<issue>"
```

## Definition of done
`npm run build` succeeds → `npm test` passes → an Issue and a Pull Request exist in `PsyGioX/psyscripts` (linked via `Closes #N`) → no new relative `dist/` paths in user-facing snippets
(`grep -rn 'src="dist/' index.html README.md docs.html` should only show the site's own bundle tag).
