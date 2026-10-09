/*! AutoSize v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.AutoSize=f();})(this,function(){

return function AutoSize(sel){var l=[].slice.call(document.querySelectorAll(sel));
function fit(t){t.style.height="auto";t.style.height=t.scrollHeight+"px";}
l.forEach(function(t){t.style.overflow="hidden";t.style.resize="none";t.addEventListener("input",function(){fit(t);});fit(t);});
return{update:function(){l.forEach(fit);}};};
});
