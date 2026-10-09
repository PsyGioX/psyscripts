/*! Utils v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.Utils=f();})(this,function(){

return{
debounce:function(fn,ms){var t;return function(){var a=arguments,c=this;clearTimeout(t);t=setTimeout(function(){fn.apply(c,a);},ms||200);};},
throttle:function(fn,ms){var l=0;return function(){var n=Date.now();if(n-l>=(ms||200)){l=n;fn.apply(this,arguments);}};},
once:function(fn){var d=0,v;return function(){if(!d){d=1;v=fn.apply(this,arguments);}return v;};},
ready:function(fn){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fn):fn();}};
});
