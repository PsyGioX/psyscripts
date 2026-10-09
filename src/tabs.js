/*! Tabs.js v2.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=='undefined'&&module.exports?module.exports=f():r.Tabs=f();})(this,function(){
  return function Tabs(root,o){
    o=o||{};var el=typeof root==='string'?document.querySelector(root):root;if(!el)return null;
    var A=o.activeClass||'active',nav=el.querySelector('[data-tab-nav]'),cur=null,
      btns=[].slice.call(el.querySelectorAll('[data-tab]')),
      panels=[].slice.call(el.querySelectorAll('[data-tab-panel]')),
      ids=btns.map(function(b){return b.getAttribute('data-tab');});
    if(nav)nav.setAttribute('role','tablist');
    function show(t,focus){
      var i=ids.indexOf(t);if(i<0)return;
      btns.forEach(function(b,j){var on=j===i;b.classList.toggle(A,on);b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;});
      panels.forEach(function(p){var on=p.getAttribute('data-tab-panel')===t;p.hidden=!on;p.classList.toggle(A,on);});
      cur=t;if(focus)btns[i].focus();
      if(o.hash)try{history.replaceState(null,'','#'+t);}catch(e){}
      if(o.onChange)o.onChange(t);
    }
    function step(d){show(ids[(ids.indexOf(cur)+d+ids.length)%ids.length],true);}
    btns.forEach(function(b){
      b.setAttribute('role','tab');
      b.addEventListener('click',function(){show(b.getAttribute('data-tab'));});
      b.addEventListener('keydown',function(e){
        var k=e.key;if(k==='ArrowRight'||k==='ArrowDown')step(1);
        else if(k==='ArrowLeft'||k==='ArrowUp')step(-1);
        else if(k==='Home')show(ids[0],true);else if(k==='End')show(ids[ids.length-1],true);else return;
        e.preventDefault();
      });
    });
    panels.forEach(function(p){p.setAttribute('role','tabpanel');});
    var h=o.hash&&location.hash.slice(1),a=el.querySelector('[data-tab].'+A);
    show(ids.indexOf(h)>-1?h:a?a.getAttribute('data-tab'):ids[0]);
    return{go:function(t){show(typeof t==='number'?ids[t]:t);},next:function(){step(1);},prev:function(){step(-1);},active:function(){return cur;}};
  };
});
