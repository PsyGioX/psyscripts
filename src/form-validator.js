/*! FormValidator v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.FormValidator=f();})(this,function(){

return function FormValidator(form,o){o=o||{};var f=typeof form==="string"?document.querySelector(form):form;if(!f)return null;f.noValidate=true;
function check(i){var m=f.querySelector("[data-error-for=\""+i.name+"\"]"),ok=i.checkValidity();i.setAttribute("aria-invalid",!ok);if(m)m.textContent=ok?"":(o.messages&&o.messages[i.name])||i.validationMessage;return ok;}
f.addEventListener("input",function(e){if(e.target.name&&e.target.getAttribute("aria-invalid")==="true")check(e.target);});
f.addEventListener("submit",function(e){e.preventDefault();var ok=true;[].forEach.call(f.elements,function(i){if(i.name&&!check(i))ok=false;});if(ok&&o.onSubmit)o.onSubmit(Object.fromEntries(new FormData(f)));});
return{validate:function(){return[].every.call(f.elements,function(i){return!i.name||check(i);});}};};
});
