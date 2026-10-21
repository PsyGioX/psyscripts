# Changelog

## Unreleased
### Fixed
- **StickyTOC on phones**: the contents list was hidden below 860 px. It is now a sticky “Contents · current section” bar that opens a sheet (closes on link tap, Escape and outside tap; announces state via `aria-expanded`). New options `collapsible`, `label` and event `toc:toggle`.
- **Command palette on the docs page** was only partly translated: palette texts, group names and plural forms are now set by the shared `js/site.js` on every page; `results` may be a function. Duplicate group headings are merged.
### Responsive
- Header no longer overflows at 320–360 px (fluid logo, compact 40 px tools) and the landing page switches to the burger menu below 1100 px (`data-breakpoint`) instead of scrolling sideways at 861–1080 px; the menu is a compact card on tablets and scrolls inside itself on short landscape screens.
- Docs: long inline `<code>` no longer stretches the page on phones; tables get scroll shadows and compact cells; fluid sidebar width.
- Landing: stat cards 2 × 2 on narrow phones, one-row swipeable catalog filters, full-width search; customizer stays two-column down to 720 px.
- Wide screens: container grows to 1240 / 1400 px, root font size scales gently (percent-based, respects the browser setting), header lines up with the container.
- Modals, cookie banner and back-to-top respect `dvh` and left/right safe areas; compact header and menu in landscape phones.
### Changed
- Design: new tokens `--psy-ring`, `--psy-dur`, `--psy-ease`; skip link; 44 px touch targets on coarse pointers; safe-area insets (`viewport-fit=cover`); `prefers-reduced-motion`, `forced-colors` and print styles; `--psy-header-h` / `--psy-toc-h` keep anchors clear of sticky bars; hover effects only on hover-capable devices; readable line length in docs.
- **Customizer** rebuilt: sticky live preview with light/dark switch, 7 presets (new Slate and Contrast AAA; all pass WCAG AA), colour picker + HEX field, live WCAG contrast report, shape/typography controls, behaviour options, export as JS / CSS / JSON and import.
### Changed
- All copy-paste include paths in the landing page, docs, translations, README and the “copy include” button are now absolute: `https://psyscripts.vercel.app/dist/<file>.min.js`.
### Added
- Files for AI agents: `AGENTS.md`, `CLAUDE.md`, `AI-INTEGRATION.md` (published at `/AI-INTEGRATION.md`) and `llms.txt`.

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
