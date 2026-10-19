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
