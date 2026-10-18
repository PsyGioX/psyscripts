/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
function closeAll(x){document.querySelectorAll('[data-dropdown].is-open').forEach(function(d){if(d!==x){d.classList.remove('is-open');d.querySelector('[data-dd-trigger]').setAttribute('aria-expanded','false')}})}
P.Dropdown={closeAll:closeAll};
document.addEventListener('click',function(e){var t=e.target.closest('[data-dd-trigger]'),d=e.target.closest('[data-dropdown]');closeAll(d);
if(t&&d){var o=d.classList.toggle('is-open');t.setAttribute('aria-expanded',o);if(o){var f=d.querySelector('[data-dd-menu] a,[data-dd-menu] button');f&&f.focus()}}
else if(d&&e.target.closest('[data-dd-menu] a,[data-dd-menu] button'))closeAll()});
document.addEventListener('keydown',function(e){var d=e.target.closest&&e.target.closest('[data-dropdown]');
if(e.key==='Escape'){var o=document.querySelector('[data-dropdown].is-open');if(o){var t=o.querySelector('[data-dd-trigger]');closeAll();t.focus()}}
if(d&&d.classList.contains('is-open')&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();var i=[].slice.call(d.querySelectorAll('[data-dd-menu] a,[data-dd-menu] button')),k=i.indexOf(document.activeElement);i[(k+(e.key==='ArrowDown'?1:-1)+i.length)%i.length].focus()}});})();
