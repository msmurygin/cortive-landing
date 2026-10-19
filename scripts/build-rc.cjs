/* Private release composition only: never deploys, changes public sources or enables measurement. */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),baseline='24914b0b2729e2b5b4f661a2db3569a6741a227d';
function git(...args){return cp.execFileSync('git',args,{cwd:root});}
function build(candidate){
 if(!['rc-a','rc-a-measurement','rc-b'].includes(candidate))throw Error('Unknown candidate');
 const out=path.join(root,'review-dist',candidate);fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
 const write=(n,s)=>{const p=path.join(out,n);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);};
 const original=new Map();
 for(const n of git('ls-tree','-r','--name-only',baseline).toString().trim().split('\n')){
  if(!/^(assets\/|api\/|lib\/|legal\/|webrf\/|[^/]+\.html$|robots\.txt$|sitemap\.xml$|vercel\.json$)/.test(n)||n.includes('/_raw/'))continue;
  const bytes=git('show',baseline+':'+n);original.set(n,bytes);write(n,bytes);
 }
 const inventory=candidate==='rc-b',route=inventory?'/features/inventory-management':'/wms-cost',file=route.slice(1)+'.html';
 let html=fs.readFileSync(path.join(root,'drafts',file),'utf8').replace(/<aside class="seo-draft">.*?<\/aside>/,'').replace('content="noindex,follow"','content="index,follow"').replaceAll('/draft-assets/','/assets/seo/');
 if(inventory)html=html.replace('<a href="/wms-cost">Plan WMS costs and implementation scope</a> or read the ','Read the ');
 write(file,html);
 for(const n of inventory?['seo-content.css']:['seo-content.css','cost-model.js','cost-ui.js'])write('assets/seo/'+n,fs.readFileSync(path.join(root,'drafts/assets',n)));
 // Review proposal: one resource link in the existing footer; home copy and primary CTA stay intact.
 const home=original.get('index.html').toString().replace('<a href="/screens.html">Screens</a>', '<a href="/screens.html">Screens</a>\n<a href="'+route+'">'+(inventory?'Inventory management':'WMS cost guide')+'</a>');write('index.html',home);
 write('sitemap.xml',original.get('sitemap.xml').toString().replace('</urlset>','  <url><loc>https://quark.build'+route+'</loc></url>\n</urlset>'));
 const config=JSON.parse(original.get('vercel.json'));
 config.rewrites.push({source:route,destination:'/'+file});
 for(const source of [route+'/', '/'+file])config.redirects.push({source,destination:route,permanent:true});
 write('vercel.json',JSON.stringify(config,null,2)+'\n');
 if(!inventory)write('assets/product.css',fs.readFileSync(path.join(root,'assets/product.css')));
 if(candidate==='rc-a-measurement'){
  for(const n of ['api/events.js','api/lead.js','api/measurement-config.js','lib/measurement.js','assets/leads.js','assets/main.js','assets/measurement.css','assets/measurement.js'])write(n,fs.readFileSync(path.join(root,n)));
  write('legal/privacy.html',fs.readFileSync(path.join(root,'drafts/legal/privacy.html')));
 }
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 const changes=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else{const n=path.relative(out,p),bytes=fs.readFileSync(p);if(!original.has(n)||!bytes.equals(original.get(n)))changes.push({path:n,sha256:hash(bytes),baseline_sha256:original.has(n)?hash(original.get(n)):null});}}}walk(out);
 const manifest={candidate,baseline,source_commit:git('rev-parse','HEAD').toString().trim(),release_authorized:false,measurement_enabled:false,blocked:inventory?'MVP evidence and founder claims approval':candidate==='rc-a-measurement'?'Inbox receipt, data handling, durable reporting and founder approval':'Inbox receipt and founder page/link/release approval',route,changes};
 write('RC-MANIFEST.json',JSON.stringify(manifest,null,2)+'\n');return manifest;
}
if(require.main===module){for(const c of process.argv.slice(2).length?process.argv.slice(2):['rc-a','rc-a-measurement','rc-b'])console.log(JSON.stringify(build(c)));}
module.exports={build,baseline};
