// npm run icons → vendor/icons/{font-awesome,bootstrap-icons,material-design-icons,tabler-icons}
const fs=require('fs'),map={'font-awesome':'@fortawesome/fontawesome-free','bootstrap-icons':'bootstrap-icons','material-design-icons':'@mdi/font','tabler-icons':'@tabler/icons-webfont'};
for(const [k,p] of Object.entries(map)){const s='node_modules/'+p,d='vendor/icons/'+k;
if(!fs.existsSync(s)){console.warn('skip',k);continue}fs.mkdirSync(d,{recursive:true});fs.cpSync(s,d,{recursive:true});console.log('✓',k)}
