/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{},box;
P.Toast={show:function(msg,o){o=o||{};if(!box){box=document.createElement('div');box.className='psy-toasts';box.setAttribute('role','status');box.setAttribute('aria-live','polite');document.body.appendChild(box)}
var t=document.createElement('div');t.className='psy-toast psy-toast--'+(o.type||'info');t.textContent=msg;box.appendChild(t);
requestAnimationFrame(function(){t.classList.add('is-in')});
function rm(){t.classList.remove('is-in');setTimeout(function(){t.remove()},250)}
t.addEventListener('click',rm);setTimeout(rm,o.duration||3000);return t}};
document.addEventListener('click',function(e){var b=e.target.closest('[data-toast]');if(b)P.Toast.show(b.dataset.toast,{type:b.dataset.toastType})});})();
