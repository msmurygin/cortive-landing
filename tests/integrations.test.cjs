const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8'),h=read('integrations.html');
const ids=[...h.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
test('integration catalogue is crawlable and structured data matches visible connector cards',()=>{
 a.equal((h.match(/<h1\b/g)||[]).length,1);a.match(h,/<title>WMS Integrations/);a.match(h,/rel='canonical' href='https:\/\/quark.build\/integrations'/);a.match(h,/name='robots' content='index,follow'/);
 const graph=JSON.parse(h.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
 const list=graph.find(x=>x['@type']==='CollectionPage').mainEntity.itemListElement;a.equal(list.length,17);
 for(const item of list){a.ok(ids.includes(new URL(item.url).hash.slice(1)));a.ok(h.includes('>'+item.name.replaceAll('&','&amp;')+'</h3>'));}
 a.equal(ids.length,new Set(ids).size);a.equal(graph.find(x=>x['@type']==='BreadcrumbList').itemListElement.at(-1).item,'https://quark.build/integrations');
});
test('catalogue has no lead collection or new third-party requests and scopes validation honestly',()=>{
 a.doesNotMatch(h,/<iframe|<form|<input|<video|fetch\(|sendBeacon|vendor-certified|production-ready|two-way synchronisation|ozone\.bg|aggregateRating/i);
 a.deepEqual([...h.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]),['/design-assets/qds.js']);
 a.match(h,/mock servers and end-to-end contract tests/);a.match(h,/not been validated against live customer marketplace accounts/);a.match(h,/href="\/#contact"/);
 a.match(h,/>Ozon Seller<\/h3>/);a.match(h,/>Telegram<\/h3>/);a.match(h,/notification channel, separate from order import/);
 a.doesNotMatch(h,/uploadDate|priceCurrency|priceRange|reviewRating|estimatedCost/);
});
test('canonical route, legacy redirects and sitemap publish the same single destination',()=>{
 const config=JSON.parse(read('vercel.json'));a.deepEqual(config.rewrites.find(x=>x.source==='/integrations'),{source:'/integrations',destination:'/integrations.html'});
 for(const source of ['/integrations/','/integrations.html'])a.deepEqual(config.redirects.find(x=>x.source===source),{source,destination:'/integrations',permanent:true});
 a.equal(read('sitemap.xml').split('<loc>https://quark.build/integrations</loc>').length-1,1);
 for(const f of ['index.html','product.html','vision.html','wms-cost.html','tools/wms-readiness-assessment/index.html','thanks.html','legal/privacy.html','legal/terms.html'])a.ok(read(f).includes('<li><a href="/integrations">Integrations</a></li>'),f);
 a.match(read('product.html'),/Explore built-in integrations/);
});
