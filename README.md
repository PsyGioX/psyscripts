# PsyScripts 2.0
Lightweight dependency-free scripts (lo-fi pastel theme) with a full configuration API.

**27 scripts:** Tabs, ThemeSwitcher, HeaderMenu, CopyButton, ScrollReveal, Accordion, Modal, Toast, BackToTop, LazyImages, Dropdown, Tooltip, Counter, Carousel, FormValidation, ScrollSpy, StickyTOC, Marquee, ImageLightbox, Parallax, CookieBanner, Skeleton, I18n and — new in 2.0 — **Typewriter, Countdown, ScrollProgress, CompareSlider**.

Demo: `index.html` (serve over HTTP, e.g. `npx serve`). Full reference: `docs.html`.
© 2026 PsyGioX — MIT. https://github.com/PsyGioX/psyscripts · https://psygiox-dev.vercel.app

## Quick start
One line (scripts + styles):
```html
<script src="dist/psyscripts.auto.min.js" defer></script>
```
Production (no style flash):
```html
<link rel="stylesheet" href="dist/psyscripts.min.css">
<script src="dist/psyscripts.bundle.min.js" defer></script>
```
Only what you need (`core.min.js` is required for the configuration API):
```html
<script src="dist/core.min.js" defer></script>
<script src="dist/tabs.min.js" defer></script>
```
`psyscripts.min.css` already contains the base styles, Tabs and the icon set.

## Configuration API (new)
```js
PsyScripts.configure({
  toast:    { position: 'bottom-center', duration: 5000 },
  carousel: { autoplay: 4000, breakpoints: { 760: 2, 1100: 3 } },
  tokens:   { accent: '#ff5fa2', radius: '10px', dark: { bg: '#101018' } },   // design tokens, per theme if needed
  icons:    { menu: '<svg …>' }                                                // replace built-in icons
});
PsyScripts.on('toast:show', (detail, e) => e.preventDefault());               // 35 events, '*' = all
PsyScripts.Carousel.get(el).go(2);                                            // instance APIs
PsyScripts.define('Rating', { selector: '[data-rating]', init(el, opt) {} });  // your own script
```
Option priority: `data-*` attribute → `PsyScripts.opts(el, …)` → `configure()` → default. 140+ options, all listed in `docs.html`. Every option also works as an attribute (`data-per-view="3"`, `data-open-on-hover`).

## Icons and contrast
Built-in SVG icons (`<i class="psy-ico psy-ico--menu">`) inherit `currentColor`, so they always match the text. Override any icon with `--psy-i-<name>` or `PsyScripts.setIcons()`. Text colors were darkened (≥ 4.5:1 on all pastel surfaces); `prefers-contrast: more` is supported.

## Build
`npm run build` assembles the deployable site into `public/`, regenerates `docs.html` (Python 3), writes `dist/*.min.js`, `psyscripts.min.css`, `tabs.min.css`, `icons.min.css`, `psyscripts.bundle.min.js` and `psyscripts.auto.min.js`. It uses **esbuild** when installed (`npm install`); without it a simple built-in minifier is used, so run `npm install` before a production build for the smallest files.

Other scripts: `npm run icons` (copies Font Awesome / Bootstrap / Material / Tabler icon fonts into `vendor/icons/`), `npm run docs`, `npm run locales` (merges `scripts/locales-site.py` strings into `locales/*.json`).

## Translations (I18n)
`<html lang="ru" data-i18n-langs="ru,en" data-i18n-default="ru" data-i18n-path="locales/{lang}.json">` — then use `data-i18n`, `data-i18n-html`, `data-i18n-attr="placeholder:key"`, `data-i18n-count` (plural forms via `Intl.PluralRules`), `data-lang-toggle` / `data-lang-set="en"`. Runtime strings: `PsyScripts.I18n.add('ru', {...})`. `npm run build` prerenders the default language into `public/index.html`. Docs strings live in `scripts/docs-content.py` (RU + EN).

## Vercel
`vercel.json` sets `buildCommand: npm run build` and `outputDirectory: public`. `vendor/` and `public/` are generated and git-ignored.
