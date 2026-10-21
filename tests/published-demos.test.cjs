const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),manifest=require('../content/product-demos.json'),demos=require('../scripts/product-demos.cjs'),media=require('../docs/native-video/ORIGINAL-MEDIA.json');
const baseline='b52e60073c80e2c89819f232543bf3f1896a2e28';
test('all four original MP4s are byte-identical to founder-provided files',()=>{
 for(const d of manifest){const bytes=fs.readFileSync(path.join(root,d.source)),expected=media.files.find(x=>x.key===d.key);a.equal(bytes.length,expected.bytes);a.equal(crypto.createHash('sha256').update(bytes).digest('hex'),expected.sha256);a.equal(d.originalSha256,expected.sha256);a.equal(expected.moovBeforeMdat,true);a.deepEqual(expected.codecFamilies,['avc1']);a.equal(d.width,expected.width);a.equal(d.height,expected.height);a.equal(Number(d.duration.slice(2,-1)),expected.durationSeconds);}
});
test('native controls, inline playback, preload none, local posters and accessible titles exist without autoplay',()=>{
 const html=read('product.html');a.equal((html.match(/<video /g)||[]).length,4);
 for(const d of manifest){const s=demos.render(d);a.match(s,/<video controls playsinline preload="none"/);a.match(s,/type="video\/mp4"/);a.ok(s.includes('aria-label="'+d.title.replaceAll('&','&amp;')+'"'));a.ok(s.includes('poster="'+d.poster+'"'));a.ok(s.includes('id="demo-'+d.key+'-description"'));a.match(s,/Download the MP4 demonstration/);a.doesNotMatch(s,/autoplay|<iframe|data-youtube-id/);a.equal(demos.validate(d,root),true);}
});
test('Product copy, CTAs, existing metadata and operational placements are preserved',()=>{
 const strip=s=>s.replace(/<figure class="q-demo" id="demo-[^"]+">[\s\S]*?<\/figure>(?:<script type="application\/ld\+json">[\s\S]*?<\/script>)?/g,'').replace('<script src="/assets/product-demos.js" defer></script>','');
 const html=read('product.html');a.equal(strip(html),strip(cp.execFileSync('git',['show',baseline+':product.html'],{cwd:root,encoding:'utf8'})));
 for(const d of manifest){const start=html.indexOf('id="'+d.section+'"'),at=html.indexOf('id="demo-'+d.key+'"');a.ok(at>start&&at<html.indexOf('</section>',start));}
});
test('no YouTube player script, iframe, remote poster or custom playback dependency remains',()=>{
 const html=read('product.html');a.doesNotMatch(html,/<iframe|data-youtube-id|youtube-nocookie|src="\/assets\/product-demos\.js/);a.equal(fs.existsSync(path.join(root,'assets/product-demos.js')),false);
 for(const s of html.matchAll(/<(?:script|source|video|img)\b[^>]*>/g))a.doesNotMatch(s[0],/https?:\/\/(?:www\.)?(?:youtube|google|i\.ytimg)/);
});
test('optional YouTube links remain plain external links and do not gate local playback',()=>{
 for(const d of manifest){a.match(demos.render(d),new RegExp('href="https://www.youtube.com/watch\\?v='+d.youtubeId+'"'));a.ok(demos.render({...d,youtubeId:null}).includes('<video controls'));a.equal(demos.validate({...d,youtubeId:null},root),true);}
});
test('only known upload dates produce VideoObject, with real duration and native content URL',()=>{
 const schemas=[...read('product.html').matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])).filter(x=>x['@type']==='VideoObject');a.equal(schemas.length,2);
 for(const d of manifest){const found=schemas.filter(s=>s.contentUrl==='https://quark.build'+d.source);a.equal(found.length,d.uploadDate?1:0);if(found.length){a.equal(found[0].duration,d.duration);a.equal(found[0].uploadDate,d.uploadDate);a.ok(!('embedUrl'in found[0]));}a.equal(d.transcript,null);}
});
test('build is idempotent and does not duplicate players or structured data',()=>{
 const before=read('product.html');a.equal(demos.build(root,manifest).active,4);a.equal(read('product.html'),before);
});
test('missing files, escaping and wrong placements cannot silently publish',()=>{
 const d=manifest[0];a.equal(demos.validate({...d,publicationApproved:false},root),false);a.throws(()=>demos.validate({...d,source:'/assets/demos/missing.mp4'},root),/MP4/);a.throws(()=>demos.validate({...d,source:'/assets/demos/../receiving.mp4'},root),/MP4/);a.throws(()=>demos.validate({...d,section:'inventory'},root),/placement/);a.throws(()=>demos.validate({...d,captionsConfirmed:false,accessibleDescription:''},root),/description/);
});
test('preview build accepts preview only and rejects production/development',()=>{
 for(const env of ['production','development','']){const r=cp.spawnSync(process.execPath,['preview-only.cjs'],{cwd:root,env:{...process.env,VERCEL_ENV:env}});a.notEqual(r.status,0);}a.equal(cp.spawnSync(process.execPath,['preview-only.cjs'],{cwd:root,env:{...process.env,VERCEL_ENV:'preview'}}).status,0);
 const c=JSON.parse(read('vercel.json'));a.equal(c.buildCommand,'node preview-only.cjs');a.ok(c.headers.some(x=>x.source==='/(.*)'&&x.headers.some(h=>h.key==='X-Robots-Tag'&&h.value.includes('noindex'))));
});
test('Home, Vision, Cost, Assessment, forms, analytics, sitemap and branding remain unchanged',()=>{
 for(const f of ['index.html','vision.html','wms-cost.html','tools/wms-readiness-assessment/index.html','robots.txt','sitemap.xml','api/lead.js','api/events.js','lib/lead-events.js','assets/leads.js','assessment-assets/discovery-model.js','assessment-assets/assessment-ui.js','assessment-assets/assessment-pdf.js','assets/seo/cost-model.js','assets/seo/cost-ui.js','design-assets/qds.js','design-assets/qds.css'])a.equal(read(f),cp.execFileSync('git',['show',baseline+':'+f],{cwd:root,encoding:'utf8'}),f);
});
