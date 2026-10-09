/*! LazyLoad v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.LazyLoad=f();})(this,function(){

return function LazyLoad(sel,o){var l=[].slice.call(document.querySelectorAll(sel));function load(e){e.src=e.getAttribute("data-src");e.removeAttribute("data-src");}
if(!("IntersectionObserver" in window)){l.forEach(load);return;}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){load(x.target);io.unobserve(x.target);}});},{rootMargin:(o&&o.margin)||"200px"});l.forEach(function(e){io.observe(e);});return{destroy:function(){io.disconnect();}};};
});
