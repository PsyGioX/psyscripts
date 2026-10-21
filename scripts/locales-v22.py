# v2.2 strings (customizer, accessibility, shared command palette) → merged into locales/{ru,en}.json.
# Run: python3 scripts/locales-v22.py  (idempotent)
import json
K = {
'a11y.skip': ('Перейти к содержимому', 'Skip to content'),
'cmd.g.docs': ('Документация', 'Docs'),
'cz.sub': ('Выбирайте пресет, правьте цвета, форму и поведение — страница перестраивается сразу, контраст проверяется по WCAG, а готовый код можно скопировать.', 'Pick a preset, tweak colors, shape and behavior — the page updates instantly, contrast is checked against WCAG and the code is ready to copy.'),
'cz.tokens': ('Цвета меняются для выбранной темы: переключайте светлую и тёмную сверху.', 'Colors apply to the selected theme: switch between light and dark at the top.'),
'cz.mode': ('Тема предпросмотра', 'Preview theme'), 'cz.light': ('Светлая', 'Light'), 'cz.dark': ('Тёмная', 'Dark'),
'cz.tabs': ('Разделы настройки', 'Customizer sections'),
'cz.tab.colors': ('Цвета', 'Colors'), 'cz.tab.shape': ('Форма и шрифт', 'Shape & type'), 'cz.tab.behavior': ('Поведение', 'Behavior'), 'cz.tab.code': ('Код', 'Code'),
'cz.p.slate': ('Графит', 'Slate'), 'cz.p.contrast': ('Контраст AAA', 'Contrast AAA'),
'cz.g.surface': ('Поверхности', 'Surfaces'), 'cz.g.text': ('Текст и контуры', 'Text & outlines'), 'cz.g.brand': ('Бренд', 'Brand'), 'cz.g.palette': ('Акцентные цвета', 'Accent palette'),
'cz.c.bg': ('Фон страницы', 'Page'), 'cz.c.solid': ('Карточка', 'Card'), 'cz.c.text': ('Текст', 'Text'), 'cz.c.muted': ('Вторичный текст', 'Muted text'),
'cz.c.line': ('Разделитель', 'Divider'), 'cz.c.ink': ('Контур', 'Outline'), 'cz.c.accent': ('Акцент', 'Accent'), 'cz.c.primary': ('Основной', 'Primary'),
'cz.c.onPrimary': ('Текст на основном', 'On primary'), 'cz.c.lav': ('Лаванда', 'Lavender'), 'cz.c.mint': ('Мята', 'Mint'), 'cz.c.pink': ('Роза', 'Pink'),
'cz.c.peach': ('Персик', 'Peach'), 'cz.c.sky': ('Небо', 'Sky'), 'cz.c.butter': ('Масло', 'Butter'),
'cz.a11y': ('Доступность: контраст', 'Accessibility: contrast'),
'cz.a11y.note': ('WCAG 2.2: обычный текст — от 4.5:1 (AA), от 7:1 — AAA; контуры и элементы интерфейса — от 3:1.', 'WCAG 2.2: body text needs 4.5:1 (AA), 7:1 is AAA; outlines and UI components need 3:1.'),
'cz.pair.text': ('Текст / фон', 'Text / page'), 'cz.pair.muted': ('Вторичный текст / фон', 'Muted / page'), 'cz.pair.accent': ('Акцент / фон', 'Accent / page'),
'cz.pair.onPrimary': ('Текст на основном', 'Text on primary'), 'cz.pair.ink': ('Контур / фон', 'Outline / page'),
'cz.g.large': ('AA крупный', 'AA large'), 'cz.g.fail': ('Ниже нормы', 'Fail'),
'cz.s.hard': ('Жёсткая', 'Hard'), 'cz.s.soft': ('Мягкая', 'Soft'), 'cz.s.big': ('Крупная', 'Big'), 'cz.s.none': ('Без тени', 'None'),
'cz.menuHide': ('Меню: прятать при прокрутке', 'Menu: hide on scroll'),
'cz.format': ('Формат экспорта', 'Export format'),
'cz.import': ('Импорт настроек', 'Import settings'), 'cz.import.ph': ('Вставьте JSON или PsyScripts.configure({ … })', 'Paste JSON or PsyScripts.configure({ … })'),
'cz.import.err': ('Не удалось разобрать: нужен корректный JSON.', 'Could not parse: valid JSON is required.'),
'cz.apply': ('Применить', 'Apply'), 'cz.applied': ('Настройки применены', 'Settings applied'),
'cz.empty.css': ('Измените цвета или форму — здесь появятся CSS-переменные', 'Change colors or shape — CSS variables will appear here'),
}
for lang, i in (('ru', 0), ('en', 1)):
    p = 'locales/%s.json' % lang
    d = json.load(open(p, encoding='utf-8'))
    for k, v in K.items(): d[k] = v[i]
    json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('locales v2.2 merged:', len(K), 'keys')
