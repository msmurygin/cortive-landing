const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const demos=require('../scripts/product-demos.cjs'),manifest=require('../content/product-demos.json');
test('four independent videos remain unpublished, without player or third-party media requests',()=>{
 assert.equal(manifest.length,4);assert.deepEqual(manifest.map(x=>x.section),['inbound','inbound','inventory','execution']);
 const html=read('product.html'),before=html;assert.equal(demos.build(root,manifest).active,0);assert.equal(read('product.html'),before);
 assert.doesNotMatch(html,/<iframe|youtube(?:-nocookie)?\.com|ytimg\.com/);assert.doesNotMatch(html,/src="\/assets\/product-demos.js/);
 for(const item of manifest){assert.equal(item.youtubeId,null);assert.equal(item.publicationApproved,false);assert.match(html,new RegExp('data-product-demo-slot="'+item.key+'" hidden'));}
});
test('video publication requires verified IDs, posters, captions and separate approval',()=>{
 const draft=manifest[0];assert.equal(demos.validate(draft,root),false);
 assert.throws(()=>demos.validate({...draft,publicationApproved:true},root),/Verified/);
 assert.throws(()=>demos.validate({...draft,publicationApproved:true,metadataVerified:true,youtubeId:'invalid'},root),/Verified/);
 const fixture={...draft,publicationApproved:true,metadataVerified:true,youtubeId:'TEST_ONLY_1',captionsConfirmed:false};
 assert.throws(()=>demos.validate(fixture,root),/Verified|captions/);
 const wrong={...draft,section:'inventory'};assert.throws(()=>demos.validate(wrong,root),/placement/);
});
test('client component constructs a privacy-enhanced player only within explicit click handler',()=>{
 const code=read('assets/product-demos.js');assert.match(code,/addEventListener\('click'/);assert.match(code,/youtube-nocookie\.com\/embed/);
 assert.ok(code.indexOf("createElement('iframe')")>code.indexOf("addEventListener('click'"));
 assert.doesNotMatch(code,/autoplay|fetch\(|sendBeacon|localStorage|sessionStorage|ytimg/);
});
