/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{},K='psy-cookie';
function get(){try{return localStorage.getItem(K)}catch(e){return null}}
function set(v){try{localStorage.setItem(K,v)}catch(e){}document.dispatchEvent(new CustomEvent('psy:cookie',{detail:{consent:v}}))}
P.Cookie={get:get,reset:function(){try{localStorage.removeItem(K)}catch(e){}document.querySelectorAll('[data-cookie-banner]').forEach(function(b){b.hidden=false})}};
document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector('[data-cookie-banner]');if(!b)return;
if(get()){b.hidden=true;document.dispatchEvent(new CustomEvent('psy:cookie',{detail:{consent:get()}}));return}b.hidden=false});
document.addEventListener('click',function(e){var a=e.target.closest('[data-cookie-accept],[data-cookie-decline]');if(!a)return;
set(a.hasAttribute('data-cookie-accept')?'accepted':'declined');a.closest('[data-cookie-banner]').hidden=true});})();
