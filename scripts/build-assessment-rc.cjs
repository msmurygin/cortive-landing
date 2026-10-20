/* Creates local snapshots only. Never pushes, merges, deploys or enables analytics. */
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const {csp}=require('./build-readiness.cjs'),root=path.resolve(__dirname,'..');
const baseline='2a628cbfa41cbd28a1959dc6818865342e017362',route='/tools/wms-readiness-assessment';
const allowed=n=>/^(assets\/|api\/|lib\/|legal\/|webrf\/|[^/]+\.html$|robots\.txt$|sitemap\.xml$|vercel\.json$)/.test(n)&&!n.includes('/_raw/');
function buildAssessment({mode='preview',out=path.join(root,'review-dist','assessment-'+mode),baselineDirectory=null}={}){
 if(!['preview','release'].includes(mode))throw Error('Choose preview or release composition. No deployment is performed.');
 fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});const original=new Map(),write=(name,bytes)=>{const dest=path.join(out,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);};
 if(baselineDirectory){function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else{const n=path.relative(baselineDirectory,p);if(allowed(n))original.set(n,fs.readFileSync(p));}}}walk(baselineDirectory);}
 else for(const n of cp.execFileSync('git',['ls-tree','-r','--name-only',baseline],{cwd:root,encoding:'utf8'}).trim().split('\n'))if(allowed(n))original.set(n,cp.execFileSync('git',['show',baseline+':'+n],{cwd:root}));
 for(const [name,bytes] of original)write(name,bytes);
 let html=fs.readFileSync(path.join(root,'drafts/readiness/index.html'),'utf8');
 if(mode==='release')html=html.replace('content="noindex,nofollow,noarchive"','content="index,follow"').replace('<span data-preview-notice>Protected review · Not published</span>','<span>Free planning tool · No email required</span>');
 write(route.slice(1)+'.html',html);
 for(const file of ['assessment-model.js','discovery-model.js','assessment-pdf.js','assessment-ui.js','assessment.css'])write('assessment-assets/'+file,fs.readFileSync(path.join(root,'drafts/readiness',file)));
 const config=JSON.parse(original.get('vercel.json'));
 config.rewrites.push({source:route,destination:route+'.html'});
 for(const source of [route+'/',route+'.html'])config.redirects.push({source,destination:route,permanent:true});
 config.headers.push({source:route,headers:[{key:'Content-Security-Policy',value:csp},{key:'Referrer-Policy',value:'no-referrer'}]});
 if(mode==='preview'){
  config.buildCommand='node preview-only.cjs';config.outputDirectory='.';config.framework=null;
  write('preview-only.cjs',"if(process.env.VERCEL_ENV!=='preview')throw Error('Assessment review artifact: preview only; never promote to production.');\n");
  config.headers.push({source:'/(.*)',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'},{key:'Cache-Control',value:'no-store'}]});
  write('robots.txt','User-agent: *\nDisallow: /\n');
  for(const name of ['lead','events','measurement-config'])write('api/'+name+'.js',name==='measurement-config'?"module.exports=(req,res)=>res.status(200).json({enabled:false,environment:'preview'});\n":"module.exports=(req,res)=>res.status(503).json({error:'Protected assessment review: submission and analytics disabled.'});\n");
 }else write('sitemap.xml',original.get('sitemap.xml').toString().replace('</urlset>','  <url><loc>https://quark.build'+route+'</loc></url>\n</urlset>'));
 write('vercel.json',JSON.stringify(config,null,2)+'\n');
 const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),changes=[];
 function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else{const n=path.relative(out,p),bytes=fs.readFileSync(p);if(!original.has(n)||!bytes.equals(original.get(n)))changes.push({path:n,sha256:hash(bytes),baselineSha256:original.has(n)?hash(original.get(n)):null});}}}walk(out);
 const manifest={candidate:'assessment-rc',mode,baseline,route,out,changes,releaseAuthorized:false,newAnalytics:false,answersTransmitted:false,requiresVercelAuthentication:mode==='preview',protectedProductionPaths:['index.html','vision.html','wms-cost.html','legal/privacy.html','assets/leads.js','assets/main.js'],note:mode==='preview'?'Protected review only; never promote this guarded snapshot to production.':'Indexable composition only; explicit founder publication approval required.'};
 fs.writeFileSync(out+'.manifest.json',JSON.stringify(manifest,null,2)+'\n');return manifest;
}
if(require.main===module)console.log(JSON.stringify(buildAssessment({mode:process.argv[2]||'preview'}),null,2));
module.exports={buildAssessment,baseline,route};
