/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};P.BackToTop={};
function upd(){var y=scrollY>(+document.documentElement.dataset.backTopAt||400);document.querySelectorAll('[data-back-top]').forEach(function(b){b.classList.toggle('is-visible',y)})}
var tk;addEventListener('scroll',function(){tk||(tk=requestAnimationFrame(function(){tk=0;upd()}))},{passive:true});
document.addEventListener('click',function(e){if(e.target.closest('[data-back-top]'))scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
document.addEventListener('DOMContentLoaded',upd);})();
