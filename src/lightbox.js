/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{},dlg,imgs=[],i=0,img,cap;
function build(){dlg=document.createElement('dialog');dlg.className='psy-lightbox';dlg.setAttribute('aria-label','Image viewer');
dlg.innerHTML='<button class="lb-x" aria-label="Close">×</button><button class="lb-p" aria-label="Prev">‹</button><img alt=""><button class="lb-n" aria-label="Next">›</button><p></p>';
img=dlg.querySelector('img');cap=dlg.querySelector('p');document.body.appendChild(dlg);
dlg.addEventListener('click',function(e){var c=e.target.className;if(c==='lb-p')go(i-1);else if(c==='lb-n')go(i+1);else if(c==='lb-x'||e.target===dlg)close()});
dlg.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')go(i-1);if(e.key==='ArrowRight')go(i+1)});
dlg.addEventListener('close',function(){document.documentElement.classList.remove('no-scroll')})}
function go(n){i=(n+imgs.length)%imgs.length;var s=imgs[i];img.src=s.dataset.full||s.currentSrc||s.src;img.alt=s.alt;cap.textContent=s.alt;dlg.classList.toggle('single',imgs.length<2)}
function close(){dlg.close?dlg.close():dlg.removeAttribute('open')}
P.Lightbox={open:function(list,n){dlg||build();imgs=list;go(n);dlg.showModal?dlg.showModal():dlg.setAttribute('open','');document.documentElement.classList.add('no-scroll')}};
document.addEventListener('click',function(e){var t=e.target;if(!t.matches||!t.matches('img'))return;var g=t.closest('[data-lightbox]');if(!g)return;
var list=g===t?[t]:[].slice.call(g.querySelectorAll('img'));P.Lightbox.open(list,list.indexOf(t))});
document.addEventListener('keydown',function(e){var t=e.target;if((e.key==='Enter')&&t.matches&&t.matches('[data-lightbox] img'))t.click()});})();
