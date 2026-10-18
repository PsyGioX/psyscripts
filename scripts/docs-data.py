# python3 scripts/docs-data.py → regenerates docs.html
import html
D=[
("Tabs","Доступные табы: стрелки, Home/End, roving tabindex.",[("data-tabs","корневой контейнер"),("data-tab","кнопка вкладки; aria-selected=\"true\" — активная по умолчанию"),("data-panel","панель, порядок как у кнопок")],'<div data-tabs>\n  <div role="tablist"><button data-tab>A</button><button data-tab>B</button></div>\n  <div data-panel>…</div><div data-panel>…</div>\n</div>',"PsyScripts.Tabs.init(root) — для динамического контента. Нужен tabs.min.css."),
("ThemeSwitcher","Светлая/тёмная тема, localStorage, prefers-color-scheme. Ставит data-theme на &lt;html&gt;.",[("data-theme-toggle","кнопка-переключатель (получает aria-pressed)")],'<button data-theme-toggle>◐</button>',"PsyScripts.Theme.set('dark'|'light'), .toggle()"),
("HeaderMenu","Адаптивное бургер-меню (до 860px), Esc и клик вне закрывают.",[("data-header","шапка"),("data-menu-toggle","кнопка-бургер"),("data-menu","контейнер ссылок")],'<header data-header>\n  <button data-menu-toggle aria-expanded="false">☰</button>\n  <nav data-menu><a href="#a">A</a></nav>\n</header>',"PsyScripts.HeaderMenu.close(header)"),
("CopyButton","Копирование текста или содержимого элемента, запасной путь для HTTP.",[("data-copy","текст для копирования"),("data-copy-target","CSS-селектор источника"),("data-copied","текст кнопки после копирования"),("data-copy-toast","показать Toast с этим текстом")],'<button data-copy="npm i psyscripts" data-copied="✓">Copy</button>',"PsyScripts.copy(text) → Promise"),
("ScrollReveal","Появление при прокрутке, учитывает prefers-reduced-motion.",[("data-reveal","включить; значения left / right меняют направление"),("data-reveal-delay","задержка, мс")],'<div data-reveal="left" data-reveal-delay="100">…</div>',"PsyScripts.Reveal.init(root)"),
("Accordion","Плавный аккордеон без max-height-хаков (grid-rows).",[("data-accordion","контейнер; + data-single — один открытый"),("data-acc-item","элемент; класс is-open — открыт"),("data-acc-trigger","кнопка"),("data-acc-panel","панель, внутри один &lt;div&gt;")],'<div data-accordion data-single>\n  <div data-acc-item>\n    <button data-acc-trigger aria-expanded="false">Q</button>\n    <div data-acc-panel><div>A</div></div>\n  </div>\n</div>',"Делегирование кликов: работает и для добавленных позже элементов."),
("Modal","Модалки на нативном &lt;dialog&gt;: Esc, фокус-ловушка, клик по фону.",[("data-modal-open=\"id\"","открыть dialog по id"),("data-modal-close","закрыть ближайший dialog"),("data-modal","атрибут на самом &lt;dialog&gt;")],'<button data-modal-open="m">Open</button>\n<dialog id="m" data-modal>…<button data-modal-close>×</button></dialog>',"PsyScripts.Modal.open(id), .close(dialog)"),
("Toast","Уведомления, aria-live, закрываются по клику.",[("data-toast","текст уведомления по клику"),("data-toast-type","info | success | error")],'<button data-toast="Saved" data-toast-type="success">Save</button>',"PsyScripts.Toast.show('Text',{type:'error',duration:4000})"),
("BackToTop","Кнопка «Наверх», появляется после прокрутки.",[("data-back-top","сама кнопка"),("data-back-top-at","на &lt;html&gt;: порог в px (по умолчанию 400)")],'<button data-back-top aria-label="Top">↑</button>',"Плавный скролл отключается при reduced-motion."),
("LazyImages","Ленивая загрузка img и srcset через IntersectionObserver.",[("data-src","адрес изображения"),("data-srcset","srcset"),("is-loaded","класс после загрузки")],'<img data-src="a.jpg" data-srcset="a-2x.jpg 2x" alt="">',"PsyScripts.Lazy.init(root)"),
("Dropdown","Выпадающее меню: стрелки, Esc, возврат фокуса.",[("data-dropdown","обёртка"),("data-dd-trigger","кнопка"),("data-dd-menu","меню из a/button")],'<div data-dropdown>\n  <button data-dd-trigger aria-expanded="false">Menu ▾</button>\n  <div data-dd-menu><a href="#">One</a><button>Two</button></div>\n</div>',"PsyScripts.Dropdown.closeAll()"),
("Tooltip","Подсказки по hover и фокусу, не выходят за экран.",[("data-tooltip","текст подсказки")],'<button data-tooltip="Hint">?</button>',"Esc и прокрутка скрывают подсказку."),
("Counter","Анимация чисел при появлении, Intl.NumberFormat.",[("data-counter","конечное значение"),("data-counter-from","старт"),("data-duration","мс"),("data-prefix / data-suffix","префикс и суффикс")],'<b data-counter="1200" data-suffix="+">0</b>',"PsyScripts.Counter.init(root)"),
("Carousel","Карусель на scroll-snap: стрелки, точки, клавиатура, автоплей.",[("data-carousel","корень; data-autoplay=\"мс\", data-multi — 2 слайда на широких"),("data-track","лента слайдов"),("data-prev / data-next","кнопки"),("data-dots","контейнер точек (создаются сами)")],'<div data-carousel data-autoplay="5000">\n  <div data-track><div>1</div><div>2</div></div>\n  <button data-prev>‹</button><button data-next>›</button><div data-dots></div>\n</div>',"PsyScripts.Carousel.init(root)"),
("FormValidation","Нативный Constraint Validation API + ARIA, свои сообщения.",[("data-validate","на &lt;form&gt;; + data-ajax — вместо отправки событие psy:valid"),("data-field","обёртка поля (необязательно)"),("data-error","место для ошибки (создаётся само)"),("data-msg-required / -type / -min / -pattern","свои тексты на поле")],'<form data-validate data-ajax>\n  <div data-field><input type="email" name="email" required data-msg-required="Введите email"></div>\n  <button>Send</button>\n</form>',"form.addEventListener('psy:valid', …); PsyScripts.Form.validate(form)"),
("ScrollSpy","Подсвечивает ссылку меню, чей раздел сейчас на экране.",[("data-spy","на &lt;nav&gt; или контейнере со ссылками #id"),("is-active","класс активной ссылки (+ aria-current)")],'<nav data-spy><a href="#a">A</a><a href="#b">B</a></nav>',"PsyScripts.Spy.init()"),
("StickyTOC","Оглавление из заголовков: id, список и подсветка раздела. Это оглавление слева — он сам.",[("data-toc","контейнер"),("data-toc-source","селектор области (по умолчанию main)"),("data-toc-levels","заголовки, по умолчанию h2,h3"),("data-sticky","прилипает при прокрутке")],'<aside data-toc data-toc-source="#post" data-toc-levels="h2" data-sticky></aside>',"PsyScripts.TOC.init()"),
("Marquee","Бегущая лента без зависимостей, пауза при наведении.",[("data-marquee","контейнер"),("data-speed","секунд на цикл"),("data-direction=\"right\"","обратное направление")],'<div data-marquee data-speed="25"><span>A</span><span>B</span></div>',"PsyScripts.Marquee.init()"),
("ImageLightbox","Просмотр картинок: стрелки, Esc, подпись из alt.",[("data-lightbox","на img или контейнере галереи"),("data-full","адрес большой версии")],'<div data-lightbox>\n  <img src="a-small.jpg" data-full="a.jpg" alt="Caption">\n</div>',"PsyScripts.Lightbox.open(imgList, index)"),
("Parallax","Лёгкий параллакс, rAF, отключается при reduced-motion.",[("data-parallax","коэффициент, например 0.2 (отрицательный — в другую сторону)")],'<img data-parallax="0.2" src="bg.jpg" alt="">',"PsyScripts.Parallax.init()"),
("CookieBanner","Баннер согласия; выбор хранится в localStorage.",[("data-cookie-banner","сам баннер (изначально hidden)"),("data-cookie-accept / data-cookie-decline","кнопки")],'<div data-cookie-banner hidden>\n  <p>Cookies…</p><button data-cookie-decline>No</button><button data-cookie-accept>OK</button>\n</div>',"document.addEventListener('psy:cookie', e => e.detail.consent); PsyScripts.Cookie.get(), .reset()"),
("Skeleton","Скелетон-плейсхолдер, пока контент не готов.",[("data-skeleton","контейнер; значение manual — снимать вручную"),("data-delay","мс, если внутри нет картинок")],'<div data-skeleton><img src="a.jpg" alt=""></div>',"PsyScripts.Skeleton.done(el), .init(root)"),
]
e=html.escape
def cell(x): return x
secs=[];
for n,d,a,ex,api in D:
    rows=''.join('<tr><td><code>%s</code></td><td>%s</td></tr>'%(x,y) for x,y in a)
    i=n.lower()
    secs.append('<section class="doc" id="%s"><h2>%s</h2><p class="muted">%s</p><div class="tw"><table><thead><tr><th>Атрибут</th><th>Описание</th></tr></thead><tbody>%s</tbody></table></div><div class="cp"><pre id="c-%s"><code>%s</code></pre><button data-copy-target="#c-%s" data-copied="✓">Copy</button></div><p class="api"><strong>JS:</strong> <code>%s</code></p></section>'%(i,n,d,rows,i,e(ex),i,api if '&' in api and False else api))
tpl=open('index.html',encoding='utf-8').read()
head=tpl[:tpl.index('<body>')].replace('<title>PsyScripts — 10 lightweight scripts</title>','<title>PsyScripts — Docs</title>').replace('Lightweight dependency-free scripts: Tabs, ThemeSwitcher, HeaderMenu, CopyButton, ScrollReveal, Accordion, Modal, Toast, BackToTop, LazyImages.','Documentation for all 22 PsyScripts: attributes, examples and JS API.')
head=head[:head.index('<style>')]+'''<style>
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:80px}
body{margin:0;background:var(--psy-bg);color:var(--psy-text);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.wrap{max-width:1100px;margin:0 auto;padding:0 clamp(1rem,4vw,2rem)}
.logo{font-weight:800;font-size:1.2rem;text-decoration:none;color:var(--psy-text)}.logo span,.grad{background:linear-gradient(135deg,var(--psy-accent),var(--psy-accent2));-webkit-background-clip:text;background-clip:text;color:transparent}
.tools{display:flex;gap:.5rem;align-items:center}.muted{color:var(--psy-muted)}
.layout{display:grid;grid-template-columns:230px minmax(0,1fr);gap:2.5rem;padding:2.5rem 0 4rem}
h1{font-size:clamp(1.8rem,5vw,2.8rem);margin:0 0 .5rem}h2{margin:0 0 .3rem;font-size:1.5rem}
.doc{padding:1.6rem 0;border-top:1px solid var(--psy-line)}.doc:first-of-type{border:0}
.tw{overflow-x:auto;margin:.8rem 0}table{border-collapse:collapse;width:100%;font-size:.92rem}th,td{text-align:left;padding:.5rem .7rem;border-bottom:1px solid var(--psy-line);vertical-align:top}th{color:var(--psy-muted);font-weight:600}
td:first-child{white-space:nowrap}code,pre{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}td code,.api code{color:var(--psy-accent2);font-size:.88em}
pre{margin:0;background:var(--psy-solid);border:1px solid var(--psy-line);border-radius:10px;padding:.8rem 1rem;overflow-x:auto;font-size:.85rem}
.cp{display:flex;gap:.5rem;align-items:flex-start}.cp pre{flex:1;min-width:0}.api{font-size:.9rem;overflow-wrap:anywhere}
@media(max-width:860px){.layout{grid-template-columns:1fr}aside[data-toc]{display:none}td:first-child{white-space:normal}}
@media(max-width:520px){.cp{flex-direction:column}}
</style>
</head>
'''
body='''<body>
<header data-header><a class="logo" href="index.html"><span>Psy</span>Scripts</a>
<nav data-menu aria-label="Main"><a href="index.html">Home</a><a href="index.html#demo">Demo</a><a href="docs.html">Docs</a><a href="https://github.com/PsyGioX/psyscripts" target="_blank" rel="noopener">GitHub</a></nav>
<div class="tools"><button data-theme-toggle aria-label="Theme">◐</button><button data-menu-toggle aria-expanded="false" aria-label="Menu">☰</button></div></header>
<div class="wrap layout"><aside data-toc data-toc-source="#docs" data-toc-levels="h2" data-sticky aria-label="Contents"></aside>
<main id="docs"><h1><span class="grad">Документация</span></h1><p class="muted">22 скрипта без зависимостей. Всё работает через data-атрибуты; JS API нужен только для особых случаев.</p>
<section class="doc" id="install"><h2>Подключение</h2><p class="muted">Всё одним файлом или по отдельности (<code>dist/&lt;name&gt;.min.js</code>). Tabs требует <code>tabs.min.css</code>.</p>
<div class="cp"><pre id="c-install"><code>'''+e('<link rel="stylesheet" href="dist/psyscripts.min.css">\n<link rel="stylesheet" href="dist/tabs.min.css">\n<script src="dist/psyscripts.bundle.min.js" defer></script>')+'''</code></pre><button data-copy-target="#c-install" data-copied="✓">Copy</button></div></section>
'''+'\n'.join(secs)+'''
</main></div>
<button data-back-top aria-label="Top">↑</button>
<script src="dist/psyscripts.bundle.min.js"></script>
</body></html>
'''
open('docs.html','w',encoding='utf-8').write(head+body)
