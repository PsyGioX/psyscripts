/* PsyScripts site glue shared by index.html and docs.html · © 2026 PsyGioX · MIT
   Keeps the command palette (Ctrl/⌘+K) fully translated on every page and registers the commands every page has. */
(function () {
  var P = window.PsyScripts, I = P && P.I18n;
  if (!P || !I || !P.CommandPalette) return;
  var off, home = /(^|\/)docs(\.html)?\/?$/.test(location.pathname);

  function setup() {
    P.configure('command', {
      placeholder: I.t('cmd.placeholder'), empty: I.t('cmd.empty'), label: I.t('cmd.label'),
      /* plural forms (1 результат / 2 результата / 5 результатов) come from Intl.PluralRules inside I18n */
      results: function (n) { return I.t('cmd.results', { n: n }); },
      groupRecent: I.t('cmd.g.recent'), groupLinks: I.t('cmd.g.links'), groupDefault: I.t('cmd.g.actions')
    });
    if (off) off();
    off = P.CommandPalette.register([
      { id: 'theme', title: I.t('cmd.theme'), keywords: 'dark light sepia тема', run: function () { P.Theme.toggle(); } },
      { id: 'lang', title: I.t('cmd.lang'), keywords: 'ru en language язык', run: function () { I.toggle(); } },
      { id: 'top', title: I.t('cmd.top'), run: function () { scrollTo({ top: 0, behavior: P.reduced() ? 'auto' : 'smooth' }); } },
      { id: 'gh', title: 'GitHub', group: I.t('cmd.g.links'), href: 'https://github.com/PsyGioX/psyscripts', keywords: 'source repo' },
      { id: 'docs', title: I.t('nav.docs'), group: I.t('cmd.g.links'), href: home ? '#docs' : 'docs.html', keywords: 'documentation docs документация' },
      { id: 'sec', title: I.t('footer.security'), group: I.t('cmd.g.links'), href: 'docs.html#security', keywords: 'csp xss audit безопасность' }
    ]);
  }
  P.Site = { commands: setup };
  /* translations load asynchronously: (re)build when the dictionary is ready and whenever the language changes */
  document.addEventListener('psy:lang', setup);
  document.addEventListener('DOMContentLoaded', function () { if (I.has && I.has('cmd.placeholder')) setup(); });
})();
