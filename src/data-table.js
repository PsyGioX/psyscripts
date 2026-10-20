/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
/* DataTable — progressive enhancement of a plain <table>: sort, search, pagination, aria-sort, safe CSV export. */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    sortable: true, search: '', pageSize: 0, multiWord: true, caseSensitive: false, locale: '', emptyText: 'No rows',
    infoText: '{from}–{to} / {total}', prevLabel: 'Previous', nextLabel: 'Next', pagerLabel: 'Pagination', csvName: 'table.csv', csvSeparator: ','
  };
  (P.q = P.q || []).push(['table', DEF]);
  function E(n, d, el) {
    if (P.emit) return P.emit(n, d, el);
    var e = new CustomEvent('psy:' + n, { bubbles: true, cancelable: true, detail: d || {} });
    (el || document).dispatchEvent(e);
    return !e.defaultPrevented;
  }
  function all(r, sel) {
    r = r || document;
    var a = [].slice.call(r.querySelectorAll(sel));
    if (r.matches && r.matches(sel)) a.unshift(r);
    return a;
  }
  function mk(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  function build(tbl) {
    if (tbl._dt) return tbl._dt;
    var body = tbl.tBodies[0];
    if (!body) return null;
    function O(k) { return P.cfg ? P.cfg('table', k, DEF[k], tbl, 'table') : DEF[k]; }
    var heads = [].slice.call(tbl.querySelectorAll('thead th')), rows = [].slice.call(body.rows).map(function (r, i) { return { el: r, i: i }; });
    var q = '', sortCol = -1, dir = 'asc', page = 1, view = rows.slice(), info, pager, prev, next, empty, uiOff = [], collator;
    try { collator = new Intl.Collator(O('locale') || undefined, { numeric: true, sensitivity: 'base' }); } catch (e) { collator = new Intl.Collator(undefined, { numeric: true }); }

    function cell(r, c) { var td = r.el.cells[c]; return td ? td : null; }
    function raw(r, c) { var td = cell(r, c); return td ? (td.getAttribute('data-sort-value') != null ? td.getAttribute('data-sort-value') : td.textContent.trim()) : ''; }
    function type(c) {
      var h = heads[c], t = h && h.getAttribute('data-sort-type');
      if (t) return t;
      var n = 0, num = 0;
      for (var i = 0; i < rows.length && n < 12; i++, n++) { var v = raw(rows[i], c).replace(/[\s,%$€£₽]/g, ''); if (v !== '' && !isNaN(+v)) num++; }
      return n && num === n ? 'number' : 'text';
    }
    function cmp(c, t) {
      return function (a, b) {
        var x = raw(a, c), y = raw(b, c), r;
        if (t === 'number') { x = parseFloat(String(x).replace(/[\s,%$€£₽]/g, '')); y = parseFloat(String(y).replace(/[\s,%$€£₽]/g, '')); r = (isNaN(x) ? -Infinity : x) - (isNaN(y) ? -Infinity : y); r = r === 0 || isNaN(r) ? 0 : r < 0 ? -1 : 1; }
        else if (t === 'date') { r = (Date.parse(x) || 0) - (Date.parse(y) || 0); r = r === 0 ? 0 : r < 0 ? -1 : 1; }
        else r = collator.compare(x, y);
        return r || a.i - b.i;                     /* stable */
      };
    }
    function text(r) { var s = r.el.textContent; return O('caseSensitive') ? s : s.toLowerCase(); }
    function filter() {
      var s = O('caseSensitive') ? q : q.toLowerCase(), terms = O('multiWord') ? s.split(/\s+/).filter(Boolean) : (s ? [s] : []);
      view = rows.filter(function (r) { if (!terms.length) return true; var t = text(r); return terms.every(function (x) { return t.indexOf(x) > -1; }); });
      if (sortCol > -1) { var f = cmp(sortCol, type(sortCol)); view.sort(f); if (dir === 'desc') view.reverse(); }
    }
    function pages() { var n = O('pageSize'); return n > 0 ? Math.max(1, Math.ceil(view.length / n)) : 1; }
    function paint() {
      var n = O('pageSize'), total = view.length, pc = pages();
      page = Math.max(1, Math.min(page, pc));
      var from = n > 0 ? (page - 1) * n : 0, to = n > 0 ? Math.min(total, from + n) : total, show = view.slice(from, to), keep = {};
      show.forEach(function (r) { keep[r.i] = 1; });
      rows.forEach(function (r) { r.el.hidden = !keep[r.i]; });
      var frag = document.createDocumentFragment();
      show.forEach(function (r) { frag.appendChild(r.el); });
      rows.forEach(function (r) { if (!keep[r.i]) frag.appendChild(r.el); });
      body.appendChild(frag);
      heads.forEach(function (h, c) { if (h.hasAttribute('data-sort-btn')) h.setAttribute('aria-sort', c === sortCol ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'); });
      if (info) info.textContent = total ? String(O('infoText')).replace('{from}', from + 1).replace('{to}', to).replace('{total}', total) : O('emptyText');
      if (pager) { pager.hidden = pc < 2; prev.disabled = page <= 1; next.disabled = page >= pc; pager.querySelector('.psy-dt__page').textContent = page + ' / ' + pc; }
      tbl.setAttribute('aria-rowcount', String(total + 1));
    }
    function refresh(why) { filter(); paint(); E('table:' + why, { table: tbl, query: q, column: sortCol, direction: dir, page: page, pages: pages(), total: view.length }, tbl); }

    var api = {
      el: tbl,
      sort: function (c, d) {
        if (!(c >= 0 && c < heads.length)) return api;
        sortCol = c; dir = d === 'desc' ? 'desc' : 'asc'; page = 1; refresh('sort'); return api;
      },
      unsort: function () { sortCol = -1; refresh('sort'); return api; },
      filter: function (v) { q = String(v == null ? '' : v).trim(); page = 1; refresh('filter'); return api; },
      page: function (n) { if (n === undefined) return page; page = Math.max(1, Math.min(+n || 1, pages())); paint(); E('table:page', { table: tbl, page: page, pages: pages() }, tbl); return api; },
      pages: pages,
      count: function () { return view.length; },
      rows: function () { return view.map(function (r) { return r.el; }); },
      /* replace the rows: array of arrays of strings (set as text) */
      setRows: function (data) {
        body.textContent = '';
        rows = (data || []).map(function (arr, i) { var tr = document.createElement('tr'); arr.forEach(function (v) { tr.appendChild(mk('td', null, v == null ? '' : String(v))); }); body.appendChild(tr); return { el: tr, i: i }; });
        page = 1; refresh('filter'); return api;
      },
      /* CSV text of the visible-after-filter rows. Cells starting with = + - @ are prefixed with ' (CSV/formula injection). */
      csv: function (all) {
        var sep = O('csvSeparator'), src = all ? rows : view;
        function q(v) {
          v = String(v).replace(/\s+/g, ' ').trim();
          if (/^[=+\-@\t\r]/.test(v) && isNaN(+v)) v = "'" + v;
          return /["\n\r]/.test(v) || v.indexOf(sep) > -1 ? '"' + v.replace(/"/g, '""') + '"' : v;
        }
        var head = heads.map(function (h) { return q(h.textContent); }).join(sep);
        return [head].concat(src.map(function (r) { return [].map.call(r.el.cells, function (c) { return q(c.textContent); }).join(sep); })).join('\r\n');
      },
      download: function (all) {
        var url = URL.createObjectURL(new Blob(['\ufeff' + api.csv(all)], { type: 'text/csv;charset=utf-8' })), a = document.createElement('a');
        a.href = url; a.download = String(O('csvName')).replace(/[^\w.\- ]/g, '_'); a.rel = 'noopener';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        E('table:export', { table: tbl, rows: (all ? rows : view).length }, tbl);
      },
      refresh: function () { rows = [].slice.call(body.rows).map(function (r, i) { return { el: r, i: i }; }); refresh('filter'); return api; },
      destroy: function () {
        uiOff.forEach(function (f) { f(); });
        rows.forEach(function (r) { r.el.hidden = false; });
        heads.forEach(function (h) { h.removeAttribute('aria-sort'); h.removeAttribute('data-sort-btn'); if (h._b) { while (h._b.firstChild) h.appendChild(h._b.firstChild); h._b.remove(); h._b = null; } });
        if (info) info.remove(); if (pager) pager.remove();
        tbl.classList.remove('psy-dt'); tbl._dt = null;
      }
    };

    tbl.classList.add('psy-dt');
    /* sortable headers: the th keeps its text; a real <button> is put inside for keyboard and screen readers */
    if (O('sortable')) heads.forEach(function (h, c) {
      if (h.hasAttribute('data-nosort')) return;
      var b = mk('button', 'psy-dt__sort'); b.type = 'button';
      while (h.firstChild) b.appendChild(h.firstChild);
      var ar = mk('span', 'psy-dt__arrow'); ar.setAttribute('aria-hidden', 'true');
      b.appendChild(ar); h.appendChild(b); h._b = b; h.setAttribute('data-sort-btn', ''); h.setAttribute('aria-sort', 'none');
      var f = function () { api.sort(c, sortCol === c && dir === 'asc' ? 'desc' : 'asc'); };
      b.addEventListener('click', f); uiOff.push(function () { b.removeEventListener('click', f); });
    });
    /* search box: data-table-search="#input" or the "search" option */
    var sel = tbl.getAttribute('data-table-search') || O('search'), box = sel && P.sel(sel);
    if (box) { var fn = function () { api.filter(box.value); }; box.addEventListener('input', fn); uiOff.push(function () { box.removeEventListener('input', fn); }); }
    var wrap = tbl.parentNode;
    info = mk('p', 'psy-dt__info'); info.setAttribute('role', 'status'); info.setAttribute('aria-live', 'polite');
    pager = mk('div', 'psy-dt__pager'); pager.setAttribute('role', 'navigation'); pager.setAttribute('aria-label', O('pagerLabel'));
    prev = mk('button', 'psy-btn psy-btn--sm', '‹'); next = mk('button', 'psy-btn psy-btn--sm', '›');
    prev.type = next.type = 'button'; prev.setAttribute('aria-label', O('prevLabel')); next.setAttribute('aria-label', O('nextLabel'));
    pager.appendChild(prev); pager.appendChild(mk('span', 'psy-dt__page')); pager.appendChild(next);
    prev.addEventListener('click', function () { api.page(page - 1); }); next.addEventListener('click', function () { api.page(page + 1); });
    var foot = mk('div', 'psy-dt__foot'); foot.appendChild(info); foot.appendChild(pager);
    var anchor = tbl.closest('.tw') || tbl;
    anchor.parentNode.insertBefore(foot, anchor.nextSibling);
    uiOff.push(function () { foot.remove(); });
    var ds = tbl.getAttribute('data-sort-default');
    if (ds) { var m = /^(\d+)(?::(asc|desc))?$/.exec(ds); if (m) { sortCol = +m[1]; dir = m[2] || 'asc'; } }
    refresh('init');
    return tbl._dt = api;
  }

  P.DataTable = {
    init: function (r) { return all(r, 'table[data-table]').map(build); },
    get: function (el) { el = typeof el === 'string' ? P.sel(el) : el; return el && el._dt || null; },
    destroy: function (r) { all(r, 'table[data-table]').forEach(function (t) { t._dt && t._dt.destroy(); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.DataTable.init(); });
})();
