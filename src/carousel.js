/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
P.Carousel={init:function(r){(r||document).querySelectorAll('[data-carousel]').forEach(function(c){if(c._c)return;c._c=1;
var tr=c.querySelector('[data-track]'),sl=[].slice.call(tr.children),dots=c.querySelector('[data-dots]'),i=0,tm;
tr.tabIndex=0;tr.setAttribute('role','region');
function go(n){i=(n+sl.length)%sl.length;tr.scrollTo({left:sl[i].offsetLeft-tr.offsetLeft,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}
function mark(){var n=0,m=1e9;sl.forEach(function(s,k){var d=Math.abs(s.offsetLeft-tr.offsetLeft-tr.scrollLeft);if(d<m){m=d;n=k}});i=n;
dots&&[].forEach.call(dots.children,function(b,k){b.setAttribute('aria-current',k===n)})}
if(dots){dots.innerHTML='';sl.forEach(function(_,k){var b=document.createElement('button');b.setAttribute('aria-label','Slide '+(k+1));b.onclick=function(){go(k)};dots.appendChild(b)})}
var p=c.querySelector('[data-prev]'),n=c.querySelector('[data-next]');p&&(p.onclick=function(){go(i-1)});n&&(n.onclick=function(){go(i+1)});
tr.addEventListener('scroll',function(){clearTimeout(tm);tm=setTimeout(mark,60)},{passive:true});
tr.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();go(i+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(i-1)}});
if(c.dataset.autoplay){var a=setInterval(function(){document.hidden||c.matches(':hover,:focus-within')||go(i+1)},+c.dataset.autoplay||4000)}
mark();});}};
document.addEventListener('DOMContentLoaded',function(){P.Carousel.init()});})();
