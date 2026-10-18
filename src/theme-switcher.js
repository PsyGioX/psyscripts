/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{},K='psy-theme',d=document.documentElement,m=matchMedia('(prefers-color-scheme: dark)');
function get(){try{return localStorage.getItem(K)}catch(e){return null}}
function set(t,save){d.setAttribute('data-theme',t);if(save)try{localStorage.setItem(K,t)}catch(e){}
document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.setAttribute('aria-pressed',t==='dark')});}
P.Theme={set:function(t){set(t,1)},toggle:function(){set(d.getAttribute('data-theme')==='dark'?'light':'dark',1)}};
set(get()||(m.matches?'dark':'light'));
m.addEventListener&&m.addEventListener('change',function(e){if(!get())set(e.matches?'dark':'light')});
document.addEventListener('click',function(e){if(e.target.closest('[data-theme-toggle]'))P.Theme.toggle()});})();
