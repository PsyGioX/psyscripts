/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{},els=[],tk;
function upd(){tk=0;var h=innerHeight;els.forEach(function(e){var r=e.getBoundingClientRect();if(r.bottom<0||r.top>h)return;
var k=parseFloat(e.dataset.parallax)||.2,off=(r.top+r.height/2-h/2)*k;e.style.transform='translate3d(0,'+(-off).toFixed(1)+'px,0)'})}
P.Parallax={init:function(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;els=[].slice.call(document.querySelectorAll('[data-parallax]'));
if(!els.length)return;els.forEach(function(e){e.style.willChange='transform'});upd()}};
function req(){tk||(tk=requestAnimationFrame(upd))}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);
document.addEventListener('DOMContentLoaded',P.Parallax.init);})();
