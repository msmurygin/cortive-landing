const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),manifest=require('../content/product-demos.json'),demos=require('../scripts/product-demos.cjs');
// Published baseline before the founder-approved indigo visual revision.
const old=f=>cp.execFileSync('git',['show','f62d32d00af298ef273ddbd9844192644d44b3c6:'+f],{cwd:root,encoding:'utf8'});
const counts=xs=>xs.reduce((m,x)=>(m.set(x,(m.get(x)||0)+1),m),new Map());
const included=(before,after,label)=>{const c=counts(after);for(const [value,n]of counts(before))a.ok((c.get(value)||0)>=n,label+': '+value);};
const text=h=>h.replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,'').split(/<[^>]*>/).map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean);
const matches=(h,re)=>[...h.matchAll(re)].map(m=>m[1]);
const icons=h=>h.match(/<link\b[^>]*rel="icon"[^>]*>/g)||[];
const head=h=>h.split('</head>')[0].replace(/<link\b[^>]*rel="icon"[^>]*>/g,'').replace(/<link rel="stylesheet" href="\/design-assets\/(?:home|site)-indigo\.css">/g,'').replace('family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500','family=Geist:wght@400;500;600;800&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1');
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
 const schemas=[...read('product.html').matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])).filter(s=>s['@type']==='VideoObject'&&s.contentUrl.includes('/assets/demos/'));a.equal(schemas.length,manifest.filter(d=>d.uploadDate).length);
 for(const d of manifest){const s=schemas.find(s=>s.contentUrl==='https://quark.build'+d.source);a.equal(!!s,!!d.uploadDate);if(s){a.equal(s.uploadDate,d.uploadDate);a.equal(s.duration,d.duration);a.equal(s.inLanguage,'en');a.equal(s.thumbnailUrl,'https://quark.build'+d.poster);a.ok(!s.embedUrl);}}
});
test('visual revision preserves published page copy, SEO, navigation, CTAs and forms',()=>{
 for(const f of ['index.html','product.html','vision.html','wms-cost.html','tools/wms-readiness-assessment/index.html','legal/privacy.html','legal/terms.html','thanks.html']){
  const before=old(f),after=read(f);
  // Founder-requested Phonon positioning replaces this card's old marketing copy.
  // Keep preservation checks for all other copy, plus links, anchors, SEO, forms and scripts below.
  const phononCard=/<article\b[^>]*><header><span class="q-sym">φ<\/span>[\s\S]*?<\/article>/;
  if(f==='vision.html'){
   a.match(before,phononCard);a.match(after,phononCard);
   const card=after.match(phononCard)[0];a.match(card,/<h3>Phonon<\/h3>/);a.match(card,/Separate product · Voice/);a.match(card,/href="\/product#phonon"/);
   // Approved name note uses third person; its duplicate personal reference is aligned too.
   const approvedNameCopy=before.replace('Mark is also the name of my son. The metaphor and the family, they earn their place.','The name also has a family connection: the founder’s son is named Mark.').replace('Mark is my son.','Mark is the founder’s son.');
   included(text(approvedNameCopy.replace(phononCard,'')),text(after.replace(phononCard,'')),f+' copy outside Phonon');
  }else included(text(before),text(after),f+' copy');
  included(matches(before,/<a\b[^>]*href=["']([^"']*)/g),matches(after,/<a\b[^>]*href=["']([^"']*)/g),f+' links');
  const ids=matches(after,/\bid=["']([^"']+)/g);included(matches(before,/\bid=["']([^"']+)/g),ids,f+' anchors');a.equal(ids.length,new Set(ids).size,f+' duplicate IDs');
  a.equal((after.match(/<h1\b/g)||[]).length,1,f+' H1');a.equal(head(after),head(before),f+' SEO/head');
  a.deepEqual(icons(after),icons(read('index.html')),f+' approved square favicon');a.ok(icons(after).some(s=>s.includes('/favicon.ico')));a.ok(icons(after).some(s=>s.includes('/assets/favicon.png')));
  a.deepEqual(after.match(/<form\b[\s\S]*?<\/form>/g),before.match(/<form\b[\s\S]*?<\/form>/g),f+' forms');
  a.deepEqual(after.replace(/<script type="application\/ld\+json" data-rf-demo-schema>[\s\S]*?<\/script>/g,'').match(/<script\b[\s\S]*?<\/script>/g),before.match(/<script\b[\s\S]*?<\/script>/g),f+' scripts and structured data');
 }
});
test('visual revision preserves app logic, settings, forms, privacy wording and analytics',()=>{
 for(const f of ['vercel.json','robots.txt','sitemap.xml','api/lead.js','api/events.js','lib/lead-events.js','assets/leads.js','assets/seo/cost-model.js','assets/seo/cost-ui.js','assessment-assets/assessment-model.js','assessment-assets/discovery-model.js','assessment-assets/assessment-ui.js','assessment-assets/assessment-pdf.js','assessment-assets/assessment-summary.js','assessment-assets/assessment.css','design-assets/qds.js','design-assets/qds.css'])a.equal(read(f),old(f),f);
 for(const f of ['legal/privacy.html','legal/terms.html'])a.deepEqual(text(read(f)),text(old(f)),f+' wording');
});
test('publication rejects unverified media, captions, IDs and placements',()=>{
 const d=manifest[0];a.equal(demos.validate({...d,publicationApproved:false},root),false);a.throws(()=>demos.validate({...d,captions:null},root),/captions/);a.throws(()=>demos.validate({...d,captions:'/assets/demos/missing.vtt'},root),/local media/);a.throws(()=>demos.validate({...d,source:'/assets/demos/missing.mp4'},root),/MP4/);a.throws(()=>demos.validate({...d,youtubeId:'invalid'},root),/YouTube/);a.throws(()=>demos.validate({...d,section:'inventory'},root),/placement/);
});
test('approved configuration recording is one ordered native player with local captions and no invented video metadata',()=>{
 const h=read('product.html'),figure=h.match(/<figure class="q-context-demo" id="demo-metadata-driven">[\s\S]*?<\/figure>/)?.[0];a.ok(figure);a.equal((h.match(/class="q-context-demo"/g)||[]).length,2);
 a.ok(h.indexOf('id="demo-metadata-driven"')>h.indexOf('id="platform"'));a.match(figure,/<video controls playsinline preload="none"/);a.doesNotMatch(figure,/autoplay|iframe|youtube/);a.match(figure,/00:00 Working SKU interface · 00:34 Metadata and form configuration/);a.match(figure,/<track kind="captions"[^>]+default>/);
 a.match(h,/<a[^>]+href="#demo-metadata-driven"/);for(const ref of matches(figure,/(?:src|poster|href)="(\/assets\/product-context\/[^"#]+)"/g))a.ok(fs.existsSync(path.join(root,ref)),ref);
 const bytes=fs.readFileSync(path.join(root,'assets/product-context/metadata-driven-Michael.mp4'));a.equal(bytes.length,5110733);a.equal(crypto.createHash('sha256').update(bytes).digest('hex'),'721f908e29ab3d3e8abd6867205ffc5afe235b61917210570a2cb33ac62c35a7');a.ok(bytes.indexOf(Buffer.from('moov'))<bytes.indexOf(Buffer.from('mdat')));
});
test('combined configuration narration has continuous valid caption timing across both parts',()=>{
 const vtt=read('assets/product-context/metadata-driven.en.vtt'),transcript=read('assets/product-context/metadata-driven-transcript.txt');a.match(vtt,/^WEBVTT/);const cues=[...vtt.matchAll(/(\d\d):(\d\d):(\d\d\.\d{3}) --> (\d\d):(\d\d):(\d\d\.\d{3})\n([\s\S]*?)(?=\n\n|$)/g)];a.equal(cues.length,11);let previous=0;
 for(const c of cues){const s=+c[1]*3600+ +c[2]*60+ +c[3],e=+c[4]*3600+ +c[5]*60+ +c[6];a.ok(s>=previous&&e>s&&e<=114.7);previous=e;a.ok(transcript.replace(/\s+/g,' ').includes(c[7].replace(/\s+/g,' ')));}
 a.equal(+cues[4][1]*3600+ +cues[4][2]*60+ +cues[4][3],34.7);
});
