const test = require('node:test'), assert = require('node:assert');
const { load, ready } = require('./helpers');

const PAGE = '<!doctype html><body><aside data-toc data-toc-source="#post" data-toc-levels="h2" data-sticky aria-label="Содержание"></aside>' +
  '<main id="post"><h2>Первый</h2><h2>Второй</h2><h2>Третий</h2></main></body>';

test('TOC renders a collapsible bar (toggle + panel + list) for small screens', () => {
  const dom = load(PAGE), P = ready(dom), d = dom.window.document, box = d.querySelector('[data-toc]');
  const b = box.querySelector('.psy-toc__toggle'), panel = box.querySelector('.psy-toc__panel');
  assert.ok(b && panel, 'toggle and panel exist');
  assert.equal(panel.querySelectorAll('li a').length, 3);
  assert.equal(b.getAttribute('aria-expanded'), 'false');
  assert.equal(b.getAttribute('aria-controls'), panel.id);
  assert.equal(b.querySelector('.psy-toc__label').textContent, 'Содержание', 'caption comes from aria-label');
  assert.equal(b.querySelector('.psy-toc__current').textContent, 'Первый');
  b.click();
  assert.ok(box.classList.contains('is-open'));
  assert.equal(b.getAttribute('aria-expanded'), 'true');
  panel.querySelector('a').click();
  assert.ok(!box.classList.contains('is-open'), 'tapping a link closes the sheet');
  b.click();
  d.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.ok(!box.classList.contains('is-open'), 'Escape closes the sheet');
  assert.ok(P.TOC);
});

test('TOC bar follows the active section and can be disabled with collapsible=false', () => {
  const dom = load(PAGE), P = ready(dom), d = dom.window.document, box = d.querySelector('[data-toc]');
  const link = box.querySelectorAll('li a')[1];
  link.dispatchEvent(new dom.window.CustomEvent('psy:spy:change', { bubbles: true, detail: { link } }));
  assert.equal(box.querySelector('.psy-toc__current').textContent, 'Второй');
  const dom2 = load(PAGE.replace('data-sticky', 'data-sticky data-toc-collapsible="false"')); ready(dom2);
  assert.equal(dom2.window.document.querySelector('.psy-toc__toggle'), null);
});

test('TOC refresh/destroy leave no stale state', () => {
  const dom = load(PAGE), P = ready(dom), box = dom.window.document.querySelector('[data-toc]');
  P.TOC.refresh(box);
  assert.equal(box.querySelectorAll('.psy-toc__toggle').length, 1);
  P.TOC.destroy(dom.window.document);
  assert.equal(box.children.length, 0);
});

test('CommandPalette accepts results() as a function (per-language plural forms)', () => {
  const dom = load('<!doctype html><body><nav data-command-source><a href="#a">Один</a><a href="#b">Два</a></nav></body>'), P = ready(dom);
  P.configure('command', { results: n => n + ' результата', empty: 'Ничего' });
  P.CommandPalette.open();
  const live = dom.window.document.querySelector('.psy-cmd [aria-live], dialog [aria-live]') || [...dom.window.document.querySelectorAll('[aria-live]')].pop();
  assert.match(live.textContent, /результата/);
});

test('CommandPalette keeps each group together when commands come from several sources', () => {
  const dom = load('<!doctype html><body></body>'), P = ready(dom);
  P.CommandPalette.register([{ id: 'a', title: 'A', group: 'G1', run() {} }, { id: 'b', title: 'B', group: 'G2', run() {} }]);
  P.CommandPalette.register([{ id: 'c', title: 'C', group: 'G1', run() {} }]);
  P.CommandPalette.open();
  const heads = [...dom.window.document.querySelectorAll('.psy-cmd__group')].map(x => x.textContent);
  assert.deepEqual(heads, ['G1', 'G2']);
});
