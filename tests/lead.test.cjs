const { test } = require('node:test');
const assert = require('node:assert/strict');
const lead = require('../api/lead');
const events = require('../api/events');
function request(body, extra = {}) {
  return { method: 'POST', headers: { origin: 'https://quark.build', 'content-type': 'application/json', accept: 'application/json' }, body, ...extra };
}
function response() {
  return { headers: {}, code: 200, setHeader(k,v) { this.headers[k] = v; }, status(c) { this.code = c; return this; }, json(v) { this.body = v; return this; }, send(v) { this.body = v; return this; }, end() { return this; }, redirect(c,v) { this.code=c; this.location=v; return this; } };
}
const valid = { email: 'private.person@example.com', industry: 'Other', consent: 'yes', source: 'google', medium: 'organic' };
test('lead acceptance and provider errors are counted separately; no PII reaches event logs', async () => {
  const originalFetch = global.fetch, originalInfo = console.info;
  const logs = []; let sent;
  console.info = value => logs.push(JSON.parse(value));
  try {
    global.fetch = async (url, opts) => { sent={url, payload:JSON.parse(opts.body)}; return { ok: true }; };
    const res=response(); await lead(request(valid),res);
    assert.equal(res.code,200); assert.equal(res.body.ok,true);
    assert.equal(sent.url,'https://formspree.io/f/mqevozlb');
    assert.equal(sent.payload.email,valid.email);
    assert.deepEqual(logs.map(x=>x.event),['lead_submit','lead_success']);
    assert.equal(logs[0].submission_id,logs[1].submission_id);
    assert.equal(JSON.stringify(logs).includes(valid.email),false);
    assert.equal(JSON.stringify(logs).includes('industry'),false);
    logs.length=0;
    global.fetch=async()=>({ok:false}); const fail=response(); await lead(request(valid),fail);
    assert.equal(fail.code,502); assert.deepEqual(logs.map(x=>x.event),['lead_submit','lead_error']);
    logs.length=0;
    global.fetch=async()=>{throw new Error('timeout')}; const timeout=response(); await lead(request(valid),timeout);
    assert.equal(timeout.code,502); assert.equal(logs.at(-1).event,'lead_error');
  } finally { global.fetch=originalFetch; console.info=originalInfo; }
});
test('validation, consent, size, method and origin checks do not forward requests', async () => {
  const originalFetch=global.fetch; let count=0; global.fetch=async()=>{count++;return {ok:true}};
  try {
    const cases=[{...valid,email:'invalid'}, {...valid,consent:''}, {...valid,website:'spam'}, {...valid,industry:'unexpected'}, {email:'x'.repeat(5000)}];
    for(const body of cases) { const res=response(); await lead(request(body),res); assert.equal(res.code,400); }
    const origin=response(); await lead(request(valid,{headers:{origin:'https://other.example'}}),origin); assert.equal(origin.code,403);
    const method=response(); await lead(request(valid,{method:'GET'}),method); assert.equal(method.code,405);
    assert.equal(count,0);
  } finally { global.fetch=originalFetch; }
});
test('non-JavaScript form POST redirects on provider acceptance',async()=>{
  const originalFetch=global.fetch,originalInfo=console.info;global.fetch=async()=>({ok:true});console.info=()=>{};
  try {const res=response(); await lead(request(new URLSearchParams(valid).toString(),{headers:{origin:'https://quark.build','content-type':'application/x-www-form-urlencoded',accept:'text/html'}}),res);assert.equal(res.code,303);assert.equal(res.location,'/thanks.html');}finally{global.fetch=originalFetch;console.info=originalInfo;}
});
test('analytics allowlists prevent spoofed lead successes and personal URL values',()=>{
  const originalInfo=console.info, logs=[];console.info=s=>logs.push(s);
  try {
    const invalid=response();events(request({event:'lead_success',placement:'hero'}),invalid);assert.equal(invalid.code,400);
    const res=response();events(request({event:'cta_click',placement:'hero',source:'person@example.com',medium:'https://private.test',email:valid.email}),res);
    assert.equal(res.code,204);const record=JSON.parse(logs[0]);assert.equal(record.source,'other');assert.equal(record.medium,'other');assert.equal(logs[0].includes('@'),false);
  }finally{console.info=originalInfo;}
});
