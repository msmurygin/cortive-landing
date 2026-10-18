const {test}=require('node:test'),assert=require('node:assert/strict');
const {calculate}=require('../drafts/assets/cost-model');
// Synthetic arithmetic fixtures only. These values are not suggested WMS prices.
const base={currency:'USD',licensing:'subscription',complexity:'standard',approach:'mixed',warehouses:'2',users:'5',integrations:'2',days:'3',dayRate:'100',siteSetup:'50',integrationCost:'200',migration:'100',training:'50',devices:'25',contingency:'10',monthlyBase:'20',monthlyUser:'3',annualSupport:'80',annualOther:'100'};
test('subscription includes year-one recurring cost, scoped multipliers and contingency',()=>{
 const r=calculate(base);assert.equal(r.initialTotal,110000);assert.equal(r.annualTotal,60000);assert.equal(r.tco3,290000);assert.equal(r.tco5,410000);
 assert.equal(r.initial.siteSetup,10000);assert.equal(r.initial.integrations,40000);assert.equal(r.initial.contingency,10000);
});
test('perpetual charges licence once, excludes inactive subscription, and retains maintenance',()=>{
 const r=calculate({...base,licensing:'perpetual',licenseBase:'100',licenseUser:'10'});
 assert.equal(r.initial.software,15000);assert.equal(r.initialTotal,126500);assert.equal(r.annual.software,0);assert.equal(r.annualTotal,18000);assert.equal(r.tco5,216500);
});
test('blank is unknown; explicit zero is valid; cents rounded once',()=>{
 for(const value of ['',undefined,'-1','NaN','Infinity','1e2','1.234'])assert.throws(()=>calculate({...base,migration:value}));
 const zero={...base};for(const k of ['days','dayRate','siteSetup','integrationCost','migration','training','devices','contingency','monthlyBase','monthlyUser','annualSupport','annualOther'])zero[k]='0';
 assert.equal(calculate(zero).tco5,0);
 const r=calculate({...zero,migration:'0.05',contingency:'10'});assert.equal(r.initial.contingency,1);assert.equal(r.initialTotal,6);
});
test('counts, ranges and unsupported models are refused; complexity is not a hidden price multiplier',()=>{
 for(const x of [{users:'0'},{warehouses:'1.2'},{integrations:'-1'},{days:'10001'},{currency:'EUR'},{licensing:'free'},{contingency:'101'}])assert.throws(()=>calculate({...base,...x}));
 assert.deepEqual(calculate({...base,complexity:'complex',approach:'partner'}),calculate(base));
 const gbp=calculate({...base,currency:'GBP'});assert.equal(gbp.tco5,calculate(base).tco5);assert.equal(gbp.currency,'GBP');
});
test('unsafe integer totals are rejected instead of silently losing monetary precision',()=>{
 assert.throws(()=>calculate({...base,users:'10000',monthlyUser:'1000000000'}),/safely/);
});
