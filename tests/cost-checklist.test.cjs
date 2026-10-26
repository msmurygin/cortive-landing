const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),path=require('node:path');
const cost=require('../assets/seo/cost-model.js'),pdf=require('../assets/seo/cost-pdf.js');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const quick={mode:'quick',warehouses:'',users:'',integrations:'',complexity:'unknown'};
const advanced={mode:'advanced',warehouses:'2',users:'10',integrations:'3',complexity:'complex',currency:'USD',licensing:'subscription',approach:'mixed',monthlyBase:'100',monthlyUser:'10',licenseBase:'10000',licenseUser:'50',days:'20',dayRate:'500',siteSetup:'1000',integrationCost:'800',migration:'1200',training:'600',devices:'700',annualSupport:'1000',annualOther:'200',contingency:'10'};
test('unknown scope stays unknown and all seven preparation actions survive PDF export',()=>{
 const d=pdf.documentModel(quick,'2026-10-26');a.equal(d.profile[0][1],'Unknown');a.equal(d.missingScope.length,4);a.equal(d.checklist.length,7);a.equal(d.summary.length,0);a.equal(d.assumptions.length,0);
 const text=Buffer.from(pdf.create(quick,'2026-10-26')).toString();for(const title of ['Software fees','Configuration and delivery effort','Connections','Migration and transition','Devices and infrastructure','Long-term ownership','Contingency and exclusions'])a.ok(text.includes(title),title);
 a.ok(text.includes('not a cost estimate'));a.ok(text.includes('2026-10-26'));
});
test('known scope including zero integrations produces a specific checklist',()=>{
 const d=pdf.documentModel({...quick,warehouses:'1',users:'1',integrations:'0',complexity:'standard'});a.equal(d.missingScope.length,0);a.equal(d.profile[2][1],0);a.match(d.checklist[0][1],/1 planned user;/);a.match(d.checklist[2][1],/Confirm that no connections/);
});
for(const currency of ['USD','GBP','EUR'])for(const licensing of ['subscription','perpetual'])test(currency+' '+licensing+' PDF exactly matches model totals and excludes inactive fees',()=>{
 const x={...advanced,currency,licensing},d=pdf.documentModel(x,'2026-10-26'),r=cost.calculate(x);
 a.deepEqual([r.initialTotal,r.annualTotal,r.tco3,r.tco5],licensing==='subscription'?[1936000,360000,3016000,3736000]:[3091000,120000,3451000,3691000]);
 a.equal(d.summary[2][1],currency+' '+(licensing==='subscription'?'30,160.00':'34,510.00'));a.equal(d.breakdown.length,11);
 a.equal(d.assumptions.length,15);a.equal(d.assumptions.some(([label])=>label==='Monthly platform fee'),licensing==='subscription');
 const bytes=pdf.create(x,'2026-10-26'),text=Buffer.from(bytes).toString();a.ok(text.includes(currency+' '+(licensing==='subscription'?'30,160.00':'34,510.00')));a.match(text,/Currency selection labels values/);a.match(text,/Tax\/VAT/);a.doesNotMatch(text,/NaN|undefined|Infinity/);
 // Offsets are byte-correct and streams terminate; parsing/rendering is checked separately.
 const xref=Number(text.match(/startxref\n(\d+)/)[1]);a.equal(text.slice(xref,xref+4),'xref');for(const m of text.matchAll(/^(\d{10}) 00000 n /gm))a.match(text.slice(Number(m[1]),Number(m[1])+18),/^\d+ 0 obj/);
});
test('explicit zero costs export as zero; blank costs are rejected',()=>{
 const x={...advanced};for(const key of ['monthlyBase','monthlyUser','days','dayRate','siteSetup','integrationCost','migration','training','devices','annualSupport','annualOther','contingency'])x[key]='0';a.equal(pdf.documentModel(x).summary[3][1],'USD 0.00');a.throws(()=>pdf.create({...x,migration:''}),/migration/);a.throws(()=>pdf.create({...x,currency:'JPY'}));
});
test('large safe totals keep their final cent and invalid report states are rejected',()=>{
 const x={...advanced,warehouses:'10000',users:'10000',days:'10000',integrations:'10000',monthlyBase:'1000000000',monthlyUser:'10000000',dayRate:'1000000000',siteSetup:'1000000000',integrationCost:'1000000000',devices:'1000000000',contingency:'0.01'};
 const d=pdf.documentModel(x),r=cost.calculate(x);a.ok(d.summary[0][1].endsWith(String(r.initialTotal%100).padStart(2,'0')));a.throws(()=>pdf.create({...quick,warehouses:'0'}));a.throws(()=>pdf.create({...quick,mode:'other'}));a.throws(()=>pdf.create(quick,'not-a-date'));
});
test('PDF exports only the budget whitelist; extra contact or free-text data is ignored',()=>{
 const text=Buffer.from(pdf.create({...advanced,email:'PRIVATE-EMAIL',notes:'PRIVATE-NOTES',assessmentAnswers:'PRIVATE-ANSWERS'})).toString();a.doesNotMatch(text,/PRIVATE-/);
 for(const f of ['assets/seo/cost-pdf.js','assets/seo/cost-ui.js'])a.doesNotMatch(read(f),/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|\.submit\s*\(/);
});
test('proposal keeps SEO, calculator model, forms, analytics, privacy and other pages unchanged',()=>{
 const withoutDocumentationLinks=html=>html.replace(/<li><a href="https:\/\/docs\.quark\.build\/"(?: data-nav="documentation")?>Documentation<\/a><\/li>/g,'').replace(/<a href="https:\/\/docs\.quark\.build\/" data-nav="documentation">Documentation<\/a>/g,'');
 const base=f=>cp.execFileSync('git',['show','a2be3e6:'+f],{cwd:root,encoding:'utf8'}),h=read('wms-cost.html');
 a.equal(h.split('</head>')[0],base('wms-cost.html').split('</head>')[0]);a.equal(h.match(/<form\b[\s\S]*?<\/form>/)[0],base('wms-cost.html').match(/<form\b[\s\S]*?<\/form>/)[0]);
 for(const f of ['assets/seo/cost-model.js','tools/wms-readiness-assessment/index.html','vercel.json','sitemap.xml','robots.txt','api/events.js','api/lead.js','assets/leads.js','legal/privacy.html','legal/terms.html'])a.equal(withoutDocumentationLinks(read(f)),base(f),f);
 a.equal((h.match(/data-budget-pdf/g)||[]).length,2);a.match(h,/2026-10-26/);a.match(h,/£325 per month/);a.match(h,/5,000 orders per month/);a.match(h,/€1,299 per month/);a.match(h,/five warehouse users/);a.match(h,/€6,200 one-off onboarding/);a.match(h,/no numerical price/);a.match(h,/not a market average/);
});
module.exports={quick,advanced};
