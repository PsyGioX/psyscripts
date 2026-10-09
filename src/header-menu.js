/*! HeaderMenu.js v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=='undefined'&&module.exports?module.exports=f():r.HeaderMenu=f();})(this,function(){
  return function HeaderMenu(root,o){
    o=o||{};var el=typeof root==='string'?document.querySelector(root):root;if(!el)return null;
    var t=el.querySelector('[data-menu-toggle]');if(!t)return null;
    function set(v){el.toggleAttribute('data-open',v);t.setAttribute('aria-expanded',v);if(o.onToggle)o.onToggle(v);}
    t.setAttribute('aria-expanded','false');
    t.addEventListener('click',function(){set(!el.hasAttribute('data-open'));});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&el.hasAttribute('data-open')){set(false);t.focus();}});
    document.addEventListener('click',function(e){if(!el.contains(e.target))set(false);});
    el.addEventListener('click',function(e){if(e.target.closest('a'))set(false);});
    return{open:function(){set(true);},close:function(){set(false);},toggle:function(){set(!el.hasAttribute('data-open'));}};
  };
});
