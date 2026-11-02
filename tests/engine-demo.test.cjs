const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function preview(fetchImpl){
 let id=0;const timers=new Map(),listeners={};
 const root={innerHTML:'',contains:()=>false,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:(n,f)=>{(listeners[n]??=[]).push(f)}};
 const context={document:{activeElement:null,getElementById:k=>k==='qe-root'?root:null},window:{},Date,URL,AbortController,fetch:fetchImpl,
 setTimeout:f=>{timers.set(++id,f);return id},clearTimeout:n=>timers.delete(n)};
 vm.runInNewContext(read('assets/engine-demo/engine-demo.js'),context);
 return {demo:context.window.QuarkEngineDemo,root,click:button=>Promise.all(listeners.click.map(f=>f({target:{closest:s=>s==='button'?button:null}}))),flush(){while(timers.size){const [n,f]=timers.entries().next().value;timers.delete(n);f()}}};
}
test('receipt, mismatch and putaway conserve stock across both renderers; retries cannot duplicate stock',()=>{
 const p=preview(),{demo:d}=p;d.generate();p.flush();
 d.act.putaway('tui');assert.equal(d.state.onhand,0);assert.equal(d.state.step,'receive');
 d.act.receive('web');assert.equal(d.state.dock,24);assert.equal(d.state.step,'scan');
 d.act.receive('tui');assert.equal(d.state.dock,24);
 d.act.scan('B-02-01-L3','tui',true);assert.equal(d.state.step,'scan');assert.ok(d.state.mismatch);
 assert.match(p.root.innerHTML,/Expected/);assert.match(p.root.innerHTML,/MISMATCH/);
 d.act.scan('A-01-02-L1','tui',true);assert.equal(d.state.step,'putaway');assert.equal(d.state.mismatch,null);
 assert.match(p.root.innerHTML,/Confirm putaway/);assert.match(p.root.innerHTML,/CONFIRM PUTAWAY/);
 d.act.putaway('web');assert.equal(d.state.onhand,24);assert.equal(d.state.dock,0);
 d.act.putaway('tui');assert.equal(d.state.onhand,24);p.flush();assert.equal(d.state.modal,true);
});
test('restarting before the completion delay prevents an unrelated lead popup',()=>{
 const p=preview(),d=p.demo;d.generate();p.flush();d.act.receive('web');d.act.scan('A-01-02-L1','tui');d.act.putaway('web');
 p.click({id:'qe-reset',dataset:{}});p.flush();assert.equal(d.state.modal,false);assert.equal(d.state.step,'receive');assert.equal(d.state.onhand,0);
});
test('minimum and maximum layouts always contain the destination; parameter limits bound rendering',()=>{
 for(const [a,b,l,count] of [[1,1,1,2],[12,20,8,3840],[999,999,999,3840]]){
 const p=preview(),d=p.demo;Object.assign(d.state.setup,{aisles:a,bays:b,levels:l});d.generate();p.flush();
 assert.equal(d.state.setup.aisles*d.state.setup.bays*d.state.setup.levels*2,count);
 d.act.receive('tui');d.act.scan('A-01-02-L1','web');assert.equal(d.state.step,'putaway');
 }
});
test('workflow stays local; AI requests use only the server endpoint without trackers or browser credentials',()=>{
 const js=read('assets/engine-demo/engine-demo.js');assert.doesNotMatch(js,/claude|anthropic/i);assert.doesNotMatch(js,/XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie|import\s*\(|ANTHROPIC_API_KEY|api\.anthropic\.com/);assert.equal((js.match(/fetch\(/g)||[]).length,1);assert.match(js,/fetch\('\/api\/engine-analyze'/);
 const h=read('index.html');assert.equal((h.match(/id="engine-demo"/g)||[]).length,1);assert.ok(h.indexOf('id="engine-demo"')>h.indexOf('A clearer view of'));assert.ok(h.indexOf('id="engine-demo"')<h.indexOf('<nav class="q-qs"'));
 assert.match(h,/<noscript><p>This interactive example needs JavaScript/);
 assert.match(js,/send your plan or description to our AI service/);assert.match(js,/nothing was sent and no workspace was created/);assert.doesNotMatch(js,/Prototype — contacts are not sent and no account is created yet/);
});

test('integration preserves the current homepage, including SEO, contact form, CTA and verification tags',()=>{
 const cp=require('node:child_process');
 const base=cp.execFileSync('git',['show','744b8ee3fb3a1c97bfa0d6f70d7f91c6c64bd588:index.html'],{cwd:path.join(__dirname,'..'),encoding:'utf8'});
 const stripped=read('index.html').replace('<link rel="stylesheet" href="/assets/engine-demo/engine-demo.css">','').replace(/<section class="qe qe-sec[\s\S]*?<\/section>/,'').replace('<script src="/assets/engine-demo/engine-demo.js" defer></script>','');
 assert.equal(stripped.replace(/>\s+</g,'><'),base.replace(/>\s+</g,'><'));
});

test('Claude suggestions drive the preview while unknown fields and manual edits remain explicit',async()=>{
 let body;const p=preview(async(url,options)=>{assert.equal(url,'/api/engine-analyze');body=JSON.parse(options.body);return {ok:true,json:async()=>({ok:true,result:{type:'3PL',aisles:2,bays:5,levels:null,summary:'Two aisles; rack height is not shown.',uncertainties:['Confirm rack levels.'],rules:[]}})}});
 p.demo.state.setup.levels=6;await p.click({id:'qe-demo',dataset:{}});
 assert.equal(body.consent,true);assert.equal(p.demo.state.setup.aisles,2);assert.equal(p.demo.state.setup.bays,5);assert.equal(p.demo.state.setup.levels,6);assert.equal(p.demo.state.setup.src,'ai');assert.match(p.root.innerHTML,/not found · check/);assert.doesNotMatch(p.root.innerHTML,/Claude|Anthropic/);assert.match(p.root.innerHTML,/Confirm rack levels/);
});
test('a delayed Claude response cannot overwrite parameters after cancellation',async()=>{
 let resolve;const p=preview(()=>new Promise(r=>resolve=r));const pending=p.click({id:'qe-demo',dataset:{}});
 await p.click({id:'qe-manual',dataset:{}});resolve({ok:true,json:async()=>({ok:true,result:{type:'3PL',aisles:8,bays:8,levels:8,summary:'late',uncertainties:[],rules:[]}})});await pending;
 assert.equal(p.demo.state.stage,'params');assert.equal(p.demo.state.setup.src,'manual');assert.equal(p.demo.state.setup.aisles,3);
});
test('a failed AI call exposes an error and never fabricates a successful analysis',async()=>{
 const p=preview(async()=>({ok:false,json:async()=>({error:'Claude is unavailable.'})}));await p.click({id:'qe-demo',dataset:{}});
 assert.equal(p.demo.state.stage,'drop');assert.match(p.root.innerHTML,/Claude is unavailable/);assert.equal(p.demo.state.setup.ai,null);
});
