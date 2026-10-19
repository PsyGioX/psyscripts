// npm run icons → vendor/icons/{font-awesome,bootstrap-icons,material-design-icons,tabler-icons}
const fs=require('fs'),map={'font-awesome':'@fortawesome/fontawesome-free','bootstrap-icons':'bootstrap-icons','material-design-icons':'@mdi/font','tabler-icons':'@tabler/icons-webfont'};
for(const [k,p] of Object.entries(map)){const s='node_modules/'+p,d='vendor/icons/'+k;
if(!fs.existsSync(s)){console.warn('skip',k);continue}fs.mkdirSync(d,{recursive:true});fs.cpSync(s,d,{recursive:true,filter:src=>{const n=require('path').basename(src);return fs.statSync(src).isDirectory()?!/^(node_modules|svgs?|sprites|less|scss|sass|js|metadata|icons|png|json)$/.test(n):/\.(css|woff2?|ttf)$/.test(n)}});console.log('✓',k)}
