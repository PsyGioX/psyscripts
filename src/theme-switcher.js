/*! ThemeSwitcher.js v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=='undefined'&&module.exports?module.exports=f():r.ThemeSwitcher=f();})(this,function(){
  return function ThemeSwitcher(btn,o){
    o=o||{};var key=o.storageKey||'theme',modes=['system','light','dark'],
      b=typeof btn==='string'?document.querySelector(btn):btn,
      mq=window.matchMedia('(prefers-color-scheme: dark)'),mode='system';
    try{mode=localStorage.getItem(key)||'system';}catch(e){}
    if(modes.indexOf(mode)<0)mode='system';
    function apply(){
      var dark=mode==='dark'||(mode==='system'&&mq.matches);
      document.documentElement.setAttribute('data-theme',dark?'dark':'light');
      document.documentElement.style.colorScheme=dark?'dark':'light';
      if(b){b.setAttribute('data-mode',mode);b.setAttribute('aria-label','Theme: '+mode);}
      if(o.onChange)o.onChange(mode,dark?'dark':'light');
    }
    function set(m){if(modes.indexOf(m)<0)return;mode=m;try{localStorage.setItem(key,m);}catch(e){}apply();}
    if(b)b.addEventListener('click',function(){set(modes[(modes.indexOf(mode)+1)%3]);});
    mq.addEventListener('change',function(){if(mode==='system')apply();});
    apply();
    return{set:set,get:function(){return mode;}};
  };
});
