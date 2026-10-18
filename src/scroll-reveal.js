/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
P.Reveal={init:function(r){var els=(r||document).querySelectorAll('[data-reveal]:not(.is-visible)');
if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(function(e){e.classList.add('is-visible')});return}
var io=new IntersectionObserver(function(l){l.forEach(function(x){if(x.isIntersecting){var e=x.target;e.style.transitionDelay=(e.dataset.revealDelay||0)+'ms';e.classList.add('is-visible');io.unobserve(e)}})},{threshold:.12,rootMargin:'0px 0px -5% 0px'});
els.forEach(function(e){io.observe(e)});}};
document.addEventListener('DOMContentLoaded',function(){document.documentElement.classList.add('js');P.Reveal.init()});})();
