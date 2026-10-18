/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
function run(el){var to=parseFloat(el.dataset.counter),from=parseFloat(el.dataset.counterFrom||0),dur=+el.dataset.duration||1600,dec=(el.dataset.counter.split('.')[1]||'').length,
f=new Intl.NumberFormat(document.documentElement.lang||undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec}),p=el.dataset.prefix||'',s=el.dataset.suffix||'',t0;
if(matchMedia('(prefers-reduced-motion: reduce)').matches){el.textContent=p+f.format(to)+s;return}
(function step(t){t0=t0||t;var k=Math.min((t-t0)/dur,1),e=1-Math.pow(1-k,3);el.textContent=p+f.format(from+(to-from)*e)+s;k<1&&requestAnimationFrame(step)})(performance.now());}
P.Counter={init:function(r){var els=(r||document).querySelectorAll('[data-counter]');
if(!('IntersectionObserver' in window)){els.forEach(run);return}
var io=new IntersectionObserver(function(a){a.forEach(function(x){if(x.isIntersecting){run(x.target);io.unobserve(x.target)}})},{threshold:.4});els.forEach(function(e){io.observe(e)})}};
document.addEventListener('DOMContentLoaded',function(){P.Counter.init()});})();
