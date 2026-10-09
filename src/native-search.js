/*! NativeSearch v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.NativeSearch=f();})(this,function(){

return function NativeSearch(input,items,o){o=o||{};var inp=document.querySelector(input),list=[].slice.call(document.querySelectorAll(items));
function run(){var v=inp.value.trim().toLowerCase(),c=0;list.forEach(function(e){var ok=!v||e.textContent.toLowerCase().indexOf(v)>-1;e.hidden=!ok;if(ok)c++;});if(o.onResult)o.onResult(c,v);}
inp.addEventListener("input",run);return{run:run};};
});
