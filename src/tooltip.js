/*! Tooltip v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.Tooltip=f();})(this,function(){

return function Tooltip(sel){var tip=document.createElement("div");tip.setAttribute("role","tooltip");tip.id="tip"+Math.random().toString(36).slice(2,7);tip.hidden=true;
tip.style.cssText="position:fixed;z-index:100;padding:4px 8px;border-radius:6px;background:#222;color:#fff;font-size:13px;pointer-events:none";document.body.appendChild(tip);
function show(e){var r=e.getBoundingClientRect();tip.textContent=e.getAttribute("data-tip");tip.hidden=false;e.setAttribute("aria-describedby",tip.id);
tip.style.left=Math.max(4,r.left+r.width/2-tip.offsetWidth/2)+"px";tip.style.top=Math.max(4,r.top-tip.offsetHeight-6)+"px";}
function hide(){tip.hidden=true;}
document.querySelectorAll(sel).forEach(function(e){e.addEventListener("mouseenter",function(){show(e);});e.addEventListener("focus",function(){show(e);});e.addEventListener("mouseleave",hide);e.addEventListener("blur",hide);});};
});
