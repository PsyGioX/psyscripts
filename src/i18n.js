/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{},H=document.documentElement,D=H.dataset,
L=(D.i18nLangs||'en').split(',').map(function(s){return s.trim()}),DEF=D.i18nDefault||L[0],
PATH=(D.i18nPath||'locales/{lang}.json').split(',').map(function(s){return s.trim()}),
RTL=/^(ar|he|fa|ur)\b/,cache={},dict={},fb={},cur=DEF;
function pick(c){if(!c)return;c=String(c).toLowerCase();for(var i=0;i<L.length;i++)if(L[i].toLowerCase()===c)return L[i];c=c.split('-')[0];for(i=0;i<L.length;i++)if(L[i].toLowerCase()===c)return L[i]}
function stored(){try{return localStorage.getItem('psy-lang')}catch(e){return null}}
function detect(){var q=new URLSearchParams(location.search).get('lang'),n=navigator.languages||[navigator.language],r=pick(q)||pick(stored());for(var i=0;!r&&i<n.length;i++)r=pick(n[i]);return r||pick(H.lang)||DEF}
function load(l){return cache[l]||(cache[l]=Promise.all(PATH.map(function(p){return fetch(p.replace('{lang}',l)).then(function(r){return r.ok?r.json():{}}).catch(function(){return {}})})).then(function(a){return Object.assign.apply(null,[{}].concat(a))}))}
function fmt(v){return typeof v==='number'?new Intl.NumberFormat(cur).format(v):v}
function tr(k,v){var s=k in dict?dict[k]:fb[k];if(s==null)return null;
if(typeof s==='object')s=s[new Intl.PluralRules(cur).select(+(v&&v.n)||0)]||s.other||'';
return String(s).replace(/\{(\w+)\}/g,function(m,x){return v&&v[x]!=null?fmt(v[x]):m})}
function vars(el){var v={};try{if(el.dataset.i18nVars)v=JSON.parse(el.dataset.i18nVars)}catch(e){}if(el.dataset.i18nCount!=null)v.n=+el.dataset.i18nCount;return v}
function apply(root){(root||document).querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-attr]').forEach(function(el){var v=vars(el),s;
if(el.dataset.i18n&&(s=tr(el.dataset.i18n,v))!=null)el.textContent=s;
if(el.dataset.i18nHtml&&(s=tr(el.dataset.i18nHtml,v))!=null)el.innerHTML=s;
if(el.dataset.i18nAttr)el.dataset.i18nAttr.split(';').forEach(function(p){var i=p.indexOf(':');if(i>0&&(s=tr(p.slice(i+1).trim(),v))!=null)el.setAttribute(p.slice(0,i).trim(),s)})})}
function mark(){document.querySelectorAll('[data-lang-set]').forEach(function(b){var on=b.dataset.langSet===cur;b.setAttribute('aria-pressed',on);b.classList.toggle('is-active',on)});
var nx=L[(L.indexOf(cur)+1)%L.length].toUpperCase();document.querySelectorAll('[data-lang-toggle]').forEach(function(b){b.textContent=nx})}
function set(l,save){l=pick(l)||DEF;return Promise.all([load(l),load(DEF)]).then(function(r){dict=r[0];fb=r[1];cur=l;H.lang=l;H.dir=RTL.test(l)?'rtl':'ltr';
if(save)try{localStorage.setItem('psy-lang',l)}catch(e){}apply();mark();document.dispatchEvent(new CustomEvent('psy:lang',{detail:{lang:l}}));return l})}
P.I18n={t:function(k,v){var s=tr(k,v);return s==null?k:s},setLang:function(l){return set(l,1)},toggle:function(){return set(L[(L.indexOf(cur)+1)%L.length],1)},apply:apply,langs:L,
number:function(n,o){return new Intl.NumberFormat(cur,o).format(n)},date:function(d,o){return new Intl.DateTimeFormat(cur,o).format(d)}};
Object.defineProperty(P.I18n,'lang',{get:function(){return cur}});
document.addEventListener('click',function(e){var b=e.target.closest('[data-lang-toggle],[data-lang-set]');if(!b)return;e.preventDefault();b.hasAttribute('data-lang-toggle')?P.I18n.toggle():P.I18n.setLang(b.dataset.langSet)});
document.addEventListener('DOMContentLoaded',function(){set(detect())});})();
