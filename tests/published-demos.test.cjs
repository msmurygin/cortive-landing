const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),manifest=require('../content/product-demos.json'),demos=require('../scripts/product-demos.cjs');
const old=f=>cp.execFileSync('git',['show','494564b2de8565d03b435e5c410487a0f5205983:'+f],{cwd:root,encoding:'utf8'});
const strip=h=>h.replace(/<figure class="q-demo" id="demo-[\w-]+">[\s\S]*?<\/figure>(?:<script type="application\/ld\+json">[\s\S]*?<\/script>)?/g,'');
test('five approved recordings retain their corresponding operational sections',()=>{
 a.deepEqual(manifest.map(d=>d.key),['receiving','putaway','receiving-and-putaway','inventory-counting','replenishment']);let h=read('product.html');
 for(const d of manifest){a.equal(demos.validate(d,root),true);const pos=h.indexOf('id="demo-'+d.key+'"'),sec=h.indexOf('id="'+d.section+'"');a.ok(pos>sec&&pos<h.indexOf('</section>',sec));a.equal(h.split('id="demo-'+d.key+'"').length-1,1);a.ok(h.includes(demos.render(d)));}
});
test('media matches approved hashes and originals remain available',()=>{
 for(const d of manifest){const b=fs.readFileSync(path.join(root,d.source));a.equal(crypto.createHash('sha256').update(b).digest('hex'),d.sha256);a.equal(b.length,d.bytes);a.ok(b.length<3_000_000);if(d.originalSha256)a.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/demos/'+d.key+'.mp4'))).digest('hex'),d.originalSha256);}
});
test('native players preserve privacy, accessible titles, aspect ratio and explicit playback',()=>{
 a.doesNotMatch(read('product.html'),/<iframe|youtube-nocookie|<script[^>]+src=["'][^"']*(youtube|google\.com)/i);
 for(const d of manifest){const h=demos.render(d);a.match(h,/<video controls playsinline preload="none"/);a.match(h,/width="1280" height="720"/);a.doesNotMatch(h,/autoplay|preconnect/);a.ok(d.accessibleDescription);a.ok(h.includes('poster="'+d.poster+'"'));a.ok(h.includes('aria-describedby="demo-'+d.key+'-description"'));a.ok(fs.statSync(path.join(root,d.poster)).size<100000);}
});
test('all 51 English narration cues have valid bounds and matching transcripts',()=>{
 const counts={receiving:10,putaway:7,'receiving-and-putaway':14,'inventory-counting':10,replenishment:10};
 for(const d of manifest){a.equal(d.captionsConfirmed,true);let vtt=read(d.captions);a.match(vtt,/^WEBVTT/);let bounds=[...vtt.matchAll(/(\d\d):(\d\d):(\d\d\.\d{3}) --> (\d\d):(\d\d):(\d\d\.\d{3})/g)];a.equal(bounds.length,counts[d.key]);let prev=0;for(const b of bounds){let s=+b[1]*3600+ +b[2]*60+ +b[3],e=+b[4]*3600+ +b[5]*60+ +b[6];a.ok(s>=prev&&e>s&&e<=Number(d.duration.match(/[\d.]+/)[0]));prev=e;}a.match(demos.render(d),/<track kind="captions"[^>]+srclang="en"[^>]+default>/);a.ok(read(d.transcript).length>100);}
});
test('VideoObject uses confirmed dates, durations, language and native URLs',()=>{
 const schemas=[...read('product.html').matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])).filter(s=>s['@type']==='VideoObject');a.equal(schemas.length,manifest.filter(d=>d.uploadDate).length);
 for(const d of manifest){const s=schemas.find(s=>s.contentUrl==='https://quark.build'+d.source);a.equal(!!s,!!d.uploadDate);if(s){a.equal(s.uploadDate,d.uploadDate);a.equal(s.duration,d.duration);a.equal(s.inLanguage,'en');a.equal(s.thumbnailUrl,'https://quark.build'+d.poster);a.ok(!s.embedUrl);}}
});
test('Product copy, SEO, navigation, layout and CTAs outside demo figures are unchanged',()=>a.equal(strip(read('product.html')),strip(old('product.html'))));
test('unrelated pages, settings, privacy, forms and analytics are unchanged',()=>{
 for(const f of ['index.html','vision.html','wms-cost.html','tools/wms-readiness-assessment/index.html','vercel.json','robots.txt','sitemap.xml','api/lead.js','api/events.js','lib/lead-events.js','assets/leads.js','legal/privacy.html','legal/terms.html','assessment-assets/discovery-model.js','assessment-assets/assessment-ui.js','assessment-assets/assessment-pdf.js','design-assets/qds.js','design-assets/qds.css'])a.equal(read(f),old(f),f);
});
test('publication rejects unverified media, captions, IDs and placements',()=>{
 const d=manifest[0];a.equal(demos.validate({...d,publicationApproved:false},root),false);a.throws(()=>demos.validate({...d,captions:null},root),/captions/);a.throws(()=>demos.validate({...d,captions:'/assets/demos/missing.vtt'},root),/local media/);a.throws(()=>demos.validate({...d,source:'/assets/demos/missing.mp4'},root),/MP4/);a.throws(()=>demos.validate({...d,youtubeId:'invalid'},root),/YouTube/);a.throws(()=>demos.validate({...d,section:'inventory'},root),/placement/);
});
