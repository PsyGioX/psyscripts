/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
function done(el){el.classList.remove('is-loading');el.removeAttribute('aria-busy')}
P.Skeleton={done:done,init:function(r){(r||document).querySelectorAll('[data-skeleton]').forEach(function(el){el.classList.add('is-loading');el.setAttribute('aria-busy','true');
if(el.dataset.skeleton==='manual')return;var im=[].slice.call(el.querySelectorAll('img')),n=im.length;
if(!n){setTimeout(function(){done(el)},+el.dataset.delay||600);return}
function one(){--n<=0&&done(el)}im.forEach(function(i){i.complete&&i.naturalWidth?one():(i.addEventListener('load',one),i.addEventListener('error',one))})})}};
document.addEventListener('DOMContentLoaded',function(){P.Skeleton.init()});})();
