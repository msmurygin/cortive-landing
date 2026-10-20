const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {build}=require('../scripts/build-rc.cjs'),root=path.resolve(__dirname,'..');
for(const candidate of ['rc-a','rc-a-measurement','rc-b'])test(candidate+' contains only its independently released page and preserved Vision',()=>{
 const m=build(candidate),dir=path.join(root,'review-dist',candidate),read=n=>fs.readFileSync(path.join(dir,n),'utf8'),inventory=candidate==='rc-b',route=inventory?'/features/inventory-management':'/wms-cost',other=inventory?'/wms-cost':'/features/inventory-management';
 assert.equal(m.release_authorized,false);assert.equal(m.measurement_enabled,false);
 const html=read(route.slice(1)+'.html'),home=read('index.html'),sitemap=read('sitemap.xml');
 assert.ok(html.includes('href="https://quark.build'+route+'"'));assert.ok(html.includes('content="index,follow"'));assert.ok(!html.includes('seo-draft'));assert.ok(!html.includes('href="'+other+'"'));assert.ok(!html.includes('/draft-assets/'));
 assert.ok(home.includes('href="'+route+'"'));assert.ok(!home.includes('href="'+other+'"'));assert.equal((sitemap.match(/<loc>/g)||[]).length,4);assert.ok(!sitemap.includes(other));
 assert.equal(m.changes.some(x=>x.path==='vision.html'||x.path==='robots.txt'||x.path==='screens.html'),false);
 assert.equal(m.changes.some(x=>x.path==='legal/privacy.html'),candidate==='rc-a-measurement');
 if(candidate==='rc-a')assert.equal(m.changes.some(x=>x.path.startsWith('api/')||x.path==='assets/main.js'||x.path==='assets/leads.js'),false);
 const config=JSON.parse(read('vercel.json'));assert.ok(config.rewrites.some(x=>x.source===route));assert.ok(config.redirects.some(x=>x.source===route+'/'));
 for(const ref of [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)[^"]*"/g)])assert.ok(fs.existsSync(path.join(dir,ref[1])));
});
