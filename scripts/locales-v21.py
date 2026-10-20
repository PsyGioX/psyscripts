# v2.1 strings for the landing page → merged into locales/{ru,en}.json.  Run: python3 scripts/locales-v21.py  (idempotent)
import json
def pl(one, few, many, other=None): return {'one': one, 'few': few, 'many': many, 'other': other or many}
K = {
'meta.title': ('PsyScripts — 31 лёгкий скрипт для веб-разработчиков', 'PsyScripts — 31 lightweight scripts for web developers'),
'meta.desc': ('Лёгкие скрипты без зависимостей: табы, модалки, командная палитра, таблицы, drag-and-drop, санитайзер HTML — с полным API настройки.', 'Dependency-free scripts: tabs, modals, command palette, data tables, drag-and-drop, HTML sanitizer — with a full configuration API.'),
'hero.words': ('табов|модалок|каруселей|форм|тостов|переводов|таблиц|палитры команд', 'tabs|modals|carousels|forms|toasts|translations|tables|command palettes'),
'scripts.search': ('Поиск скрипта…', 'Search scripts…'),
'scripts.found': (pl('Найден {n} скрипт', 'Найдено {n} скрипта', 'Найдено {n} скриптов'), {'one': '{n} script found', 'other': '{n} scripts found'}),
'scripts.empty': ('Ничего не найдено — попробуйте другое слово или категорию.', 'Nothing found — try another word or category.'),
'card.docs': ('Документация', 'Docs'), 'card.include': ('Подключить', 'Include'),
'cat.new': ('Новое в 2.1', 'New in 2.1'),
'c.CommandPalette': ('CommandPalette', 'CommandPalette'), 'c.DataTable': ('DataTable', 'DataTable'), 'c.Sortable': ('Sortable', 'Sortable'), 'c.SafeHTML': ('SafeHTML', 'SafeHTML'),
'card.CommandPalette': ('Палитра команд Ctrl/⌘+K: нечёткий поиск, группы, недавние', 'Ctrl/⌘+K command palette: fuzzy search, groups, recent items'),
'card.DataTable': ('Таблица: сортировка, поиск, страницы, безопасный экспорт CSV', 'Table: sorting, search, pagination, safe CSV export'),
'card.Sortable': ('Перетаскивание мышью, касанием и клавиатурой с озвучиванием', 'Drag by mouse, touch or keyboard with screen-reader announcements'),
'card.SafeHTML': ('Санитайзер HTML по белому списку + Trusted Types', 'Allow-list HTML sanitizer + Trusted Types'),
'd.cmd.p': ('Нажмите Ctrl/⌘+K на любой странице. Ищет по командам и ссылкам навигации; недавние запоминаются.', 'Press Ctrl/⌘+K anywhere. Searches commands and navigation links; recent items are remembered.'),
'd.cmd.open': ('Открыть палитру', 'Open palette'), 'd.cmd.hl': ('подсветка совпадений', 'highlight matches'), 'd.cmd.add': ('+ команда', '+ command'), 'd.cmd.clear': ('Очистить недавние', 'Clear recent'),
'cmd.open': ('Поиск и команды', 'Search and commands'), 'cmd.placeholder': ('Введите команду или запрос…', 'Type a command or search…'), 'cmd.empty': ('Ничего не найдено', 'Nothing found'),
'cmd.results': (pl('{n} результат', '{n} результата', '{n} результатов'), '{n} results'), 'cmd.label': ('Командная палитра', 'Command palette'),
'cmd.g.recent': ('Недавние', 'Recent'), 'cmd.g.links': ('Ссылки', 'Links'), 'cmd.g.actions': ('Действия', 'Actions'), 'cmd.g.custom': ('Свои', 'Custom'),
'cmd.theme': ('Переключить тему', 'Toggle theme'), 'cmd.lang': ('Сменить язык', 'Switch language'), 'cmd.toast': ('Показать уведомление', 'Show a toast'),
'cmd.modal': ('Открыть модальное окно', 'Open the modal'), 'cmd.top': ('Наверх', 'Back to top'), 'cmd.cleared': ('Недавние очищены', 'Recent items cleared'),
'd.dt.p': ('Клик по заголовку — сортировка (aria-sort), поиск по всем ячейкам, страницы, экспорт CSV с защитой от formula injection.', 'Click a header to sort (aria-sort), search across all cells, pages, CSV export protected against formula injection.'),
'd.dt.search': ('Поиск', 'Search'), 'd.dt.page': ('Строк на странице', 'Rows per page'), 'd.dt.csv': ('Скачать CSV', 'Download CSV'),
'd.dt.c1': ('Скрипт', 'Script'), 'd.dt.c2': ('Категория', 'Category'), 'd.dt.c3': ('Размер gzip, КБ', 'Size gzip, KB'), 'd.dt.c4': ('Версия', 'Since'),
'd.sort.p': ('Тяните за ручку или нажмите Пробел на ручке, затем стрелки; Esc отменяет. Смена порядка озвучивается.', 'Drag the handle, or press Space on it and use the arrows; Esc cancels. Changes are announced to screen readers.'),
'd.sort.axis': ('Ось', 'Axis'), 'd.sort.grip': ('Переместить', 'Move'),
'd.safe.p': ('Любой HTML разбирается в изолированном документе и пересобирается только из разрешённых узлов: скрипты, обработчики событий, javascript:-ссылки и стили удаляются.', 'Any HTML is parsed in an inert document and rebuilt from allowed nodes only: scripts, event handlers, javascript: links and styles are removed.'),
'd.safe.in': ('Ненадёжный HTML', 'Untrusted HTML'), 'd.safe.img': ('разрешить img', 'allow img'), 'd.safe.links': ('разрешить ссылки', 'allow links'),
'd.safe.stat': ('Удалено элементов: {a}, атрибутов: {b}', 'Removed elements: {a}, attributes: {b}'),
'install.each': ('Отдельные скрипты: core + нужный файл', 'Individual scripts: core + the file you need'),
'install.eachNote': ('Каждый скрипт — это <code>dist/&lt;имя&gt;.min.js</code> (после <code>core.min.js</code>); путь и SRI-хэш есть у каждого скрипта в документации и в разделе «Файлы».', 'Every script is <code>dist/&lt;name&gt;.min.js</code> (after <code>core.min.js</code>); the path and SRI hash for each one are in the docs and in the “Files” section.'),
'footer.security': ('Безопасность', 'Security'), 'footer.files': ('Файлы и SRI', 'Files & SRI'),
}
for lang, i in (('ru', 0), ('en', 1)):
    p = 'locales/%s.json' % lang
    d = json.load(open(p, encoding='utf-8'))
    for k, v in K.items(): d[k] = v[i]
    json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('locales merged:', len(K), 'keys')
