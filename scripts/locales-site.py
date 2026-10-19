# Merge landing-page strings into locales/{ru,en}.json.  Run: python3 scripts/locales-site.py
import json
K = {
'meta.title': ('PsyScripts — 27 лёгких скриптов для веб-разработчиков', 'PsyScripts — 27 lightweight scripts for web developers'),
'meta.desc': ('Лёгкие скрипты без зависимостей: табы, модалки, тосты, карусель, формы, таймеры, переводы — с полным API настройки.', 'Dependency-free scripts: tabs, modals, toasts, carousel, forms, timers, i18n — with a full configuration API.'),
'nav.customize': ('Настройка', 'Customize'),
'hero.tw': ('Всё для:', 'Everything for:'),
'hero.words': ('табов|модалок|каруселей|форм|тостов|переводов|таймеров', 'tabs|modals|carousels|forms|toasts|translations|timers'),
'hero.cta3': ('Настроить', 'Customize'),
'stats.options': ('опций настройки', 'config options'),
'scripts.filter': ('Категории', 'Categories'),
'cat.all': ('Все', 'All'), 'cat.nav': ('Навигация', 'Navigation'), 'cat.overlay': ('Оверлеи', 'Overlays'),
'cat.media': ('Контент и медиа', 'Content & media'), 'cat.data': ('Данные и формы', 'Data & forms'), 'cat.sys': ('Система', 'System'),
'badge.new': ('new', 'new'),
'demo.sub': ('Каждый скрипт — живой, с настройками. Меняйте опции и смотрите результат и события.', 'Every script is live and configurable. Change options and watch the result and events.'),
'demo.tab.ui': ('Интерфейс', 'Interface'), 'demo.tab.overlays': ('Оверлеи', 'Overlays'), 'demo.tab.media': ('Контент и медиа', 'Content & media'), 'demo.tab.data': ('Данные и формы', 'Data & forms'),
'install.title': ('Быстрое подключение', 'Quick install'),
'install.sub': ('Одна строка — и всё работает.', 'One line and you are done.'),
'install.auto': ('Одна строка (скрипты + стили)', 'One line (scripts + styles)'),
'install.split': ('Быстрее для продакшена: стили отдельно', 'Faster in production: styles separately'),
'install.more': ('Отдельные скрипты, иконки и настройка — в', 'Single scripts, icons and configuration — in the'),
'cookie.necessary': ('Необходимые', 'Necessary'), 'cookie.analytics': ('Аналитика', 'Analytics'), 'cookie.marketing': ('Маркетинг', 'Marketing'), 'cookie.save': ('Сохранить выбор', 'Save choice'),
'form.min6': ('Минимум 6 символов', 'Minimum 6 characters'), 'form.match': ('Пароли не совпадают', 'Passwords do not match'), 'form.digits': ('Только цифры', 'Digits only'),
# card titles
'c.Tabs': ('Tabs', 'Tabs'), 'c.Accordion': ('Accordion', 'Accordion'), 'c.Dropdown': ('Dropdown', 'Dropdown'), 'c.Tooltip': ('Tooltip', 'Tooltip'), 'c.ThemeSwitcher': ('ThemeSwitcher', 'ThemeSwitcher'),
'c.Modal': ('Modal', 'Modal'), 'c.Toast': ('Toast', 'Toast'), 'c.ImageLightbox': ('ImageLightbox', 'ImageLightbox'), 'c.CookieBanner': ('CookieBanner', 'CookieBanner'),
'c.Carousel': ('Carousel', 'Carousel'), 'c.CompareSlider': ('CompareSlider', 'CompareSlider'), 'c.Typewriter': ('Typewriter', 'Typewriter'), 'c.Marquee': ('Marquee', 'Marquee'),
'c.ScrollReveal': ('ScrollReveal', 'ScrollReveal'), 'c.Parallax': ('Parallax', 'Parallax'), 'c.Skeleton': ('Skeleton', 'Skeleton'), 'c.FormValidation': ('FormValidation', 'FormValidation'),
'c.Counter': ('Counter', 'Counter'), 'c.Countdown': ('Countdown', 'Countdown'), 'c.CopyButton': ('CopyButton', 'CopyButton'), 'c.ScrollProgress': ('ScrollProgress', 'ScrollProgress'), 'c.I18n': ('I18n', 'I18n'),
# demo descriptions
'd.tabs.p': ('Режим активации, ориентация, события tabs:change.', 'Activation mode, orientation, tabs:change events.'),
'd.tabs.a': ('Один', 'One'), 'd.tabs.b': ('Два', 'Two'), 'd.tabs.c': ('Три', 'Three'),
'd.tabs.pa': ('Первая панель. Стрелки, Home и End переключают вкладки.', 'First panel. Arrow keys, Home and End switch tabs.'),
'd.tabs.pb': ('Вторая панель с roving tabindex.', 'Second panel with roving tabindex.'),
'd.tabs.pc': ('Третья панель — aria-controls проставляется сам.', 'Third panel — aria-controls is set for you.'),
'd.acc.p': ('Один открытый или несколько, скорость анимации, API open/close/openAll.', 'Single or multiple open, animation speed, open/close/openAll API.'),
'd.acc.q3': ('Можно управлять из JS?', 'Can I control it from JS?'), 'd.acc.a3': ('Да: Accordion.open(), .close(), .openAll() и событие accordion:toggle.', 'Yes: Accordion.open(), .close(), .openAll() and the accordion:toggle event.'),
'd.dd.p': ('Открытие по наведению, клавиатура, тултипы с placement и задержкой.', 'Hover mode, keyboard support, tooltips with placement and delay.'),
'd.tip.delay': ('Появляюсь с задержкой 400 мс', 'I appear after a 400 ms delay'),
'd.theme.p': ('Любое число тем: добавьте свою одной командой — configure + setTokens.', 'Any number of themes: add your own with configure + setTokens.'),
'd.nav.h': ('Шапка, ScrollSpy, TOC, BackToTop', 'Header, ScrollSpy, TOC, BackToTop'),
'd.nav.p': ('Меню в шапке подсвечивает раздел (ScrollSpy), бургер работает на мобильных, кнопка «наверх» — справа внизу.', 'The header menu highlights the section (ScrollSpy), the burger works on mobile, back-to-top is bottom right.'),
'd.modal.p': ('Нативный <dialog>, опции закрытия и Promise-диалог Modal.confirm().', 'Native <dialog>, close options and the Promise-based Modal.confirm().'),
'd.confirm.t': ('Удалить проект?', 'Delete the project?'), 'd.confirm.p': ('Это действие нельзя отменить.', 'This action cannot be undone.'), 'd.confirm.ok': ('Удалить', 'Delete'), 'd.confirm.yes': ('Подтверждено', 'Confirmed'), 'd.confirm.no': ('Отменено', 'Cancelled'),
'd.toast.p': ('Позиция, тип, длительность, заголовок, кнопка действия, прогресс и пауза при наведении.', 'Position, type, duration, title, action button, progress bar and pause on hover.'),
'd.toast.title': ('Сохранено', 'Saved'), 'd.toast.undo': ('Отменить', 'Undo'),
'd.lb.p': ('Свайп, стрелки, счётчик, предзагрузка соседних кадров.', 'Swipe, arrows, counter, neighbour preloading.'),
'd.cookie.p': ('Категории согласия и срок хранения. Решение доступно через Cookie.has("analytics").', 'Consent categories and expiry. Read it with Cookie.has("analytics").'),
'd.cookie.none': ('нет решения', 'no choice yet'),
'd.car.p': ('perView, адаптивные breakpoints, автоплей, loop и события — меняйте на лету.', 'perView, responsive breakpoints, autoplay, loop and events — change them live.'),
'd.cmp.p': ('Сравнение «до/после»: мышь, касание и клавиатура, горизонтальный и вертикальный режим.', 'Before/after comparison: mouse, touch and keyboard, horizontal and vertical modes.'),
'd.tw.p': ('Печатающийся текст: слова, скорость, цикл. Учитывает reduced-motion.', 'Typing text: words, speed, loop. Respects reduced-motion.'),
'd.marq.p': ('Лента сама заполняет ширину контейнера; скорость и пауза через API.', 'The ticker fills the container width on its own; speed and pause via API.'),
'd.rev.p': ('Пять эффектов появления. Расстояние и длительность — глобальные опции.', 'Five reveal effects. Distance and duration are global options.'),
'd.px.p': ('Параллакс по оси Y/X и скелетон с ручным управлением.', 'Parallax on the Y/X axis and a manually controlled skeleton.'),
'd.form.p': ('Свои правила (data-rule, data-match), режимы проверки, события form:invalid и psy:valid.', 'Custom rules (data-rule, data-match), validation modes, form:invalid and psy:valid events.'),
'd.form.pass': ('Пароль (от 6 символов)', 'Password (6+ characters)'), 'd.form.pass2': ('Повторите пароль', 'Repeat password'), 'd.form.phone': ('Телефон (только цифры)', 'Phone (digits only)'),
'd.cnt.p': ('Кривые анимации, длительность, анимация к любому значению через Counter.set().', 'Easing curves, duration, animate to any value with Counter.set().'),
'd.cd.p': ('Обратный отсчёт до даты и таймер «+45» секунд, локализованные подписи через Intl.', 'Countdown to a date and a "+45" second timer, localized labels through Intl.'),
'd.copy.p': ('Копирование с тостом и индикатор прогресса чтения страницы (полоса сверху + эта).', 'Copy with a toast, and a page reading progress indicator (top bar + this one).'),
'd.i18n.p': ('Плюрали через Intl.PluralRules, переключение языка без перезагрузки.', 'Plurals via Intl.PluralRules, language switching without reload.'),
'd.plural': ({'one': '{n} файл', 'few': '{n} файла', 'many': '{n} файлов', 'other': '{n} файла'}, {'one': '{n} file', 'other': '{n} files'}),
# option labels
'o.activation': ('активация', 'activation'), 'o.orientation': ('ориентация', 'orientation'), 'o.single': ('один открытый', 'single open'), 'o.duration': ('скорость', 'speed'), 'o.durationMs': ('длительность, мс', 'duration, ms'),
'o.openAll': ('Открыть все', 'Open all'), 'o.closeAll': ('Закрыть все', 'Close all'), 'o.hover': ('по наведению', 'on hover'), 'o.top': ('Сверху', 'Top'), 'o.right': ('Справа', 'Right'), 'o.delayed': ('С задержкой', 'Delayed'),
'o.light': ('Светлая', 'Light'), 'o.dark': ('Тёмная', 'Dark'), 'o.addTheme': ('Добавить тему sepia', 'Add the sepia theme'), 'o.hideScroll': ('Прятать шапку при прокрутке вниз', 'Hide header on scroll down'),
'o.confirm': ('Подтверждение (Promise)', 'Confirm (Promise)'), 'o.backdrop': ('закрытие по фону', 'close on backdrop'), 'o.esc': ('закрытие по Esc', 'close on Esc'),
'o.type': ('тип', 'type'), 'o.position': ('позиция', 'position'), 'o.title': ('заголовок', 'title'), 'o.action': ('кнопка действия', 'action button'), 'o.closeBtn': ('кнопка ×', '× button'), 'o.progress': ('прогресс', 'progress bar'), 'o.clear': ('Очистить', 'Clear'),
'o.loop': ('по кругу', 'loop'), 'o.counter': ('счётчик', 'counter'), 'o.showBanner': ('Показать баннер снова', 'Show the banner again'),
'o.perView': ('слайдов', 'per view'), 'o.autoplay': ('автоплей', 'autoplay'), 'o.dots': ('точки', 'dots'), 'o.arrows': ('стрелки', 'arrows'),
'o.words': ('слова через |', 'words separated by |'), 'o.speed': ('скорость, мс/символ', 'speed, ms/char'), 'o.cycle': ('цикл', 'cycle'), 'o.pause': ('Пауза / пуск', 'Pause / play'),
'o.replay': ('Повторить', 'Replay'), 'o.reload': ('Показать скелетон', 'Show skeleton'), 'o.reset': ('Сбросить', 'Reset'), 'o.validateOn': ('проверять при', 'validate on'),
'o.target': ('значение', 'target'), 'o.easing': ('кривая', 'easing'), 'o.run': ('Запустить', 'Run'), 'o.restart': ('Перезапустить таймер', 'Restart timer'),
# customizer
'cz.title': ('Настройка и API', 'Customize & API'),
'cz.sub': ('Меняйте цвета, радиусы, шрифты и поведение — страница перестраивается сразу, а ниже появляется готовый код.', 'Change colors, radii, fonts and behavior — the page updates instantly and ready-to-use code appears below.'),
'cz.tokens': ('Дизайн-токены (для текущей темы)', 'Design tokens (current theme)'), 'cz.presets': ('Пресеты', 'Presets'),
'cz.p.lofi': ('Lo-fi', 'Lo-fi'), 'cz.p.ocean': ('Океан', 'Ocean'), 'cz.p.forest': ('Лес', 'Forest'), 'cz.p.sunset': ('Закат', 'Sunset'), 'cz.p.mono': ('Моно', 'Mono'),
'cz.radius': ('радиус', 'radius'), 'cz.border': ('рамка', 'border'), 'cz.shadow': ('тень', 'shadow'), 'cz.font': ('шрифт', 'font'),
'cz.save': ('Запомнить', 'Remember'), 'cz.saved': ('Сохранено в браузере', 'Saved in the browser'), 'cz.reset': ('Сбросить всё', 'Reset all'), 'cz.preview': ('Предпросмотр', 'Preview'),
'cz.config': ('Глобальные опции', 'Global options'), 'cz.toastPos': ('Toast: позиция', 'Toast: position'), 'cz.toastDur': ('Toast: время, мс', 'Toast: time, ms'),
'cz.tipPlace': ('Tooltip: место', 'Tooltip: placement'), 'cz.revealDist': ('Reveal: сдвиг, px', 'Reveal: distance, px'), 'cz.newest': ('Toast: новые сверху', 'Toast: newest on top'),
'cz.code': ('Код', 'Code'), 'cz.events': ('Поток событий PsyScripts.on("*")', 'Event stream PsyScripts.on("*")'),
# cards for new scripts
'card.Typewriter': ('Печатающийся текст со словами, скоростью и циклом', 'Typing text with words, speed and loop'),
'card.Countdown': ('Обратный отсчёт до даты или таймер, подписи через Intl', 'Countdown to a date or a timer, labels via Intl'),
'card.ScrollProgress': ('Индикатор прогресса чтения страницы или блока', 'Reading progress for the page or a block'),
'card.CompareSlider': ('Слайдер «до/после» для мыши, касаний и клавиатуры', 'Before/after slider for mouse, touch and keyboard'),
}
for lang, i in (('ru', 0), ('en', 1)):
    p = 'locales/%s.json' % lang
    d = json.load(open(p, encoding='utf-8'))
    for k, v in K.items(): d[k] = v[i]
    # counts: 23 → 27
    for k in ('hero.sub', 'scripts.title'):
        pass
    d['hero.sub'] = {x: y.replace('23', '27') for x, y in d['hero.sub'].items()}
    for k in ('install.bundle', 'install.single', 'install.icons'): d.pop(k, None)
    json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok')
