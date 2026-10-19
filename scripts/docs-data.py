# python3 scripts/docs-data.py → docs.html (RU static, EN via I18n) + locales/docs/{ru,en}.json
import html,json,os,re
ns={};exec(open('scripts/docs-content.py',encoding='utf-8').read(),ns);D,EN=ns['D'],ns['EN'];N=len(D)
e=html.escape
def plr(n,t):return '%d %s %s'%(n,'скрипт' if n%10==1 and n%100!=11 else 'скрипта' if 2<=n%10<=4 and not 12<=n%100<=14 else 'скриптов',t)
tr_,te_=' без зависимостей. Всё работает через data-атрибуты; JS API нужен только для особых случаев.',', zero dependencies. Everything works through data attributes; the JS API is only for special cases.'
R={'docs.title':'PsyScripts — Документация','docs.meta':'Документация по всем скриптам PsyScripts: атрибуты, примеры и JS API.','docs.h1':'Документация',
'docs.intro':{'one':'{n} скрипт'+tr_,'few':'{n} скрипта'+tr_,'many':'{n} скриптов'+tr_,'other':'{n} скриптов'+tr_},
'docs.install.h':'Подключение','docs.install.p':'Всё одним файлом или по отдельности (<code>dist/&lt;name&gt;.min.js</code>). Tabs требует <code>tabs.min.css</code>.','docs.th.attr':'Атрибут','docs.th.desc':'Описание','docs.js':'JS:','docs.contents':'Содержание','docs.copy':'Копировать'}
EL={'docs.title':'PsyScripts — Documentation','docs.meta':'Documentation for all PsyScripts: attributes, examples and JS API.','docs.h1':'Documentation',
'docs.intro':{'one':'{n} script'+te_,'other':'{n} scripts'+te_},
'docs.install.h':'Install','docs.install.p':'All in one file or individually (<code>dist/&lt;name&gt;.min.js</code>). Tabs requires <code>tabs.min.css</code>.','docs.th.attr':'Attribute','docs.th.desc':'Description','docs.js':'JS:','docs.contents':'Contents','docs.copy':'Copy'}
secs=[]
for n,d,a,ex,api in D:
    i=n.lower();ed,ea,eapi=EN[n];assert len(ea)==len(a),n
    R['docs.%s.d'%i]=d;EL['docs.%s.d'%i]=ed;R['docs.%s.api'%i]=api;EL['docs.%s.api'%i]=eapi or api
    rows=''
    for j,(x,y) in enumerate(a):
        R['docs.%s.a%d'%(i,j)]=y;EL['docs.%s.a%d'%(i,j)]=ea[j]
        rows+='<tr><td><code>%s</code></td><td data-i18n-html="docs.%s.a%d">%s</td></tr>'%(x,i,j,y)
    secs.append('<section class="doc" id="%s"><h2>%s</h2><p class="muted" data-i18n-html="docs.%s.d">%s</p><div class="tw"><table><thead><tr><th data-i18n="docs.th.attr">%s</th><th data-i18n="docs.th.desc">%s</th></tr></thead><tbody>%s</tbody></table></div><div class="cp"><pre id="c-%s"><code>%s</code></pre><button data-copy-target="#c-%s" data-copied="✓" data-i18n="docs.copy">%s</button></div><p class="api"><strong data-i18n="docs.js">JS:</strong> <code data-i18n-html="docs.%s.api">%s</code></p></section>'%(i,n,i,d,R['docs.th.attr'],R['docs.th.desc'],rows,i,e(ex),i,R['docs.copy'],i,api))
os.makedirs('locales/docs',exist_ok=True)
for f,dd in (('ru',R),('en',EL)):json.dump(dd,open('locales/docs/%s.json'%f,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
tpl=open('index.html',encoding='utf-8').read();head=tpl[:tpl.index('<body>')]
head=re.sub(r'<title[^>]*>.*?</title>','<title data-i18n="docs.title">%s</title>'%R['docs.title'],head,flags=re.S)
head=re.sub(r'<meta name="description"[^>]*>','<meta name="description" content="%s" data-i18n-attr="content:docs.meta">'%R['docs.meta'],head)
head=head.replace('data-i18n-path="locales/{lang}.json"','data-i18n-path="locales/{lang}.json,locales/docs/{lang}.json"')
intro=plr(N,tr_.strip().capitalize() if False else tr_.strip())
body='''<body>
<header data-header><a class="logo" href="index.html"><span>Psy</span>Scripts</a>
<nav data-menu aria-label="Main"><a href="index.html" data-i18n="nav.home">Главная</a><a href="index.html#demo" data-i18n="nav.demo">Демо</a><a href="docs.html" data-i18n="nav.docs">Документация</a><a href="https://github.com/PsyGioX/psyscripts" target="_blank" rel="noopener">GitHub</a></nav>
<div class="tools"><button class="psy-btn" data-lang-toggle data-i18n-attr="aria-label:aria.lang" style="padding:0 .9rem">EN</button><button data-theme-toggle aria-label="" data-i18n-attr="aria-label:aria.theme">◐</button><button data-menu-toggle aria-expanded="false" aria-label="" data-i18n-attr="aria-label:aria.menu">☰</button></div></header>
<div class="wrap layout"><aside data-toc data-toc-source="#docs" data-toc-levels="h2" data-sticky data-i18n-attr="aria-label:docs.contents"></aside>
<main id="docs"><h1><span class="grad" data-i18n="docs.h1">'''+R['docs.h1']+'''</span></h1><p class="muted" data-i18n="docs.intro" data-i18n-count="%d">%s</p>
<section class="doc" id="install"><h2 data-i18n="docs.install.h">%s</h2><p class="muted" data-i18n-html="docs.install.p">%s</p>
<div class="cp"><pre id="c-install"><code>'''%(N,plr(N,tr_.strip()),R['docs.install.h'],R['docs.install.p'])+e('<link rel="stylesheet" href="dist/psyscripts.min.css">\n<link rel="stylesheet" href="dist/tabs.min.css">\n<script src="dist/psyscripts.bundle.min.js" defer></script>')+'''</code></pre><button data-copy-target="#c-install" data-copied="✓" data-i18n="docs.copy">'''+R['docs.copy']+'''</button></div></section>
'''+'\n'.join(secs)+'''
</main></div>
<button data-back-top aria-label="" data-i18n-attr="aria-label:aria.top">↑</button>
<script src="dist/psyscripts.bundle.min.js"></script>
</body></html>
'''
open('docs.html','w',encoding='utf-8').write(head+body)
