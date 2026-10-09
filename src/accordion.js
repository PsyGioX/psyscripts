/*! Accordion v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.Accordion=f();})(this,function(){

return function Accordion(root,o){o=o||{};var el=typeof root==="string"?document.querySelector(root):root;if(!el)return null;var bs=[].slice.call(el.querySelectorAll("[data-acc]"));
function set(b,v){b.setAttribute("aria-expanded",v);b.nextElementSibling.hidden=!v;}
bs.forEach(function(b){set(b,false);b.addEventListener("click",function(){var v=b.getAttribute("aria-expanded")!=="true";if(o.single)bs.forEach(function(x){set(x,false);});set(b,v);});});
return{open:function(i){set(bs[i],true);},closeAll:function(){bs.forEach(function(b){set(b,false);});}};};
});
