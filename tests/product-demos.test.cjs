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

test('approved fixture builds correct placement, aspect ratio and optional valid VideoObject without requests',()=>{
 const os=require('node:os'),temp=fs.mkdtempSync(path.join(os.tmpdir(),'quark-video-unit-'));
 try{fs.mkdirSync(path.join(temp,'assets/demos'),{recursive:true});fs.writeFileSync(path.join(temp,'assets/demos/fixture.png'),Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=','base64'));
  const item={...manifest[0],youtubeId:'TEST_ONLY_1',poster:'/assets/demos/fixture.png',width:640,height:480,captionsConfirmed:true,publicationApproved:true,metadataVerified:true,stages:['Unit-test stage; no recording claim']};
  const template='<html><head></head><body><div data-product-demo-slot="receiving" hidden></div></body></html>';fs.writeFileSync(path.join(temp,'product.html'),template);
  assert.equal(demos.build(temp,[item]).active,1);let html=fs.readFileSync(path.join(temp,'product.html'),'utf8');assert.match(html,/aspect-ratio:640\/480/);assert.match(html,/Load video player/);assert.doesNotMatch(html,/<iframe|VideoObject/);assert.match(html,/About this warehouse operation/);
  fs.writeFileSync(path.join(temp,'product.html'),template);assert.equal(demos.build(temp,[{...item,uploadDate:'2026-01-01T00:00:00Z'}]).active,1);html=fs.readFileSync(path.join(temp,'product.html'),'utf8');const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);assert.equal(schema['@type'],'VideoObject');assert.equal(schema.uploadDate,'2026-01-01T00:00:00Z');assert.ok(!('duration'in schema));assert.throws(()=>demos.validate({...item,uploadDate:'2026-99-99T00:00:00Z'},temp));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
