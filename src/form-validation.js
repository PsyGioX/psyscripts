/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function () {
  var P = window.PsyScripts = window.PsyScripts || {};
  var DEF = {
    validateOn: 'blur', liveAfterError: true, focusFirst: true, scrollToError: true, showValid: true,
    messages: {
      required: 'Required field', type: 'Invalid format', tooShort: 'Min length: {min}', tooLong: 'Max length: {max}',
      pattern: 'Invalid format', min: 'Minimum value: {min}', max: 'Maximum value: {max}', step: 'Invalid value',
      match: 'Values do not match', digits: 'Digits only', invalid: 'Invalid value'
    }
  };
  (P.q = P.q || []).push(['form', DEF]);
  function O(k, el) { return P.cfg ? P.cfg('form', k, DEF[k], el) : DEF[k]; }
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

  /* custom rules: fn(value, field, form) -> true | false | 'message' */
  var rules = {
    match: function (v, f) { var o = P.sel ? P.sel(f.dataset.match) : null; return !o || v === o.value; },
    digits: function (v) { return !v || /^\d+$/.test(v); }
  };

  var uid = 0;
  function fld(f) { return /^(INPUT|SELECT|TEXTAREA)$/.test(f.tagName) && !/^(submit|button|reset|image|hidden)$/.test(f.type); }
  function tpl(s, f) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      var v = k === 'min' && f.minLength > 0 ? f.minLength : k === 'max' && f.maxLength > 0 ? f.maxLength : f.getAttribute(k);
      return v != null ? v : m;
    });
  }
  function runRules(f, form) {
    f.setCustomValidity('');
    var names = (f.dataset.rule || '').split(/\s+/).filter(Boolean);
    if (f.dataset.match && names.indexOf('match') < 0) names.push('match');
    for (var i = 0; i < names.length; i++) {
      var fn = rules[names[i]];
      if (!fn) continue;
      var r = fn(f.value, f, form);
      if (r === true || r === undefined) continue;
      var m = f.dataset['msg' + names[i].charAt(0).toUpperCase() + names[i].slice(1)] || (typeof r === 'string' ? r : O('messages', form)[names[i]]) || O('messages', form).invalid;
      f.setCustomValidity(tpl(m, f));
      return;
    }
  }
  function message(f, form) {
    var v = f.validity, d = f.dataset, M = O('messages', form), k;
    if (v.valueMissing) k = 'required';
    else if (v.typeMismatch) k = 'type';
    else if (v.tooShort) k = 'tooShort';
    else if (v.tooLong) k = 'tooLong';
    else if (v.patternMismatch) k = 'pattern';
    else if (v.rangeUnderflow) k = 'min';
    else if (v.rangeOverflow) k = 'max';
    else if (v.stepMismatch) k = 'step';
    else return f.validationMessage;
    var legacy = { required: 'msgRequired', type: 'msgType', tooShort: 'msgMin', tooLong: 'msgMax', pattern: 'msgPattern', min: 'msgMin', max: 'msgMax' }[k];
    return tpl((legacy && d[legacy]) || M[k], f);
  }
  function slot(f) {
    var box = f.closest('[data-field]'), n = f.nextElementSibling;
    var er = box ? box.querySelector('[data-error]') : (n && n.hasAttribute('data-error') ? n : null);
    if (!er) {
      er = document.createElement('small');
      er.setAttribute('data-error', '');
      er.id = 'e-' + (f.name || 'f' + (++uid)).replace(/[^\w-]/g, '_') + '-' + (++uid);
      box ? box.appendChild(er) : f.parentNode.insertBefore(er, f.nextSibling);
    }
    return er;
  }
  function check(f) {
    var form = f.form, box = f.closest('[data-field]'), er = slot(f);
    runRules(f, form);
    var ok = f.checkValidity();
    if (ok && !O('showValid', form)) f.removeAttribute('aria-invalid'); else f.setAttribute('aria-invalid', !ok);
    f.setAttribute('aria-describedby', er.id);
    er.textContent = ok ? '' : message(f, form);
    (box || f).classList.toggle('has-error', !ok);
    return ok;
  }
  function validate(form, opt) {
    var bad = [].filter.call(form.elements, function (f) { return fld(f) && f.willValidate && !check(f); });
    if (bad[0]) {
      if (!opt || opt.focus !== false) {
        if (O('focusFirst', form)) bad[0].focus({ preventScroll: true });
        if (O('scrollToError', form)) bad[0].scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' });
      }
      E('form:invalid', { form: form, fields: bad }, form);
    }
    return !bad.length;
  }
  function serialize(form) {
    var o = {};
    new FormData(form).forEach(function (v, k) { o[k] = k in o ? [].concat(o[k], v) : v; });
    return o;
  }

  function bind(form) {
    if (form._v) return;
    form._v = 1;
    form.noValidate = true;
    /* reserve the error slots up front so showing an error never shifts the layout (and eats clicks) */
    [].forEach.call(form.elements, function (f) { if (fld(f)) slot(f); });
    var mode = O('validateOn', form);
    function submit(e) {
      if (!validate(form)) { e.preventDefault(); return; }
      if (form.hasAttribute('data-ajax')) {
        e.preventDefault();
        E('valid', { form: form, data: serialize(form) }, form);
      }
    }
    function blur(e) { if (mode === 'blur' && fld(e.target) && e.target.willValidate) check(e.target); }
    function input(e) {
      if (!fld(e.target)) return;
      var live = mode === 'input' || (O('liveAfterError', form) && e.target.getAttribute('aria-invalid') === 'true');
      if (live) check(e.target);
    }
    form.addEventListener('submit', submit);
    form.addEventListener('blur', blur, true);
    form.addEventListener('input', input);
    form._vo = function () {
      form.removeEventListener('submit', submit);
      form.removeEventListener('blur', blur, true);
      form.removeEventListener('input', input);
      form._v = 0;
    };
  }

  P.Form = {
    rules: rules,
    addRule: function (name, fn, msg) {
      rules[name] = fn;
      if (msg && P.configure) { var m = {}; m[name] = msg; P.configure('form', { messages: m }); }
      else if (msg) DEF.messages[name] = msg;
    },
    validate: validate,
    check: check,
    serialize: serialize,
    reset: function (form) {
      [].forEach.call(form.elements, function (f) {
        if (!fld(f)) return;
        f.setCustomValidity('');
        f.removeAttribute('aria-invalid');
        var box = f.closest('[data-field]');
        (box || f).classList.remove('has-error');
        var er = box ? box.querySelector('[data-error]') : null;
        if (er) er.textContent = '';
      });
      form.reset();
    },
    init: function (r) { all(r, 'form[data-validate]').forEach(bind); },
    destroy: function (r) { all(r, 'form[data-validate]').forEach(function (f) { f._vo && f._vo(); }); }
  };
  document.addEventListener('DOMContentLoaded', function () { P.Form.init(); });
})();
