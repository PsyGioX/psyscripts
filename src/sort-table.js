/*! SortTable v1.0.0 | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(r,f){typeof module!=="undefined"&&module.exports?module.exports=f():r.SortTable=f();})(this,function(){

return function SortTable(sel){var t=typeof sel==="string"?document.querySelector(sel):sel;if(!t)return null;var ths=[].slice.call(t.querySelectorAll("thead th"));
function val(r,i){var s=r.cells[i].textContent.trim(),n=parseFloat(s.replace(",","."));return isNaN(n)?s.toLowerCase():n;}
ths.forEach(function(th,i){th.style.cursor="pointer";th.tabIndex=0;function go(){var asc=th.getAttribute("aria-sort")!=="ascending",b=t.tBodies[0],rows=[].slice.call(b.rows);
rows.sort(function(x,y){var a=val(x,i),c=val(y,i);return(a>c?1:a<c?-1:0)*(asc?1:-1);}).forEach(function(r){b.appendChild(r);});
ths.forEach(function(h){h.removeAttribute("aria-sort");});th.setAttribute("aria-sort",asc?"ascending":"descending");}
th.addEventListener("click",go);th.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();go();}});});};
});
