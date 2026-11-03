const {test}=require('node:test'),a=require('node:assert/strict');
const Flow=require('../assets/engine-demo/engine-flow');
const {parseRequest,validateResult,infer,MAX_FILE_BYTES}=require('../lib/engine-ai');
const good={task:Flow.emptyTask(),type:'E-commerce',aisles:3,bays:4,levels:null,summary:'Three aisles shown. Vertical rack levels need confirmation.',uncertainties:['How many rack levels do you use?'],rules:[]};
const request=b=>({headers:{'content-type':'application/json'},body:JSON.stringify(b)});
const input=()=>parseRequest(request({mode:'layout',consent:true,text:'3 aisles with 4 bays'}));
const response=data=>({ok:true,text:async()=>JSON.stringify(data)});
test('explicit submission is required; unverified dimensions use marked demo defaults and output is bounded',()=>{
 a.throws(()=>parseRequest(request({mode:'layout',text:'3 aisles'})),/Confirm/);
 a.throws(()=>parseRequest(request({mode:'layout',consent:true,text:'x'.repeat(12001)})),/length/);
 a.equal(validateResult(good,input()).levels,4);
 a.deepEqual(validateResult(good,input()).defaulted_layout,['levels']);
 a.equal(validateResult({...good,levels:999},input()).levels,4);
 a.equal(validateResult({...good,detected_region:'RO-BUCHAREST-WEST'},input()).detected_region,'RO-BUCHAREST-WEST');
 for(const patch of [{levels:0},{aisles:1.2},{type:'Invented WMS'},{summary:'x'.repeat(401)},{uncertainties:Array(6).fill('unknown')},{rules:[{level:9,category:'COLD',text:'Invalid level'}]},{command:'create_warehouse'}])a.throws(()=>validateResult({...good,...patch},input()));
});
test('file signatures and size are checked; remote file URLs cannot be fetched',()=>{
 for(const type of ['image/jpeg','image/png','application/pdf'])a.throws(()=>parseRequest(request({mode:'layout',consent:true,file:{type,data:Buffer.from('<script>bad</script>').toString('base64')}})));
 a.throws(()=>parseRequest(request({mode:'layout',consent:true,file:{type:'image/png',url:'http://127.0.0.1/private'}})));
 const b=Buffer.from('%PDF-1.7\n');a.equal(parseRequest(request({mode:'layout',consent:true,file:{type:'application/pdf',data:b.toString('base64')}})).file.type,'application/pdf');
 a.throws(()=>parseRequest(request({mode:'layout',consent:true,file:{type:'application/pdf',data:Buffer.alloc(MAX_FILE_BYTES+1).toString('base64')}})));
});
test('Claude receives structured inputs, server credentials and bounded output; only validated JSON is returned',async()=>{
 const calls=[];const result=await infer(input(),{key:'TEST-ONLY-KEY',model:'TEST-MODEL',fetchImpl:async(url,options)=>{calls.push({url,options});return response(url.endsWith('count_tokens')?{input_tokens:300}:{stop_reason:'end_turn',content:[{type:'text',text:JSON.stringify(good)}]})}});
 a.equal(result.levels,4);a.equal(calls.length,2);a.equal(calls[0].url,'https://api.anthropic.com/v1/messages/count_tokens');
 const body=JSON.parse(calls[1].options.body);a.equal(body.output_config.format.type,'json_schema');a.deepEqual(body.output_config.format.schema.properties.type.anyOf,[{type:'string',enum:['E-commerce','Distribution','3PL','Manufacturing']},{type:'null'}]);a.equal(body.max_tokens,2400);a.equal(calls[1].options.headers['x-api-key'],'TEST-ONLY-KEY');a.equal(body.tools,undefined);a.equal(body.model,'TEST-MODEL');
});
test('oversized token estimates stop before inference; refusals, invalid JSON and truncated responses fail closed',async()=>{
 let calls=0;await a.rejects(infer(input(),{key:'test',model:'test',fetchImpl:async()=>{calls++;return response({input_tokens:12001})}}),/too detailed/);a.equal(calls,1);
 for(const reply of [{stop_reason:'max_tokens',content:[{type:'text',text:JSON.stringify(good)}]},{stop_reason:'refusal',content:[]},{stop_reason:'end_turn',content:[{type:'text',text:'not json'}]},{stop_reason:'end_turn',content:[{type:'text',text:JSON.stringify({...good,aisles:-1})}]}]){
 await a.rejects(infer(input(),{key:'test',model:'test',fetchImpl:async url=>response(url.endsWith('count_tokens')?{input_tokens:100}:reply)}));
 }
});
test('provider errors never return private response bodies or keys',async()=>{
 await a.rejects(infer(input(),{key:'PRIVATE-KEY',model:'test',fetchImpl:async()=>({ok:false,status:401,text:async()=> 'PRIVATE PROVIDER ERROR'})}),e=>!e.message.includes('PRIVATE')&&e.status===502);
});
function res(){return {headers:{},statusCode:null,body:null,setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}}}
test('endpoint blocks wrong origins, disabled production and missing credentials without inference',async()=>{
 const save={...process.env};const originalFetch=global.fetch;let calls=0;global.fetch=async()=>{calls++;throw new Error('must not call')};
 try{const handler=require('../api/engine-analyze');delete process.env.ANTHROPIC_API_KEY;process.env.ENGINE_AI_PREVIEW_ORIGIN='http://127.0.0.1:49940';delete process.env.VERCEL_ENV;
 for(const [headers,method,status] of [[{origin:'https://evil.example'},'POST',403],[{origin:'http://127.0.0.1:49940'},'GET',405],[{origin:'http://127.0.0.1:49940'},'POST',503]]){const r=res();await handler({headers,method},r);a.equal(r.statusCode,status);a.equal(r.headers['Cache-Control'],'no-store')}
 process.env.VERCEL_ENV='production';delete process.env.ENGINE_AI_PUBLIC_ENABLED;process.env.ANTHROPIC_API_KEY='TEST';const r=res();await handler({method:'POST',headers:{origin:'https://quark.build'}},r);a.equal(r.statusCode,503);a.equal(calls,0);
 }finally{global.fetch=originalFetch;for(const k of Object.keys(process.env))if(!(k in save))delete process.env[k];Object.assign(process.env,save)}
});
test('endpoint success exposes no prompt or credential; repeated requests are throttled on a warm instance',async()=>{
 const save={...process.env},originalFetch=global.fetch;let calls=0;
 try{process.env.ANTHROPIC_API_KEY='TEST-NOT-A-REAL-KEY';process.env.ENGINE_AI_PREVIEW_ORIGIN='http://127.0.0.1:49940';delete process.env.VERCEL_ENV;
 global.fetch=async url=>{calls++;return response(url.endsWith('count_tokens')?{input_tokens:100}:{stop_reason:'end_turn',content:[{type:'text',text:JSON.stringify(good)}]})};
 const handler=require('../api/engine-analyze');const req={...request({mode:'layout',consent:true,text:'3 aisles'}),method:'POST'};req.headers.origin='http://127.0.0.1:49940';req.headers['x-forwarded-for']='192.0.2.55';
 for(let i=0;i<6;i++){const r=res();await handler(req,r);a.equal(r.statusCode,200);a.equal(r.body.provider,'Quark AI');a.ok(!JSON.stringify(r.body).includes('TEST-NOT-A-REAL-KEY'))}
 const r=res();await handler(req,r);a.equal(r.statusCode,429);a.equal(calls,12);
 }finally{global.fetch=originalFetch;for(const k of Object.keys(process.env))if(!(k in save))delete process.env[k];Object.assign(process.env,save)}
});

test('model, authentication and input errors have accurate safe recovery messages',async()=>{
 for(const [status,pattern] of [[404,/temporarily unavailable/],[401,/connection needs attention/],[400,/could not analyse this input/],[429,/busy/]])await a.rejects(infer(input(),{key:'test',model:'test',fetchImpl:async()=>({ok:false,status})}),e=>pattern.test(e.message));
});

test('preview diagnosis classifies provider configuration without exposing raw details',async()=>{
 for(const [detail,reason] of [['PRIVATE KEY credit balance too low','api_credits'],['unsupported anthropic-version','api_version'],['unknown model','model_configuration'],['output_config schema invalid','output_schema']])await a.rejects(infer(input(),{key:'PRIVATE',model:'test',fetchImpl:async()=>({ok:false,status:400,text:async()=>JSON.stringify({error:{message:detail}})})}),e=>e.reason===reason&&!e.message.includes('PRIVATE'));
});

test('model output cannot bypass serial capture, package limits or intact-LPN move semantics',()=>{
 const make=op=>{const t=Flow.emptyTask();t.operation=op;t.title=op;t.product={name:'Laptops',sku:'LP-1',pack_label:'Case',pack_units:6,pack_quantity:2,serialized:true,lot_controlled:false};t.destination_aisle='B';t.steps=Flow.defaults(op,true,false);return t};
 const valid={...good,task:make('receiving')};a.equal(validateResult(valid,input()).task.product.pack_units,6);
 const ro=validateResult({...valid,detected_region:'RO-BUCHAREST-WEST'},input());
 a.equal(ro.task.localized_commands.primary_btn,'CONFIRMĂ PRIMIREA');
 const bg=validateResult({...good,detected_region:'BG-PLOVDIV-TRAKIA',task:make('putaway')},input());
 a.equal(bg.task.localized_commands.primary_btn,'ПОТВЪРДИ МЕСТЕНЕ');
 const ordinary=make('receiving');ordinary.product.serialized=false;ordinary.steps=Flow.defaults('receiving',false,false);
 ordinary.product.pack_quantity=1000;ordinary.product.pack_units=10;
 a.equal(validateResult({...good,task:ordinary},input()).task.product.pack_quantity,1000);
 ordinary.product.pack_units=11;
 a.equal(validateResult({...good,task:ordinary},input()).task.product.pack_quantity,24);
 const prior=make('putaway');
 const ruleInput={mode:'rule',setup:{aisles:3,bays:4,levels:4,task:prior}};
 const rule=validateResult({...valid,rule_only:true,rules:[{level:1,category:'COLD',text:'Keep chilled goods on level one.'}]},ruleInput);
 a.deepEqual(rule.task,prior);a.equal(rule.rules.length,1);

 const noSerial=make('receiving');noSerial.steps=noSerial.steps.filter(x=>x!=='capture_serials');a.throws(()=>validateResult({...good,task:noSerial},input()));
 const move=make('putaway');move.steps.splice(1,0,'receive_line');a.throws(()=>validateResult({...good,task:move},input()));
 const arbitrary=make('putaway');arbitrary.steps=['fetch_customer_data'];a.throws(()=>validateResult({...good,task:arbitrary},input()));
 const big=make('receiving');big.product.pack_quantity=100;const sample=validateResult({...good,task:big},input());
 a.deepEqual([sample.task.product.pack_quantity,sample.task.product.pack_units,sample.task.product.pack_label],[24,1,'Each']);
 a.match(sample.summary,/Demo quantity/);
});
test('dialog context preserves the current process and explicit unknown layout fields',()=>{
 const b={mode:'layout',consent:true,text:'For the demo use one level.',setup:{type:'E-commerce',aisles:2,bays:15,levels:4,confirmed:['type','aisles'],previous_summary:'Levels are not visible on the uploaded plan.',task:Flow.emptyTask()}};
 const r=parseRequest(request(b));a.deepEqual(r.setup.confirmed,['type','aisles']);a.equal(r.setup.task.operation,null);a.match(r.setup.previous_summary,/not visible/);
 a.throws(()=>parseRequest(request({...b,setup:{...b.setup,confirmed:['private_api_key']}})));
});

test('RF button language can differ from the warehouse region', () => {
 const polish = validateResult({
  ...good,
  detected_region: 'RO-BUCHAREST-WEST',
  detected_language: 'pl',
  task: {...good.task, localized_commands: {primary_btn: 'CONFIRMĂ PRIMIREA'}},
 }, input());
 a.equal(polish.detected_region, 'RO-BUCHAREST-WEST');
 a.deepEqual(polish.task.localized_commands, {primary_btn: 'POTWIERDŹ', enter_btn: 'WPROWADŹ'});
 const ukrainian = validateResult({...good, detected_language: 'uk'}, input());
 a.equal(ukrainian.detected_region, 'GLOBAL-EMEA');
 a.equal(ukrainian.task.localized_commands.primary_btn, 'ПІДТВЕРДИТИ');
 a.throws(() => validateResult({...good, detected_language: 'unsupported'}, input()));
});
