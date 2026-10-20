const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const {buildProtected}=require('../scripts/build-protected-preview.cjs');
for(const candidate of ['rc-a','rc-b'])test(candidate+' protected preview refuses production builds, real submissions and measurement',()=>{
 const m=buildProtected(candidate),read=n=>fs.readFileSync(path.join(m.out,n),'utf8'),config=JSON.parse(read('vercel.json'));
 assert.equal(m.deployed,false);assert.equal(m.release_authorized,false);assert.match(m.required_before_deployment,/Vercel Authentication/);
 assert.ok(config.headers.some(rule=>rule.headers.some(h=>h.key==='X-Robots-Tag'&&h.value==='noindex, nofollow, noarchive')));
 assert.match(read('robots.txt'),/Disallow: \//);assert.equal(Object.hasOwn(config,'public'),false);
 const page=candidate==='rc-a'?'wms-cost.html':'features/inventory-management.html',html=read(page),other=candidate==='rc-a'?'features/inventory-management.html':'wms-cost.html';
 assert.match(html,/content="noindex,nofollow,noarchive"/);assert.match(html,/Private review/);assert.equal(fs.existsSync(path.join(m.out,other)),false);
 assert.equal(fs.existsSync(path.join(m.out,'RC-MANIFEST.json')),false);
 assert.match(read('index.html'),/<fieldset disabled>/);
 assert.doesNotMatch(read('assets/leads.js'),/fetch\s*\(|sendBeacon|FormData/);
 for(const env of ['production','development','preview']){const r=cp.spawnSync(process.execPath,['preview-only.cjs'],{cwd:m.out,env:{...process.env,VERCEL_ENV:env}});assert.equal(r.status,env==='preview'?0:1);}
 const oldFetch=global.fetch;let calls=0;global.fetch=()=>{calls++;throw Error('No upstream request allowed');};
 try{for(const api of ['lead','events','measurement-config']){
  delete require.cache[require.resolve(path.join(m.out,'api',api+'.js'))];
  const res={setHeader(){},status(n){this.code=n;return this;},json(value){this.body=value;return this;}};
  require(path.join(m.out,'api',api+'.js'))({method:'POST',body:{email:'synthetic@example.invalid'}},res);
  assert.equal(res.code,api==='measurement-config'?200:503);if(api==='measurement-config')assert.equal(res.body.enabled,false);
 }assert.equal(calls,0);}finally{global.fetch=oldFetch;}
});
