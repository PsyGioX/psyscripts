# python3 scripts/docs-data.py → docs.html (RU static, EN via I18n) + locales/docs/{ru,en}.json
import html,json,os,re
ns={};exec(open('scripts/docs-content.py',encoding='utf-8').read(),ns);D,EN=ns['D'],ns['EN'];N=len(D)
e=html.escape
def plr(n,t):return '%d %s %s'%(n,'скрипт' if n%10==1 and n%100!=11 else 'скрипта' if 2<=n%10<=4 and not 12<=n%100<=14 else 'скриптов',t)
tr_,te_=' без зависимостей. Всё работает через data-атрибуты; JS API нужен только для особых случаев.',', zero dependencies. Everything works through data attributes; the JS API is only for special cases.'
R={'docs.title':'PsyScripts — Документация','docs.meta':'Документация по всем скриптам PsyScripts: атрибуты, примеры и JS API.','docs.h1':'Документация',
'docs.intro':{'one':'{n} скрипт'+tr_,'few':'{n} скрипта'+tr_,'many':'{n} скриптов'+tr_,'other':'{n} скриптов'+tr_},
'docs.install.h':'Подключение','docs.install.p':'Одной строкой, bundle + css или по отдельности (<code>core.min.js</code> + <code>https://psyscripts.vercel.app/dist/&lt;name&gt;.min.js</code>). Стили (включая Tabs и иконки) — в <code>psyscripts.min.css</code>. Путь и SRI-хэш каждого скрипта — в блоке «Подключение отдельно» его раздела и в разделе «Файлы и SRI».','docs.opts':'JS-опции','docs.events':'События','docs.th.opt':'Опция','docs.th.def':'По умолчанию','docs.th.method':'API','docs.core.h':'Core API: настройка и расширение','docs.core.p':'Подключите <code>core.min.js</code> (он уже внутри bundle). Все скрипты берут опции из data-атрибутов, из <code>PsyScripts.configure()</code> или из <code>PsyScripts.opts(el, …)</code>.','docs.th.attr':'Атрибут','docs.th.desc':'Описание','docs.js':'JS:','docs.contents':'Содержание','docs.copy':'Копировать','docs.standalone':'Подключение отдельно','docs.files.f':'Файл','docs.files.b':'Размер','docs.files.g':'gzip','docs.files.i':'SRI (sha384)','docs.files.none':'Манифест появится после <code>npm run build</code>.'}
EL={'docs.title':'PsyScripts — Documentation','docs.meta':'Documentation for all PsyScripts: attributes, examples and JS API.','docs.h1':'Documentation',
'docs.intro':{'one':'{n} script'+te_,'other':'{n} scripts'+te_},
'docs.install.h':'Install','docs.install.p':'One line, bundle + css, or individually (<code>core.min.js</code> + <code>https://psyscripts.vercel.app/dist/&lt;name&gt;.min.js</code>). Styles (Tabs and icons included) live in <code>psyscripts.min.css</code>. The path and SRI hash of every script are in the “Include on its own” block of its section and in “Files &amp; SRI”.','docs.opts':'JS options','docs.events':'Events','docs.th.opt':'Option','docs.th.def':'Default','docs.th.method':'API','docs.core.h':'Core API: configure and extend','docs.core.p':'Include <code>core.min.js</code> (already inside the bundle). Every script reads options from data attributes, <code>PsyScripts.configure()</code> or <code>PsyScripts.opts(el, …)</code>.','docs.th.attr':'Attribute','docs.th.desc':'Description','docs.js':'JS:','docs.contents':'Contents','docs.copy':'Copy','docs.standalone':'Include on its own','docs.files.f':'File','docs.files.b':'Size','docs.files.g':'gzip','docs.files.i':'SRI (sha384)','docs.files.none':'The manifest appears after <code>npm run build</code>.'}
MAN=json.load(open('dist/manifest.json',encoding='utf-8')).get('files',{}) if os.path.exists('dist/manifest.json') else {}
secs=[]
for n,d,a,ex,api in D:
    i=n.lower();ed,ea,eapi=EN[n];assert len(ea)==len(a),n
    R['docs.%s.d'%i]=d;EL['docs.%s.d'%i]=ed;R['docs.%s.api'%i]=api;EL['docs.%s.api'%i]=eapi or api
    rows=''
    xtra=''
    cfgn,ol,evs=ns['OPTS'][n]
    orows=''
    for j,(k,dv,ru_,en_) in enumerate(ol):
        R['docs.%s.o%d'%(i,j)]=ru_;EL['docs.%s.o%d'%(i,j)]=en_
        orows+='<tr><td><code>%s</code></td><td><code>%s</code></td><td data-i18n="docs.%s.o%d">%s</td></tr>'%(e(k),e(dv),i,j,e(ru_))
    xtra='<h3 data-i18n="docs.opts">%s</h3><p class="api"><code>PsyScripts.configure(\'%s\', { … })</code></p><div class="tw"><table><thead><tr><th data-i18n="docs.th.opt">%s</th><th data-i18n="docs.th.def">%s</th><th data-i18n="docs.th.desc">%s</th></tr></thead><tbody>%s</tbody></table></div>'%(R['docs.opts'],cfgn,R['docs.th.opt'],R['docs.th.def'],R['docs.th.desc'],orows)
    if evs:xtra+='<p class="api"><strong data-i18n="docs.events">%s:</strong> %s</p>'%(R['docs.events'],', '.join('<code>%s</code>'%e(x) for x in evs))
    for j,(x,y) in enumerate(a):
        R['docs.%s.a%d'%(i,j)]=y;EL['docs.%s.a%d'%(i,j)]=ea[j]
        rows+='<tr><td><code>%s</code></td><td data-i18n-html="docs.%s.a%d">%s</td></tr>'%(x,i,j,y)
    fl=ns['FILES'][n];f_=fl[0];extra=fl[1]
    R['docs.%s.inc'%i]=fl[2];EL['docs.%s.inc'%i]=fl[3]
    def tag(nm,defer=True):
        sri=MAN.get(nm+'.min.js',{}).get('integrity')
        return '<script src="https://psyscripts.vercel.app/dist/%s.min.js"%s%s></script>'%(nm,' defer' if defer else '',' integrity="%s" crossorigin="anonymous"'%sri if sri else '')
    nodefer=(n=='ThemeSwitcher')
    inc='<link rel="stylesheet" href="https://psyscripts.vercel.app/dist/psyscripts.min.css">\n'+'\n'.join(tag(x,not nodefer) for x in ['core']+extra+[f_])
    xtra+='<h3 data-i18n="docs.standalone">%s</h3><div class="cp"><pre id="c-%s-inc"><code>%s</code></pre><button data-copy-target="#c-%s-inc" data-copied="✓" data-i18n="docs.copy">%s</button></div>'%(R['docs.standalone'],i,e(inc),i,R['docs.copy'])
    if fl[2]:xtra+='<p class="muted api" data-i18n-html="docs.%s.inc">%s</p>'%(i,fl[2])
    secs.append('<section class="doc" id="%s"><h2>%s</h2><p class="muted" data-i18n-html="docs.%s.d">%s</p><div class="tw"><table><thead><tr><th data-i18n="docs.th.attr">%s</th><th data-i18n="docs.th.desc">%s</th></tr></thead><tbody>%s</tbody></table></div>%s<div class="cp"><pre id="c-%s"><code>%s</code></pre><button data-copy-target="#c-%s" data-copied="✓" data-i18n="docs.copy">%s</button></div><p class="api"><strong data-i18n="docs.js">JS:</strong> <code data-i18n-html="docs.%s.api">%s</code></p></section>'%(i,n,i,d,R['docs.th.attr'],R['docs.th.desc'],rows,xtra,i,e(ex),i,R['docs.copy'],i,api))
core_rows=''
for j,(nm,ru_,en_) in enumerate(ns['CORE']):
    R['docs.core.%d'%j]=ru_;EL['docs.core.%d'%j]=en_
    core_rows+='<tr><td><code>%s</code></td><td data-i18n-html="docs.core.%d">%s</td></tr>'%(nm,j,ru_)
core='<section class="doc" id="core"><h2 data-i18n="docs.core.h">%s</h2><p class="muted" data-i18n-html="docs.core.p">%s</p><div class="tw"><table><thead><tr><th data-i18n="docs.th.method">%s</th><th data-i18n="docs.th.desc">%s</th></tr></thead><tbody>%s</tbody></table></div><div class="cp"><pre id="c-core"><code>%s</code></pre><button data-copy-target="#c-core" data-copied="✓" data-i18n="docs.copy">%s</button></div></section>\n'%(R['docs.core.h'],R['docs.core.p'],R['docs.th.method'],R['docs.th.desc'],core_rows,e(ns['CORE_EX']),R['docs.copy'])
def guides():
    out=''
    for gid,hr,he,blocks in ns['GUIDES']:
        R['docs.g.%s.h'%gid]=hr;EL['docs.g.%s.h'%gid]=he
        h='<section class="doc" id="%s"><h2 data-i18n="docs.g.%s.h">%s</h2>'%(gid,gid,hr)
        for k,b in enumerate(blocks):
            key='docs.g.%s.%d'%(gid,k)
            if b[0]=='p':
                R[key]=b[1];EL[key]=b[2];h+='<p data-i18n-html="%s">%s</p>'%(key,b[1])
            elif b[0]=='ul':
                h+='<ul>'
                for m,(ru_,en_) in enumerate(b[1]):
                    R['%s.%d'%(key,m)]=ru_;EL['%s.%d'%(key,m)]=en_;h+='<li data-i18n-html="%s.%d">%s</li>'%(key,m,ru_)
                h+='</ul>'
            elif b[0]=='code':
                h+='<div class="cp"><pre id="c-%s-%d"><code>%s</code></pre><button data-copy-target="#c-%s-%d" data-copied="✓" data-i18n="docs.copy">%s</button></div>'%(gid,k,e(b[1]),gid,k,R['docs.copy'])
            elif b[0]=='table':
                h+='<div class="tw"><table><thead><tr>'
                for m,(hr_,he_) in enumerate(zip(b[1],b[2])):
                    R['%s.h%d'%(key,m)]=hr_;EL['%s.h%d'%(key,m)]=he_;h+='<th data-i18n="%s.h%d">%s</th>'%(key,m,hr_)
                h+='</tr></thead><tbody>'
                for r_,row in enumerate(b[3]):
                    h+='<tr>'
                    for c_,(ru_,en_) in enumerate(row):
                        kk='%s.r%d.%d'%(key,r_,c_);R[kk]=ru_;EL[kk]=en_;h+='<td data-i18n-html="%s">%s</td>'%(kk,ru_)
                    h+='</tr>'
                h+='</tbody></table></div>'
            elif b[0]=='files':
                if not MAN:
                    h+='<p class="muted" data-i18n-html="docs.files.none">%s</p>'%R['docs.files.none']
                else:
                    order=sorted(MAN,key=lambda x:(0 if x.startswith('core.') else 1 if 'bundle' in x else 2 if 'auto' in x else 3 if x.endswith('.css') else 4,x))
                    h+='<div class="tw"><table><thead><tr>'+''.join('<th data-i18n="docs.files.%s">%s</th>'%(c,R['docs.files.'+c]) for c in 'fbgi')+'</tr></thead><tbody>'
                    for fn in order:
                        m=MAN[fn];h+='<tr><td><code>https://psyscripts.vercel.app/dist/%s</code></td><td>%.1f KB</td><td>%.1f KB</td><td><code class="sri">%s</code></td></tr>'%(e(fn),m['bytes']/1024,m['gzip']/1024,m['integrity'])
                    h+='</tbody></table></div>'
        out+=h+'</section>\n'
    return out
guides_html=guides()
os.makedirs('locales/docs',exist_ok=True)
for f,dd in (('ru',R),('en',EL)):json.dump(dd,open('locales/docs/%s.json'%f,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
tpl=open('index.html',encoding='utf-8').read();head=tpl[:tpl.index('<body>')]
head=re.sub(r'<title[^>]*>.*?</title>','<title data-i18n="docs.title">%s</title>'%R['docs.title'],head,flags=re.S)
head=re.sub(r'<meta name="description"[^>]*>','<meta name="description" content="%s" data-i18n-attr="content:docs.meta">'%R['docs.meta'],head)
head=head.replace('<link rel="canonical" href="https://psyscripts.vercel.app/">','<link rel="canonical" href="https://psyscripts.vercel.app/docs.html">').replace('content="https://psyscripts.vercel.app/"','content="https://psyscripts.vercel.app/docs.html"')
head=head.replace('data-i18n-path="locales/{lang}.json"','data-i18n-path="locales/{lang}.json,locales/docs/{lang}.json"')
intro=plr(N,tr_.strip().capitalize() if False else tr_.strip())
body='''<body>
<a class="psy-skip" href="#docs" data-i18n="a11y.skip">Перейти к содержимому</a>
<header data-header><a class="logo" href="index.html"><span>Psy</span>Scripts</a>
<nav data-menu data-command-source aria-label="Main"><a href="index.html" data-i18n="nav.home">Главная</a><a href="index.html#demo" data-i18n="nav.demo">Демо</a><a href="docs.html" data-i18n="nav.docs">Документация</a><a href="https://github.com/PsyGioX/psyscripts" target="_blank" rel="noopener">GitHub</a></nav>
<div class="tools"><button class="psy-btn u-cmd" data-command-open aria-label="" data-i18n-attr="aria-label:cmd.open"><i class="psy-ico psy-ico--search" aria-hidden="true"></i><kbd class="u-kbd">Ctrl K</kbd></button><button class="psy-btn u-pad-lang" data-lang-toggle data-i18n-attr="aria-label:aria.lang">EN</button><button data-theme-toggle aria-label="" data-i18n-attr="aria-label:aria.theme"><i class="psy-ico psy-ico--theme" aria-hidden="true"></i></button><button data-menu-toggle aria-expanded="false" aria-label="" data-i18n-attr="aria-label:aria.menu"><i class="psy-ico psy-ico--menu" aria-hidden="true"></i></button></div></header>
<div class="wrap layout"><aside data-toc data-toc-source="#docs" data-toc-levels="h2" data-sticky data-command-source data-command-group="Docs" data-i18n-attr="aria-label:docs.contents;data-command-group:cmd.g.docs"></aside>
<main id="docs"><h1><span class="grad" data-i18n="docs.h1">'''+R['docs.h1']+'''</span></h1><p class="muted" data-i18n="docs.intro" data-i18n-count="%d">%s</p>
<section class="doc" id="install"><h2 data-i18n="docs.install.h">%s</h2><p class="muted" data-i18n-html="docs.install.p">%s</p>
<div class="cp"><pre id="c-install"><code>'''%(N,plr(N,tr_.strip()),R['docs.install.h'],R['docs.install.p'])+e('<!-- 1. one line -->\n<script src="https://psyscripts.vercel.app/dist/psyscripts.auto.min.js" defer></script>\n\n<!-- 2. production: styles + bundle -->\n<link rel="stylesheet" href="https://psyscripts.vercel.app/dist/psyscripts.min.css">\n<script src="https://psyscripts.vercel.app/dist/psyscripts.bundle.min.js" defer></script>\n\n<!-- 3. only what you need (core is required for the configuration API) -->\n<link rel="stylesheet" href="https://psyscripts.vercel.app/dist/psyscripts.min.css">\n<script src="https://psyscripts.vercel.app/dist/core.min.js" defer></script>\n<script src="https://psyscripts.vercel.app/dist/tabs.min.js" defer></script>')+'''</code></pre><button data-copy-target="#c-install" data-copied="✓" data-i18n="docs.copy">'''+R['docs.copy']+'''</button></div></section>
'''+'\n'.join(secs)+'\n'+core+guides_html+'''
</main></div>
<button data-back-top aria-label="" data-i18n-attr="aria-label:aria.top"><i class="psy-ico psy-ico--arrow-up" aria-hidden="true"></i></button>
<script src="dist/psyscripts.bundle.min.js"></script>
<script src="js/site.js"></script>
</body></html>
'''
open('docs.html','w',encoding='utf-8').write(head+body)
