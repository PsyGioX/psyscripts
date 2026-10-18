/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
P.Tabs={init:function(r){(r||document).querySelectorAll('[data-tabs]').forEach(function(root){if(root._t)return;root._t=1;
var tabs=[].slice.call(root.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
function go(i,f){tabs.forEach(function(t,j){var on=i===j;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;panels[j].hidden=!on;});if(f)tabs[i].focus();}
tabs.forEach(function(t,i){t.setAttribute('role','tab');t.addEventListener('click',function(){go(i)});
t.addEventListener('keydown',function(e){var n=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;if(n===null)return;e.preventDefault();go((n+tabs.length)%tabs.length,1);});});
var s=tabs.findIndex(function(t){return t.getAttribute('aria-selected')==='true'});go(s<0?0:s);});}};
document.addEventListener('DOMContentLoaded',function(){P.Tabs.init()});})();
