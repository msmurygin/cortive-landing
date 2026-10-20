const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {randomUUID}=require('node:crypto');
const events=require('../api/events'),lead=require('../api/lead'),config=require('../api/measurement-config');
const {report}=require('../scripts/funnel-report.cjs');
function req(body){return {method:'POST',headers:{origin:'http://127.0.0.1:4173',host:'127.0.0.1:4173','content-type':'application/json',accept:'application/json'},body};}
function res(){return {code:200,setHeader(){},status(n){this.code=n;return this;},json(b){this.body=b;return this;},end(){return this;}};}
const meter={consent:true,source:'google',medium:'organic',landing:'/wms-cost',page:'/',context_scope:'tab'};
function environment(fn){const old=process.env.QUARK_MEASUREMENT_LOCAL_TEST;process.env.QUARK_MEASUREMENT_LOCAL_TEST='1';return Promise.resolve().then(fn).finally(()=>{if(old===undefined)delete process.env.QUARK_MEASUREMENT_LOCAL_TEST;else process.env.QUARK_MEASUREMENT_LOCAL_TEST=old;});}
test('only consented eligible events are recorded; preview and tracking-off remain disabled',async()=>{
 await environment(()=>{
  const logs=[],info=console.info;console.info=s=>logs.push(JSON.parse(s));
  try{
   let r=res();events(req({event:'page_view',event_id:randomUUID(),measurement:meter,is_entry:true}),r);assert.equal(r.code,204);assert.equal(logs[0].is_entry,true);
   for(const m of [undefined,{...meter,consent:false}])events(req({event:'page_view',event_id:randomUUID(),measurement:m}),res());
   const dnt=req({event:'page_view',event_id:randomUUID(),measurement:meter});dnt.headers.dnt='1';events(dnt,res());assert.equal(logs.length,1);
   const preview=req({event:'page_view',event_id:randomUUID(),measurement:meter});preview.headers.host='branch.vercel.app';preview.headers.origin='https://quark.build';events(preview,res());assert.equal(logs.length,1);
   const c=res();config({...preview,method:'GET'},c);assert.equal(c.body.enabled,false);
  }finally{console.info=info;}
 });
});
test('PII, arbitrary paths, placements and source strings cannot enter measurement records',async()=>{
 await environment(()=>{
  const logs=[],info=console.info;console.info=s=>logs.push(s);
  try{const r=res();events(req({event:'demo_cta_click',event_id:randomUUID(),placement:'private@example.com',email:'private@example.com',measurement:{...meter,source:'private@example.com',landing:'/users/private@example.com',page:'/?email=private@example.com'}}),r);assert.equal(r.code,204);assert.equal(logs.join('').includes('@'),false);const e=JSON.parse(logs[0]);assert.equal(e.source,'other');assert.equal(e.landing,'other');assert.equal(e.page,'other');assert.equal(e.placement,undefined);}finally{console.info=info;}
 });
});
test('acceptance is backend-only, provider failures never emit delivery success, validation is an error',async()=>{
 await environment(async()=>{
  const logs=[],info=console.info,fetch=global.fetch;console.info=s=>logs.push(JSON.parse(s));
  const payload={email:'owner@example.com',industry:'Other',consent:'yes',measurement:meter,attempt_id:randomUUID()};
  try{
   global.fetch=async()=>({ok:true});const r=res();await lead(req(payload),r);assert.equal(r.body.delivery_status,'provider_accepted');
   assert.deepEqual(logs.filter(x=>x.namespace==='quark_funnel').map(x=>x.event),['demo_form_accepted']);assert.equal(logs.some(x=>x.event==='demo_form_success'),false);
   assert.equal(JSON.stringify(logs).includes(payload.email),false);
   logs.length=0;global.fetch=async()=>({ok:false});const fail=res();await lead(req(payload),fail);assert.equal(fail.code,502);assert.deepEqual(logs.filter(x=>x.namespace==='quark_funnel').map(x=>x.event),['demo_form_error']);
   logs.length=0;const bad=res();await lead(req({...payload,email:'bad'}),bad);assert.equal(bad.code,400);assert.equal(logs[0].reason,'validation');
  }finally{console.info=info;global.fetch=fetch;}
 });
});
function client({pathname='/',search='',referrer='',storage=new Map(),dnt=false}={}){
 const sent=[],listeners={};
 function el(){return {children:[],dataset:{},append(...x){this.children.push(...x);},setAttribute(){},addEventListener(){},querySelector(){return {focus(){}};}};}
 const document={referrer,head:el(),body:el(),createElement:el,querySelector(){return el();},addEventListener(k,fn){listeners[k]=fn;}};
 const window={};
 const context={window,document,location:{pathname,search,origin:'https://quark.build',href:'https://quark.build'+pathname+search},navigator:{doNotTrack:dnt?'1':'0'},sessionStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},URL,URLSearchParams,Date,Set,Promise,JSON,crypto:{randomUUID},fetch:async(url,opt)=>{if(url==='/api/measurement-config')return {ok:true,json:async()=>({enabled:true,environment:'test'})};sent.push(JSON.parse(opt.body));return {ok:true};}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../assets/measurement.js'),'utf8'),context);
 return {meter:window.QuarkMeasurement,sent,storage};
}
test('explicit opt-in preserves a clean Google landing across pages; decline clears context; DNT suppresses all',async()=>{
 const storage=new Map(),first=client({pathname:'/screens.html',referrer:'https://www.google.com/search?q=secret',storage});await first.meter.ready;assert.equal(first.sent.length,0);assert.equal(storage.size,0);
 first.meter.setConsent(true);assert.equal(first.sent.length,1);assert.equal(first.sent[0].measurement.source,'google');assert.equal(first.sent[0].measurement.landing,'/screens.html');assert.equal(first.sent[0].is_entry,true);assert.equal(JSON.stringify(first.sent).includes('secret'),false);
 const next=client({pathname:'/',referrer:'https://quark.build/screens.html',storage});await next.meter.ready;assert.equal(next.sent[0].is_entry,false);assert.equal(next.meter.metadata().landing,'/screens.html');assert.equal(next.meter.metadata().medium,'organic');
 next.meter.setConsent(false);assert.equal(next.meter.metadata(),null);assert.equal(storage.has('qk-measurement-context'),false);
 const blocked=client({dnt:true,storage});await blocked.meter.ready;blocked.meter.setConsent(true);assert.equal(blocked.sent.length,0);
});
test('query PII is discarded and a session context expires rather than attributing indefinitely',async()=>{
 const c=client({pathname:'/wms-cost',search:'?utm_source=private@example.com&utm_medium=organic&email=secret'});await c.meter.ready;c.meter.setConsent(true);assert.equal(c.sent[0].measurement.source,'other');assert.equal(JSON.stringify(c.sent).includes('secret'),false);
 const stored=JSON.parse(c.storage.get('qk-measurement-context'));stored.expires=0;c.storage.set('qk-measurement-context',JSON.stringify(stored));
 const next=client({storage:c.storage});await next.meter.ready;assert.equal(next.sent[0].is_entry,true);assert.equal(next.meter.metadata().landing,'/');
});
test('report deduplicates repeated events, excludes test data and never claims inbox delivery',()=>{
 const id=randomUUID(),a=randomUUID();const records=[{event:'page_view',event_id:id,is_entry:true},{event:'demo_form_accepted',attempt_id:a},{event:'demo_form_accepted',attempt_id:a},{event:'ignored_event',attempt_id:randomUUID()}].map(e=>JSON.stringify({namespace:'quark_funnel',environment:'production',...meter,...e}));
 const r=report(records.join('\n'));assert.equal(r.rows[0].entry_views,1);assert.equal(r.rows[0].provider_accepted,1);assert.equal(r.rows[0].accepted_per_entry,1);assert.match(r.warning,/not inbox/);assert.equal(report(records.join('\n'),'test').rows.length,0);
});

test('inbox success requires an explicit owner attestation matching backend acceptance, not an HTTP status',()=>{
 const {confirmDelivery}=require('../scripts/confirm-delivery.cjs');
 const id=randomUUID(),attempt=randomUUID();
 const accepted=JSON.stringify({namespace:'quark_funnel',event:'demo_form_accepted',at:'2026-10-18T20:00:00Z',submission_id:id,attempt_id:attempt,environment:'test',...meter});
 assert.throws(()=>confirmDelivery(accepted,[{submission_id:id,inbox_verified:false,verified_at:'2026-10-18T20:01:00Z'}]));
 assert.throws(()=>confirmDelivery(accepted,[{submission_id:randomUUID(),inbox_verified:true,verified_at:'2026-10-18T20:01:00Z'}]));
 const c={submission_id:id,inbox_verified:true,verified_at:'2026-10-18T20:01:00Z',email:'never-log@example.com'};
 const result=confirmDelivery(accepted,[c,c]);assert.equal(result.length,1);assert.equal(result[0].event,'demo_form_success');assert.equal(JSON.stringify(result).includes('@'),false);
 const summary=report([accepted,...result.map(x=>JSON.stringify(x))].join('\n'),'test');assert.equal(summary.rows[0].inbox_confirmed,1);assert.equal(summary.rows[0].provider_accepted,1);
});
