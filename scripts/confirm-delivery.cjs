/* Offline, owner-attested inbox receipt; never a browser endpoint or inferred HTTP success. */
const fs=require('node:fs');
const {uuid,paths}=require('../lib/measurement');
function confirmDelivery(exportText, confirmations){
 if(!Array.isArray(confirmations))throw new Error('Expected an array of owner confirmations.');
 const accepted=new Map();
 for(const line of exportText.split('\n')){
  let e;try{e=JSON.parse(line);if(typeof e.message==='string')e=JSON.parse(e.message);}catch{continue;}
  if(e.namespace==='quark_funnel'&&e.event==='demo_form_accepted'&&uuid(e.submission_id)&&uuid(e.attempt_id)&&['production','test'].includes(e.environment))accepted.set(e.submission_id,e);
 }
 const result=[],seen=new Set();
 for(const c of confirmations){
  if(!uuid(c.submission_id)||c.inbox_verified!==true||!Number.isFinite(Date.parse(c.verified_at)))throw new Error('A submission reference, verified_at and explicit inbox_verified:true are required.');
  if(seen.has(c.submission_id))continue;seen.add(c.submission_id);
  const e=accepted.get(c.submission_id);if(!e)throw new Error('No matching consented backend acceptance record.');
  if(Date.parse(c.verified_at)<Date.parse(e.at))throw new Error('Verification cannot precede acceptance.');
  if(!['direct','google','bing','linkedin','newsletter','other'].includes(e.source)||!['none','organic','cpc','email','social','referral','other'].includes(e.medium)||!paths.has(e.landing)||!paths.has(e.page))throw new Error('Unrecognized attribution.');
  result.push({namespace:'quark_funnel',schema:2,event:'demo_form_success',at:new Date(c.verified_at).toISOString(),environment:e.environment,submission_id:e.submission_id,attempt_id:e.attempt_id,event_id:e.submission_id,source:e.source,medium:e.medium,landing:e.landing,page:e.page,context_scope:e.context_scope==='tab'?'tab':'page',delivery_status:'inbox_confirmed_by_owner'});
 }
 return result;
}
module.exports={confirmDelivery};
if(require.main===module){try{if(!process.argv[2]||!process.argv[3])throw new Error('Usage: node scripts/confirm-delivery.cjs backend.ndjson owner-confirmations.json');for(const e of confirmDelivery(fs.readFileSync(process.argv[2],'utf8'),JSON.parse(fs.readFileSync(process.argv[3],'utf8'))))console.log(JSON.stringify(e));}catch(e){console.error(e.message);process.exitCode=1;}}
