/* Local packaging only. Never invokes Vercel or authorizes a deployment. */
const fs=require('node:fs'),path=require('node:path');
const {build}=require('./build-rc.cjs');
const root=path.resolve(__dirname,'..');
function buildProtected(candidate){
 if(!['rc-a','rc-b'].includes(candidate))throw Error('Only independent RC-A or RC-B review is supported');
 const manifest=build(candidate,'preview-source'),source=path.join(root,'review-dist','preview-source',candidate),out=path.join(root,'review-dist','protected-preview',candidate);
 fs.rmSync(out,{recursive:true,force:true});
 fs.cpSync(source,out,{recursive:true,filter:p=>{const rel=path.relative(source,p);return rel!=='RC-MANIFEST.json'&&rel.split(path.sep)[0]!=='api';}});
 const write=(n,s)=>{const p=path.join(out,n);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);};
 const disabled="module.exports=(req,res)=>{res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');return res.status(503).json({error:'Private review: enquiries and measurement are disabled.'});};\n";
 for(const name of ['lead','events'])write('api/'+name+'.js',disabled);
 write('api/measurement-config.js',"module.exports=(req,res)=>{res.setHeader('Cache-Control','no-store');return res.status(200).json({enabled:false,environment:'preview'});};\n");
 write('assets/leads.js','/* Private review: enquiry submission and event collection are disabled. */\n');
 write('preview-only.cjs',"if(process.env.VERCEL_ENV!=='preview')throw Error('This review artifact must not build in production.');\n");
 const config=JSON.parse(fs.readFileSync(path.join(out,'vercel.json')));
 config.buildCommand='node preview-only.cjs';config.outputDirectory='.';config.framework=null;delete config.public;
 config.headers=config.headers.map(rule=>({...rule,headers:rule.headers.filter(h=>!['x-robots-tag','cache-control'].includes(h.key.toLowerCase()))})).filter(rule=>rule.headers.length);
 config.headers.push({source:'/(.*)',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'},{key:'Cache-Control',value:'no-store'}]});
 write('vercel.json',JSON.stringify(config,null,2)+'\n');
 write('robots.txt','User-agent: *\nDisallow: /\n');
 function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory()){walk(p);continue;}if(!p.endsWith('.html'))continue;
  let html=fs.readFileSync(p,'utf8');
  html=html.replace(/(<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'])[^"']*(["'][^>]*>)/gi,'$1noindex,nofollow,noarchive$2');
  if(!/name=["']robots["']/i.test(html))html=html.replace('</head>','<meta name="robots" content="noindex,nofollow,noarchive"></head>');
  if(path.relative(out,p)===manifest.route.slice(1)+'.html')html=html.replace(/(<main\b[^>]*>)/,'$1<aside class="seo-draft">Private review — enquiries and measurement are disabled.</aside>');
  html=html.replace(/(<form\b[^>]*\bid="leadForm"[^>]*>)([\s\S]*?)(<\/form>)/g,(_,open,body,close)=>open+'<p role="status">Private review — enquiry submission and analytics are disabled.</p><fieldset disabled>'+body.replace(/<noscript>[\s\S]*?<\/noscript>/g,'')+'</fieldset>'+close);
  fs.writeFileSync(p,html);
 }}walk(out);
 // Site access REQUIRES Vercel Authentication; public is not a supported vercel.json property.
 return {candidate,out,source_commit:manifest.source_commit,deployed:false,release_authorized:false,required_before_deployment:'Founder P0 approval and verified Vercel Authentication; no production alias'};
}
if(require.main===module)for(const c of ['rc-a','rc-b'])console.log(JSON.stringify(buildProtected(c)));
module.exports={buildProtected};
