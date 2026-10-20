# Аудит безопасности PsyScripts — базовая дата 19 октября 2026

| | |
|---|---|
| Объект | PsyScripts **2.0.0** (исходный архив) → **2.1.0** (после исправлений) |
| Сайт | https://psyscripts.vercel.app |
| Базовая дата аудита | 2026-10-19 (по запросу); автоматические проверки (npm audit, поиск advisory) выполнены 2026-10-20 |
| Метод | ручной разбор всего кода `src/` (32 файла) по «синкам» (innerHTML, URL, селекторы, regexp, storage, сеть), grep-проверки, воспроизведение уязвимостей на исходном коде, 24 регрессионных теста (jsdom), `npm audit`, обзор advisory и инцидентов цепочки поставок за 2026 год, загрузка живого сайта |
| Итог | найдено **14 замечаний** (из них 4 подтверждены эксплуатацией на исходном коде); все исправлены или снижены; остаточные риски — в разделе 6 |

## 1. Что не удалось проверить (честные ограничения)

- **В окружении не было браузера.** CSP, Trusted Types и `adoptedStyleSheets` проверены статически (нет inline-стилей/скриптов/обработчиков, нет внешних origin, список синков) и тестами в jsdom, но **не в реальном Chrome/Firefox/Safari**. Поэтому Trusted Types включены в режиме *Report-Only* (см. 5.2).
- **Заголовки ответа и TLS живого сайта недоступны из окружения аудита** (доступен только текст страницы). Живой сайт на момент проверки отдавал ещё старую версию (27 скриптов). Проверьте после деплоя командами из раздела 7.
- `npm audit signatures` не выполнился (сеть окружения). Проверьте локально.

## 2. Подтверждено эксплуатацией на исходном коде 2.0.0

| ID | Результат на 2.0.0 | Результат на 2.1.0 |
|---|---|---|
| F-01 | `PsyScripts.configure(JSON.parse('{"__proto__":{"polluted":"yes"}}'))` → `({}).polluted === "yes"`; то же через `PsyScripts.opts()` | `undefined` |
| F-02 | `setTokens({accent:'red;} body{display:none!important} x{y:'})` → в `<style>` попало `body{display:none!important}` | значение отброшено |
| F-03 | перевод `<img src=x onerror=alert(1)>` в `data-i18n-html` → вставлен `<img onerror>` | элемент удалён санитайзером |
| F-04 | `data-copy-toast-text="<img src=x onerror=…>"` → `<img onerror>` внутри кнопки | текст, не HTML |

Скрипты воспроизведения были запущены против `dist/` из вашего архива; те же проверки теперь — тесты `tests/security.test.js`.

## 3. Замечания

| ID | Серьёзность | Компонент | Описание | Статус |
|---|---|---|---|---|
| F-01 | **Высокая** (условно: если в `configure/opts/setTokens` попадает JSON из недоверенного источника; иначе средняя) | core | Загрязнение прототипа: `merge()` и цикл в `configure()` копировали ключ `__proto__` в `Object.prototype`. Последствия: подмена опций любого скрипта на всей странице, обход проверок вида `if (obj.isAdmin)`, в худшем случае XSS через «гаджеты» | Исправлено в `merge`, `configure`, `setTokens`, `setIcons`, словарях I18n; тест |
| F-02 | Средняя | core (токены) | Значения токенов склеивались в `<style>` без проверки; токены восстанавливаются из `localStorage` при загрузке → постоянная CSS-инъекция (скрытие/подмена интерфейса, утечка данных через селекторы атрибутов + `url()`) | Исправлено: валидация ключей и значений (`{ } ; < > \ /* @import url(внешний)`), тест |
| F-03 | Средняя | I18n | `data-i18n-html` вставлял строку из JSON через `innerHTML`; путь переводов мог указывать на чужой origin → компрометация файла перевода = XSS | Исправлено: SafeHTML (белый список, без повторного парсинга), без SafeHTML — только текст; чужой origin запрещён по умолчанию (`crossOrigin`); `credentials: same-origin`, `no-referrer` |
| F-04 | Средняя | CopyButton | Подпись `toastText` из атрибута/опции конкатенировалась в `innerHTML` | Исправлено: DOM-узлы и `textContent` |
| F-05 | Низкая | Lightbox, LazyImages | URL из `data-full`/`data-src`/`data-srcset`/`data-bg` не проверялись; в `url("…")` не экранировались `\` и перевод строки | Белый список схем (`http`, `https`, `blob`, `data:image`), проверка каждого кандидата `srcset`, экранирование |
| F-06 | Низкая | Toast | `type`, `position`, `className` попадали в имена классов | Белые списки / фильтр символов |
| F-07 | Низкая | ScrollSpy, CopyButton, FormValidation, TOC | Некорректный `%`-хэш (`<a href="#%E0%A4%A">`) вызывал `URIError` и ломал инициализацию; неверный селектор в `data-copy-target`, `data-match`, `data-toc-source/levels` бросал исключение (отказ в обслуживании виджета) | `try/catch`, `PsyScripts.sel/selAll` |
| F-08 | Низкая | StickyTOC | Автоматические `id` заголовков (`name`, `forms`…) допускают DOM clobbering | Опция `idPrefix`; по умолчанию без префикса ради совместимости — **остаточный риск** |
| F-09 | Низкая (приватность) | CookieBanner | Нет версии согласия: после добавления трекера прежнее согласие остаётся действующим | Опция `version` |
| F-10 | **Средняя** (соединения/приватность) | сайт | Шрифты грузились со сторонних origin `fonts.googleapis.com` и `fonts.gstatic.com`: IP посетителя уходит третьей стороне без согласия (известное решение LG München I от 20.01.2022, 3 O 17493/20, признало это нарушением GDPR; не юридическая консультация), и это мешало строгой CSP | Шрифты Nunito и DM Mono размещены локально (`fonts/`, SIL OFL); сторонних origin на сайте теперь 0 (проверяет тест) |
| F-11 | **Средняя** (соединения) | сайт | `vercel.json` содержал только настройки сборки: нет CSP, защиты от clickjacking (`frame-ancestors`), `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP | Заголовки добавлены (раздел 5) |
| F-12 | Средняя | сайт, core | 16 inline-стилей в HTML и вставка `<style>` из JS делали строгую CSP невозможной без `'unsafe-inline'` | Стили вынесены в классы; токены и auto-бандл используют `adoptedStyleSheets` (запасной вариант — `<style nonce>`) |
| F-13 | **Средняя** (цепочка поставок) | репозиторий | `package-lock.json` был в `.gitignore`; зависимости с `^` → невоспроизводимые сборки. В 2026 году зафиксированы инциденты в npm: axios (31 марта), `@tanstack/*` (11 мая), `keyv` и смежные (4 августа) | Lock-файл в репозитории, `installCommand: npm ci`, `.npmrc` с `ignore-scripts=true`, CI (`npm ci`, тесты, `npm audit`), Dependabot |
| F-14 | Информационная | дистрибутив | Нет SRI-хэшей для тех, кто подключает файлы с вашего домена | `dist/manifest.json` (sha384) + «Подключение отдельно» в документации каждого скрипта |

Положительные находки (проверено, менять не требовалось): нет `eval`, `new Function`, `document.write`, `insertAdjacentHTML`, `postMessage`, cookies; единственный сетевой запрос — загрузка переводов; все `target="_blank"` с `rel="noopener"`; `Modal.confirm` и `Toast` уже использовали `textContent`; зависимости — только devDependencies, в дистрибутив ничего стороннего не входит.

## 4. Зависимости и цепочка поставок на 2026-10-20

- `npm audit`: **0 уязвимостей** (46 пакетов, включая новый devDependency `jsdom` для тестов).
- `esbuild 0.25.12`. Advisory GHSA-67mh-4wv8-2f99 (CORS у dev-сервера `esbuild --serve`) исправлено в версиях ≥ 0.25.0, и проект не использует `--serve`. Advisory GHSA-gv7w-rqvm-qjhr (целостность бинарника в Deno-модуле) отозвано 12 июня 2026 (по данным GitLab Advisory Database).
- Рекомендации по инцидентам 2026 года, применённые здесь: lock-файл + `npm ci`, отключение lifecycle-скриптов (`ignore-scripts=true`; esbuild работает без postinstall, чистая сборка с `npm ci` проверена), отсутствие runtime-зависимостей.
- Остаётся: диапазоны `^` в `package.json` (версии фиксирует lock-файл; обновления идут через Dependabot-PR с проверкой).

## 5. Безопасность соединения

### 5.1 Транспорт
- Сайт на `*.vercel.app` обслуживается только по HTTPS (сертификат и терминация TLS у Vercel; настройки TLS проект не контролирует). Заголовок `Strict-Transport-Security: max-age=63072000; includeSubDomains` задан явно. **`preload` не добавлен** намеренно: он нужен только для собственного домена, и отозвать его потом сложно.
- `upgrade-insecure-requests` в CSP; смешанного контента нет: сетевых `http://`-ссылок в HTML, CSS и JS нет (единственные вхождения — пространство имён SVG `http://www.w3.org/2000/svg` внутри `data:`-URI, это не запрос; все внешние URL проверяет тест).
- Сторонних соединений нет: `connect-src 'self'`, `font-src 'self'`, `img-src 'self' data: blob:`. Переводы запрашиваются только со своего origin (проверка и в коде, и в CSP).

### 5.2 Заголовки (`vercel.json`)
| Заголовок | Значение / назначение |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` — без `'unsafe-inline'` и `'unsafe-eval'` |
| `Content-Security-Policy-Report-Only` | `require-trusted-types-for 'script'; trusted-types psyscripts` — включить принудительно после проверки консоли (в окружении аудита не было браузера) |
| `Strict-Transport-Security` | 2 года, `includeSubDomains` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (для старых браузеров; основное — `frame-ancestors`) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | камера, микрофон, геолокация, платежи, USB, serial, Bluetooth, topics — отключены |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `X-Permitted-Cross-Domain-Policies` | `none` |
| `/dist/*` | `Access-Control-Allow-Origin: *` и `Cross-Origin-Resource-Policy: cross-origin` — только для публичных статических файлов, чтобы работал SRI с `crossorigin`; куки и учётные данные не задействованы |
| `/fonts/*` | `Cache-Control: immutable`, 1 год |

Побочный эффект строгой CSP: на **preview-деплоях Vercel** встроенная панель комментариев/тулбар может быть заблокирована — это ожидаемо.

### 5.3 Прочее
- `/.well-known/security.txt` (контакт — приватный GitHub Security Advisory; срок действия до 2027-10-19), `SECURITY.md`.
- `robots.txt`, `sitemap.xml`, `canonical` и Open Graph используют `https://psyscripts.vercel.app`.
- Подпись `security.txt` (PGP) не добавлена — по желанию.

## 6. Остаточные риски и рекомендации

1. **После деплоя** откройте сайт и документацию с DevTools → Console: не должно быть нарушений CSP. Затем перенесите `require-trusted-types-for 'script'; trusted-types psyscripts` из Report-Only в основную CSP.
2. Включите на GitHub: 2FA (ключ/passkey), Dependabot alerts, secret scanning, защиту ветки `main`; на Vercel — Deployment Protection для preview. Если будете публиковать пакет в npm — через trusted publishing с provenance, без долгоживущих токенов (по описанным 2026 инцидентам вектором был украденный токен).
3. StickyTOC без `idPrefix` оставляет теоретический DOM clobbering (F-08); на страницах с пользовательским контентом задайте `data-toc-id-prefix`.
4. localStorage читается любым скриптом origin: хранятся только тема, язык, согласие, токены, id недавних команд; секретов нет.
5. CookieBanner хранит выбор, но не блокирует трекеры сам: проверяйте `PsyScripts.Cookie.has('analytics')` перед загрузкой.
6. Пользователям CDN-подключения: фиксируйте версию и SRI-хэш из `dist/manifest.json`.
7. Раз в квартал повторяйте `npm audit` и проверку заголовков; пересмотрите срок в `security.txt` до 2027-10-19.

## 7. Как проверить сайт после деплоя

```bash
curl -sI https://psyscripts.vercel.app | grep -iE "content-security|strict-transport|x-content-type|referrer|permissions|cross-origin|x-frame"
curl -s https://psyscripts.vercel.app/.well-known/security.txt
curl -sI http://psyscripts.vercel.app | head -3            # ожидается редирект на https
npm ci && npm test && npm audit && npm audit signatures
```
Онлайн: securityheaders.com, Mozilla Observatory, SSL Labs (TLS), Google CSP Evaluator.

## 8. Где что лежит
`src/` — исправления; `tests/security.test.js` — регрессионные тесты уязвимостей (корпус из 25 XSS-пейлоадов для SafeHTML, загрязнение прототипа, CSS-инъекция, origin-проверки); `vercel.json` — заголовки; `.npmrc`, `.github/` — цепочка поставок; `SECURITY.md`, `public/.well-known/security.txt` — раскрытие уязвимостей.
