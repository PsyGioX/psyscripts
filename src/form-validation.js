/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
function msg(f){var v=f.validity,d=f.dataset;return v.valueMissing?(d.msgRequired||'Required field'):v.typeMismatch?(d.msgType||'Invalid format'):v.tooShort?(d.msgMin||'Min length: '+f.minLength):v.patternMismatch?(d.msgPattern||'Invalid format'):f.validationMessage}
function check(f){var box=f.closest('[data-field]')||f.parentNode,er=box.querySelector('[data-error]');
if(!er){er=document.createElement('small');er.setAttribute('data-error','');er.id='e-'+(f.name||Math.random().toString(36).slice(2));box.appendChild(er)}
var ok=f.checkValidity();f.setAttribute('aria-invalid',!ok);f.setAttribute('aria-describedby',er.id);er.textContent=ok?'':msg(f);box.classList.toggle('has-error',!ok);return ok}
P.Form={validate:function(form){var bad=[].filter.call(form.elements,function(f){return f.willValidate&&!check(f)});bad[0]&&bad[0].focus();return !bad.length}};
document.addEventListener('DOMContentLoaded',function(){document.querySelectorAll('form[data-validate]').forEach(function(form){form.noValidate=true;
form.addEventListener('submit',function(e){if(!P.Form.validate(form))e.preventDefault();else if(form.hasAttribute('data-ajax')){e.preventDefault();form.dispatchEvent(new CustomEvent('psy:valid',{bubbles:true}))}});
form.addEventListener('blur',function(e){e.target.willValidate&&check(e.target)},true);
form.addEventListener('input',function(e){e.target.getAttribute('aria-invalid')==='true'&&check(e.target)});})});})();
