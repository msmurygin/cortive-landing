/* Quark — one metadata engine, two interfaces. Single shared state; WebRF and TUI are pure renders of it. Workflow runs locally; optional Quark AI analysis uses the same-origin server endpoint. */
(function(){
const root=document.getElementById('qe-root');if(!root)return;
const $=(s,r)=>(r||root).querySelector(s);
const esc=(s)=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TYPES=['E-commerce','Distribution','3PL','Manufacturing'];
const LIM={aisles:[1,12],bays:[1,20],levels:[1,8]};
const TASK={doc:'PO-DEMO-1042',lpn:'DEMO-LPN-001',item:'BOTTLE-500',itemName:'Bottle 500 ml',qty:24,target:'A-01-02-L1'};
const WRONG='B-02-01-L3';
const EXAMPLE='An e-commerce warehouse with 3 aisles, 4 bays per rack and 4 levels.';
const STEPS=['receive','scan','putaway','done'];
let pendingFile=null,aiController=null,aiSerial=0;
const S={phase:'setup',stage:'drop',an:null,dragOver:false,setup:{ai:null,aiKnown:{},type:'E-commerce',aisles:3,bays:4,levels:4,text:'',plan:null,src:null,manual:{},fromText:{}},prog:0,step:'receive',draft:'',mismatch:null,dock:0,onhand:0,log:[],modalShown:false,modal:false,sync:null,face:{aisle:'A',side:'02'},formErr:''};
const pad=(n)=>String(n).padStart(2,'0');
const clamp=(k,v)=>{v=parseInt(v,10);if(isNaN(v))return null;return Math.max(LIM[k][0],Math.min(LIM[k][1],v))};
const locCount=()=>S.setup.aisles*2*S.setup.bays*S.setup.levels;
const aisleL=(i)=>String.fromCharCode(65+i);
const lastLoc=()=>aisleL(S.setup.aisles-1)+'-'+pad(S.setup.bays)+'-02-L'+S.setup.levels;
function locExists(c){const m=/^([A-Z])-(\d{2})-(0[12])-L(\d)$/.exec(c);if(!m)return false;return m[1].charCodeAt(0)-65<S.setup.aisles&&+m[2]>=1&&+m[2]<=S.setup.bays&&+m[4]>=1&&+m[4]<=S.setup.levels}
const now=()=>{const d=new Date();return d.toTimeString().slice(0,8)};
function log(k,m,cls){S.log.push({t:now(),k,m,cls});if(S.log.length>7)S.log=S.log.slice(-7)}
/* ---------- workflow actions (shared by both interfaces) ---------- */
const SRC={web:'WebRF',tui:'TUI',map:'Schematic'};
function synced(from){log('WEBRF PREVIEW','State updated'+(from==='web'?'':' · from '+SRC[from]));log('TUI PREVIEW','State updated'+(from==='tui'?'':' · from '+SRC[from]));S.sync={from,at:Date.now()}}
const act={
receive(from){if(S.step!=='receive'){log('RECEIPT',TASK.lpn+' already received · quantity unchanged','er');return render()}
S.dock=TASK.qty;S.step='scan';log('RECEIPT',TASK.lpn+' received · '+TASK.qty+' units','ok');synced(from);render()},
scan(code,from,demo){code=String(code||'').trim().toUpperCase();
if(S.step==='receive'){log('SCAN','Confirm receipt first','er');return render()}
if(S.step!=='scan'){log('SCAN','Destination already matched · scan ignored','er');return render()}
if(!code)return;S.draft='';
const tag=demo?'SCAN DEMO':'SCAN';
if(code===TASK.target){S.mismatch=null;S.step='putaway';log(tag,code+' → destination matched','ok')}
else{S.mismatch={code,why:locExists(code)?'Wrong location':'Unknown address'};log(tag,code+' → mismatch · expected '+TASK.target,'er')}
synced(from);render()},
putaway(from){if(S.step==='done'){log('WORKFLOW','Putaway already confirmed · stock unchanged','er');return render()}
if(S.step!=='putaway'){log('WORKFLOW','Scan the destination before confirming','er');return render()}
S.step='done';S.dock=0;S.onhand=TASK.qty;log('WORKFLOW','Putaway confirmed · '+TASK.target+' on hand '+TASK.qty,'ok');synced(from);render();
if(!S.modalShown){S.modalShown=true;leadTimer=setTimeout(()=>{if(S.phase==='live'&&S.step==='done'){S.modal=true;render()}},900)}},
back(from){if(S.step==='scan'&&(S.mismatch||S.draft)){S.mismatch=null;S.draft='';log('WORKFLOW','Scan cleared');synced(from);return render()}
if(S.step==='putaway'){S.step='scan';log('WORKFLOW','Destination scan cleared · rescan required');synced(from);return render()}}};
/* ---------- generate ---------- */
let prepT=[],leadTimer;
function generate(){
clearTimeout(leadTimer);
const st=S.setup;['aisles','bays','levels'].forEach(k=>{st[k]=clamp(k,st[k])||LIM[k][0]});
Object.assign(S,{phase:'preparing',prog:0,step:'receive',draft:'',mismatch:null,dock:0,onhand:0,log:[],modalShown:false,modal:false,sync:null,face:{aisle:'A',side:'02'}});
const seq=[
['INPUT','Warehouse parameters accepted · '+st.type+(st.src==='ai'?' · reviewed AI suggestions':st.src==='demo'?' · from demo schematic':st.src==='file'?' · plan kept as reference':st.src==='text'?' · from description':' · manual')],
['LAYOUT','Preparing aisle and rack structure · '+st.aisles+' aisle'+(st.aisles>1?'s':'')+' × 2 rack faces × '+st.bays+' bays × '+st.levels+' levels'],
['LOCATIONS','Generated '+locCount()+' location addresses · A-01-01-L1 … '+lastLoc()],
...(st.rules||[]).map(r=>['SAMPLE RULE',r.text]),['WORKFLOW','Receiving and putaway task created · '+TASK.doc+' · '+TASK.lpn],
['WEBRF PREVIEW','Workflow state attached'],
['TUI PREVIEW','Workflow state attached'],
['READY','Receiving and putaway preview available']];
prepT.forEach(clearTimeout);prepT=[];
render();
seq.forEach((s,i)=>prepT.push(setTimeout(()=>{log(s[0],s[1],i===seq.length-1?'ok':'');S.prog=Math.round((i+1)/seq.length*100);if(i===seq.length-1){S.phase='live'}render()},380*(i+1))))}
/* ---------- renders ---------- */
const DEMO_PLAN={name:'demo-ecommerce-schematic.svg',demo:true};
function demoPlanSVG(k){
const boxes=[{x:14,y:124,w:212,h:30,l:'DOCK AREA',lx:224,ly:151,a:'end'},{x:20,y:8,w:200,h:34,l:'BLOCK A',lx:210,ly:27,a:'end'},{x:20,y:46,w:200,h:34,l:'BLOCK B',lx:210,ly:65,a:'end'},{x:20,y:84,w:200,h:34,l:'BLOCK C',lx:210,ly:103,a:'end'},{x:36,y:9,w:176,h:12,l:'4 BAYS / ROW',lx:38,ly:27,a:'start'}];
let g='';for(let i=0;i<3;i++){const y=10+i*38;['',' '].forEach((_,r)=>{const yy=y+r*20;g+='<rect x="36" y="'+yy+'" width="176" height="10" class="r"/>';for(let b=1;b<4;b++)g+='<line x1="'+(36+b*44)+'" x2="'+(36+b*44)+'" y1="'+yy+'" y2="'+(yy+10)+'" class="r"/>'});g+='<text x="24" y="'+(y+18)+'" class="t">'+'ABC'[i]+'</text>'}
g+='<rect x="18" y="128" width="204" height="22" class="d"/>';for(let i=0;i<6;i++)g+='<rect x="'+(28+i*32)+'" y="150" width="20" height="4" class="dd"/>';g+='<text x="120" y="142" class="t" text-anchor="middle">DOCK</text>';
const bb=boxes.slice(0,k).map((b,i)=>'<g class="bb'+(i===k-1?' is-new':'')+'"><rect x="'+b.x+'" y="'+b.y+'" width="'+b.w+'" height="'+b.h+'"/><text x="'+b.lx+'" y="'+b.ly+'" text-anchor="'+b.a+'">'+b.l+'</text></g>').join('');
return '<svg viewBox="0 0 240 160" class="qe-plan-svg" aria-label="Demo e-commerce warehouse schematic">'+g+bb+'</svg>'}
function previewHTML(){const p=S.setup.plan,k=S.an?S.an.k:5;
if(!p||p.demo)return demoPlanSVG(k);
if(p.url)return '<img src="'+p.url+'" alt="Uploaded plan '+esc(p.name)+'">';
return '<div class="qe-pdf"><span>PDF</span><b>'+esc(p.name)+'</b><small>'+Math.max(1,Math.round(p.size/1024))+' KB</small></div>'}
function paramsHTML(){
const st=S.setup,src=st.src;
const nf=(k,l)=>'<div class="qe-nf"><label for="qe-'+k+'">'+l+'</label><input class="qe-num" id="qe-'+k+'" data-k="'+k+'" type="number" inputmode="numeric" min="'+LIM[k][0]+'" max="'+LIM[k][1]+'" value="'+st[k]+'"><small class="'+(st.fromText[k]?'is-desc':'')+'">'+(st.manual[k]?'set manually':src==='ai'&&!st.aiKnown[k]?'not found · check':st.fromText[k]?(src==='ai'?'from AI':src==='demo'?(k==='levels'?'default · check':'from plan'):'from description'):LIM[k][0]+'–'+LIM[k][1])+'</small></div>';
const badge=src==='ai'?'<span class="qe-badge is-ai"><i aria-hidden="true"></i>Quark AI suggestions · review</span>':src==='demo'?'<span class="qe-badge is-ai"><i aria-hidden="true"></i>Sample configuration</span>':src==='file'?'<span class="qe-badge is-warn">Plan attached · review parameters</span>':src==='text'?'<span class="qe-badge is-ai"><i aria-hidden="true"></i>Sample configuration</span>':'<span class="qe-badge is-plain">Manual parameters</span>';
return '<form class="qe-setup'+(S.unfold?' is-unfold':'')+'" id="qe-form" novalidate aria-label="Warehouse parameters"><div class="qe-row" style="margin:0">'+badge+'<button type="button" class="qe-link" id="qe-restart">Start over</button></div>'
+(st.plan?'<div class="qe-thumb"><div class="qe-thumb-i">'+previewHTML()+'</div><div><b>'+esc(st.plan.name)+'</b><small>'+(st.plan.demo?'Demo schematic · levels are not shown on a floor plan':'Reviewed with Quark AI · check the suggested values')+'</small></div></div>':'')
+(src==='text'||st.text?'<div><label class="qe-lab" for="qe-desc">Description</label><textarea class="qe-ta" id="qe-desc" maxlength="5000" style="min-height:72px">'+esc(st.text)+'</textarea><div class="qe-row"><span class="qe-parsed" id="qe-parsed">'+(S.descriptionChanged?'Description changed. Analyse again to update suggestions.':'Edit the description and ask Quark AI to review it.')+'</span><button type="button" class="qe-link" id="qe-desc-go"'+(st.text.trim()?'':' disabled')+'>Analyse again with Quark AI →</button></div></div>':'')
+'<div><span class="qe-lab" id="qe-type-l">Warehouse type</span><div class="qe-seg" role="group" aria-labelledby="qe-type-l">'+TYPES.map(t=>'<button type="button" data-type="'+t+'" aria-pressed="'+(st.type===t)+'">'+t+'</button>').join('')+'</div></div>'
+'<div class="qe-nums">'+nf('aisles','Aisles')+nf('bays','Bays / rack')+nf('levels','Rack levels')+'</div>'
+(st.ai?'<div class="qe-ai-result"><p>'+esc(st.ai.summary)+'</p>'+(st.ai.uncertainties.length?'<ul>'+st.ai.uncertainties.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+'</div>':'')
+'<p class="qe-note">Check the values and change any of them by hand. A value you edit stays as you set it.</p>'
+'<div class="qe-ask"><label class="qe-lab" for="qe-ask">Ask Quark AI about a preview rule</label><div class="qe-askrow"><span aria-hidden="true">&gt;_</span><input id="qe-ask" value="'+esc(S.ruleText||'')+'" maxlength="1000" placeholder="e.g. Reserve Level 4 for heavy LPNs" autocomplete="off"><button type="button" id="qe-ask-go"'+(S.ruleBusy?' disabled':'')+'>'+(S.ruleBusy?'Thinking…':'Ask Quark AI')+'</button></div>'+(st.rules&&st.rules.length?'<ul class="qe-rules">'+st.rules.map((r,i)=>'<li><span class="qe-mono">'+esc(r.code)+'</span>'+esc(r.text)+'<button type="button" class="qe-x2" data-rule="'+i+'" aria-label="Remove rule">×</button></li>').join('')+'</ul>':'')+(S.ruleErr?'<p class="qe-err" role="alert">'+esc(S.ruleErr)+'</p>':'')+'<p class="qe-note">This rule and the preview parameters are sent to Quark AI for interpretation.</p></div>'
+(S.formErr?'<p class="qe-err">'+esc(S.formErr)+'</p>':'')
+'<div><button class="qe-btn is-wide" type="submit"'+(S.phase==='preparing'||S.ruleBusy?' disabled':'')+'><span>'+(S.phase==='preparing'?'Preparing…':'Instantiate dual-render preview')+'</span><span aria-hidden="true">→</span></button><p class="qe-note" style="margin-top:8px"><span class="qe-mono">'+locCount()+'</span> location addresses · no sign-up needed</p></div></form>'}
function dropHTML(){
return '<div class="qe-setup" aria-label="Describe your warehouse"><div class="qe-row" style="margin:0"><span class="qe-lab" style="margin:0">Describe your warehouse</span><span class="qe-ai-tag"><i aria-hidden="true"></i>Quark AI layout analysis</span></div>'
+'<div class="qe-drop'+(S.dragOver?' is-over':'')+'" id="qe-drop"><input type="file" id="qe-plan" aria-label="Choose a warehouse plan for local preview" accept="image/jpeg,image/png,application/pdf"><div class="qe-drop-ic" aria-hidden="true"><i></i></div><b>[ DROP WAREHOUSE PLAN HERE ]</b><span>JPEG · PNG · PDF · up to 3 MB</span><label for="qe-plan" class="qe-btn is-ghost"><span>[ BROWSE FILES ]</span></label></div><p class="qe-note qe-ai-sub">Choose Analyze with Quark AI to send your plan or description to our AI service. Only share material you have permission to use. The warehouse preview stays a simulation.</p>'
+(S.setup.plan&&!S.setup.plan.demo?'<p class="qe-note">Selected: '+esc(S.setup.plan.name)+'</p><button type="button" class="qe-btn is-wide" id="qe-analyze-file">Analyze plan with Quark AI →</button>':'')
+(S.formErr?'<p class="qe-err" role="alert" style="margin:0">'+esc(S.formErr)+'</p>':'')
+'<div class="qe-demo-cta"><button type="button" class="qe-btn is-wide" id="qe-demo" aria-describedby="qe-demo-d"><span>[ ANALYZE SAMPLE WITH CLAUDE ]</span><span aria-hidden="true">→</span></button><small id="qe-demo-d">Uses our sample warehouse description; no file is uploaded.</small></div>'
+'<div class="qe-or"><span>or</span></div>'
+'<div><label class="qe-sr" for="qe-desc">Warehouse description</label><textarea class="qe-ta" id="qe-desc" maxlength="5000" placeholder="Or type a manual description instead… e.g. '+esc(EXAMPLE)+'">'+esc(S.setup.text)+'</textarea><div class="qe-row"><span class="qe-parsed" id="qe-parsed">Quark AI will suggest parameters from your description</span><button type="button" class="qe-link" id="qe-desc-go"'+(S.setup.text.trim()?'':' disabled')+'>Analyze description with Quark AI →</button></div></div>'
+'<button type="button" class="qe-link" id="qe-manual">Set parameters manually</button></div>'}
function analyzingHTML(){return '<div class="qe-setup" aria-busy="true" aria-label="Quark AI analysis"><span class="qe-ai-tag is-live"><i aria-hidden="true"></i>Quark AI · analysing</span><div class="qe-scanbox"><div class="qe-scanimg">'+previewHTML()+'</div><i class="qe-sweep" aria-hidden="true"></i></div><p class="qe-note" role="status">Sending your input for analysis. Waiting for Quark AI’s suggestions…</p><button type="button" class="qe-link" id="qe-manual">Cancel and set parameters manually</button></div>'}
function setupHTML(){return S.stage==='analyzing'?analyzingHTML():S.stage==='params'?paramsHTML():dropHTML()}
let anT=[];
function cancelAI(){aiSerial++;if(aiController)aiController.abort();aiController=null;S.ruleBusy=false}
async function requestAI(body){
 aiController=new AbortController();const controller=aiController,timer=setTimeout(()=>controller.abort(),45000);
 try{const res=await fetch('/api/engine-analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,consent:true}),signal:controller.signal});
 const data=await res.json();if(!res.ok||!data.ok)throw new Error(data.error||'Quark AI could not analyse this input.');return data.result;
 }finally{clearTimeout(timer);if(aiController===controller)aiController=null}
}
function readPlan(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(',')[1]);reader.onerror=()=>reject(new Error('Could not read this file.'));reader.readAsDataURL(file)})}
async function analyze(plan){
 cancelAI();const serial=aiSerial;S.formErr='';S.ruleErr='';if(S.setup.plan&&S.setup.plan.url&&S.setup.plan!==plan)URL.revokeObjectURL(S.setup.plan.url);S.setup.plan=plan;S.stage='analyzing';render();
 try{
 const body={mode:'layout',text:plan&&plan.demo?EXAMPLE:S.setup.text};
 if(plan&&!plan.demo){if(!pendingFile)throw new Error('Choose your plan again.');body.file={type:pendingFile.type||(/\.pdf$/i.test(pendingFile.name)?'application/pdf':/\.png$/i.test(pendingFile.name)?'image/png':'image/jpeg'),data:await readPlan(pendingFile)}}
 if(serial!==aiSerial)return;const result=await requestAI(body);if(serial!==aiSerial)return;
 const st=S.setup;st.ai=result;st.aiKnown={};st.fromText={};
 ['type','aisles','bays','levels'].forEach(k=>{if(result[k]!=null&&!st.manual[k]){st[k]=result[k];st.fromText[k]=true;st.aiKnown[k]=true}});
 st.rules=result.rules.map(r=>({code:r.level?'L'+r.level+' → '+r.category:'RULE',text:r.text,lv:r.level,cls:r.category}));
 st.src='ai';S.descriptionChanged=false;S.stage='params';S.unfold=true;render();const f=$('#qe-aisles');f&&f.focus({preventScroll:true});
 }catch(e){if(serial!==aiSerial)return;S.stage='drop';S.formErr=e.name==='AbortError'?'Quark AI analysis timed out. Retry or set parameters manually.':e.message;render()}
}
async function askRule(){
 const input=$('#qe-ask');if(!input||!input.value.trim())return input&&input.focus();if(S.ruleBusy)return;
 const text=input.value.trim();cancelAI();const serial=aiSerial;S.ruleBusy=true;S.ruleErr='';S.ruleText=text;render();
 try{const st=S.setup,result=await requestAI({mode:'rule',text,setup:{type:st.type,aisles:st.aisles,bays:st.bays,levels:st.levels}});if(serial!==aiSerial)return;
 if(!result.rules.length)throw new Error(result.uncertainties[0]||'Add more detail about the rule you want to try.');
 st.rules=(st.rules||[]).concat(result.rules.map(r=>({code:r.level?'L'+r.level+' → '+r.category:'RULE',text:r.text,lv:r.level,cls:r.category}))).slice(-8);S.ruleText='';
 }catch(e){if(serial!==aiSerial)return;S.ruleErr=e.name==='AbortError'?'Quark AI request timed out. Please retry.':e.message}
 finally{if(serial===aiSerial){S.ruleBusy=false;render()}}
}
function summaryHTML(){const st=S.setup;
return '<div class="qe-sum"><dl><div><dt>Type</dt><dd>'+esc(st.type)+'</dd></div><div><dt>Layout</dt><dd>'+st.aisles+' aisles × '+st.bays+' bays × '+st.levels+' levels</dd></div><div><dt>Addresses</dt><dd>'+locCount()+'</dd></div>'+(st.src==='file'?'<div><dt>Plan</dt><dd>reference only</dd></div>':st.src==='demo'?'<div><dt>Plan</dt><dd>demo schematic</dd></div>':'')+'</dl><div class="qe-sum-act">'+(S.step==='done'?'<button type="button" class="qe-link" id="qe-cont">Continue with this setup →</button>':'')+'<button type="button" class="qe-link" id="qe-reset">Restart task</button><button type="button" class="qe-link" id="qe-edit">Edit setup</button></div></div>'}
const stepNo=()=>Math.min(3,STEPS.indexOf(S.step)+1);
function rfHTML(){
if(S.phase!=='live')return '<div class="qe-rf qe-dev"><div class="qe-rf-bar">WebRF<span>no task</span></div><div class="qe-wait">'+(S.phase==='preparing'?'<b>Attaching workflow…</b>':'<b>No task assigned</b>Generate a warehouse setup to load a receiving and putaway task.')+'</div></div>';
const i=STEPS.indexOf(S.step);
let body='';
if(S.step==='receive')body='<p class="qe-note">Pallet at dock. Check the label, then confirm receipt.</p><div class="qe-rf-act"><button type="button" class="qe-btn is-wide" data-a="receive"><span>Confirm receipt</span><span aria-hidden="true">→</span></button></div>';
if(S.step==='scan')body=(S.mismatch?'<div class="qe-alert" role="alert">'+esc(S.mismatch.why)+' <b>'+esc(S.mismatch.code)+'</b>. Expected <b>'+TASK.target+'</b>. Scan again.</div>':'')+'<div class="qe-rf-act"><label class="qe-lab" for="qe-rfscan" style="margin:0">Scan destination</label><div class="qe-scanrow"><input class="qe-scan" id="qe-rfscan" data-scan="web" value="'+esc(S.draft)+'" placeholder="Scan or type location" autocomplete="off" spellcheck="false" autocapitalize="characters"><button type="button" data-a="scan-web">Enter</button></div><div class="qe-sims"><button type="button" class="qe-link" data-a="sim-ok">Simulate scan · '+TASK.target+'</button><button type="button" class="qe-link" data-a="sim-bad">Simulate wrong scan · '+WRONG+'</button></div></div>';
if(S.step==='putaway')body='<div class="qe-okmsg">Destination matched. Place the pallet and confirm.</div><div class="qe-rf-act"><button type="button" class="qe-btn is-wide" data-a="putaway"><span>Confirm putaway</span><span aria-hidden="true">→</span></button><button type="button" class="qe-btn is-ghost is-wide" data-a="back"><span>Back · rescan</span></button></div>';
if(S.step==='done')body='<div class="qe-done"><b>Task completed</b><span class="qe-note">'+TASK.qty+' units of '+TASK.item+' on hand at '+TASK.target+'.</span></div><div class="qe-rf-act"><button type="button" class="qe-btn is-wide" disabled><span>Putaway confirmed</span><span aria-hidden="true">✓</span></button></div>';
return '<div class="qe-rf qe-dev"><div class="qe-rf-bar">'+(S.step==='receive'?'Receiving':'Putaway')+'<span>'+TASK.doc+' · '+stepNo()+'/3</span></div><div class="qe-rf-steps" aria-hidden="true">'+[0,1,2].map(k=>'<i class="'+(k<i||S.step==='done'?'on':'')+'"></i>').join('')+'</div><div class="qe-rf-b"><h4 class="qe-rf-title">'+(S.step==='receive'?'Receive pallet':S.step==='done'?'Putaway complete':'Put away pallet')+'</h4>'
+'<dl class="qe-rf-dl"><dt>LPN</dt><dd>'+TASK.lpn+'</dd><dt>Item</dt><dd>'+TASK.item+'</dd><dt>Quantity</dt><dd>'+TASK.qty+' units</dd><dt>'+(S.step==='done'?'On hand':'At dock')+'</dt><dd>'+(S.step==='done'?S.onhand:S.dock)+' units</dd></dl>'
+'<div class="qe-rf-loc'+(S.step==='putaway'||S.step==='done'?' is-ok':'')+'"><small>Destination</small><b>'+TASK.target+'</b></div>'+(S.step==='scan'||S.step==='putaway'?'<div class="qe-copilot"><i aria-hidden="true"></i><span><b>Route preview</b> Example route · Dock → A-01 → 02-L1</span></div>':'')+body+'</div></div>'}
const W=32;
const ln=(t,c)=>({t:String(t).slice(0,W).padEnd(W,' '),c});
const rule=()=>ln('-'.repeat(W),'dim');
function tuiLines(){
const L=[ln('QUARK WMS / TERMINAL PREVIEW'),rule()];
if(S.phase!=='live'){L.push(ln(''),ln(S.phase==='preparing'?' ATTACHING WORKFLOW...':' WAITING FOR SETUP'),ln(S.phase==='preparing'?' '+'#'.repeat(Math.round(S.prog/100*24)).padEnd(24,'.'):' NO TASK ASSIGNED','dim'));for(let i=0;i<9;i++)L.push(ln(''));L.push(rule(),ln(' [ESC] BACK','dim'));return L}
L.push(ln((' '+(S.step==='receive'?'RECEIVE':'PUTAWAY')+' PALLET').padEnd(W-9)+'STEP '+stepNo()+'/3'),ln(' DOC  : '+TASK.doc),ln(' LPN  : '+TASK.lpn),ln(' ITEM : '+TASK.item),ln(' QTY  : '+TASK.qty+' units'),ln(' LOC  : '+TASK.target+(S.step==='putaway'||S.step==='done'?'  OK':'')),ln(' '+(S.step==='done'?'ONHND: '+S.onhand:'DOCK : '+S.dock)),ln(S.step==='scan'||S.step==='putaway'?' DEMO PATH // DOCK>A-01>02-L1':(S.setup.rules||[]).filter(r=>r.lv)[0]?' DEMO RULE // '+S.setup.rules.filter(r=>r.lv)[0].code.replace('→','>'):'','dim'),rule());
if(S.step==='receive')L.push(ln('> CONFIRM RECEIPT?','hi'),ln(''),ln(''));
if(S.step==='scan'){if(S.mismatch)L.push(ln('!! MISMATCH: '+S.mismatch.code,'er'),ln('   EXPECTED '+TASK.target));else L.push(ln('> SCAN DESTINATION BARCODE','hi'),ln(''));L.push({input:true})}
if(S.step==='putaway')L.push(ln('> DESTINATION MATCHED','hi'),ln('  CONFIRM PUTAWAY?'),ln(''));
if(S.step==='done')L.push(ln('*** TASK COMPLETED ***','hi'),ln('  '+TASK.qty+' UNITS AT '+TASK.target),ln(''));
L.push(rule(),ln(S.step==='done'?' [F2] CONFIRM':S.step==='scan'?' [ENT] SCAN  [F2] OK  [ESC] BACK':' [F2] CONFIRM       [ESC] BACK','dim'));return L}
function tuiHTML(){
const body=tuiLines().map(l=>l.input?'<span class="l">LOC&gt; <input id="qe-tuiscan" data-scan="tui" value="'+esc(S.draft)+'" maxlength="16" size="16" autocomplete="off" spellcheck="false" autocapitalize="characters" aria-label="Terminal scan input"><span class="bl">_</span>'+' '.repeat(W-22)+'</span>':'<span class="l'+(l.c?' '+l.c:'')+'">'+esc(l.t)+'</span>').join('\n');
const live=S.phase==='live';
return '<div class="qe-tuiwrap qe-dev"><div class="qe-tuitop"><span>HANDHELD · 240×320 CLASS</span><span>'+(live?'ONLINE':'IDLE')+'</span></div><pre class="qe-tui" id="qe-tui" tabindex="0" role="application" aria-label="Terminal preview. F2 confirms, Escape goes back, Enter submits a scan."><code>'+body+'</code></pre>'
+'<div class="qe-keys"><button type="button" data-k="F2"'+(live?'':' disabled')+'><b>F2</b> CONFIRM</button><button type="button" data-k="F3"'+(live&&S.step==='scan'?'':' disabled')+'><b>F3</b> DEMO SCAN</button><button type="button" data-k="ESC"'+(live?'':' disabled')+'><b>ESC</b> BACK</button></div><div class="qe-tuihint">Click the screen and use F2 / Esc / Enter, or the keys above.<br>ℓ Lepton is a planned edge/client direction. Device compatibility is verified per project.</div></div>'}
function occ(code){let h=0;for(const c of code)h=(h*31+c.charCodeAt(0))>>>0;return h%10<3}
function faceHTML(){
if(S.phase!=='live')return '<div class="qe-face"><div class="qe-bp-empty"><span>NO LAYOUT LOADED</span><small>Rack elevation appears after generation.</small></div></div>';
const st=S.setup,f=S.face,scan=S.step==='scan',fresh=S.sync&&Date.now()-S.sync.at<1000;
const lv=[];for(let l=st.levels;l>=1;l--)lv.push(l);
const bays=[];for(let b=1;b<=st.bays;b++){
const cells=lv.map(l=>{const code=f.aisle+'-'+pad(b)+'-'+f.side+'-L'+l,t=code===TASK.target,x=S.mismatch&&S.mismatch.code===code,o=!t&&occ(code);
const cls='qe-loc'+(t?(S.step==='done'?' is-done'+(fresh?' is-anim':''):' is-t'):'')+(o?' is-o':'')+(x?' is-x':'');
const lab=t?(S.step==='done'?'<b>LOCKED</b><i>'+TASK.qty+' U · '+TASK.lpn+'</i>':'<b>TARGET</b><i>'+code+'</i>'):x?'<b>MISMATCH</b><i>'+code+'</i>':o?'<i class="qe-lpn">LPN</i><em>'+code+'</em>':'<em>'+code+'</em>';
return '<button type="button" class="'+cls+'" data-loc="'+code+'" '+(scan?'aria-label="Simulate scan '+code+(o?' (occupied)':'')+'"':'tabindex="-1" aria-label="'+code+(o?' occupied':t?' target':'')+'"')+'>'+lab+(t&&scan?'<span class="qe-tip">[ CLICK TO SIMULATE SCAN ]</span>':'')+'</button>'}).join('');
bays.push('<div class="qe-bay"><div class="qe-dim"><span>BAY '+pad(b)+'</span></div><div class="qe-bay-c">'+cells+'</div></div>'+(b<st.bays?'<div class="qe-up" aria-hidden="true"></div>':''))}
return '<div class="qe-face">'
+'<div class="qe-bp-top"><div class="qe-tg"><span>AISLE</span><div role="group" aria-label="Aisle">'+Array.from({length:st.aisles},(_,i)=>'<button type="button" data-aisle="'+aisleL(i)+'" aria-pressed="'+(f.aisle===aisleL(i))+'">'+aisleL(i)+'</button>').join('')+'</div></div><div class="qe-tg"><span>FACE</span><div role="group" aria-label="Rack face">'+['01','02'].map(s=>'<button type="button" data-side="'+s+'" aria-pressed="'+(f.side===s)+'">'+s+'</button>').join('')+'</div></div>'
+'<dl class="qe-spec"><div><dt>SCALE</dt><dd>NTS</dd></div><div><dt>PROJ</dt><dd>FRONT ELEVATION</dd></div><div><dt>SRC</dt><dd>QUARK METADATA</dd></div></dl></div>'
+'<div class="qe-bp'+(scan?' is-scan':'')+'"><div class="qe-bp-title"><span>RACK '+f.aisle+'-'+f.side+'</span><span>'+st.bays+' BAYS × '+st.levels+' LEVELS · '+(scan?'SIMULATE SCAN: CLICK A LOCATION':S.step==='done'?'TASK COMPLETE':'VIEW ONLY')+'</span></div>'
+'<div class="qe-rack-sc"><div class="qe-rack" style="--lv:'+st.levels+'"><div class="qe-lvls"><div class="qe-dim"></div>'+lv.map(l=>'<span>L'+l+'</span>').join('')+'</div><div class="qe-up is-end" aria-hidden="true"></div>'+bays.join('')+'<div class="qe-up is-end" aria-hidden="true"></div></div><div class="qe-floor" aria-hidden="true"></div></div></div>'
+'<ul class="qe-leg"><li class="e">Empty</li><li class="o">Occupied</li><li class="t">Target</li><li class="d">Confirmed</li><li class="x">Mismatch</li></ul></div>'}
function logHTML(){if(!S.log.length)return '<ol class="qe-log"><li><time>--:--:--</time><span class="qe-mute">No events yet</span></li></ol>';
return '<ol class="qe-log" aria-live="polite">'+S.log.map(e=>'<li class="'+(e.cls||'')+'"><time>'+e.t+'</time><span><span class="k">['+esc(e.k)+']</span> '+esc(e.m)+'</span></li>').join('')+'</ol>'}
function modalHTML(){if(!S.modal)return '';const st=S.setup;
return '<div class="qe-ov" id="qe-ov"><div class="qe-modal" role="dialog" aria-modal="true" aria-labelledby="qe-mh"><button type="button" class="qe-x" id="qe-mx" aria-label="Close and return to demo">×</button><h3 id="qe-mh">Continue with your warehouse setup</h3><p>Review the next step for this sample configuration. Workspace provisioning is not connected in this preview.</p>'
+'<div class="qe-msum"><span><b>'+esc(st.type)+'</b></span><span><b>'+st.aisles+'×'+st.bays+'×'+st.levels+'</b> layout</span><span><b>'+locCount()+'</b> addresses</span><span>Receiving + putaway</span></div>'
+(S.sent?'<p class="qe-proto" style="margin-top:20px" role="status">Prototype: nothing was sent and no workspace was created. In the connected version this step continues to your Quark workspace with this setup.</p><div class="qe-mf"><button type="button" class="qe-btn is-ghost" id="qe-mback"><span>Back to demo</span></button></div>'
:'<form class="qe-mf" id="qe-mform" novalidate><div><label class="qe-lab" for="qe-em">Work email</label><input id="qe-em" type="email" autocomplete="email" value="'+esc(S.em||'')+'"'+(S.emErr?' aria-invalid="true" aria-describedby="qe-eme"':'')+'>'+(S.emErr?'<span class="qe-err" id="qe-eme">'+esc(S.emErr)+'</span>':'')+'</div><div><label class="qe-lab" for="qe-co">Company</label><input id="qe-co" autocomplete="organization" value="'+esc(S.co||'')+'"'+(S.coErr?' aria-invalid="true"':'')+'>'+(S.coErr?'<span class="qe-err">'+esc(S.coErr)+'</span>':'')+'</div><button class="qe-btn is-wide" type="submit"><span>[ PREVIEW WORKSPACE REQUEST ]</span><span aria-hidden="true">→</span></button></form>')
+'</div></div>'}
/* ---------- mount ---------- */
let lastModal=false,opener=null;
function render(){
const ae=document.activeElement,aid=ae&&root.contains(ae)?ae.id||(ae.dataset&&(ae.dataset.a||ae.dataset.k||ae.dataset.type||ae.dataset.loc)):null,sel=ae&&ae.selectionStart!=null?[ae.selectionStart,ae.selectionEnd]:null;
const live=S.phase==='live',sf=S.sync&&Date.now()-S.sync.at<1000?S.sync.from:null;
root.innerHTML='<div class="qe-box'+(live?' is-live':'')+'"'+(S.modal?' inert':'')+'>'+(live?summaryHTML():setupHTML())
+'<div class="qe-stage"><section class="qe-pane'+(sf&&sf!=='web'?' is-sync':'')+'" aria-label="WebRF preview"><div class="qe-ph"><b>WebRF Studio · preview</b><span class="qe-sync">updated from '+(sf?SRC[sf]:'')+'</span></div><div class="qe-pb">'+rfHTML()+'</div></section>'
+'<section class="qe-pane'+(sf&&sf!=='tui'?' is-sync':'')+'" aria-label="Terminal UI preview"><div class="qe-ph"><b>Terminal UI · preview</b><span class="qe-lep">ℓ Lepton · planned</span><span class="qe-sync">updated from '+(sf?SRC[sf]:'')+'</span></div><div class="qe-pb" style="background:transparent">'+tuiHTML()+'</div></section>'
+'<section class="qe-pane" aria-label="Location schematic"><div class="qe-ph"><b>Layout</b><span>'+(live?locCount()+' addresses':'—')+'</span></div>'+faceHTML()+'</section>'
+'<section class="qe-pane" aria-label="Event journal"><div class="qe-ph"><b>Event journal</b><span>shared · local preview</span></div>'+(S.phase==='preparing'?'<div class="qe-prog" style="margin-top:12px"><i style="width:'+S.prog+'%"></i></div>':'')+logHTML()+'</section></div><div class="qe-foot"><span class="qe-foot-a"><i aria-hidden="true"></i>AI HARNESS · PHOTON</span><span class="qe-mute">Future AI Onboarding &amp; Support</span><a href="https://quark.build/vision" target="_blank" rel="noopener">MANIFESTO ↗</a></div></div>'+modalHTML();
if(aid){const el=document.getElementById(aid)||root.querySelector('[data-a="'+aid+'"],[data-k="'+aid+'"],[data-type="'+aid+'"],[data-loc="'+aid+'"]');if(el&&!S.modal){el.focus({preventScroll:true});if(sel&&el.setSelectionRange)try{el.setSelectionRange(sel[0],sel[1])}catch(e){}}}
if(S.modal&&!lastModal){opener=aid;const f=$('#qe-em')||$('#qe-mback');f&&f.focus()}
if(!S.modal&&lastModal){const c=$('#qe-cont')||$('#qe-reset');c&&c.focus({preventScroll:true})}
lastModal=S.modal;S.unfold=false;
if(sf)setTimeout(()=>{root.querySelectorAll('.is-sync').forEach(n=>n.classList.remove('is-sync'))},1000)}
function tuiKey(k){if(S.phase!=='live')return;
if(k==='F2'){if(S.step==='receive')act.receive('tui');else if(S.step==='scan'){if(S.draft)act.scan(S.draft,'tui');else{log('WORKFLOW','Scan the destination before confirming','er');render()}}else act.putaway('tui')}
if(k==='F3'&&S.step==='scan')act.scan(TASK.target,'tui',true);
if(k==='ESC')act.back('tui')}
root.addEventListener('click',(e)=>{const t=e.target.closest('button');if(!t)return;
if(t.id==='qe-demo')return analyze(DEMO_PLAN);
if(t.id==='qe-analyze-file')return analyze(S.setup.plan);
if(t.id==='qe-ask-go')return askRule();
if(t.dataset.rule!=null){S.setup.rules.splice(+t.dataset.rule,1);return render()}
if(t.id==='qe-desc-go')return analyze(null);
if(t.id==='qe-manual'){cancelAI();S.formErr='';S.setup.ai=null;S.setup.src='manual';S.setup.plan=null;S.setup.fromText={};S.stage='params';S.unfold=true;return render()}
if(t.id==='qe-restart'){cancelAI();pendingFile=null;S.setup.ai=null;S.setup.aiKnown={};S.setup.rules=[];anT.forEach(clearTimeout);if(S.setup.plan&&S.setup.plan.url)URL.revokeObjectURL(S.setup.plan.url);Object.assign(S.setup,{plan:null,src:null,manual:{},fromText:{},text:''});S.stage='drop';S.formErr='';return render()}
if(t.dataset.type){S.setup.type=t.dataset.type;S.setup.manual.type=true;S.setup.fromText.type=false;return render()}
if(t.id==='qe-unplan'){pendingFile=null;if(S.setup.plan&&S.setup.plan.url)URL.revokeObjectURL(S.setup.plan.url);S.setup.plan=null;return render()}
if(t.id==='qe-edit'){cancelAI();clearTimeout(leadTimer);prepT.forEach(clearTimeout);S.phase='setup';S.stage='params';S.unfold=true;S.modal=false;return render()}
if(t.id==='qe-reset'){clearTimeout(leadTimer);Object.assign(S,{step:'receive',draft:'',mismatch:null,dock:0,onhand:0,modal:false});log('WORKFLOW','Task restarted · '+TASK.doc);synced('web');return render()}
if(t.id==='qe-cont'){S.modal=true;S.sent=false;return render()}
if(t.id==='qe-mx'||t.id==='qe-mback'){S.modal=false;return render()}
const a=t.dataset.a;
if(a==='receive')return act.receive('web');
if(a==='putaway')return act.putaway('web');
if(a==='back')return act.back('web');
if(a==='scan-web')return act.scan(S.draft,'web');
if(a==='sim-ok')return act.scan(TASK.target,'web',true);
if(a==='sim-bad')return act.scan(WRONG,'web',true);
if(t.dataset.k)return tuiKey(t.dataset.k);
if(t.dataset.aisle){S.face.aisle=t.dataset.aisle;return render()}
if(t.dataset.side){S.face.side=t.dataset.side;return render()}
if(t.dataset.loc&&S.step==='scan')return act.scan(t.dataset.loc,'map',true)});
root.addEventListener('click',(e)=>{if(e.target.id==='qe-ov'){S.modal=false;render()}const tui=e.target.closest('#qe-tui');if(tui&&e.target.tagName!=='INPUT'){const i=$('#qe-tuiscan');(i||tui).focus()}});
root.addEventListener('input',(e)=>{const t=e.target;
if(t.id==='qe-desc'){S.setup.text=t.value;S.descriptionChanged=true;const g=$('#qe-desc-go');if(g)g.disabled=!t.value.trim();const p=$('#qe-parsed');if(p)p.textContent=S.stage==='params'?'Description changed. Analyse again to update suggestions.':'Quark AI will suggest parameters from your description';return}
if(t.dataset.k&&t.classList.contains('qe-num')){const v=clamp(t.dataset.k,t.value);if(v!=null){S.setup[t.dataset.k]=v;S.setup.manual[t.dataset.k]=true;S.setup.fromText[t.dataset.k]=false;t.nextElementSibling.textContent='set manually';t.nextElementSibling.className='';const n=root.querySelector('.qe-setup .qe-note .qe-mono');if(n)n.textContent=locCount()}return}
if(t.dataset.scan){const v=t.value.toUpperCase().replace(/[^A-Z0-9-]/g,'');if(v!==t.value){const p=t.selectionStart;t.value=v;t.setSelectionRange(p,p)}S.draft=v;const other=$(t.dataset.scan==='web'?'#qe-tuiscan':'#qe-rfscan');if(other)other.value=v;return}
if(t.id==='qe-ask')S.ruleText=t.value;
if(t.id==='qe-em')S.em=t.value;if(t.id==='qe-co')S.co=t.value});
root.addEventListener('change',(e)=>{const t=e.target;
if(t.classList.contains('qe-num')){t.value=S.setup[t.dataset.k];}
if(t.id==='qe-plan'&&t.files[0])takeFile(t.files[0])});
function takeFile(f){if(!/\.(jpe?g|png|pdf)$/i.test(f.name)){S.formErr='Use a JPEG, PNG or PDF file.';return render()}if(f.size>3*1024*1024){S.formErr='Use a file smaller than 3 MB.';return render()}cancelAI();if(S.setup.plan&&S.setup.plan.url)URL.revokeObjectURL(S.setup.plan.url);pendingFile=f;S.setup.plan={name:f.name,size:f.size,url:/^image\//.test(f.type)?URL.createObjectURL(f):null};S.formErr='';render()}
root.addEventListener('dragover',(e)=>{const d=e.target.closest&&e.target.closest('#qe-drop');if(!d)return;e.preventDefault();if(!S.dragOver){S.dragOver=true;d.classList.add('is-over')}});
root.addEventListener('dragleave',(e)=>{const d=e.target.closest&&e.target.closest('#qe-drop');if(d&&!d.contains(e.relatedTarget)){S.dragOver=false;d.classList.remove('is-over')}});
root.addEventListener('drop',(e)=>{const d=e.target.closest&&e.target.closest('#qe-drop');if(!d)return;e.preventDefault();S.dragOver=false;const f=e.dataTransfer.files[0];if(f)takeFile(f)});
root.addEventListener('keydown',(e)=>{const t=e.target;
if(S.modal&&e.key==='Escape'){S.modal=false;return render()}
if(S.modal&&e.key==='Tab'){const f=[...root.querySelectorAll('.qe-modal button,.qe-modal input')];if(!f.length)return;const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}return}
if(t.id==='qe-ask'&&e.key==='Enter'){e.preventDefault();const b=$('#qe-ask-go');b&&b.click();return}
if(t.dataset&&t.dataset.scan&&e.key==='Enter'){e.preventDefault();return act.scan(t.value,t.dataset.scan==='web'?'web':'tui')}
if(t.closest&&t.closest('#qe-tui')){if(e.key==='F2'){e.preventDefault();tuiKey('F2')}else if(e.key==='F3'){e.preventDefault();tuiKey('F3')}else if(e.key==='Escape'){e.preventDefault();tuiKey('ESC')}else if(e.key==='Enter'&&t.id==='qe-tui'){e.preventDefault();tuiKey('F2')}}});
root.addEventListener('submit',(e)=>{e.preventDefault();
if(e.target.id==='qe-form'){if(!locCount()){S.formErr='Set aisles, bays and levels.';return render()}S.formErr='';return generate()}
if(e.target.id==='qe-mform'){S.emErr=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((S.em||'').trim())?'':'Enter a valid work email.';S.coErr=(S.co||'').trim()?'':'Enter your company name.';if(!S.emErr&&!S.coErr)S.sent=true;render();if(S.sent){const b=$('#qe-mback');b&&b.focus()}else{const x=$('[aria-invalid="true"]');x&&x.focus()}}});
render();
window.QuarkEngineDemo={state:S,act,generate};
})();
