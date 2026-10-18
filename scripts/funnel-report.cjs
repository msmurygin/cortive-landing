const fs = require('node:fs');
function report(text, environment = 'production') {
 const rows = new Map(), seen = new Set();
 for (const line of text.split('\n')) {
  let e; try { e = JSON.parse(line); if (typeof e.message === 'string') e = JSON.parse(e.message); } catch { continue; }
  if (e.namespace !== 'quark_funnel' || e.environment !== environment || !['page_view','demo_cta_click','demo_form_submit','demo_form_accepted','demo_form_error','demo_form_success'].includes(e.event)) continue;
  if (!['direct','google','bing','linkedin','newsletter','other'].includes(e.source) || !['none','organic','cpc','email','social','referral','other'].includes(e.medium) || !['/','/vision','/screens.html','/wms-cost','/features/inventory-management','other'].includes(e.landing)) continue;
  const identity = ['demo_form_accepted','demo_form_error','demo_form_submit','demo_form_success'].includes(e.event) ? e.attempt_id : e.event_id;
  if (typeof identity !== 'string' || !/^[0-9a-f-]{36}$/i.test(identity)) continue;
  const dedup = e.event + ':' + identity; if (seen.has(dedup)) continue; seen.add(dedup);
  const key = [e.source,e.medium,e.landing].join('|');
  if (!rows.has(key)) rows.set(key,{source:e.source,medium:e.medium,landing:e.landing,entry_views:0,page_views:0,cta_clicks:0,submit_attempts:0,provider_accepted:0,inbox_confirmed:0,errors:0});
  const r=rows.get(key);
  if(e.event==='page_view'){r.page_views++;if(e.is_entry===true)r.entry_views++;}
  else r[{'demo_cta_click':'cta_clicks','demo_form_submit':'submit_attempts','demo_form_accepted':'provider_accepted','demo_form_error':'errors','demo_form_success':'inbox_confirmed'}[e.event]]++;
 }
 return {environment,warning:'Consented measured entries, not all visitors or unique people. Provider acceptance is not inbox delivery or qualification. Export retention and completeness must be verified.',rows:[...rows.values()].map(r=>({...r,accepted_per_entry:r.entry_views?r.provider_accepted/r.entry_views:null}))};
}
module.exports={report};
if(require.main===module){const file=process.argv[2];if(!file){console.error('Usage: node scripts/funnel-report.cjs export.ndjson [production|test]');process.exitCode=1;}else console.log(JSON.stringify(report(fs.readFileSync(file,'utf8'),process.argv[3]||'production'),null,2));}
