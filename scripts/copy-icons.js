/* copy-icons.js | © 2026 PsyGioX | MIT License | https://github.com/PsyGioX/psyscripts | https://psygiox-dev.vercel.app */
const fs=require('fs'),path=require('path');
const map={
  'fontawesome':['@fortawesome/fontawesome-free',['css','webfonts']],
  'bootstrap-icons':['bootstrap-icons',['font']],
  'mdi':['@mdi/font',['css','fonts']],
  'tabler':['@tabler/icons-webfont',['dist']]
};
for(const [out,[pkg,dirs]] of Object.entries(map)){
  for(const d of dirs){
    const from=path.join('node_modules',pkg,d),to=path.join('vendor','icons',out,d);
    if(!fs.existsSync(from)){console.warn('skip (run npm install first):',from);continue;}
    fs.cpSync(from,to,{recursive:true});
  }
  console.log('ok',out);
}
