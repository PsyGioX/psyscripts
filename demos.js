/*! demos.js | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
(function(){
var svg=function(c){return 'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><rect width="160" height="100" fill="'+c+'"/></svg>');};
var D=[
{id:'slider',html:'<div id="d-slider" class="sl"><div data-track class="tr"><div>1</div><div>2</div><div>3</div></div><button data-prev>‹</button> <button data-next>›</button></div>',init:function(){Slider('#d-slider',{autoplay:4000});}},
{id:'gallery',html:['#e55','#4a9','#58f'].map(function(c){return '<img class="g" alt="" src="'+svg(c)+'">';}).join(' '),init:function(){Gallery('.g');}},
{id:'search',html:'<input id="s-in" type="search" placeholder="Search…"><ul id="s-ul"><li>Apple</li><li>Banana</li><li>Cherry</li></ul>',init:function(){NativeSearch('#s-in','#s-ul li');}},
{id:'footer',html:'<div id="d-foot">© <span data-year></span> PsyGioX <button data-top>↑</button></div>',init:function(){FooterBlock('#d-foot');}},
{id:'accordion',html:'<div id="d-acc"><button data-acc>A</button><p>Lorem ipsum.</p><button data-acc>B</button><p>Dolor sit amet.</p></div>',init:function(){Accordion('#d-acc',{single:true});}},
{id:'modal',html:'<button data-modal-open="#d-modal" data-i18n="demo.open"></button><dialog id="d-modal"><p>Modal</p><button data-modal-close>OK</button></dialog>',init:function(){Modal('#d-modal');}},
{id:'toast',html:'<button id="d-toast" data-i18n="demo.toast"></button>',init:function(){document.getElementById('d-toast').onclick=function(){Toast(document.documentElement.lang==='ru'?'Готово!':'Done!',{type:'success'});};}},
{id:'lazy',html:'<img class="lz" width="160" height="100" alt="" data-src="'+svg('#fa4')+'">',init:function(){LazyLoad('.lz');}},
{id:'countdown',html:'<strong id="d-cd"></strong>',init:function(){Countdown('#d-cd',Date.now()+90061000);}},
{id:'tooltip',html:'<button data-tip="Tooltip" class="tp">Hover / Focus</button>',init:function(){Tooltip('.tp');}},
{id:'validator',html:'<form id="d-form"><input name="email" type="email" required placeholder="email"> <button data-i18n="demo.send"></button><div data-error-for="email" style="color:#d33"></div></form>',init:function(){FormValidator('#d-form',{onSubmit:function(){Toast('OK',{type:'success'});}});}},
{id:'spy',html:'<code>ScrollSpy("header nav a")</code>',init:function(){ScrollSpy('header nav a');}},
{id:'utils',html:'<input id="u-in" placeholder="debounce 400ms"> <code id="u-out"></code>',init:function(){var o=document.getElementById('u-out');document.getElementById('u-in').oninput=Utils.debounce(function(e){o.textContent=e.target.value;},400);}},
{id:'storage',html:'<button id="st-b">TTL 10s</button> <code id="st-o"></code>',init:function(){var s=SafeStorage('demo'),o=document.getElementById('st-o');function r(){o.textContent=s.get('t','—');}document.getElementById('st-b').onclick=function(){s.set('t',new Date().toLocaleTimeString(),10000);r();setTimeout(r,10100);};r();}},
{id:'cookie',html:'<button id="ck-b" data-i18n="demo.open"></button>',init:function(){document.getElementById('ck-b').onclick=function(){var ru=document.documentElement.lang==='ru';CookieConsent({key:'demo-cookie',text:ru?'Мы используем cookie.':'We use cookies.',accept:ru?'Принять':'Accept',decline:ru?'Отклонить':'Decline'}).show();};}},
{id:'autosize',html:'<textarea class="as" rows="1" style="width:100%" placeholder="Type…"></textarea>',init:function(){AutoSize('.as');}},
{id:'sorttable',html:'<table id="d-tbl"><thead><tr><th>Name</th><th>Qty</th></tr></thead><tbody><tr><td>Pear</td><td>12</td></tr><tr><td>Apple</td><td>3</td></tr><tr><td>Plum</td><td>25</td></tr></tbody></table>',init:function(){SortTable('#d-tbl');}}
];
var host=document.getElementById('more');
D.forEach(function(d){var s=document.createElement('section');s.id='c-'+d.id;s.className='c';
s.innerHTML='<h2 data-i18n="'+d.id+'.title"></h2><p class="d" data-i18n="'+d.id+'.desc"></p><div>'+d.html+'</div>';host.appendChild(s);});
D.forEach(function(d){d.init();});
})();
