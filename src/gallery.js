/*! Gallery v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.Gallery=f();})(this,function(){

return function Gallery(sel){var im=[].slice.call(document.querySelectorAll(sel)),i=0,ov;
function show(k){i=(k+im.length)%im.length;ov.firstChild.src=im[i].getAttribute("data-full")||im[i].src;ov.firstChild.alt=im[i].alt;}
function close(){if(ov){ov.remove();ov=null;document.removeEventListener("keydown",key);}}
function key(e){if(e.key==="Escape")close();if(e.key==="ArrowRight")show(i+1);if(e.key==="ArrowLeft")show(i-1);}
function open(k){ov=document.createElement("div");ov.setAttribute("role","dialog");ov.setAttribute("aria-modal","true");
ov.style.cssText="position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.85);display:grid;place-items:center";
ov.innerHTML="<img style=\"max-width:90vw;max-height:90vh;border-radius:8px\">";ov.onclick=close;document.body.appendChild(ov);document.addEventListener("keydown",key);show(k);}
im.forEach(function(e,k){e.style.cursor="zoom-in";e.addEventListener("click",function(){open(k);});});
return{open:open,close:close};};
});
