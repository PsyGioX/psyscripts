/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
/* Sortable — reorder lists and grids by pointer (mouse, touch, pen) or keyboard, with live-region announcements. */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    items: '', handle: '', axis: 'y', animation: 160, threshold: 4, scroll: true, disabled: false,
    roledescription: 'sortable item',
    announceGrab: '{item} grabbed. Position {pos} of {total}. Arrow keys move, Space drops, Escape cancels.',
    announceMove: '{item}: position {pos} of {total}.',
    announceDrop: '{item} dropped at position {pos} of {total}.',
    announceCancel: 'Move cancelled. {item} returned to position {pos}.'
  };
  (P.q = P.q || []).push(['sortable', DEF]);
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
  function reduced() { return P.reduced ? P.reduced() : matchMedia('(prefers-reduced-motion: reduce)').matches; }
  var INTERACTIVE = 'a[href],button,input,select,textarea,label,[contenteditable=""],[contenteditable=true]';

  function build(box) {
    if (box._sort) return box._sort;
    function O(k) { return P.cfg ? P.cfg('sortable', k, DEF[k], box, 'sortable') : DEF[k]; }
    var live = document.createElement('p');
    live.className = 'psy-sr'; live.setAttribute('role', 'status'); live.setAttribute('aria-live', 'assertive');
    box.parentNode.insertBefore(live, box.nextSibling);
    var drag = null, kb = null, offs = [];

    function items() {
      var s = O('items');
      return [].filter.call(box.children, function (c) { return s ? c.matches(s) : c.hasAttribute('data-sortable-item') || !box.querySelector(':scope > [data-sortable-item]'); });
    }
    function label(it) { return (it.getAttribute('data-label') || it.getAttribute('aria-label') || it.textContent).replace(/\s+/g, ' ').trim().slice(0, 80); }
    function say(key, it) {
      var l = items();
      live.textContent = String(O(key)).replace('{item}', label(it)).replace('{pos}', l.indexOf(it) + 1).replace('{total}', l.length);
    }
    function order() { return items().map(function (it, i) { return it.getAttribute('data-id') || String(i); }); }
    function grip(it) { var h = O('handle'); return h ? P.sel(h, it) || null : it; }
    function setup() {
      items().forEach(function (it) {
        var g = grip(it);
        if (!g) return;
        if (!g.hasAttribute('tabindex') && !g.matches('button,a[href],input')) g.tabIndex = 0;
        g.setAttribute('aria-roledescription', O('roledescription'));
        g.setAttribute('aria-keyshortcuts', 'Space ArrowUp ArrowDown ArrowLeft ArrowRight Escape');
        g.setAttribute('data-sortable-grip', '');
      });
      box.classList.add('psy-sortable');
      box.classList.toggle('is-x', O('axis') === 'x');
    }

    /* FLIP: siblings glide to their new place */
    function flip(change) {
      var l = items(), before = l.map(function (n) { return n.getBoundingClientRect(); });
      change();
      if (!(O('animation') > 0) || reduced() || !l[0] || !l[0].animate) return;
      l.forEach(function (n, i) {
        if (drag && n === drag.it) return;
        var a = before[i], b = n.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
        if (dx || dy) n.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: O('animation'), easing: 'ease' });
      });
    }
    function place(it, ref, after) {
      if (ref === it) return false;
      if (after ? it.previousElementSibling === ref : it.nextElementSibling === ref) return false;
      flip(function () { box.insertBefore(it, after ? ref.nextElementSibling : ref); });
      return true;
    }

    /* ---------- pointer ---------- */
    function down(e) {
      if (O('disabled') || (e.button != null && e.button !== 0) || !e.isPrimary) return;
      var it = e.target.closest && e.target.closest('.psy-sortable > *'), l = items();
      if (!it || it.parentNode !== box || l.indexOf(it) < 0) return;
      var h = O('handle'), g = h ? e.target.closest(h) : null;
      if (h ? !g || !it.contains(g) : e.target.closest(INTERACTIVE) && e.target.closest(INTERACTIVE) !== it) return;
      var r = it.getBoundingClientRect();
      drag = { it: it, id: e.pointerId, x: e.clientX, y: e.clientY, gx: e.clientX - r.left, gy: e.clientY - r.top, on: false, from: l.indexOf(it), origin: order() };
      try { it.setPointerCapture(e.pointerId); } catch (x) {}
    }
    function move(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var it = drag.it;
      if (!drag.on) {
        if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) < O('threshold')) return;
        if (!E('sortable:start', { item: it, index: drag.from }, box)) { drag = null; return; }
        drag.on = true; it.classList.add('is-dragging'); box.classList.add('is-sorting');
      }
      e.preventDefault();
      it.style.transform = '';
      var r = it.getBoundingClientRect(), ax = O('axis');
      var tx = ax === 'y' ? 0 : e.clientX - drag.gx - r.left, ty = ax === 'x' ? 0 : e.clientY - drag.gy - r.top;
      it.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      var under = document.elementsFromPoint(e.clientX, e.clientY).filter(function (n) { return n !== it && n.parentNode === box && items().indexOf(n) > -1; })[0];
      if (under) {
        var b = under.getBoundingClientRect(), horiz = ax === 'x' || (ax === 'both' && Math.abs(e.clientX - (b.left + b.width / 2)) / b.width > Math.abs(e.clientY - (b.top + b.height / 2)) / b.height);
        var after = horiz ? e.clientX > b.left + b.width / 2 : e.clientY > b.top + b.height / 2;
        if (place(it, under, after)) { it.style.transform = ''; var r2 = it.getBoundingClientRect(); it.style.transform = 'translate(' + (ax === 'y' ? 0 : e.clientX - drag.gx - r2.left) + 'px,' + (ax === 'x' ? 0 : e.clientY - drag.gy - r2.top) + 'px)'; E('sortable:move', { item: it, index: items().indexOf(it) }, box); }
      }
      if (O('scroll')) { if (e.clientY < 48) scrollBy(0, -14); else if (e.clientY > innerHeight - 48) scrollBy(0, 14); }
    }
    function up(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      var d = drag, it = d.it;
      drag = null;
      try { it.releasePointerCapture(e.pointerId); } catch (x) {}
      if (!d.on) return;
      it.classList.remove('is-dragging'); box.classList.remove('is-sorting'); it.style.transform = '';
      var to = items().indexOf(it);
      if (e.type === 'pointercancel') { restore(d.origin); return; }
      /* a click that ends a drag must not activate the item */
      var stop = function (ev) { ev.stopPropagation(); ev.preventDefault(); };
      it.addEventListener('click', stop, { capture: true, once: true }); setTimeout(function () { it.removeEventListener('click', stop, true); }, 0);
      if (to !== d.from) E('sortable:end', { item: it, from: d.from, to: to, order: order() }, box);
    }
    function restore(ids) {
      var map = {}, l = items();
      l.forEach(function (n, i) { map[n.getAttribute('data-id') || String(i)] = n; });
      ids.forEach(function (id) { if (map[id]) box.appendChild(map[id]); });
    }

    /* ---------- keyboard ---------- */
    function key(e) {
      var it = e.target.closest && e.target.closest('.psy-sortable > *');
      if (O('disabled') || !it || it.parentNode !== box) return;
      var g = grip(it);
      if (!g || (e.target !== g && !g.contains(e.target))) return;
      var k = e.key, l = items(), i = l.indexOf(it);
      if (!kb) {
        if (k === ' ' || (k === 'Enter' && !e.target.matches('a[href],button'))) {
          e.preventDefault();
          if (!E('sortable:start', { item: it, index: i }, box)) return;
          kb = { it: it, from: i, origin: order() };
          it.classList.add('is-grabbed'); box.classList.add('is-sorting'); say('announceGrab', it);
        }
        return;
      }
      if (kb.it !== it) return;
      var ax = O('axis'), d = 0;
      if ((k === 'ArrowDown' && ax !== 'x') || (k === 'ArrowRight' && ax !== 'y')) d = 1;
      else if ((k === 'ArrowUp' && ax !== 'x') || (k === 'ArrowLeft' && ax !== 'y')) d = -1;
      if (d) {
        e.preventDefault();
        var ref = l[i + d];
        if (ref && place(it, ref, d > 0)) { say('announceMove', it); E('sortable:move', { item: it, index: i + d }, box); }
        g.focus();
      } else if (k === ' ' || k === 'Enter') {
        e.preventDefault();
        var to = items().indexOf(it), from = kb.from;
        it.classList.remove('is-grabbed'); box.classList.remove('is-sorting'); kb = null; say('announceDrop', it);
        if (to !== from) E('sortable:end', { item: it, from: from, to: to, order: order() }, box);
      } else if (k === 'Escape') {
        e.preventDefault();
        restore(kb.origin); it.classList.remove('is-grabbed'); box.classList.remove('is-sorting'); kb = null; say('announceCancel', it); g.focus();
        E('sortable:cancel', { item: it }, box);
      } else if (k === 'Tab') { restore(kb.origin); it.classList.remove('is-grabbed'); box.classList.remove('is-sorting'); kb = null; }
    }

    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    box.addEventListener('keydown', key);
    box.addEventListener('dragstart', function (e) { if (drag) e.preventDefault(); });
    setup();

    return box._sort = {
      el: box, order: order, items: items, refresh: setup,
      /* apply an order given as an array of data-id values */
      setOrder: function (ids) { flip(function () { restore(ids); }); return box._sort; },
      /* move an item from one index to another (programmatic) */
      move: function (from, to) { var l = items(), it = l[from], ref = l[to]; if (it && ref) place(it, ref, to > from); return box._sort; },
      disable: function () { box.setAttribute('data-sortable-disabled', ''); },
      destroy: function () {
        box.removeEventListener('pointerdown', down); box.removeEventListener('pointermove', move);
        box.removeEventListener('pointerup', up); box.removeEventListener('pointercancel', up); box.removeEventListener('keydown', key);
        items().forEach(function (it) { var g = grip(it); if (g) { g.removeAttribute('aria-roledescription'); g.removeAttribute('aria-keyshortcuts'); g.removeAttribute('data-sortable-grip'); } });
        box.classList.remove('psy-sortable', 'is-sorting'); live.remove(); box._sort = null;
      }
    };
  }

  P.Sortable = {
    init: function (r) { return all(r, '[data-sortable]').map(build); },
    get: function (el) { el = typeof el === 'string' ? P.sel(el) : el; return el && el._sort || null; },
    destroy: function (r) { all(r, '[data-sortable]').forEach(function (b) { b._sort && b._sort.destroy(); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Sortable.init(); });
})();
