/*! CookieConsent v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.CookieConsent=f();})(this,function(){

return function CookieConsent(o){o=Object.assign({key:"cookie-consent",text:"We use cookies.",accept:"Accept",decline:"Decline"},o||{});var box;
function get(){try{return localStorage.getItem(o.key);}catch(e){return null;}}
function save(v){try{localStorage.setItem(o.key,v);}catch(e){}if(box)box.remove();box=null;if(o.onChange)o.onChange(v==="yes");}
function show(force){if(box||(!force&&get()))return;box=document.createElement("div");box.setAttribute("role","dialog");box.setAttribute("aria-label",o.text);
box.style.cssText="position:fixed;left:16px;right:16px;bottom:16px;z-index:100;max-width:520px;padding:16px;border-radius:12px;background:#222;color:#fff;display:flex;gap:12px;align-items:center;flex-wrap:wrap";
var p=document.createElement("span");p.textContent=o.text;p.style.flex="1";box.appendChild(p);
[["accept","yes"],["decline","no"]].forEach(function(x){var b=document.createElement("button");b.textContent=o[x[0]];b.style.cssText="padding:6px 12px;border-radius:8px;border:0;cursor:pointer";b.onclick=function(){save(x[1]);};box.appendChild(b);});
document.body.appendChild(box);}
show();return{show:function(){show(true);},get:function(){var v=get();return v?v==="yes":null;},reset:function(){try{localStorage.removeItem(o.key);}catch(e){}show();}};};
});
