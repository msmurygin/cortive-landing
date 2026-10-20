const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),os=require('node:os');
const {build,base}=require('../scripts/build-site-redesign.cjs');
const root=path.resolve(__dirname,'..'),repo=process.env.QUARK_SITE_REPO||(fs.existsSync(path.join(root,'.git'))?root:'/Users/Maksim.Smurygin/quark.build/cortive-landing');
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'site-redesign-rc-test-'));
const original=n=>cp.execFileSync('git',['-C',repo,'show',base+':'+n],{maxBuffer:32*1024*1024}).toString();
const release=build({mode:'release',out:path.join(fixture,'site-redesign-release')}),preview=build({mode:'preview',out:path.join(fixture,'site-redesign-preview')});
const read=(n,m=release)=>fs.readFileSync(path.join(m.out,n),'utf8');
const pages=['index.html','product.html','vision.html','wms-cost.html','legal/privacy.html','legal/terms.html','thanks.html'];
process.on('exit',()=>fs.rmSync(fixture,{recursive:true,force:true}));
test('private review refuses production builds and cannot send enquiries or events',()=>{
 assert.notEqual(cp.spawnSync(process.execPath,['preview-only.cjs'],{cwd:preview.out,env:{...process.env,VERCEL_ENV:'production'}}).status,0);
 assert.equal(cp.spawnSync(process.execPath,['preview-only.cjs'],{cwd:preview.out,env:{...process.env,VERCEL_ENV:'preview'}}).status,0);
 for(const n of ['lead','events'])assert.match(read('api/'+n+'.js',preview),/503/);
 assert.match(read('robots.txt',preview),/Disallow: \//);assert.match(read('index.html',preview),/<fieldset disabled>/);
 for(const p of pages)assert.match(read(p,preview),/noindex,nofollow,noarchive/);
 const c=JSON.parse(read('vercel.json',preview));assert.ok(c.headers.some(x=>x.headers.some(h=>h.key==='Content-Security-Policy'&&h.value.includes("connect-src 'none'")&&h.value.includes("form-action 'none'"))));
});
test('release preserves real contact fields, consent, provider, handlers and existing collection baseline',()=>{
 const contact=s=>s.match(/<section class="product-contact" id="contact">[\s\S]*?<\/section>/)[0];assert.equal(contact(read('index.html')),contact(original('index.html')));
 for(const n of ['assets/leads.js','api/lead.js','api/events.js','lib/lead-events.js','robots.txt'])assert.equal(read(n),original(n));
 assert.ok(!fs.existsSync(path.join(release.out,'preview-only.cjs')));assert.ok(!fs.existsSync(path.join(release.out,'api/measurement-config.js')));
 assert.match(read('index.html'),/<script src='\/assets\/leads.js' defer>/);assert.ok(!/<fieldset disabled>|Private review/.test(read('index.html')));
 assert.equal(release.newAnalytics,false);assert.equal(release.productionReleaseApproved,false);
});
test('cost runtime/article, legal copy and original manifesto remain intact',()=>{
 for(const n of ['assets/seo/cost-model.js','assets/seo/cost-ui.js','assets/main.js','assets/product.css','assets/styles.css'])assert.equal(read(n),original(n));
 const main=s=>s.match(/<main\b[\s\S]*?<\/main>/)[0].replace(/ id="main"/,'');
 for(const n of ['wms-cost.html','legal/privacy.html','legal/terms.html'])assert.equal(main(read(n)),main(original(n)));
 const manifesto=s=>s.slice(s.indexOf('<!-- ═══ HERO ═══ -->')).split('<footer')[0].replace(/<\/main>$/,'');assert.equal(manifesto(read('vision.html')),manifesto(original('vision.html')));
 const ld=s=>s.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/)[0];assert.equal(ld(read('wms-cost.html')),ld(original('wms-cost.html')));
});
test('one central Product page replaces Screens and keeps meaningful incoming fragments',()=>{
 assert.ok(!fs.existsSync(path.join(release.out,'screens.html')));
 const c=JSON.parse(read('vercel.json'));for(const from of ['/screens.html','/screens','/screens/'])assert.deepEqual(c.redirects.find(r=>r.source===from),{source:from,destination:'/product',permanent:true});
 for(const id of ['topology','inventory','movements','studio','stock','allocation','configuration','inbound'])assert.ok(read('product.html').includes("id='"+id+"'"),'missing '+id);
 for(const p of pages){const h=read(p);const shell=h.match(/<header class='ux-header'>[\s\S]*?<\/header>/)[0]+h.match(/<footer class='ux-footer'>[\s\S]*?<\/footer>/)[0];assert.ok(!/href=['"]\/screens|Product Experience/.test(shell),p+' navigation links to retired section');}
 assert.match(read('product.html'),/WORKFLOW EXAMPLES/);assert.ok(!/<img\b|<video\b|data-capture|ux-capture|uxLightbox/.test(read('product.html')));
 assert.ok(!/fetch\(|sendBeacon|XMLHttpRequest|localStorage|sessionStorage/.test(read('design-assets/site.js')));
});
test('marketing copy contains no internal QA identifiers, acceptance claims or recording storyboards',()=>{
 for(const p of ['index.html','product.html'])assert.ok(!/TOPUP|RCV-D|d105fce|ACTION FOR AGENT|NOT Certified|scoped PASS|certif|retest|recording pending|storyboard|source-supported|Private design proposal|Product Experience/i.test(read(p).replace(/<[^>]*>/g,'')),p);
 assert.match(read('product.html'),/early-stage WMS/);assert.match(read('product.html'),/AI Harness, AI Onboarding and AI Support[^<]*not current product capabilities/);
 assert.ok(!fs.existsSync(path.join(release.out,'review.html')));assert.ok(!fs.existsSync(path.join(release.out,'design-system.html')));
});
test('release indexability, canonical, sitemap and factual structured data are correct',()=>{
 for(const [p,url] of [['index.html','/'],['product.html','/product'],['vision.html','/vision'],['wms-cost.html','/wms-cost']]){assert.ok(/name=['"]robots['"][^>]+content=['"]index,\s?follow/.test(read(p)));assert.ok(read(p).includes('https://quark.build'+url));assert.equal((read(p).match(/<h1[\s>]/g)||[]).length,1);}
 for(const p of ['legal/privacy.html','legal/terms.html','thanks.html'])assert.match(read(p),/noindex/);
 const map=read('sitemap.xml');assert.equal((map.match(/<loc>/g)||[]).length,4);assert.match(map,/https:\/\/quark.build\/product<\/loc>/);assert.ok(!/screens|assessment|review/.test(map));
 const c=JSON.parse(read('vercel.json'));assert.ok(!c.buildCommand);assert.ok(!c.headers.some(x=>x.source==='/(.*)'&&x.headers.some(h=>h.key==='X-Robots-Tag'&&h.value.includes('noindex'))));
 for(const p of ['index.html','product.html']){const schema=JSON.parse(read(p).match(/<script type='application\/ld\+json'>(.*?)<\/script>/)[1]);assert.ok(!/offers|aggregateRating/.test(JSON.stringify(schema)));assert.equal(schema['@type'],p==='index.html'?'SoftwareApplication':'BreadcrumbList');}
});
test('shared logo/header/footer and mobile menus are identical except current-page context',()=>{
 const shell=(h,tag)=>h.match(new RegExp('<'+tag+" class='ux-"+tag+"'>[\\s\\S]*?</"+tag+'>'))[0].replace(/ aria-current='page'/g,'');
 for(const p of pages){assert.equal(shell(read(p),'header'),shell(read('index.html'),'header'));assert.equal(shell(read(p),'footer'),shell(read('index.html'),'footer'));assert.equal((read(p).match(/aria-label='Quark home'/g)||[]).length,2);assert.match(read(p),/aria-label='Mobile navigation'/);assert.ok(/id=['"]main['"]/.test(read(p)));}
});
test('internal page/asset links and fragments resolve without exposing separate Assessment candidate',()=>{
 const resolve=h=>{let [route,frag]=h.split('#');route=route.split('?')[0];const c=JSON.parse(read('vercel.json'));const r=c.redirects.find(x=>x.source===route);if(r)route=r.destination;const rewrite=c.rewrites.find(x=>x.source===route);if(rewrite)route=rewrite.destination;let file=route==='/'?'index.html':route.slice(1);if(!path.extname(file))file+='.html';return[file,frag];};
 for(const p of pages)for(const m of read(p).matchAll(/(?:href|src)=["']([^"']+)["']/g)){const h=m[1];if(!h.startsWith('/')&&!h.startsWith('#'))continue;const [f,frag]=h.startsWith('#')?[p,h.slice(1)]:resolve(h);assert.ok(fs.existsSync(path.join(release.out,f)),p+' -> '+h);if(frag&&f.endsWith('.html'))assert.ok(new RegExp('id=["\']'+frag+'["\']').test(read(f)),p+' -> '+h);}
 assert.ok(!fs.existsSync(path.join(release.out,'tools/wms-readiness-assessment.html')));
});
