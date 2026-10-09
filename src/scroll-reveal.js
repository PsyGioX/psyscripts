/*! ScrollReveal.js v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=='undefined'&&module.exports?module.exports=f():r.ScrollReveal=f();})(this,function(){
  return function ScrollReveal(sel,o){
    o=o||{};var els=[].slice.call(document.querySelectorAll(sel)),cls=o.className||'is-visible';
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(function(e){e.classList.add(cls);});return{destroy:function(){}};}
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add(cls);if(o.once!==false)io.unobserve(x.target);}else if(o.once===false)x.target.classList.remove(cls);});},{threshold:o.threshold||0.15});
    els.forEach(function(e,i){e.style.transitionDelay=(o.stagger||0)*i+'ms';io.observe(e);});
    return{destroy:function(){io.disconnect();}};
  };
});
