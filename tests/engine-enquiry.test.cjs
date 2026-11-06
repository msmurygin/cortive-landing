const {test}=require('node:test'),a=require('node:assert/strict');
const handler=require('../api/engine-enquiry');
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}}}
const good={email:'max@quark.build',company:'Internal preview QA',consent:'yes',warehouse:{type:'E-commerce',aisles:3,bays:4,levels:4},process:{operation:'putaway',product:'Olive oil',pack_label:'Case',pack_units:6,pack_quantity:2,serialized:false}};
function req(b,origin='https://quark.build'){return {method:'POST',headers:{origin,'content-type':'application/json','x-forwarded-for':'192.0.2.77'},body:b}}
test('setup enquiry requires explicit contact consent and valid same-origin data',async()=>{
 for(const body of [{...good,consent:'no'},{...good,email:'bad'},{...good,company:''},{...good,website:'bot'},{...good,warehouse:{...good.warehouse,aisles:99}},{...good,process:{...good.process,pack_units:0}}]){const r=response();await handler(req(body),r);a.equal(r.statusCode,400)}
 const r=response();await handler(req(good,'https://other.example'),r);a.equal(r.statusCode,403);
});
test('only contact details and the selected setup reach the configured form; no files or serial values are forwarded',async()=>{
 const previous=global.fetch;let sent;
 global.fetch=async(url,opts)=>{a.equal(url,'https://formspree.io/f/mqevozlb');sent=JSON.parse(opts.body);return {ok:true}};
 try{const r=response();await handler(req({...good,file:'PRIVATE-FILE',serials:['PRIVATE-SERIAL'],assessmentAnswers:'PRIVATE-ASSESSMENT',process:{...good.process,serials:['PRIVATE-SERIAL']}}),r);a.equal(r.statusCode,200);a.equal(sent.email,good.email);a.match(sent.packaging,/2 Case × 6 units = 12/);a.doesNotMatch(JSON.stringify(sent),/PRIVATE-/)}finally{global.fetch=previous}
});
test('provider failure is retryable and never claims an email was delivered',async()=>{
 const previous=global.fetch;global.fetch=async()=>({ok:false,status:500});
 try{const r=response();await handler(req(good),r);a.equal(r.statusCode,502);a.equal(r.body.ok,undefined);a.match(r.body.error,/Could not send/)}finally{global.fetch=previous}
});
test('production setup enquiries remain disabled until the release is approved',async()=>{
 const env=process.env.VERCEL_ENV,flag=process.env.ENGINE_AI_PUBLIC_ENABLED;process.env.VERCEL_ENV='production';delete process.env.ENGINE_AI_PUBLIC_ENABLED;
 try{const r=response();await handler(req(good),r);a.equal(r.statusCode,503)}finally{if(env===undefined)delete process.env.VERCEL_ENV;else process.env.VERCEL_ENV=env;if(flag===undefined)delete process.env.ENGINE_AI_PUBLIC_ENABLED;else process.env.ENGINE_AI_PUBLIC_ENABLED=flag}
});
