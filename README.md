<!-- © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app -->
# JS Scripts
Lightweight dependency-free scripts: Tabs, ThemeSwitcher, HeaderMenu, CopyButton, ScrollReveal.
Demo: `index.html` (serve over HTTP, e.g. `npx serve`; translations live in `locales/*.json`).
© 2026 PsyGioX — MIT. https://github.com/PsyGioX/psyscripts · https://psygiox-dev.vercel.app

## Icon fonts
`npm install && npm run icons` copies Font Awesome, Bootstrap Icons, Material Design Icons and Tabler Icons into `vendor/icons/`. Include e.g. `vendor/icons/bootstrap-icons/font/bootstrap-icons.min.css`.

## Minified build
`npm run build` writes `dist/*.min.js`, `dist/tabs.min.css` and `dist/psyscripts.bundle.min.js` (all scripts in one file); author banners are preserved.
