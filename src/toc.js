/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */
(function(){var P=window.PsyScripts=window.PsyScripts||{};
function slug(t,u){var s=t.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')||'section',b=s,n=1;while(u[s])s=b+'-'+(++n);u[s]=1;return s}
P.TOC={init:function(){document.querySelectorAll('[data-toc]').forEach(function(box){if(box._t)return;box._t=1;
var src=document.querySelector(box.dataset.tocSource||'main'),hs=src?src.querySelectorAll(box.dataset.tocLevels||'h2,h3'):[],used={},ul=document.createElement('ul');
[].forEach.call(document.querySelectorAll('[id]'),function(e){used[e.id]=1});
[].forEach.call(hs,function(h){if(!h.id)h.id=slug(h.textContent,used);var li=document.createElement('li'),a=document.createElement('a');li.className='toc-'+h.tagName.toLowerCase();a.href='#'+h.id;a.textContent=h.textContent;li.appendChild(a);ul.appendChild(li)});
box.appendChild(ul);box.setAttribute('data-spy','');P.Spy&&P.Spy.init();});}};
document.addEventListener('DOMContentLoaded',P.TOC.init);})();
