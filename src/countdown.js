/*! Countdown v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.Countdown=f();})(this,function(){

return function Countdown(el,date,o){o=o||{};var e=typeof el==="string"?document.querySelector(el):el,end=new Date(date).getTime(),t;
function p(n){return(n<10?"0":"")+n;}
function tick(){var s=Math.max(0,Math.floor((end-Date.now())/1000));e.textContent=Math.floor(s/86400)+(o.dayLabel||"d")+" "+p(Math.floor(s%86400/3600))+":"+p(Math.floor(s%3600/60))+":"+p(s%60);
if(!s){clearInterval(t);if(o.onEnd)o.onEnd();}}
tick();t=setInterval(tick,1000);return{stop:function(){clearInterval(t);}};};
});
