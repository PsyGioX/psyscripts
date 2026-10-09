/*! CopyButton.js v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=='undefined'&&module.exports?module.exports=f():r.CopyButton=f();})(this,function(){
  function copy(text){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
    return new Promise(function(ok,fail){var a=document.createElement('textarea');a.value=text;a.style.position='fixed';a.style.opacity='0';
      document.body.appendChild(a);a.select();try{document.execCommand('copy')?ok():fail();}catch(e){fail(e);}a.remove();});
  }
  return function CopyButton(sel,o){
    o=o||{};var list=[].slice.call(document.querySelectorAll(sel));
    list.forEach(function(b){b.addEventListener('click',function(){
      var tg=b.getAttribute('data-copy-target'),n=tg&&document.querySelector(tg),
        text=b.getAttribute('data-copy')||(n?n.value||n.textContent:'');
      copy(text).then(function(){b.setAttribute('data-copied','');setTimeout(function(){b.removeAttribute('data-copied');},o.delay||1500);if(o.onCopy)o.onCopy(text);},
        function(e){if(o.onError)o.onError(e);});
    });});
    return{copy:copy};
  };
});
