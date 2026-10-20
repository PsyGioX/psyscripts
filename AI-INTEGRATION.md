# PsyScripts — integration guide for AI agents

Machine-oriented reference for adding **PsyScripts 2.1.0** (31 dependency-free UI scripts) to a website.
Canonical URL: https://psyscripts.vercel.app/AI-INTEGRATION.md · Index: https://psyscripts.vercel.app/llms.txt
Human docs: https://psyscripts.vercel.app/docs.html · Source: https://github.com/PsyGioX/psyscripts

## Rules for agents
1. **Always use absolute URLs** with the domain: `https://psyscripts.vercel.app/dist/<file>.min.js`. Never write a relative `dist/...` path in someone else's project.
2. Load order: CSS → `core.min.js` → the script file(s). `core.min.js` is required by every script. The bundle already includes core.
3. Prefer the smallest setup that works: one script → `core` + that file; several → the bundle.
4. Use `defer` on scripts. Put the `<link>` for CSS in `<head>` (avoids a style flash).
5. Configuration goes through `data-*` attributes or `PsyScripts.configure({...})` — do not edit or fork the files.
6. Never put untrusted data into `innerHTML`. Use `textContent` or `PsyScripts.Sanitize.set(el, html)` (needs `safe-html`).
7. Do not invent attributes or options. If unsure, read https://psyscripts.vercel.app/docs.html (all options are listed per script).
8. Strict-CSP sites: add `https://psyscripts.vercel.app` to `script-src` and `style-src` (the library injects styles via `adoptedStyleSheets`; no inline code is used). `/dist/*` is served with `Access-Control-Allow-Origin: *` and `Cross-Origin-Resource-Policy: cross-origin`, so SRI + `crossorigin="anonymous"` works.

## Install recipes
One line (scripts + styles injected from JS):
```html
<script src="https://psyscripts.vercel.app/dist/psyscripts.auto.min.js" defer></script>
```
Production (no style flash):
```html
<link rel="stylesheet" href="https://psyscripts.vercel.app/dist/psyscripts.min.css">
<script src="https://psyscripts.vercel.app/dist/psyscripts.bundle.min.js" defer></script>
```
Only what you need:
```html
<link rel="stylesheet" href="https://psyscripts.vercel.app/dist/psyscripts.min.css">
<script src="https://psyscripts.vercel.app/dist/core.min.js" defer></script>
<script src="https://psyscripts.vercel.app/dist/tabs.min.js" defer></script>
```
With SRI — take the hash from the manifest, never guess it:
```html
<script src="https://psyscripts.vercel.app/dist/tabs.min.js" defer
        integrity="sha384-<from manifest>" crossorigin="anonymous"></script>
```
Manifest (size, gzip, `integrity` of every file): https://psyscripts.vercel.app/dist/manifest.json

`psyscripts.min.css` contains base styles, Tabs and the icon set. Tabs styles alone: `https://psyscripts.vercel.app/dist/tabs.min.css`; icons alone: `.../dist/icons.min.css`.

## Script catalog
File URL = `https://psyscripts.vercel.app/dist/<file>.min.js` (load `core.min.js` first). “Needs” = extra file to load before it.

| Script | `<file>` | Needs | Minimal markup / API |
|---|---|---|---|
| Tabs | `tabs` | | `data-tabs`, `data-tab`, `data-panel` |
| ThemeSwitcher | `theme-switcher` | | `data-theme-toggle`, `data-theme-set` |
| HeaderMenu | `header-menu` | | `data-header`, `data-menu-toggle` |
| CopyButton | `copy-button` | `toast` (optional) | `data-copy="text"` or `data-copy-target="#id"` |
| ScrollReveal | `scroll-reveal` | | `data-reveal="left" data-reveal-delay="100"` |
| Accordion | `accordion` | | `data-accordion`, `data-single` |
| Modal | `modal` | | `data-modal-open="id"`, `Modal.confirm()` |
| Toast | `toast` | | `PsyScripts.Toast.success("Hi", {position:"top-center"})` |
| BackToTop | `back-to-top` | | `data-back-top` |
| LazyImages | `lazy-images` | | `<img data-src="a.jpg">`, `data-bg` |
| Dropdown | `dropdown` | | `data-dropdown`, `data-open-on-hover` |
| Tooltip | `tooltip` | | `data-tooltip="Text" data-tooltip-placement` |
| Counter | `counter` | | `data-counter="1200" data-suffix="+"` |
| Carousel | `carousel` | | `data-carousel data-per-view="3"` |
| FormValidation | `form-validation` | | `<form data-validate>`, `data-rule`, `data-match` |
| ScrollSpy | `scroll-spy` | | `data-spy` on `<nav>` |
| StickyTOC | `toc` | `scroll-spy` (highlighting) | `data-toc data-toc-source="#post"` |
| Marquee | `marquee` | | `data-marquee data-speed="30"` |
| ImageLightbox | `lightbox` | | `data-lightbox`, `data-full="big.jpg"` |
| Parallax | `parallax` | | `data-parallax="0.2"` |
| CookieBanner | `cookie-banner` | | `data-cookie-banner`, `data-cookie-category` |
| Skeleton | `skeleton` | | `data-skeleton`, `Skeleton.done(el)` |
| I18n | `i18n` | `safe-html` (for `data-i18n-html`) | `data-i18n="key"`, `data-lang-toggle` |
| Typewriter | `typewriter` | | `data-typewriter="One\|Two\|Three"` |
| Countdown | `countdown` | | `data-countdown="2027-01-01T00:00"` |
| ScrollProgress | `scroll-progress` | | `data-progress data-progress-target="#post"` |
| CompareSlider | `compare` | | `data-compare`, `data-compare-labels="A\|B"` |
| CommandPalette | `command-palette` | | Ctrl/⌘+K, `data-command-open`, `CommandPalette.register()` |
| DataTable | `data-table` | | `<table data-table data-table-page-size="10">` |
| Sortable | `sortable` | | `data-sortable`, `data-sortable-handle=".grip"` |
| SafeHTML | `safe-html` | | `PsyScripts.Sanitize.set(el, html)` |

Globals live under `window.PsyScripts` (e.g. `PsyScripts.Modal`, `PsyScripts.Carousel.get(el).go(2)`).

## Configuration API
```js
PsyScripts.configure({
  toast:    { position: 'bottom-center', duration: 5000 },
  carousel: { autoplay: 4000, breakpoints: { 760: 2, 1100: 3 } },
  tokens:   { accent: '#ff5fa2', radius: '10px', dark: { bg: '#101018' } }
});
PsyScripts.on('toast:show', (detail, e) => e.preventDefault());   // 35 events, '*' = all
PsyScripts.define('Rating', { selector: '[data-rating]', init(el, opt) {} });
```
Option priority: `data-*` attribute → `PsyScripts.opts(el, …)` → `configure()` → default. Run `configure()` before `DOMContentLoaded` handlers that depend on it (or call it right after `core` loads).

## I18n setup
```html
<html lang="en" data-i18n-langs="en,ru" data-i18n-default="en" data-i18n-path="/locales/{lang}.json">
```
Translations load from the **same origin** only (host the JSON on the site that uses the script). Attributes: `data-i18n`, `data-i18n-html`, `data-i18n-attr="placeholder:key"`, `data-i18n-count`, `data-lang-toggle`, `data-lang-set="en"`.

## Common tasks → what to load
| Task | Files |
|---|---|
| Tabs / accordion on a landing page | `core`, `tabs` / `accordion` + `psyscripts.min.css` |
| Contact form validation | `core`, `form-validation` |
| Dark/light switch | `core`, `theme-switcher` |
| Toast on copy | `core`, `toast`, `copy-button` |
| Searchable/sortable table | `core`, `data-table` (+ `safe-html` if cells contain HTML) |
| Docs sidebar with active section | `core`, `scroll-spy`, `toc` |
| Everything | `psyscripts.bundle.min.js` |

## Verification checklist for an agent
- [ ] Every `src`/`href` begins with `https://psyscripts.vercel.app/dist/`.
- [ ] `core.min.js` (or the bundle) is loaded before any script file.
- [ ] CSS is loaded (`psyscripts.min.css`, or use `psyscripts.auto.min.js`).
- [ ] No console errors / CSP violations; the element has the documented `data-*` attribute.
- [ ] If SRI is used, the hash matches `dist/manifest.json` for that exact file.
