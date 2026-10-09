/*! Slider v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.Slider=f();})(this,function(){
function q(x){return typeof x==="string"?document.querySelector(x):x;}
return function Slider(root,o){o=o||{};var el=q(root);if(!el)return null;var tr=el.querySelector("[data-track]"),n=tr.children.length,i=0,t,x0;
function go(k){i=(k+n)%n;tr.style.transform="translateX(-"+i*100+"%)";if(o.onChange)o.onChange(i);}
function play(){stop();if(o.autoplay)t=setInterval(function(){go(i+1);},o.autoplay);}function stop(){clearInterval(t);}
var p=el.querySelector("[data-prev]"),nx=el.querySelector("[data-next]");
if(p)p.onclick=function(){go(i-1);};if(nx)nx.onclick=function(){go(i+1);};
el.tabIndex=0;el.addEventListener("keydown",function(e){if(e.key==="ArrowLeft")go(i-1);if(e.key==="ArrowRight")go(i+1);});
el.addEventListener("pointerdown",function(e){x0=e.clientX;});el.addEventListener("pointerup",function(e){var d=e.clientX-x0;if(Math.abs(d)>40)go(i+(d<0?1:-1));});
el.addEventListener("mouseenter",stop);el.addEventListener("mouseleave",play);play();
return{go:go,next:function(){go(i+1);},prev:function(){go(i-1);},stop:stop};};
});
