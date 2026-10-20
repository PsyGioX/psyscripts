const test = require('node:test'), assert = require('node:assert/strict');
const { load, ready } = require('./helpers');
const eq = (a, b, m) => assert.equal(JSON.stringify(Array.from(a)), JSON.stringify(b), m);   // jsdom arrays live in another realm

const TABLE = '<input id="q"><table data-table data-table-search="#q" data-table-page-size="2"><thead><tr><th>Name</th><th data-sort-type="number">Size</th><th data-sort-type="date">When</th></tr></thead><tbody>' +
  '<tr><td>delta</td><td>10</td><td>2026-03-01</td></tr><tr><td>alpha</td><td>9</td><td>2026-01-01</td></tr><tr><td>charlie</td><td data-sort-value="100">1 KB</td><td>2026-02-01</td></tr><tr><td>bravo</td><td>2</td><td>2025-12-31</td></tr></tbody></table>';
const names = t => t.rows().filter(r => !r.hidden).map(r => r.cells[0].textContent);

test('DataTable: numeric/date/text sorting is stable and sets aria-sort', () => {
  const dom = load('<!doctype html><body>' + TABLE + '</body>'); const P = ready(dom), t = P.DataTable.get('table');
  t.sort(1, 'asc'); eq(t.rows().map(r => r.cells[0].textContent), ['bravo', 'alpha', 'delta', 'charlie']);   // 2, 9, 10, 100 (not "10" < "9")
  assert.equal(dom.window.document.querySelectorAll('th')[1].getAttribute('aria-sort'), 'ascending');
  t.sort(1, 'desc'); assert.equal(t.rows()[0].cells[0].textContent, 'charlie');
  t.sort(2, 'asc'); assert.equal(t.rows()[0].cells[0].textContent, 'bravo');
  t.sort(0, 'asc'); eq(t.rows().map(r => r.cells[0].textContent), ['alpha', 'bravo', 'charlie', 'delta']);
});
test('DataTable: search, pagination, info line and header buttons', () => {
  const dom = load('<!doctype html><body>' + TABLE + '</body>'); const w = dom.window, P = ready(dom), t = P.DataTable.get('table');
  assert.equal(t.pages(), 2); assert.equal(t.rows().filter(r => !r.hidden).length, 2);
  t.page(2); assert.equal(t.page(), 2);
  const q = w.document.getElementById('q'); q.value = 'AL'; q.dispatchEvent(new w.Event('input'));
  assert.equal(t.count(), 1); assert.equal(t.page(), 1);
  q.value = ''; q.dispatchEvent(new w.Event('input')); assert.equal(t.count(), 4);
  const btn = w.document.querySelector('th button.psy-dt__sort'); assert.ok(btn); btn.click();
  assert.equal(w.document.querySelector('th').getAttribute('aria-sort'), 'ascending'); btn.click();
  assert.equal(w.document.querySelector('th').getAttribute('aria-sort'), 'descending');
  assert.ok(w.document.querySelector('.psy-dt__info').textContent.length > 0);
});
test('DataTable: events and destroy', () => {
  const dom = load('<!doctype html><body>' + TABLE + '</body>'); const w = dom.window, P = ready(dom), t = P.DataTable.get('table'); let n = 0;
  w.document.addEventListener('psy:table:sort', () => n++); t.sort(0); assert.equal(n, 1);
  t.destroy(); assert.equal(w.document.querySelector('.psy-dt__pager'), null); assert.equal(w.document.querySelectorAll('th button').length, 0);
});

const LIST = '<ul data-sortable data-sortable-handle=".grip"><li data-id="a"><i class="grip"></i>A</li><li data-id="b"><i class="grip"></i>B</li><li data-id="c"><i class="grip"></i>C</li></ul>';
const key = (w, el, k) => el.dispatchEvent(new w.KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
test('Sortable: keyboard reorder (Space, arrows, Space), announcement, event, cancel with Escape', () => {
  const dom = load('<!doctype html><body>' + LIST + '</body>'); const w = dom.window, P = ready(dom), s = P.Sortable.get('ul');
  const g = () => [...w.document.querySelectorAll('li .grip')]; let end = null;
  w.document.addEventListener('psy:sortable:end', e => end = e.detail);
  assert.equal(g()[0].tabIndex, 0); assert.ok(g()[0].getAttribute('aria-roledescription'));
  const ga = g()[0];                                                     // the grip of item A keeps focus while A moves
  key(w, ga, ' '); assert.ok(w.document.querySelector('li.is-grabbed')); assert.match(w.document.querySelector('[role=status]').textContent, /A grabbed/);
  key(w, ga, 'ArrowDown'); key(w, ga, 'ArrowDown');
  eq(s.order(), ['b', 'c', 'a']); key(w, ga, ' ');
  eq(end.order, ['b', 'c', 'a']); assert.equal(end.from, 0); assert.equal(end.to, 2);
  const gb = g()[0]; key(w, gb, ' '); key(w, gb, 'ArrowDown'); key(w, gb, 'Escape'); eq(s.order(), ['b', 'c', 'a']);
  s.setOrder(['a', 'b', 'c']); eq(s.order(), ['a', 'b', 'c']); s.move(0, 2); eq(s.order(), ['b', 'c', 'a']);
});
test('Sortable: a handle is required when data-sortable-handle is set; disabled blocks keys', () => {
  const dom = load('<!doctype html><body><ul data-sortable data-sortable-disabled><li data-id="a">A</li><li data-id="b">B</li></ul></body>'); const w = dom.window, P = ready(dom);
  const li = w.document.querySelector('li'); key(w, li, ' '); key(w, li, 'ArrowDown'); eq(P.Sortable.get('ul').order(), ['a', 'b']);
});

const open = (w, P, q) => { P.CommandPalette.open(q); return w.document.querySelector('dialog.psy-cmd'); };
test('CommandPalette: register, rank, ARIA wiring, keyboard run, recent items, unregister', () => {
  const dom = load('<!doctype html><body><nav data-command-source><a href="#docs">Documentation</a><a href="javascript:alert(1)">Evil</a></nav><button data-command="Click me" id="cm">x</button></body>');
  const w = dom.window, P = ready(dom); let ran = [];
  const off = P.CommandPalette.register([{ id: 't', title: 'Toggle theme', keywords: 'dark light', run: () => ran.push('t') }, { id: 'l', title: 'Switch language', run: () => ran.push('l') }]);
  eq(P.CommandPalette.search('thm').map(c => c.id).slice(0, 1), ['t']);           // fuzzy subsequence
  assert.ok(P.CommandPalette.search('dark').some(c => c.id === 't'));                           // keywords
  assert.ok(!P.CommandPalette.list().some(c => /javascript/i.test(c.href || '')), 'unsafe link not offered');
  const d = open(w, P), inp = d.querySelector('input');
  assert.equal(inp.getAttribute('role'), 'combobox'); assert.equal(d.querySelector('[role=listbox]').getAttribute('id'), inp.getAttribute('aria-controls'));
  assert.ok(inp.getAttribute('aria-activedescendant'));
  inp.value = 'lang'; inp.dispatchEvent(new w.Event('input')); assert.equal(d.querySelectorAll('[role=option]').length, 1);
  key(w, inp, 'Enter'); eq(ran, ['l']); assert.ok(!d.open);
  eq(JSON.parse(w.localStorage.getItem('psy-cmd')), ['l']);
  const d2 = open(w, P); assert.equal(d2.querySelector('.psy-cmd__group').textContent, 'Recent');
  off(); assert.ok(!P.CommandPalette.list().some(c => c.id === 't'));
});
test('CommandPalette: Ctrl+K toggles; titles are rendered as text; empty state', () => {
  const dom = load(); const w = dom.window, P = ready(dom);
  P.CommandPalette.register({ id: 'x', title: '<img src=x onerror=alert(1)>' });
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true }));
  const d = w.document.querySelector('dialog.psy-cmd'); assert.ok(d && d.open); assert.equal(d.querySelector('img'), null);
  const inp = d.querySelector('input'); inp.value = 'zzzzqq'; inp.dispatchEvent(new w.Event('input')); assert.equal(d.querySelectorAll('[role=option]').length, 0); assert.ok(d.querySelector('.psy-cmd__none'));
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true, cancelable: true })); assert.ok(!d.open);
});

test('SafeHTML: declarative attribute, set(), text(), last() stats', () => {
  const dom = load('<!doctype html><body><div id="d" data-safe-html="&lt;b&gt;hi&lt;/b&gt;&lt;script&gt;1&lt;/script&gt;"></div><p id="p"></p></body>'); const w = dom.window, P = ready(dom);
  assert.equal(w.document.getElementById('d').innerHTML, '<b>hi</b>');
  P.Sanitize.set(w.document.getElementById('p'), '<i onclick=1>x</i>'); assert.equal(w.document.getElementById('p').innerHTML, '<i>x</i>');
  assert.equal(P.Sanitize.text('<a href="x">&</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  P.Sanitize.html('<script>1</script><b onclick=1>y</b>'); assert.equal(JSON.stringify(P.Sanitize.last()), JSON.stringify({ removed: 1, attributes: 1, unwrapped: 0 }));
});

test('smoke: every dist script loads after core, standalone, without errors', () => {
  const fs = require('fs'), path = require('path'), root = path.join(__dirname, '..', 'dist');
  const files = fs.readdirSync(root).filter(f => /\.min\.js$/.test(f) && !/bundle|auto|^core/.test(f));
  assert.equal(files.length, 31);
  for (const f of files) { const dom = load('<!doctype html><body></body>', { files: ['core.min.js', f] }); assert.doesNotThrow(() => ready(dom), f); }
  const keys = Object.keys(ready(load())); for (const k of ['CommandPalette', 'DataTable', 'Sortable', 'Sanitize', 'Tabs', 'Modal', 'Toast', 'I18n']) assert.ok(keys.includes(k), k);
  const m = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8')); assert.ok(m.files['core.min.js'].integrity.startsWith('sha384-'));
});
