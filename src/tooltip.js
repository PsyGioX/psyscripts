/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{},tip,cur;P.Tooltip={};
function show(el){var t=el.dataset.tooltip;if(!t)return;if(!tip){tip=document.createElement('div');tip.className='psy-tooltip';tip.setAttribute('role','tooltip');document.body.appendChild(tip)}
cur=el;tip.textContent=t;tip.classList.add('is-in');var r=el.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight,x=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2)),y=r.top-h-8;if(y<8)y=r.bottom+8;
tip.style.left=x+'px';tip.style.top=y+'px';el.setAttribute('aria-describedby','psy-tip');tip.id='psy-tip'}
function hide(){tip&&tip.classList.remove('is-in');cur&&cur.removeAttribute('aria-describedby');cur=null}
['mouseover','focusin'].forEach(function(n){document.addEventListener(n,function(e){var el=e.target.closest&&e.target.closest('[data-tooltip]');el&&show(el)})});
['mouseout','focusout'].forEach(function(n){document.addEventListener(n,function(e){e.target.closest&&e.target.closest('[data-tooltip]')&&hide()})});
document.addEventListener('keydown',function(e){e.key==='Escape'&&hide()});addEventListener('scroll',hide,{passive:true});})();
