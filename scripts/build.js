/* build.js | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
const fs=require('fs'),path=require('path'),{minify}=require('terser'),csso=require('csso');
const out='dist',banner='/*! psyscripts | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */\n';let bundle='';
fs.mkdirSync(out,{recursive:true});
(async()=>{
  for(const f of fs.readdirSync('src')){
    const src=fs.readFileSync(path.join('src',f),'utf8');
    if(f.endsWith('.js')){
      const r=await minify(src,{compress:true,mangle:true,format:{comments:/^!/}});
      fs.writeFileSync(path.join(out,f.replace('.js','.min.js')),r.code+'\n');bundle+=r.code+'\n';
    }else if(f.endsWith('.css')){
      const m=src.match(/^\/\*!.*?\*\//)[0];
      fs.writeFileSync(path.join(out,f.replace('.css','.min.css')),m+csso.minify(src).css+'\n');
    }
  }
  fs.writeFileSync(path.join(out,'psyscripts.bundle.min.js'),banner+bundle);
  for(const f of fs.readdirSync(out)){const s=fs.statSync(path.join(out,f)).size;console.log(f.padEnd(34),s+' B');}
})();
