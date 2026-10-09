/*! Modal v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.Modal=f();})(this,function(){

return function Modal(sel){var d=document.querySelector(sel);if(!d)return null;
document.querySelectorAll("[data-modal-open=\""+sel+"\"]").forEach(function(b){b.addEventListener("click",open);});
d.querySelectorAll("[data-modal-close]").forEach(function(b){b.addEventListener("click",close);});
d.addEventListener("click",function(e){if(e.target===d)close();});
function open(){d.showModal();}function close(){d.close();}return{open:open,close:close};};
});
