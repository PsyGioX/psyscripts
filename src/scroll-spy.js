/*! ScrollSpy v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.ScrollSpy=f();})(this,function(){

return function ScrollSpy(links,o){o=o||{};var a=[].slice.call(document.querySelectorAll(links)),cls=o.className||"active";
if(!("IntersectionObserver" in window))return null;
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting)a.forEach(function(l){var on=l.getAttribute("href")==="#"+x.target.id;l.classList.toggle(cls,on);if(on)l.setAttribute("aria-current","true");else l.removeAttribute("aria-current");});});},{rootMargin:"-40% 0px -55% 0px"});
a.forEach(function(l){var s=document.querySelector(l.getAttribute("href"));if(s)io.observe(s);});return{destroy:function(){io.disconnect();}};};
});
