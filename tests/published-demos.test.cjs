const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),manifest=require('../content/product-demos.json'),demos=require('../scripts/product-demos.cjs');
test('four founder-supplied IDs appear only in the agreed operational sections',()=>{
 a.deepEqual(manifest.map(x=>x.youtubeId),['pmOGie2ltEg','cP4fYOkpGNY','oV1XNz-Wz4g','bpwlTV-cp44']);const html=read('product.html');
 for(const d of manifest){a.equal(demos.validate(d,root),true);a.ok(d.accessibleDescription);a.equal(d.captionsConfirmed,false);a.equal(d.duration,null);a.ok(html.indexOf('id="demo-'+d.key+'"')>html.indexOf('id="'+d.section+'"'));a.ok(html.indexOf('id="demo-'+d.key+'"')<html.indexOf('</section>',html.indexOf('id="'+d.section+'"')));}
});
test('build preserves all existing Product content, metadata, navigation and CTAs',()=>{
 let html=read('product.html');for(const d of manifest)html=html.replace(demos.render(d),'');html=html.replace('<link rel="stylesheet" href="/design-assets/product-demos.css"><script src="/assets/product-demos.js" defer></script>','');a.equal(html,cp.execFileSync('git',['show','dd5fc0f:product.html'],{cwd:root,encoding:'utf8'}));
});
test('initial markup has local lazy posters, no iframe, Google scripts, preconnect or remote thumbnails',()=>{
 const html=read('product.html');a.doesNotMatch(html,/<iframe|<[^>]+(?:src|href)=["']https:\/\/(?:i\.ytimg|www\.youtube|www\.google)[^>]+(?:preconnect|script|img)/i);
 for(const d of manifest){a.ok(fs.statSync(path.join(root,d.poster)).size<100000);a.match(demos.render(d),/loading="lazy" decoding="async"/);a.match(demos.render(d),/Text description of this demonstration/);}
});
test('component makes zero player connections before interaction, then loads only the selected nocookie video',()=>{
 let created=[],callbacks=[];const containers=manifest.map(d=>({dataset:{youtubeId:d.youtubeId,title:d.title},querySelector(){return {hidden:true,addEventListener(type,cb,opts){a.equal(type,'click');a.equal(opts.once,true);callbacks.push(cb)}}},replaceChildren(f){this.child=f}}));
 const document={querySelectorAll(){return containers},createElement(tag){a.equal(tag,'iframe');const f={focus(){this.focused=true}};created.push(f);return f}};vm.runInNewContext(read('assets/product-demos.js'),{document});a.equal(created.length,0);
 callbacks[2]();a.equal(created.length,1);a.equal(containers[2].child.src,'https://www.youtube-nocookie.com/embed/oV1XNz-Wz4g?rel=0&cc_load_policy=1&playsinline=1');a.equal(containers[2].child.title,manifest[2].title);a.equal(containers[2].child.focused,true);a.ok(!containers[0].child);a.equal(containers[2].child.allowFullscreen,true);a.doesNotMatch(read('assets/product-demos.js'),/autoplay|fetch\(|sendBeacon|localStorage|sessionStorage/);
});
test('only verified upload dates produce VideoObject; no invented duration or transcripts',()=>{
 const html=read('product.html');const schemas=[...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])).filter(x=>x['@type']==='VideoObject');a.equal(schemas.length,2);
 for(const d of manifest){a.equal(d.transcript,null);a.equal(schemas.filter(s=>s.embedUrl.endsWith(d.youtubeId)).length,d.uploadDate?1:0);}for(const s of schemas){a.ok(!('duration'in s));a.ok(s.thumbnailUrl.startsWith('https://quark.build/assets/demos/'));}
});
test('publication remains gated; captions cannot be fabricated, and text alternative is required when absent',()=>{
 const d=manifest[0];a.equal(demos.validate({...d,publicationApproved:false},root),false);a.throws(()=>demos.validate({...d,accessibleDescription:'',captionsConfirmed:false},root),/Captions|description/);a.throws(()=>demos.validate({...d,youtubeId:'invalid'},root),/Verified/);
});
test('unrelated production files and settings remain unchanged',()=>{
 for(const f of ['index.html','vision.html','wms-cost.html','tools/wms-readiness-assessment/index.html','vercel.json','robots.txt','sitemap.xml','api/lead.js','api/events.js','lib/lead-events.js','assets/leads.js','assessment-assets/discovery-model.js','assessment-assets/assessment-ui.js','assessment-assets/assessment-pdf.js','design-assets/qds.js','design-assets/qds.css'])a.equal(read(f),cp.execFileSync('git',['show','dd5fc0f:'+f],{cwd:root,encoding:'utf8'}),f);
});
