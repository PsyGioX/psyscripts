// npm run build → dist/*.min.js, tabs.min.css, psyscripts.min.css, psyscripts.bundle.min.js
const esbuild=require('esbuild'),fs=require('fs'),path=require('path');
const banner='/*! PsyScripts · © 2026 PsyGioX · MIT · github.com/PsyGioX/psyscripts */';
fs.mkdirSync('dist',{recursive:true});
const files=fs.readdirSync('src').filter(f=>f.endsWith('.js'));
for(const f of files)esbuild.buildSync({entryPoints:['src/'+f],outfile:'dist/'+path.basename(f,'.js')+'.min.js',minify:true,banner:{js:banner},legalComments:'none'});
esbuild.buildSync({stdin:{contents:files.map(f=>`import './src/${f}';`).join('\n'),resolveDir:'.'},bundle:true,outfile:'dist/psyscripts.bundle.min.js',minify:true,banner:{js:banner},legalComments:'none'});
for(const [i,o] of [['css/tabs.css','dist/tabs.min.css'],['css/psyscripts.css','dist/psyscripts.min.css']])esbuild.buildSync({entryPoints:[i],outfile:o,minify:true,banner:{css:banner}});
console.log('Built',files.length,'scripts + bundle');
// icon fonts → vendor/icons/
require('./icons.js');
// docs.html is generated from scripts/docs-data.py (needs Python 3; skipped if unavailable)
const {spawnSync}=require('child_process');
const py=['python3','python'].map(c=>[c,spawnSync(c,['scripts/docs-data.py'],{stdio:'inherit'})]).find(([,r])=>!r.error);
console.log(py&&py[1].status===0?'Built docs.html':'⚠ docs.html skipped (Python 3 not found or script failed)');
// Vercel/static hosting: collect everything the site needs into public/
const fs2=require('fs');fs2.rmSync('public',{recursive:true,force:true});fs2.mkdirSync('public');
for(const f of ['index.html','docs.html','css','dist','locales','vendor'])if(fs2.existsSync(f))fs2.cpSync(f,'public/'+f,{recursive:true});
console.log('Built public/');
// Prerender the default language into public/index.html (no empty flash before locales load)
{const src=fs2.readFileSync('index.html','utf8'),dl=/data-i18n-default="([^"]+)"/.exec(src)[1],dict=JSON.parse(fs2.readFileSync(`locales/${dl}.json`,'utf8')),pr=new Intl.PluralRules(dl);
const tr=(k,n)=>{let v=dict[k];if(v==null)return null;if(typeof v==='object')v=v[pr.select(n||0)]||v.other;return String(v).replace(/\{n\}/g,n)};
const cnt=o=>{const c=/data-i18n-count="(\d+)"/.exec(o);return c?+c[1]:0};
let out=src.replace(/(<(\w+)\b[^>]*?\bdata-i18n(?:-html)?="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,(m,o,t,k,i,c)=>{const v=tr(k,cnt(o));return v==null?m:o+v+c});
out=out.replace(/<(\w+)\b[^>]*\bdata-i18n-attr="([^"]+)"[^>]*>/g,(m,t,spec)=>{let o=m;for(const p of spec.split(';')){const i=p.indexOf(':'),a=p.slice(0,i),v=tr(p.slice(i+1),cnt(m));if(v==null)continue;const q=v.replace(/"/g,'&quot;'),re=new RegExp('(\\s'+a+'=")[^"]*(")');o=re.test(o)?o.replace(re,'$1'+q+'$2'):o.replace(/\/?>$/,s=>` ${a}="${q}"`+s)}return o});
fs2.writeFileSync('public/index.html',out);console.log('Prerendered index.html ('+dl+')')}
