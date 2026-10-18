/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
function copy(t){if(navigator.clipboard&&isSecureContext)return navigator.clipboard.writeText(t);
return new Promise(function(ok,no){var a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();
try{document.execCommand('copy')?ok():no()}catch(e){no(e)}a.remove();});}
P.copy=copy;
document.addEventListener('click',function(e){var b=e.target.closest('[data-copy],[data-copy-target]');if(!b)return;
var el=b.dataset.copyTarget&&document.querySelector(b.dataset.copyTarget),t=el?(el.value||el.textContent):b.dataset.copy;
copy(t.trim()).then(function(){var o=b._o||(b._o=b.textContent);b.textContent=b.dataset.copied||'✓';b.classList.add('is-copied');
clearTimeout(b._t);b._t=setTimeout(function(){b.textContent=o;b.classList.remove('is-copied')},1600);
P.Toast&&b.hasAttribute('data-copy-toast')&&P.Toast.show(b.dataset.copyToast||'Copied');});});})();
