/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
function close(h){h.classList.remove('is-open');var b=h.querySelector('[data-menu-toggle]');b&&b.setAttribute('aria-expanded','false');}
P.HeaderMenu={close:close};
document.addEventListener('click',function(e){var b=e.target.closest('[data-menu-toggle]'),h=e.target.closest('[data-header]');
if(b&&h){var o=h.classList.toggle('is-open');b.setAttribute('aria-expanded',o);return}
if(h&&e.target.closest('[data-menu] a'))close(h);
if(!h)document.querySelectorAll('[data-header].is-open').forEach(close);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')document.querySelectorAll('[data-header].is-open').forEach(close)});
addEventListener('resize',function(){if(innerWidth>860)document.querySelectorAll('[data-header].is-open').forEach(close)});})();
