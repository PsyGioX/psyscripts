/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
P.Modal={open:function(id){var d=document.getElementById(id);if(d&&!d.open){d.showModal?d.showModal():d.setAttribute('open','');document.documentElement.classList.add('no-scroll')}},
close:function(d){if(d.close)d.close();else d.removeAttribute('open');document.documentElement.classList.remove('no-scroll')}};
document.addEventListener('click',function(e){var o=e.target.closest('[data-modal-open]');if(o){P.Modal.open(o.dataset.modalOpen);return}
var c=e.target.closest('[data-modal-close]'),d=c?c.closest('dialog'):e.target.matches&&e.target.matches('dialog[data-modal]')?e.target:null;if(d)P.Modal.close(d)});
document.addEventListener('close',function(){document.documentElement.classList.remove('no-scroll')},true);})();
