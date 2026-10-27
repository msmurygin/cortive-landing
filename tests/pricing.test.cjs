const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),h=read('pricing.html');
const files=['index.html','product.html','integrations.html','vision.html','wms-cost.html','tools/wms-readiness-assessment/index.html','thanks.html','legal/privacy.html','legal/terms.html','pricing.html'];
test('pricing explains the approved model without invented fees or contractual guarantees',()=>{
 a.match(h,/Monthly subscription = <strong>Warehouse fee \+ RF capacity/);a.match(h,/concurrent RF sessions, not every employee account/);a.match(h,/sessions do not overlap/);a.match(h,/No mandatory consulting/);a.match(h,/Standard core warehouse modules are included/);
 a.match(h,/Standard product support and issue reporting/);a.match(h,/Professional services are quoted separately/);a.match(h,/Phonon is a separate product/);
 a.doesNotMatch(h,/[€£$]\s*\d|\bstarting (at|from)\b|\b24\/7\b|guaranteed ROI|go live in \d|unlimited (users|warehouses)|free trial|credit card/i);
 const data=[...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));a.equal(data.length,1);a.doesNotMatch(JSON.stringify(data),/"(?:offers|price|priceCurrency|lowPrice|highPrice|aggregateRating)"/);
});
test('pricing is a crawlable standalone page with correct canonical and matching social metadata',()=>{
 a.equal((h.match(/<h1\b/g)||[]).length,1);a.match(h,/<title>WMS Pricing \| Warehouse Management Software \| Quark WMS<\/title>/);a.match(h,/rel='canonical' href='https:\/\/quark.build\/pricing'/);a.match(h,/name='robots' content='index,follow'/);
 const data=JSON.parse(h.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);a.equal(data['@graph'][0].url,'https://quark.build/pricing');a.equal(data['@graph'][1].itemListElement.at(-1).item,'https://quark.build/pricing');
 a.match(h,/property='og:url' content='https:\/\/quark.build\/pricing'/);a.match(h,/name="twitter:description" content="Explore Quark WMS pricing/);
 const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);a.equal(ids.length,new Set(ids).size);
});
test('pricing reuses the contact destination and native FAQ without collecting or transmitting new data',()=>{
 a.equal((h.match(/<details class="q-price-faq">/g)||[]).length,5);for(const label of ['Request Early Access','Apply for Early Access','Request Pricing'])a.ok(h.includes('href="/#contact">'+label));
 a.deepEqual([...h.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]),['/design-assets/qds.js']);
 a.doesNotMatch(h,/<form|<input|<iframe|onclick=|onchange=|fetch\(|sendBeacon|type="application\/ld\+json"[^>]*src=/);
 a.match(h,/href="\/wms-cost">Plan your total WMS budget/);a.match(h,/wider ownership and implementation budget using your own assumptions/);
});
test('Pricing is available in desktop, mobile and footer navigation; shared footer remains intact',()=>{
 for(const f of files){const s=read(f);for(const name of ['q-nav','q-mnav']){const nav=s.match(new RegExp('<nav class="'+name+'"[\\s\\S]*?<\\/nav>'))[0];a.equal((nav.match(/data-nav="pricing"/g)||[]).length,1,f);a.ok(nav.indexOf('data-nav="product"')<nav.indexOf('data-nav="pricing"'),f);}a.match(s.slice(s.indexOf('<footer class="q-ftr">')),/href="\/pricing"/);}
 const footer=s=>s.slice(s.indexOf('<footer class="q-ftr">'),s.indexOf('</footer>',s.indexOf('<footer class="q-ftr">'))+9);a.equal(footer(h).replace(' aria-current="page"',''),footer(read('product.html')));
});
test('canonical Pricing routes and sitemap are prepared once; existing Cost content is unchanged',()=>{
 const config=JSON.parse(read('vercel.json'));a.deepEqual(config.rewrites.find(x=>x.source==='/pricing'),{source:'/pricing',destination:'/pricing.html'});for(const source of ['/pricing/','/pricing.html'])a.deepEqual(config.redirects.find(x=>x.source===source),{source,destination:'/pricing',permanent:true});a.equal(read('sitemap.xml').split('<loc>https://quark.build/pricing</loc>').length-1,1);
 const old=cp.execFileSync('git',['show','91822df4337e161553c05672c80f5f9a96e13fce:wms-cost.html'],{cwd:root,encoding:'utf8'}),cost=read('wms-cost.html');a.equal(cost.match(/<main[\s\S]*?<\/main>/)[0],old.match(/<main[\s\S]*?<\/main>/)[0]);a.equal(cost.split('</head>')[0],old.split('</head>')[0]);
});
