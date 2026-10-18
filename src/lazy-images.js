/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
function load(i){if(i.dataset.srcset)i.srcset=i.dataset.srcset;if(i.dataset.src)i.src=i.dataset.src;i.addEventListener('load',function(){i.classList.add('is-loaded')},{once:1});}
P.Lazy={init:function(r){var l=(r||document).querySelectorAll('img[data-src],img[data-srcset]');
if(!('IntersectionObserver' in window)){l.forEach(load);return}
var io=new IntersectionObserver(function(a){a.forEach(function(x){if(x.isIntersecting){load(x.target);io.unobserve(x.target)}})},{rootMargin:'200px'});l.forEach(function(i){io.observe(i)});}};
document.addEventListener('DOMContentLoaded',function(){P.Lazy.init()});})();
