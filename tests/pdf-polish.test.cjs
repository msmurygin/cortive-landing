const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const D=require('../drafts/readiness/discovery-model.js'),P=require('../drafts/readiness/assessment-pdf.js'),profiles=require('./discovery-profiles.cjs');
const golden=['small','manyOwners','pharmaCold','pharmaManufacturing','fashion'];
const report=a=>D.assess(a,{generatedAt:'2026-10-20T12:00:00.000Z',consent:true});
const normal=s=>String(s).replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2022\u00b7]/g,'-').replace(/\u00a0/g,' ').replace(/\u00d7/g,'x').replace(/\s+/g,' ').trim();
test('executive PDF preserves golden report JSON, every finding/action and the active answers',()=>{
 for(const key of golden){const r=report(profiles[key]),before=JSON.stringify(r),doc=P.customerDocument(r,D),tasks=[...doc.first,...doc.remaining];
  assert.equal(doc.first.length,3,key);assert.deepEqual(new Set(doc.allRecommendationRuleIds),new Set(r.recommendations.map(x=>x.ruleId)),key);
  for(const x of r.recommendations){const task=tasks.find(t=>t.ruleIds.includes(x.ruleId));assert.ok(task,key+': '+x.ruleId);assert.equal(task.action,normal(x.action));assert.ok(task.why.includes(normal(x.explanation)));}
  assert.equal(doc.hypotheses.length,r.derivedHypotheses.length);assert.equal(doc.scenarios.length,r.candidateEvaluationScenarios.length);
  const questions=D.plan(r.answers).active;assert.equal(doc.appendix.length,questions.length);
  for(const q of questions){const rendered=doc.appendix.find(s=>s.title===normal(q.title));for(const f of D.visibleFields(q,r.answers)){if(f.key==='primaryIndustry')continue;assert.ok(rendered.answers.some(([label])=>label===normal(f.label)),key+': '+f.key);}}
  P.createCustomerPdf(r,D);assert.equal(JSON.stringify(r),before);assert.equal(r.assessmentSchemaVersion,'2.0.0');assert.equal(r.rulesVersion,'0.2.0');
 }
});
test('customer PDF fixes the opening two pages, has valid xrefs and removes generated internal IDs',()=>{
 for(const key of golden){const r=report(profiles[key]),pdf=Buffer.from(P.createCustomerPdf(r,D)).toString('ascii'),streams=[...pdf.matchAll(/stream\n([\s\S]*?)endstream/g)].map(m=>m[1]);
  assert.ok(streams[0].includes('Executive summary'));assert.ok(streams[0].includes('Your top 3 actions'));assert.ok(streams[1].includes('Complexity and readiness'));assert.ok(streams[1].includes('Implementation readiness'));assert.ok(streams.slice(2).some(s=>s.includes('Appendix: your complete answers')));
  assert.doesNotMatch(pdf,/(?:fact|action|hypothesis|unknown|prepare|deferred|pilot|conflict):[\w-]+|\bD0[1-7]\b|\bC(?:OWN|REG|MFG|COLD|FLOW|ECOM|SITES|AUTO|IF)\b/);
  const start=Number(pdf.match(/startxref\n(\d+)/)[1]);assert.equal(pdf.slice(start,start+4),'xref');
  const rows=pdf.slice(start).split('\n');for(let i=3;i<rows.length&&/^\d{10} 00000 n/.test(rows[i]);i++){const offset=Number(rows[i].slice(0,10));assert.ok(pdf.slice(offset).startsWith((i-2)+' 0 obj'));}
 }
});
test('recommendations are grouped by action and are not copied into multiple customer sections',()=>{
 const r=report(profiles.pharmaCold),duplicate=JSON.parse(JSON.stringify(r.recommendations[0]));duplicate.ruleId='example:duplicate';r.recommendations.push(duplicate);
 const d=P.customerDocument(r,D),tasks=[...d.first,...d.remaining];assert.equal(new Set(tasks.map(x=>x.action)).size,tasks.length);assert.ok(tasks.some(t=>t.ruleIds.includes(duplicate.ruleId)&&t.ruleIds.includes(r.recommendations[0].ruleId)));
 assert.equal(d.scenarioAction,r.candidateEvaluationScenarios[0].action);assert.ok(d.scenarios.every(s=>s.action===null));
});
test('profile pluralization and industry labels are correct for singular, plural and mixed selections',()=>{
 const one=report({...profiles.small,sites:1,users:1,volume:1,volumeUnit:'lines'}),d=P.customerDocument(one,D);assert.ok(d.profile.some(r=>r[1]==='1 warehouse'));assert.ok(d.profile.some(r=>r[1]==='1 active user'));assert.ok(d.profile.some(r=>r[1]==='1 order line per day'));assert.ok(!d.profile.some(r=>r[0]==='Additional industries'));
 const mixed=P.customerDocument(report({...profiles.fashion,sites:2,users:2,volume:2}),D);assert.ok(mixed.profile.some(r=>r[1]==='2 warehouses'));const additional=mixed.profile.find(r=>r[0]==='Additional industries');assert.ok(additional);assert.ok(!additional[1].includes(mixed.primary));
});
test('unknown and mixed profiles retain their answers and keep the opening layout bounded',()=>{
 const r=report({}),d=P.customerDocument(r,D);assert.equal(d.requirements.length,0);assert.equal(d.hypotheses.length,0);assert.equal(d.readinessLevel,'Insufficient information');assert.ok(d.appendix.some(q=>q.answers.some(([k,v])=>k==='Warehouses'&&/Not known/.test(v))));
 const pdf=Buffer.from(P.createCustomerPdf(r,D)).toString('ascii');assert.ok(!pdf.includes('Requirements you explicitly reported'));assert.ok(!pdf.includes('Discovery topics to validate'));assert.ok(!pdf.includes('No explicit item'));assert.ok(d.appendix.every(q=>q.answers.every(([k,v])=>k&&v)));
 assert.ok([...d.first,...d.remaining].some(t=>t.titles.includes('Clarify SKU and location master data')));assert.ok(!pdf.includes('sKU'));
 const mixed=report({...profiles.pharmaCold,industries:['pharmaceutical','manufacturing','fmcg','fashion','ecommerce'],primaryIndustry:'fashion',models:['3pl','manufacturing-supply','ecommerce-fulfilment'],sites:3,integrations:['erp'],automation:['robots']});assert.doesNotThrow(()=>P.createCustomerPdf(mixed,D));
});
test('existing PDF API remains available while the export control selects only the customer renderer',()=>{
 const r=report(profiles.pharmaCold),old=Buffer.from(P.createPdf(r,D.meetingSections(r))).toString('ascii');assert.ok(old.includes('action:clients'));assert.ok(old.includes('D01'));const ui=fs.readFileSync(path.join(__dirname,'../drafts/readiness/assessment-ui.js'),'utf8');assert.ok(ui.includes('QuarkReadinessPdf.createCustomerPdf(report,engine)'));assert.ok(!/\bfetch\s*\(|sendBeacon|XMLHttpRequest/.test(ui));
});
