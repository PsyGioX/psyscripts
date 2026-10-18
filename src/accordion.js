/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
document.addEventListener('click',function(e){var t=e.target.closest('[data-acc-trigger]');if(!t)return;
var root=t.closest('[data-accordion]'),item=t.closest('[data-acc-item]'),open=!item.classList.contains('is-open');
if(root&&root.hasAttribute('data-single'))root.querySelectorAll('[data-acc-item].is-open').forEach(function(i){i.classList.remove('is-open');i.querySelector('[data-acc-trigger]').setAttribute('aria-expanded','false')});
item.classList.toggle('is-open',open);t.setAttribute('aria-expanded',open);});
P.Accordion={};})();
