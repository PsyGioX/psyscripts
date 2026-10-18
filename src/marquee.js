/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
P.Marquee={init:function(){document.querySelectorAll('[data-marquee]').forEach(function(m){if(m._m)return;m._m=1;
var t=document.createElement('div');t.className='psy-marquee__track';while(m.firstChild)t.appendChild(m.firstChild);
var g=t.cloneNode(true);g.setAttribute('aria-hidden','true');g.className='psy-marquee__track';
var w=document.createElement('div');w.className='psy-marquee__inner';w.style.animationDuration=(m.dataset.speed||30)+'s';
if(m.dataset.direction==='right')w.style.animationDirection='reverse';w.appendChild(t);w.appendChild(g);m.appendChild(w);});}};
document.addEventListener('DOMContentLoaded',P.Marquee.init);})();
