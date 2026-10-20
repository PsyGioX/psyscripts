// jsdom harness: loads the built bundle into a fresh DOM
const fs = require('fs'), path = require('path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
exports.root = root;
exports.load = (html = '<!doctype html><body></body>', opts = {}) => {
  const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: opts.url || 'https://psyscripts.vercel.app/' });
  const w = dom.window;
  w.matchMedia = w.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
  w.IntersectionObserver = w.IntersectionObserver || class { observe() {} unobserve() {} disconnect() {} };
  w.ResizeObserver = w.ResizeObserver || class { observe() {} unobserve() {} disconnect() {} };
  w.fetch = w.fetch || (() => Promise.resolve({ ok: false, json: async () => ({}) }));
  Object.defineProperty(w, 'isSecureContext', { value: true, configurable: true });
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.HTMLDialogElement.prototype.showModal = w.HTMLDialogElement.prototype.showModal || function () { this.setAttribute('open', ''); };
  w.HTMLDialogElement.prototype.close = w.HTMLDialogElement.prototype.close || function () { this.removeAttribute('open'); this.dispatchEvent(new w.Event('close')); };
  for (const f of opts.files || ['psyscripts.bundle.min.js']) w.eval(fs.readFileSync(path.join(root, 'dist', f), 'utf8'));
  return dom;
};
exports.ready = dom => { dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded')); return dom.window.PsyScripts; };
