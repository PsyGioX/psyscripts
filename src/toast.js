/*! Toast v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.Toast=f();})(this,function(){

var box;return function Toast(msg,o){o=o||{};if(!box){box=document.createElement("div");box.setAttribute("aria-live","polite");
box.style.cssText="position:fixed;right:16px;bottom:16px;display:flex;flex-direction:column;gap:8px;z-index:100";document.body.appendChild(box);}
var t=document.createElement("div");t.textContent=msg;t.style.cssText="padding:10px 16px;border-radius:8px;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.25);background:"+({error:"#d33",success:"#2a8"}[o.type]||"#333");
box.appendChild(t);setTimeout(function(){t.remove();},o.duration||3000);return t;};
});
