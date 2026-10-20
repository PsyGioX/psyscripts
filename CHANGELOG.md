# Changelog

## 2.1.0 — 2026-10-19
### Added
- **CommandPalette**, **DataTable**, **Sortable**, **SafeHTML** (31 scripts in total) with docs (RU/EN), options, events and demos.
- Landing page: searchable/filterable catalog with counters, docs link, “copy include” button and gzip size per script.
- Docs: “Include on its own” block (exact `dist/` path + SRI) for every script; new sections Security, Files & SRI, Accessibility, Browser support, FAQ, Changelog; the **Core API** section, which was generated but never inserted into `docs.html`, is now rendered.
- `dist/manifest.json` (size, gzip, sha384 SRI), favicon set (SVG light/dark, ICO, PNG, maskable, manifest), Open Graph image, `robots.txt`, `sitemap.xml`, `/.well-known/security.txt`.
- Core helpers `PsyScripts.url/sel/selAll/pick/html/clear/sheet`; options `I18n.crossOrigin`, `CookieBanner.version`, `StickyTOC.idPrefix`.
- 24 regression tests (`npm test`), GitHub Actions CI, Dependabot.
### Security
- Fixed prototype pollution in `configure()`, `opts()`, `setTokens()` and the configuration merge.
- Fixed CSS injection through design tokens (also when restored from `localStorage`).
- Fixed DOM XSS sink in I18n `data-i18n-html` (now sanitized; translations are same-origin only).
- Fixed HTML injection through the CopyButton label.
- URL allow-list in ImageLightbox / LazyImages (incl. `srcset`, `data-bg` escaping); class-name allow-list in Toast.
- Strict CSP possible: no inline styles/scripts; styles injected via `adoptedStyleSheets`; Trusted Types policy `psyscripts`.
- Google Fonts replaced by self-hosted Nunito and DM Mono; security headers in `vercel.json`; lockfile committed, `.npmrc` `ignore-scripts=true`, `npm ci` on Vercel.
### Fixed
- “Back to top” icon contrast in light themes.
- ScrollSpy crashed on a malformed `%`-hash; invalid selectors in `data-copy-target`, `data-match`, `data-toc-source` threw.

## 2.0.0
Configuration API, 27 scripts, events, design tokens, icons, I18n.
