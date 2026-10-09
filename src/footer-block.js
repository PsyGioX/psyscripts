/*! FooterBlock v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.FooterBlock=f();})(this,function(){

return function FooterBlock(root){var el=typeof root==="string"?document.querySelector(root):root;if(!el)return null;
[].forEach.call(el.querySelectorAll("[data-year]"),function(n){n.textContent=new Date().getFullYear();});
var b=el.querySelector("[data-top]");if(b)b.addEventListener("click",function(){window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});};
});
