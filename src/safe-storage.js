/*! SafeStorage v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.SafeStorage=f();})(this,function(){

return function SafeStorage(prefix){prefix=(prefix||"app")+":";var mem={};
function raw(k,v){try{if(v===undefined)return localStorage.getItem(prefix+k);if(v===null)localStorage.removeItem(prefix+k);else localStorage.setItem(prefix+k,v);}catch(e){if(v===undefined)return mem[k]||null;if(v===null)delete mem[k];else mem[k]=v;}}
return{set:function(k,v,ttl){raw(k,JSON.stringify({v:v,e:ttl?Date.now()+ttl:0}));},
get:function(k,d){var s=raw(k);if(!s)return d;try{var o=JSON.parse(s);if(o.e&&o.e<Date.now()){raw(k,null);return d;}return o.v;}catch(e){return d;}},
remove:function(k){raw(k,null);}};};
});
