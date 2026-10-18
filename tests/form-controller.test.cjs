const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const {randomUUID}=require('node:crypto');
function client({valid=true,send=async()=>({ok:true,json:async()=>({ok:true,delivery_status:'provider_accepted'})}),cryptoAvailable=true}={}){
 const listeners=[],calls=[],events=[],button={textContent:'Discuss my warehouse',disabled:false},status={textContent:''};
 const form={dataset:{},reportValidity:()=>valid,querySelector:()=>button,addEventListener:(name,fn)=>{if(name==='submit')listeners.push(fn);},reset(){this.resets=(this.resets||0)+1;}};
 const context={window:{QuarkMeasurement:{metadata:()=>({consent:true}),track:(name,fields)=>events.push({name,...fields})}},document:{getElementById:id=>id==='leadForm'?form:status},location:{pathname:'/',hash:''},crypto:cryptoAvailable?{randomUUID}:{},FormData:class {constructor(){return new Map([['email','private@example.com'],['consent','yes']]);}},fetch:async(...a)=>{calls.push(a);return send(...a);}};
 const source=fs.readFileSync(require.resolve('../assets/leads.js'),'utf8');vm.runInNewContext(source,context);vm.runInNewContext(source,context);
 return {listeners,calls,events,button,status,form,submit:()=>listeners[0]({preventDefault(){}})};
}
test('form binds once, suppresses in-flight duplicates, and never sends a browser success event',async()=>{
 let finish;const c=client({send:()=>new Promise(resolve=>{finish=resolve;})});assert.equal(c.listeners.length,1);
 const sending=c.submit();await c.submit();assert.equal(c.calls.length,1);assert.equal(c.events.length,1);finish({ok:true,json:async()=>({ok:true,delivery_status:'provider_accepted'})});await sending;
 assert.equal(c.form.resets,1);assert.equal(c.button.disabled,true);assert.equal(c.events.some(x=>/success|accepted/.test(x.name)),false);await c.submit();assert.equal(c.calls.length,1);
});
test('native invalid form does not count an attempted send; optional API availability never blocks contact',async()=>{
 const invalid=client({valid:false});await invalid.submit();assert.equal(invalid.calls.length,0);assert.equal(invalid.events.length,0);
 const old=client({cryptoAvailable:false});await old.submit();assert.equal(old.calls.length,1);assert.match(old.status.textContent,/received/);
});
test('network, provider rejection and malformed success keep UI recoverable without fake conversions',async()=>{
 for(const [send,reason] of [[async()=>{throw Error('offline');},'network'],[async()=>({ok:false}),null],[async()=>({ok:true,json:async()=>{throw Error('invalid');}}),'response']]){
  const c=client({send});await c.submit();assert.equal(c.button.disabled,false);assert.match(c.status.textContent,/could not be confirmed/);assert.equal(c.form.resets,undefined);
  const failures=c.events.filter(x=>x.name==='demo_form_error');assert.equal(failures.length,reason?1:0);if(reason)assert.equal(failures[0].reason,reason);
 }
});
