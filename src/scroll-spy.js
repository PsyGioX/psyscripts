/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
P.Spy={init:function(){document.querySelectorAll('[data-spy]').forEach(function(nav){if(nav._s)return;nav._s=1;
var links=[].slice.call(nav.querySelectorAll('a[href^="#"]')),map={};links.forEach(function(a){var s=document.getElementById(a.hash.slice(1));s&&(map[s.id]=a)});
var secs=Object.keys(map).map(function(k){return document.getElementById(k)});if(!secs.length||!('IntersectionObserver' in window))return;
var io=new IntersectionObserver(function(l){l.forEach(function(x){if(x.isIntersecting){links.forEach(function(a){a.classList.remove('is-active');a.removeAttribute('aria-current')});var a=map[x.target.id];a.classList.add('is-active');a.setAttribute('aria-current','true')}})},{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(function(s){io.observe(s)});});}};
document.addEventListener('DOMContentLoaded',P.Spy.init);})();
