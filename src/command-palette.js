/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
/* CommandPalette — Ctrl/⌘+K launcher: fuzzy search, groups, recent items, ARIA combobox, native <dialog>. */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    hotkey: 'mod+k', placeholder: 'Type a command or search…', empty: 'Nothing found', results: '{n} results',
    label: 'Command palette', recent: 5, storageKey: 'psy-cmd', maxResults: 50, source: '[data-command-source]',
    groupRecent: 'Recent', groupLinks: 'Links', groupDefault: 'Commands', closeOnRun: true, highlight: true, hints: true
  };
  (P.q = P.q || []).push(['command', DEF]);
  function O(k) { return P.cfg ? P.cfg('command', k, DEF[k]) : DEF[k]; }
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }

  var reg = [], dlg, input, list, live, shown = [], act = -1, from = null, uid = 0;

  /* ---------- search ---------- */
  function norm(s) { return String(s == null ? '' : s).toLowerCase(); }
  function score(q, t) {
    if (!q) return 1;
    var i = t.indexOf(q);
    if (i > -1) return 1000 - i + (i === 0 ? 200 : 0) - t.length / 100;
    var qi = 0, s = 0, last = -2;
    for (var ti = 0; ti < t.length && qi < q.length; ti++) {
      if (t.charAt(ti) === q.charAt(qi)) { s += (last === ti - 1 ? 5 : 1) + (ti === 0 || /[\s\-_\/.]/.test(t.charAt(ti - 1)) ? 8 : 0); last = ti; qi++; }
    }
    return qi === q.length ? s : 0;
  }
  function rank(c, terms) {
    var T = norm(c.title), K = norm(c.keywords) + ' ' + norm(c.group), total = 0;
    for (var i = 0; i < terms.length; i++) {
      var a = score(terms[i], T), b = score(terms[i], K) * 0.3;
      if (!a && !b) return 0;
      total += a * 2 + b;
    }
    return total;
  }

  /* ---------- sources: registered commands + [data-command] elements + links inside [data-command-source] ---------- */
  function collect() {
    var out = reg.slice(), seen = {};
    reg.forEach(function (c) { seen[c.id] = 1; });
    [].forEach.call(document.querySelectorAll('[data-command]'), function (el, i) {
      var t = el.getAttribute('data-command') || el.textContent.trim();
      if (!t) return;
      out.push({
        id: el.id || 'el:' + t, title: t, group: el.getAttribute('data-command-group') || O('groupDefault'),
        keywords: el.getAttribute('data-command-keywords') || '', hint: el.getAttribute('data-command-hint') || '',
        run: function () { el.click(); }
      });
    });
    P.selAll(O('source')).forEach(function (box) {
      [].forEach.call(box.querySelectorAll('a[href]'), function (a) {
        var t = a.textContent.trim(), u = P.url(a.getAttribute('href'), { schemes: ['http:', 'https:', 'mailto:', 'tel:'] }) || (a.getAttribute('href').charAt(0) === '#' ? a.getAttribute('href') : '');
        if (!t || !u) return;
        out.push({ id: 'a:' + u + ':' + t, title: t, group: a.getAttribute('data-command-group') || box.getAttribute('data-command-group') || O('groupLinks'), keywords: u, href: u });
      });
    });
    return out.filter(function (c) { return c && c.title; });
  }
  function recents() {
    try { var a = JSON.parse(localStorage.getItem(O('storageKey')) || '[]'); return Array.isArray(a) ? a.filter(function (x) { return typeof x === 'string'; }).slice(0, 20) : []; } catch (e) { return []; }
  }
  function remember(id) {
    var n = O('recent');
    if (!(n > 0)) return;
    var a = recents().filter(function (x) { return x !== id; });
    a.unshift(id);
    try { localStorage.setItem(O('storageKey'), JSON.stringify(a.slice(0, n))); } catch (e) {}
  }
  function search(q) {
    var all = collect(), terms = norm(q).split(/\s+/).filter(Boolean), max = O('maxResults'), res;
    if (!terms.length) {
      var rc = recents(), byId = {};
      all.forEach(function (c) { byId[c.id] = c; });
      var head = rc.map(function (id) { return byId[id]; }).filter(Boolean).map(function (c) { return { c: c, g: O('groupRecent') }; });
      var ids = {};
      head.forEach(function (r) { ids[r.c.id] = 1; });
      res = head.concat(all.filter(function (c) { return !ids[c.id]; }).map(function (c) { return { c: c, g: c.group || O('groupDefault') }; }));
    } else {
      res = all.map(function (c) { return { c: c, s: rank(c, terms), g: c.group || O('groupDefault') }; })
        .filter(function (r) { return r.s > 0; }).sort(function (a, b) { return b.s - a.s; });
    }
    return res.slice(0, max);
  }

  /* ---------- UI ---------- */
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function build() {
    if (dlg) return;
    dlg = el('dialog', 'psy-cmd');
    dlg.setAttribute('aria-label', O('label'));
    var box = el('div', 'psy-cmd__box'), top = el('div', 'psy-cmd__top');
    var ic = el('i', 'psy-ico psy-ico--search'); ic.setAttribute('aria-hidden', 'true');
    input = el('input', 'psy-cmd__input');
    input.type = 'text'; input.autocomplete = 'off'; input.spellcheck = false;
    input.setAttribute('role', 'combobox'); input.setAttribute('aria-expanded', 'true'); input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', 'psy-cmd-list'); input.setAttribute('aria-label', O('label'));
    list = el('ul', 'psy-cmd__list'); list.id = 'psy-cmd-list'; list.setAttribute('role', 'listbox'); list.setAttribute('aria-label', O('label'));
    live = el('p', 'psy-sr'); live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'polite');
    var esc = el('kbd', 'psy-cmd__esc', 'Esc');
    top.appendChild(ic); top.appendChild(input); top.appendChild(esc);
    box.appendChild(top); box.appendChild(list); box.appendChild(live);
    dlg.appendChild(box);
    document.body.appendChild(dlg);

    input.addEventListener('input', function () { render(input.value); E('command:search', { query: input.value }, dlg); });
    input.addEventListener('keydown', function (e) {
      if (e.isComposing) return;
      var k = e.key;
      if (k === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (k === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (k === 'PageDown') { e.preventDefault(); move(5); }
      else if (k === 'PageUp') { e.preventDefault(); move(-5); }
      else if (k === 'Home' && e.ctrlKey) { e.preventDefault(); go(0); }
      else if (k === 'End' && e.ctrlKey) { e.preventDefault(); go(shown.length - 1); }
      else if (k === 'Enter') { e.preventDefault(); run(act); }
    });
    list.addEventListener('click', function (e) { var li = e.target.closest('[role=option]'); if (li) run(+li.dataset.i); });
    list.addEventListener('mousemove', function (e) { var li = e.target.closest('[role=option]'); if (li && +li.dataset.i !== act) go(+li.dataset.i, true); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('close', function () {
      document.documentElement.classList.remove('no-scroll');
      if (from && from.focus && from.isConnected) from.focus();
      E('command:close', {}, dlg);
    });
  }
  function mark(text, q) {
    var f = el('span');
    var i = O('highlight') && q ? norm(text).indexOf(norm(q).split(/\s+/)[0]) : -1, w = i > -1 ? norm(q).split(/\s+/)[0].length : 0;
    if (i < 0 || !w) { f.textContent = text; return f; }
    f.appendChild(document.createTextNode(text.slice(0, i)));
    f.appendChild(el('mark', null, text.slice(i, i + w)));
    f.appendChild(document.createTextNode(text.slice(i + w)));
    return f;
  }
  function render(q) {
    shown = search(q);
    list.textContent = '';
    var g = null;
    shown.forEach(function (r, i) {
      if (r.g !== g) {
        g = r.g;
        var h = el('li', 'psy-cmd__group', g); h.setAttribute('role', 'presentation'); list.appendChild(h);
      }
      var li = el('li', 'psy-cmd__item'), c = r.c;
      li.id = 'psy-cmd-o' + i; li.dataset.i = i; li.setAttribute('role', 'option'); li.setAttribute('aria-selected', 'false');
      li.appendChild(mark(c.title, q));
      if (O('hints') && c.hint) li.appendChild(el('kbd', 'psy-cmd__hint', c.hint));
      list.appendChild(li);
    });
    if (!shown.length) {
      var n = el('li', 'psy-cmd__none', O('empty')); n.setAttribute('role', 'presentation'); list.appendChild(n);
    }
    live.textContent = shown.length ? String(O('results')).replace('{n}', shown.length) : O('empty');
    go(shown.length ? 0 : -1, true);
  }
  function go(i, noScroll) {
    var items = list.querySelectorAll('[role=option]');
    if (!items.length) { act = -1; input.removeAttribute('aria-activedescendant'); return; }
    act = (i + items.length) % items.length;
    [].forEach.call(items, function (x, k) { x.setAttribute('aria-selected', k === act); });
    input.setAttribute('aria-activedescendant', items[act].id);
    if (!noScroll && items[act].scrollIntoView) items[act].scrollIntoView({ block: 'nearest' });
  }
  function move(d) { if (!shown.length) return; var n = act + d; if (n < 0) n = shown.length - 1; else if (n >= shown.length) n = 0; go(n); }

  function run(i) {
    var r = shown[i];
    if (!r) return;
    var c = r.c;
    if (!E('command:run', { command: c, query: input.value }, dlg)) return;
    remember(c.id);
    if (O('closeOnRun')) close();
    if (typeof c.run === 'function') { try { c.run(c); } catch (e) { console.error('[PsyScripts] command', e); } }
    else if (c.href) {
      var u = P.url(c.href, { schemes: ['http:', 'https:', 'mailto:', 'tel:'] }) || (String(c.href).charAt(0) === '#' ? c.href : '');
      if (u) location.assign(u);
    }
  }
  function open(q) {
    build();
    if (dlg.open) { if (q != null) { input.value = q; render(q); } return; }
    if (!E('command:open', {}, dlg)) return;
    from = document.activeElement;
    input.placeholder = O('placeholder');
    input.value = q || '';
    render(input.value);
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
    document.documentElement.classList.add('no-scroll');
    input.focus();
    input.select();
  }
  function close() { if (dlg && dlg.open) { dlg.close ? dlg.close() : dlg.removeAttribute('open'); } }

  function match(e) {
    var hk = norm(O('hotkey')).split('+'), key = hk.pop(), plain = hk.length === 0, t = e.target;
    if (hk.indexOf('mod') > -1 ? !(e.ctrlKey || e.metaKey) : (hk.indexOf('ctrl') > -1) !== e.ctrlKey || (hk.indexOf('meta') > -1) !== e.metaKey) return false;
    if ((hk.indexOf('shift') > -1) !== e.shiftKey || (hk.indexOf('alt') > -1) !== e.altKey) return false;
    /* a bare key such as "/" must not fire while the user is typing */
    if (plain && t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return false;
    return norm(e.key) === key;
  }

  P.CommandPalette = {
    open: open, close: close,
    toggle: function () { dlg && dlg.open ? close() : open(); },
    isOpen: function () { return !!(dlg && dlg.open); },
    /* register({id, title, group, keywords, hint, href, run}) or an array; returns a function that removes them */
    register: function (c) {
      var a = (Array.isArray(c) ? c : [c]).filter(function (x) { return x && x.title; }).map(function (x) {
        return { id: String(x.id || 'cmd-' + (++uid)), title: String(x.title), group: x.group, keywords: x.keywords || '', hint: x.hint || '', href: x.href, run: x.run };
      });
      a.forEach(function (x) { reg = reg.filter(function (r) { return r.id !== x.id; }); reg.push(x); });
      return function () { a.forEach(function (x) { P.CommandPalette.unregister(x.id); }); };
    },
    unregister: function (id) { reg = reg.filter(function (r) { return r.id !== id; }); },
    list: function () { return collect(); },
    search: function (q) { return search(q).map(function (r) { return r.c; }); },
    clearRecent: function () { try { localStorage.removeItem(O('storageKey')); } catch (e) {} }
  };

  document.addEventListener('keydown', function (e) {
    if (O('hotkey') && !e.isComposing && match(e)) { e.preventDefault(); P.CommandPalette.toggle(); }
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-command-open]');
    if (b) { e.preventDefault(); open(b.getAttribute('data-command-open') || ''); }
  });
})();
