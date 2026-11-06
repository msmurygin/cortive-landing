const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const F=require('../assets/engine-demo/engine-flow');
const read=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
function task(op='putaway',serial=false){const t=F.emptyTask();Object.assign(t,{operation:op,title:F.labels[op],destination_aisle:'B'});t.product={name:serial?'Laptops':'Olive oil',sku:serial?'LAPTOP-1':'OIL-1',pack_label:'Case',pack_units:6,pack_quantity:2,serialized:serial,lot_controlled:false};t.steps=F.defaults(op,serial,false);return t}
const ai=(t=F.emptyTask(),over={})=>({type:'E-commerce',aisles:3,bays:4,levels:4,summary:'Warehouse preview.',uncertainties:[],rules:[],task:t,...over});
function preview(fetchImpl,navigator,guided=false){
 let id=0;const timers=new Map(),listeners={};
 const root={dataset:guided?{experience:'guided'}:{},innerHTML:'',contains:()=>false,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:(n,f)=>{(listeners[n]??=[]).push(f)}};
 class Reader{readAsDataURL(file){file.arrayBuffer().then(b=>{this.result='data:'+file.type+';base64,'+Buffer.from(b).toString('base64');this.onload()})}}
 const context={navigator,document:{activeElement:null,getElementById:k=>k==='qe-root'?root:null},window:{QuarkEngineFlow:F},Date,URL,FileReader:Reader,AbortController,AbortSignal,fetch:fetchImpl,
 setTimeout:f=>{timers.set(++id,f);return id},clearTimeout:n=>timers.delete(n)};
 if(guided)vm.runInNewContext(read('assets/engine-demo/engine-try.js'),context);
 vm.runInNewContext(read('assets/engine-demo/engine-demo.js'),context);
 const event=(name,target)=>Promise.all((listeners[name]||[]).map(f=>f({preventDefault(){},target:{dataset:{},classList:{contains:()=>false},...target}})));
 const p={demo:context.window.QuarkEngineDemo,root,event,click:button=>event('click',{closest:s=>s==='button'?button:null}),flush(){while(timers.size){const [n,f]=timers.entries().next().value;timers.delete(n);f()}},finish(){let n=0;while(!p.demo.state.run.completed){if(++n>150)throw Error('loop');p.demo.act.demo('web')}}};
 return p;
}
test('the requested putaway process starts with LPN scanning, olive oil and a free B destination in both renderers',()=>{
 const p=preview(),d=p.demo;d.state.setup.task=task();d.generate();p.flush();
 a.equal(F.view(d.state.definition,d.state.run).code,'scan_lpn');a.match(p.root.innerHTML,/Olive oil/);a.doesNotMatch(p.root.innerHTML,/Confirm receipt/);a.match(d.state.definition.destination,/^B-/);
 d.act.demo('tui');a.equal(d.state.step,'scan');d.act.submit('web','A-01-02-L1');a.equal(d.state.run.stored,0);a.match(p.root.innerHTML,/Expected B-/);
 d.act.demo('web');a.match(p.root.innerHTML,/Confirm LPN placement/);d.act.submit('tui');a.equal(d.state.run.completed,true);a.equal(d.state.run.stored,12);a.equal(d.state.run.received,0);
 d.act.submit('web');a.equal(d.state.run.stored,12);p.flush();a.equal(d.state.modal,true);
});
test('serial capture is driven by packaging JSON and uses the same counter in WebRF and TUI',()=>{
 const p=preview(),d=p.demo;d.state.setup.task=task('receiving',true);d.generate();p.flush();
 while(F.view(d.state.definition,d.state.run).code!=='capture_serials')d.act.demo('web');
 a.match(p.root.innerHTML,/0 \/ 12/);d.act.submit('web','UNIT-001');d.act.submit('tui','UNIT-001');a.equal(d.state.run.serials.length,1);a.match(p.root.innerHTML,/Already scanned/);
 d.act.submit('tui','UNIT-002');a.match(p.root.innerHTML,/2 \/ 12/);a.match(p.root.innerHTML,/SERIALS: 2 \/ 12/);
 p.finish();a.equal(d.state.run.receiptClosed,true);a.equal(d.state.run.serials.length,12);a.equal(d.state.run.dock,12);a.equal(d.state.run.stored,0);
});
test('restart cancels a delayed completion popup and preserves the selected operation',async()=>{
 const p=preview(),d=p.demo;d.state.setup.task=task();d.generate();p.flush();p.finish();await p.click({id:'qe-reset',dataset:{}});p.flush();
 a.equal(d.state.modal,false);a.equal(F.view(d.state.definition,d.state.run).code,'scan_lpn');a.equal(d.state.run.dock,12);
});
test('layout limits keep rendering bounded and invalid destinations cannot silently change aisle',()=>{
 for(const [aisles,bays,levels,count] of [[1,1,1,2],[12,20,8,3840],[999,999,999,3840]]){const p=preview(),d=p.demo;Object.assign(d.state.setup,{aisles,bays,levels});d.generate();p.flush();a.equal(d.state.setup.aisles*d.state.setup.bays*d.state.setup.levels*2,count)}
 const p=preview();p.demo.state.setup.aisles=1;p.demo.state.setup.task=task();p.demo.generate();a.equal(p.demo.state.phase,'setup');a.match(p.root.innerHTML,/outside the layout/);
});
test('browser assets have no credentials or trackers; only same-origin AI and consented enquiry requests exist',()=>{
 const js=read('assets/engine-demo/engine-demo.js');a.doesNotMatch(js,/claude|anthropic|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie|import\s*\(/i);a.equal((js.match(/fetch\(/g)||[]).length,2);a.match(js,/fetch\('\/api\/engine-analyze'/);a.match(js,/fetch\('\/api\/engine-enquiry'/);a.match(js,/Send my contact details and this demo setup/);
 a.doesNotMatch(read('assets/engine-demo/engine-flow.js'),/fetch\(|eval\(|new Function|https?:/);
 const h=read('index.html');a.equal((h.match(/id="engine-demo"/g)||[]).length,1);a.ok(h.indexOf('id="engine-demo"')>h.indexOf('A clearer view of'));a.ok(h.indexOf('id="engine-demo"')<h.indexOf('<nav class="q-qs"'));a.match(read('try.html'),/<noscript><p>This interactive example needs JavaScript/);a.doesNotMatch(h,/engine-flow.js|engine-demo.js|id="qe-root"/);
});
test('the homepage retains published content, forms and SEO around the compact try entry',()=>{
 const base=require('node:child_process').execFileSync('git',['show','a3e039c:index.html'],{cwd:path.join(__dirname,'..'),encoding:'utf8'});
 a.equal(require('./try-preservation.cjs')('index.html',read('index.html')),base);
});
test('AI process JSON reaches the renderers while unknown layout fields remain explicit',async()=>{
 let body;const p=preview(async(url,options)=>{body=JSON.parse(options.body);return {ok:true,json:async()=>({ok:true,result:ai({...task(),localized_commands:{primary_btn:'ПОТВЪРДИ МЕСТЕНЕ',enter_btn:'ВЪВЕДИ'}},{aisles:2,bays:5,levels:4,defaulted_layout:['levels'],detected_region:'BG-PLOVDIV-TRAKIA',uncertainties:['Confirm rack levels.']})})}});
 p.demo.state.setup.levels=6;await p.click({id:'qe-demo',dataset:{}});a.equal(body.consent,true);a.equal(p.demo.state.setup.aisles,2);a.equal(p.demo.state.setup.levels,4);a.equal(p.demo.state.setup.task.operation,'putaway');a.match(p.root.innerHTML,/demo default · check/);a.match(p.root.innerHTML,/Confirm rack levels/);a.doesNotMatch(p.root.innerHTML,/claude|anthropic/i);
 p.demo.generate();p.flush();a.match(p.root.innerHTML,/ВЪВЕДИ/);
 p.demo.act.demo('web');p.demo.act.demo('web');
 a.match(p.root.innerHTML,/data-a="flow-confirm"><span>ПОТВЪРДИ МЕСТЕНЕ/);
 a.match(p.root.innerHTML,/\[ENTER\] ПОТВЪРДИ МЕСТЕНЕ/);
 a.match(p.root.innerHTML,/<h4 class="qe-rf-title">Потвърди местене на LPN<\/h4>/);
 a.match(p.root.innerHTML,/ПОТВЪРДИ МЕСТЕНЕ НА LPN/);
 a.match(p.root.innerHTML,/<dt>Базови единици<\/dt>/);
 a.equal((p.root.innerHTML.match(/\[AI:BG-PLOVDIV-TRAKIA\]/g)||[]).length,2);
});
test('cancelled or failed AI requests do not fabricate a process or overwrite manual setup',async()=>{
 let resolve;const p=preview(()=>new Promise(r=>resolve=r));const pending=p.click({id:'qe-demo',dataset:{}});await p.click({id:'qe-manual',dataset:{}});resolve({ok:true,json:async()=>({ok:true,result:ai(task(),{aisles:8})})});await pending;a.equal(p.demo.state.stage,'params');a.equal(p.demo.state.setup.src,'manual');a.equal(p.demo.state.setup.aisles,3);
 const failed=preview(async()=>({ok:false,json:async()=>({error:'Analysis unavailable.'})}));await failed.click({id:'qe-demo',dataset:{}});a.equal(failed.demo.state.stage,'drop');a.match(failed.root.innerHTML,/Analysis unavailable/);
});
test('inline answers preserve the uploaded plan and distinguish unknown defaults from confirmed values',async()=>{
 const requests=[];const p=preview(async(url,options)=>{requests.push(JSON.parse(options.body));return {ok:true,json:async()=>({ok:true,result:ai(F.emptyTask(),{aisles:2,bays:15,levels:requests.length===1?null:1,uncertainties:requests.length===1?['How many vertical levels?']:[]})})}});
 const file=new Blob([Buffer.from([137,80,78,71,13,10,26,10])],{type:'image/png'});file.name='synthetic.png';await p.event('change',{id:'qe-plan',files:[file]});await p.click({id:'qe-analyze-file',dataset:{}});a.match(p.root.innerHTML,/data-question="0"/);
 await p.event('input',{id:'qe-answer-0',dataset:{question:'0'},value:'Ярусы неизвестны. Для демо один.'});await p.click({id:'qe-refine',dataset:{}});
 a.equal(requests[1].file.data,requests[0].file.data);a.equal(requests[1].file.type,'image/png');a.match(requests[1].text,/Ярусы неизвестны/);a.ok(!requests[1].setup.confirmed.includes('levels'));a.equal(p.demo.state.setup.levels,1);a.equal(p.demo.state.setup.plan.name,'synthetic.png');
 await p.event('input',{id:'qe-desc',value:'Now demonstrate putaway.'});await p.click({id:'qe-desc-go',dataset:{}});a.equal(requests[2].file.data,requests[0].file.data);
});
test('the continuation form sends only after consent and reports a real endpoint acknowledgement',async()=>{
 let calls=0,body;const p=preview(async(url,options)=>{calls++;a.equal(url,'/api/engine-enquiry');body=JSON.parse(options.body);return {ok:true,json:async()=>({ok:true})}});p.demo.state.setup.task=task();p.demo.generate();p.flush();p.finish();p.flush();
 p.demo.state.em='max@quark.build';p.demo.state.co='Internal QA';await p.event('submit',{id:'qe-mform'});a.equal(calls,0);a.match(p.root.innerHTML,/Please agree/);
 await p.event('change',{id:'qe-consent',checked:true});await p.event('submit',{id:'qe-mform'});a.equal(calls,1);a.equal(body.consent,'yes');a.equal(body.process.pack_units,6);a.equal(body.process.pack_quantity,2);a.equal(body.process.operation,'putaway');a.equal(body.serials,undefined);a.equal(p.demo.state.sent,true);a.match(p.root.innerHTML,/request was sent/);
});
test('model-generated labels and serial text are escaped by both renderers',()=>{
 const p=preview(),t=task('receiving',true);t.product.name='<img src=x onerror=alert(1)>';t.lpn='<svg onload=alert(1)>';p.demo.state.setup.task=t;p.demo.generate();p.flush();a.ok(!p.root.innerHTML.includes('<img src=x'));a.match(p.root.innerHTML,/&lt;img/);
 while(F.view(p.demo.state.definition,p.demo.state.run).code!=='capture_serials')p.demo.act.demo('web');p.demo.act.submit('web','<script>bad</script>');a.ok(!p.root.innerHTML.includes('<script>bad'));a.match(p.root.innerHTML,/&lt;script&gt;/);
 p.finish();a.ok(!p.root.innerHTML.includes('<svg onload='));a.match(p.root.innerHTML,/&lt;svg onload/);
});

test('browser preferences localize both terminals before any AI request',()=>{
 const p=preview(undefined,{languages:['fr-FR','el-GR'],language:'fr-FR'});
 a.match(p.root.innerHTML,/Δεν έχει ανατεθεί εργασία/);
 a.match(p.root.innerHTML,/ΑΝΑΜΟΝΗ ΡΥΘΜΙΣΗΣ/);
 p.demo.state.setup.task=task();
 p.demo.generate();p.flush();
 a.match(p.root.innerHTML,/data-a="flow-submit">ΕΙΣΑΓΩΓΗ/);
 p.demo.act.demo('web');p.demo.act.demo('web');
 a.match(p.root.innerHTML,/data-a="flow-confirm"><span>ΕΠΙΒΕΒΑΙΩΣΗ/);
 a.match(p.root.innerHTML,/\[ENTER\] ΕΠΙΒΕΒΑΙΩΣΗ/);
});

test('guided entry shows only operation choices; a local example reaches one RF screen without AI or automatic lead popup',async()=>{
 let calls=0;const p=preview(async()=>{calls++;throw Error('No AI for a local sample')},undefined,true);
 a.match(p.root.innerHTML,/What would you like to try/);a.doesNotMatch(p.root.innerHTML,/qe-rfscan|qe-tuiscan|qe-desc|Event journal/);
 await p.click({dataset:{qtOperation:'putaway'}});a.match(p.root.innerHTML,/What do you store/);a.doesNotMatch(p.root.innerHTML,/qe-rfscan|qe-tuiscan/);
 await p.click({id:'qt-example',dataset:{}});a.equal(p.demo.state.phase,'live');a.equal(p.demo.state.definition.operation,'putaway');a.match(p.root.innerHTML,/qe-rfscan/);a.doesNotMatch(p.root.innerHTML,/qe-tuiscan/);a.equal(calls,0);
 p.finish();p.flush();a.equal(p.demo.state.modal,false);a.match(p.root.innerHTML,/Task complete/);
 await p.click({id:'qe-cont',dataset:{}});a.equal(p.demo.state.modal,true);
});
test('guided technical view is optional and uses the same accepted workflow state',async()=>{
 const p=preview(undefined,undefined,true);await p.click({dataset:{qtOperation:'picking'}});await p.click({id:'qt-example',dataset:{}});
 p.demo.act.demo('web');const index=p.demo.state.run.index;
 await p.click({id:'qt-technical',dataset:{}});a.match(p.root.innerHTML,/qe-tuiscan|qe-tui/);a.equal(p.demo.state.run.index,index);
 p.demo.act.demo('tui');a.equal(p.demo.state.run.index,index+1);
 await p.click({id:'qt-technical',dataset:{}});a.doesNotMatch(p.root.innerHTML,/id="qe-tui"/);
});
test('guided clarification asks one question at a time, preserves answers and sends one refinement round',async()=>{
 const requests=[];const p=preview(async(url,options)=>{requests.push(JSON.parse(options.body));return {ok:true,json:async()=>({ok:true,result:ai(task('receiving',true),{uncertainties:requests.length===1?['Which package?','How many levels?']:[]})})}},undefined,true);
 await p.click({dataset:{qtOperation:'receiving'}});await p.event('input',{id:'qe-desc',value:'Receive laptops with serial numbers.'});await p.click({id:'qt-analyze',dataset:{}});
 a.equal(requests.length,1);a.match(requests[0].text,/Selected demo operation: receiving/);a.match(p.root.innerHTML,/Which package/);a.doesNotMatch(p.root.innerHTML,/How many levels/);
 await p.click({id:'qt-next-question',dataset:{}});a.match(p.root.innerHTML,/Add an answer/);
 await p.event('input',{id:'qe-answer-0',dataset:{question:'0'},value:'Cases of six.'});await p.click({id:'qt-next-question',dataset:{}});a.match(p.root.innerHTML,/How many levels/);a.doesNotMatch(p.root.innerHTML,/Which package/);a.equal(requests.length,1);
 await p.click({id:'qt-previous-question',dataset:{}});a.match(p.root.innerHTML,/Cases of six/);await p.click({id:'qt-next-question',dataset:{}});await p.click({id:'qt-unknown',dataset:{}});a.equal(requests.length,1);await p.click({id:'qt-refine',dataset:{}});
 a.equal(requests.length,2);a.match(requests[1].text,/Cases of six/);a.match(requests[1].text,/Unknown/);a.match(p.root.innerHTML,/Your example is ready/);a.equal(p.demo.state.setup.task.operation,'receiving');
});
test('guided failures preserve input and cancelled analysis cannot replace a new operation',async()=>{
 let resolve;const p=preview(()=>new Promise(r=>resolve=r),undefined,true);
 await p.click({dataset:{qtOperation:'putaway'}});await p.event('input',{id:'qe-desc',value:'My pallet of oil'});const pending=p.click({id:'qt-analyze',dataset:{}});await p.click({id:'qt-cancel',dataset:{}});resolve({ok:true,json:async()=>({ok:true,result:ai(task())})});await pending;
 a.match(p.root.innerHTML,/My pallet of oil/);a.match(p.root.innerHTML,/What do you store/);a.equal(p.demo.state.setup.ai,null);
 const failed=preview(async()=>({ok:false,json:async()=>({error:'Please try later.'})}),undefined,true);await failed.click({dataset:{qtOperation:'receiving'}});await failed.event('input',{id:'qe-desc',value:'My stock'});await failed.click({id:'qt-analyze',dataset:{}});a.match(failed.root.innerHTML,/Please try later/);a.match(failed.root.innerHTML,/My stock/);
});
test('try page has a canonical route, no homepage AI execution, and direct desktop/mobile entry points',()=>{
 const config=JSON.parse(read('vercel.json'));a.deepEqual(config.rewrites.find(r=>r.source==='/try'),{source:'/try',destination:'/try.html'});
 for(const source of ['/try/','/try.html'])a.deepEqual(config.redirects.find(r=>r.source===source),{source,destination:'/try',permanent:true});
 const h=read('try.html');a.match(h,/canonical" href="https:\/\/quark.build\/try/);a.match(h,/name="robots" content="noindex,follow"/);a.doesNotMatch(h.split('</head>')[0],/hreflang=/);a.doesNotMatch(h,/id="lead-form"/);a.ok(h.includes('/assets/workflow-demo/onboarding-machine.js'));a.ok(h.indexOf('onboarding-machine.js')<h.indexOf('onboarding-workspace.js'));a.doesNotMatch(h,/src="[^"]*\/session\.js/);a.equal((h.match(/id="messages"/g)||[]).length,1);a.match(h,/rf-device.js/);
 for(const file of ['index.html','product.html','pricing.html','integrations.html','vision.html','wms-cost.html','tools/wms-readiness-assessment/index.html'])a.equal((read(file).match(/data-nav="try"/g)||[]).length,2,file);
 for(const code of ['bg','ro','el','sr'])for(const file of [code+'/index.html','solutions/legacy-hardware/'+code+'/index.html'])a.match(read(file),/href="\/try" data-nav="try"/);
 a.doesNotMatch(read('index.html'),/engine-demo.js|engine-flow.js|id="qe-root"/);
 a.doesNotMatch(read('assets/engine-demo/engine-try.js'),/fetch\(|sendBeacon|localStorage|sessionStorage|\.innerHTML\s*=/);
});

test('guided analysis failure offers a working manual review without another AI call or losing the description',async()=>{
 let calls=0;const p=preview(async()=>{calls++;return {ok:false,json:async()=>({error:'AI could not finish this example.'})}},undefined,true);
 await p.click({dataset:{qtOperation:'receiving'}});await p.event('input',{id:'qe-desc',value:'Gumichka XXL: 1000 units per pallet, 20 cases, 5 inner packs per case.'});
 await p.click({id:'qt-analyze',dataset:{}});a.match(p.root.innerHTML,/Configure the example manually/);
 await p.click({id:'qt-manual',dataset:{}});a.match(p.root.innerHTML,/Your example is ready/);a.match(p.root.innerHTML,/Adjust the example/);a.equal(calls,1);a.equal(p.demo.state.setup.task.operation,'receiving');a.match(p.demo.state.setup.text,/Gumichka/);a.equal(p.demo.state.setup.ai,null);
});
