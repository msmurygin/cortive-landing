const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const D=require('../assessment-assets/discovery-model.js'),S=require('../assessment-assets/assessment-summary.js'),P=require('../assessment-assets/assessment-pdf.js');
const profiles=require('./discovery-profiles.cjs');
const report=a=>D.assess(a,{consent:true,generatedAt:'2026-10-21T08:00:00.000Z'});
for(const [name,input]of Object.entries(profiles))test('summary preserves existing findings and priority: '+name,()=>{
 const r=report(input),before=JSON.stringify(r),s=S.summarize(r);
 assert.equal(s.readiness,r.implementationReadiness.level);assert.ok(s.actions.length<=3);
 assert.equal(new Set(s.actions.map(x=>x.action.toLowerCase().replace(/\s+/g,' '))).size,s.actions.length);
 for(const item of [...s.actions,...s.unknowns])assert.ok(r.recommendations.includes(item));
 assert.deepEqual([...s.actions].sort((a,b)=>a.priority-b.priority),s.actions);
 assert.equal(JSON.stringify(r),before);
 assert.ok(P.createCustomerPdf(r,D).length>1000);
});
test('zero/fewer than three findings never manufactures recommendations',()=>{
 const r=report({});for(const count of [0,1,2]){const subset={...r,recommendations:r.recommendations.slice(0,count)};assert.equal(S.summarize(subset).actions.length,count);}
});
test('summary deduplicates identical actions without deleting the full report',()=>{const r=report({}),item=r.recommendations[0];r.recommendations=[item,{...item,ruleId:'fixture:duplicate'}];assert.equal(S.summarize(r).actions.length,1);assert.equal(r.recommendations.length,2);});
test('assessment engine, PDF and cost calculation files are byte-identical to production baseline',()=>{
 for(const f of ['assessment-assets/assessment-model.js','assessment-assets/discovery-model.js','assessment-assets/assessment-pdf.js','assets/seo/cost-model.js','assets/seo/cost-ui.js'])assert.equal(read(f),cp.execFileSync('git',['show','029347a:'+f],{cwd:root,encoding:'utf8'}),f);
});
test('assessment UI has no transmission, storage, query-parameter or consent-gated contact path',()=>{
 const ui=read('assessment-assets/assessment-ui.js'),html=read('tools/wms-readiness-assessment/index.html');
 assert.doesNotMatch(ui,/\bfetch\s*\(|sendBeacon|XMLHttpRequest|localStorage|sessionStorage|\.search\b/);
 assert.doesNotMatch(ui+html,/contactConsent/);assert.match(html,/<a id="contactButton"[^>]*href="\/#contact"/);
 assert.match(html,/Your assessment answers stay private\. No report is attached or submitted\./);
 assert.match(ui,/QuarkReadinessPdf.createCustomerPdf\(report,engine\)/);assert.match(ui,/JSON.stringify\(report,null,2\)/);
 assert.match(html,/id="executiveSummary"/);assert.ok(html.indexOf('id="executiveSummary"')<html.indexOf('id="reportBody"'));
});
test('current form provider, server handlers and event settings are unchanged',()=>{
 for(const f of ['api/lead.js','api/events.js','lib/lead-events.js','assets/leads.js'])assert.equal(read(f),cp.execFileSync('git',['show','029347a:'+f],{cwd:root,encoding:'utf8'}),f);
 const before=cp.execFileSync('git',['show','029347a:index.html'],{cwd:root,encoding:'utf8'}),form=s=>s.match(/<form\b[^>]*id="leadForm"[\s\S]*?<\/form>/)[0];
 assert.equal(form(read('index.html')),form(before).replace('Discuss my warehouse <span','Request a Demo <span'));
});
test('mobile menu repairs fixed containing block and includes focus and scrolling controls',()=>{
 const css=read('design-assets/qds.css'),js=read('design-assets/qds.js');assert.match(css,/\.q-hdr\[data-open\]\{backdrop-filter:none;-webkit-backdrop-filter:none/);
 assert.match(css,/100dvh/);assert.match(css,/safe-area-inset-bottom/);assert.match(css,/overscroll-behavior:contain/);
 for(const text of ["e.key==='Escape'","e.key==='Tab'",'preventScroll:true','el.inert=true',"position:'fixed'","mobile.addEventListener('change'"])assert.ok(js.includes(text));
});
test('existing enquiry handler forwards to the current provider and distinguishes rejection',async()=>{
 const handler=require('../api/lead.js'),originalFetch=global.fetch,originalInfo=console.info;let forwarded;
 const request={method:'POST',headers:{origin:'https://quark.build','content-type':'application/json',accept:'application/json'},body:{email:'synthetic@example.invalid',industry:'',consent:'yes'}};
 const makeResponse=()=>({headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.code=code;return this},json(body){this.body=body;return this}});
 try{console.info=()=>{};global.fetch=async(url,options)=>{forwarded={url,data:JSON.parse(options.body)};return {ok:true}};
  const response=makeResponse();await handler(request,response);assert.equal(response.code,200);assert.deepEqual(response.body,{ok:true});assert.equal(forwarded.url,'https://formspree.io/f/mqevozlb');assert.equal(forwarded.data.email,'synthetic@example.invalid');assert.equal(forwarded.data._subject,'Quark warehouse enquiry');
  global.fetch=async()=>({ok:false});const failure=makeResponse();await handler(request,failure);assert.equal(failure.code,502);
  let invoked=false;global.fetch=async()=>{invoked=true};const invalid=makeResponse();await handler({...request,body:{...request.body,consent:'no'}},invalid);assert.equal(invalid.code,400);assert.equal(invoked,false);
 }finally{global.fetch=originalFetch;console.info=originalInfo;}
});
