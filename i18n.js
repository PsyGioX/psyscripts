/*! i18n.js v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(){
  var langs=['ru','en'],cache={};
  function pick(){var s;try{s=localStorage.getItem('lang');}catch(e){}
    s=s||(navigator.language||'en').slice(0,2);return langs.indexOf(s)>-1?s:'en';}
  async function set(l){
    if(!cache[l])cache[l]=await (await fetch('locales/'+l+'.json')).json();
    var d=cache[l];document.documentElement.lang=l;
    document.querySelectorAll('[data-i18n]').forEach(function(n){var v=d[n.getAttribute('data-i18n')];if(v!=null)n.textContent=v;});
    document.title=d['meta.title'];
    document.querySelectorAll('[data-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-lang')===l);});
    try{localStorage.setItem('lang',l);}catch(e){}
  }
  window.I18n={set:set,init:function(){set(pick());}};
})();
