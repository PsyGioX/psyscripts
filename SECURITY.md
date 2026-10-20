# Security Policy / Политика безопасности

## Supported versions
Only the latest minor release (**2.1.x**) receives security fixes.

## Reporting a vulnerability / Сообщить об уязвимости
Please report privately — **do not open a public issue**:

- GitHub: <https://github.com/PsyGioX/psyscripts/security/advisories/new> (private Security Advisory)
- Machine-readable contact: <https://psyscripts.vercel.app/.well-known/security.txt>

Include the version, a minimal reproduction (HTML + script) and the impact. Expect an acknowledgement within 7 days.
Пожалуйста, не создавайте публичный issue: используйте приватный Security Advisory на GitHub.

## Scope
In scope: anything in `src/`, `dist/`, `css/`, the build scripts and the deployed site `https://psyscripts.vercel.app`
(XSS, CSS injection, prototype pollution, unsafe URL handling, CSP bypass, supply-chain issues in the build).
Out of scope: attacks that already require arbitrary JavaScript on the page, missing best-practice headers on third-party hosts, self-XSS.

## Security model of the library
- Strings from attributes, options and translations are inserted with `textContent`; HTML only through `PsyScripts.Sanitize`.
- URLs are checked against a scheme allow-list; selectors from attributes never throw; configuration merging ignores `__proto__`, `constructor`, `prototype`.
- No `eval`, `new Function`, `document.write`, inline handlers, cookies or third-party requests. Translations load from the same origin only.
- Works under a strict CSP (`script-src 'self'; style-src 'self'`) and Trusted Types (`trusted-types psyscripts`).

Full audit: [SECURITY-AUDIT-2026-10-19.md](SECURITY-AUDIT-2026-10-19.md).
