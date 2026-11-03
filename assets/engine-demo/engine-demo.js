/* Quark — one metadata engine, two interfaces. Single shared state; WebRF and TUI are pure renders of it. Workflow runs locally; optional Quark AI analysis uses the same-origin server endpoint. */
(function(){
const root=document.getElementById('qe-root');const Flow=window.QuarkEngineFlow;if(!root||!Flow)return;
const $=(s,r)=>(r||root).querySelector(s);
const esc=(s)=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const TYPES=['E-commerce','Distribution','3PL','Manufacturing'];
const LIM={aisles:[1,12],bays:[1,20],levels:[1,8]};
const TASK={doc:'PO-DEMO-1042',lpn:'DEMO-LPN-001',item:'BOTTLE-500',itemName:'Bottle 500 ml',qty:24,target:'A-01-02-L1'};
const WRONG='B-02-01-L3';
const EXAMPLE='An e-commerce warehouse with 3 aisles, 4 bays per rack and 4 levels.';
let pendingFile=null,aiController=null,aiSerial=0;
const S={phase:'setup',stage:'drop',an:null,dragOver:false,setup:{task:Flow.emptyTask(),taskManual:{},ai:null,aiKnown:{},type:'E-commerce',aisles:3,bays:4,levels:4,text:'',plan:null,src:null,manual:{},fromText:{}},prog:0,step:'receive',draft:'',mismatch:null,dock:0,onhand:0,log:[],modalShown:false,modal:false,sent:false,sending:false,sendErr:'',sync:null,face:{aisle:'A',side:'02'},formErr:''};
const pad=(n)=>String(n).padStart(2,'0');
const clamp=(k,v)=>{v=parseInt(v,10);if(isNaN(v))return null;return Math.max(LIM[k][0],Math.min(LIM[k][1],v))};
const locCount=()=>S.setup.aisles*2*S.setup.bays*S.setup.levels;
const aisleL=(i)=>String.fromCharCode(65+i);
const lastLoc=()=>aisleL(S.setup.aisles-1)+'-'+pad(S.setup.bays)+'-02-L'+S.setup.levels;
function locExists(c){const m=/^([A-Z])-(\d{2})-(0[12])-L(\d)$/.exec(c);if(!m)return false;return m[1].charCodeAt(0)-65<S.setup.aisles&&+m[2]>=1&&+m[2]<=S.setup.bays&&+m[4]>=1&&+m[4]<=S.setup.levels}
const now=()=>{const d=new Date();return d.toTimeString().slice(0,8)};
function log(k,m,cls){S.log.push({t:now(),k,m,cls});if(S.log.length>7)S.log=S.log.slice(-7)}
/* ---------- one metadata process, two renderers ---------- */
const SRC={web:'WebRF',tui:'TUI',map:'Schematic'};
function synced(from){log('WEBRF PREVIEW','State updated'+(from==='web'?'':' · from '+SRC[from]));log('TUI PREVIEW','State updated'+(from==='tui'?'':' · from '+SRC[from]));S.sync={from,at:Date.now()}}
function syncProcess(){
 if(!S.definition||!S.run)return;const d=S.definition,r=S.run,v=Flow.view(d,r),target=v.code==='scan_source'?d.source:d.destination;
 Object.assign(TASK,{doc:d.document,lpn:d.lpn,item:d.product.sku,itemName:d.product.name,qty:d.total_units,target});
 S.step=r.completed?'done':['scan_source','scan_destination'].includes(v.code)?'scan':'workflow';S.onhand=r.stored;S.dock=r.dock;
 if(/^[A-L]-/.test(target)&&['scan_source','scan_destination'].includes(v.code)){S.face={aisle:target[0],side:target.split('-')[2]}}
}
function mergeTask(task){
 if(!task)return;const st=S.setup,old=st.task||Flow.emptyTask(),next=JSON.parse(JSON.stringify(task));
 for(const key of Object.keys(st.taskManual||{})){
  if(key.startsWith('product.'))next.product[key.slice(8)]=old.product[key.slice(8)];else next[key]=old[key];
 }
 if(st.taskManual.operation||st.taskManual['product.serialized']||st.taskManual['product.lot_controlled'])next.steps=Flow.defaults(next.operation||'receiving_and_putaway',next.product.serialized,next.product.lot_controlled);
 st.task=next;
}
const act={
 submit(from,value){
  if(S.phase!=='live')return;const before=Flow.view(S.definition,S.run),entered=value==null?S.draft:value;
  S.run=Flow.submit(S.definition,S.run,entered);S.draft=S.run.error?String(entered||''):'';
  S.mismatch=S.run.error&&['scan_source','scan_destination'].includes(before.code)?{code:String(entered||'').toUpperCase(),why:S.run.error}:null;
  for(const message of S.run.events)log(before.control==='serial'?'SERIAL':'WORKFLOW',message,'ok');
  if(S.run.error)log('CHECK',S.run.error,'er');syncProcess();synced(from);render();
  const scan=$('#'+(from==='tui'?'qe-tuiscan':'qe-rfscan'));if(scan&&S.run.error){scan.focus({preventScroll:true});scan.select()}
  if(S.run.completed&&!S.modalShown){S.modalShown=true;leadTimer=setTimeout(()=>{if(S.phase==='live'&&S.run?.completed){S.modal=true;render()}},900)}
 },
 demo(from){return act.submit(from,Flow.expected(S.definition,S.run))},
 scan(value,from){return act.submit(from,value)},
 back(from){S.draft='';S.mismatch=null;if(S.run)S.run.error=null;log('WORKFLOW','Entry cleared · accepted scans and progress kept');synced(from);render()}
};
let prepT=[],leadTimer;
function generate(){
 clearTimeout(leadTimer);S.mailSerial=(S.mailSerial||0)+1;const st=S.setup;
 ['aisles','bays','levels'].forEach(k=>{st[k]=clamp(k,st[k])||LIM[k][0]});
 try{S.definition=Flow.resolve(st.task||Flow.emptyTask(),st);S.run=Flow.create(S.definition)}catch(e){S.formErr=e.message;S.stage='params';S.phase='setup';return render()}
 Object.assign(S,{phase:'preparing',prog:0,draft:'',mismatch:null,log:[],modalShown:false,modal:false,sent:false,sending:false,sendErr:'',sync:null,face:{aisle:S.definition.destination[0],side:S.definition.destination.split('-')[2]}});syncProcess();
 const seq=[['INPUT','Preview parameters accepted · '+st.type],['LAYOUT',st.aisles+' aisles × 2 rack faces × '+st.bays+' bays × '+st.levels+' levels'],['METADATA',S.definition.title+' · '+S.definition.steps.length+' RF screens'],['PRODUCT',S.definition.product.name+' · '+S.definition.product.pack_quantity+' '+S.definition.product.pack_label+' × '+S.definition.product.pack_units+' = '+S.definition.total_units+' units'],['WEBRF PREVIEW','Process JSON attached'],['TUI PREVIEW','Same process JSON attached'],['READY','Ready · '+Flow.labels[S.definition.operation]]];
 prepT.forEach(clearTimeout);prepT=[];render();seq.forEach((x,i)=>prepT.push(setTimeout(()=>{log(x[0],x[1],i===seq.length-1?'ok':'');S.prog=Math.round((i+1)/seq.length*100);if(i===seq.length-1)S.phase='live';render()},260*(i+1))))
}
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
function hasReplies(){return Boolean((S.clarification||'').trim()||Object.values(S.answers||{}).some(v=>v.trim()))}
function questionsHTML(ai){const questions=Array.isArray(ai.uncertainties)?ai.uncertainties:[];
return '<div class="qe-ai-result"><div class="qe-conversation" role="region" aria-label="AI questions and your answers" tabindex="0"><p>'+esc(ai.summary)+'</p>'+((S.dialog||[]).length?'<details class="qe-history"><summary>Previous answers · '+S.dialog.length+' rounds</summary>'+S.dialog.map(r=>'<div>'+r.replies.map(x=>'<p><b>'+esc(x.question)+'</b><br>'+esc(x.answer)+'</p>').join('')+(r.additional_information?'<p>'+esc(r.additional_information)+'</p>':'')+'</div>').join('')+'</details>':'')+(questions.length?'<ol class="qe-questions">'+questions.map((q,i)=>'<li><label class="qe-question" for="qe-answer-'+i+'">'+esc(q)+'</label><textarea class="qe-ta qe-answer" id="qe-answer-'+i+'" data-question="'+i+'" maxlength="400" placeholder="Your answer, or say this is unknown…">'+esc((S.answers||{})[i]||'')+'</textarea></li>').join('')+'</ol>':'')+'<label class="qe-lab" for="qe-answer" style="margin-top:16px">'+(questions.length?'Anything else? (optional)':'Refine this setup')+'</label><textarea class="qe-ta" id="qe-answer" maxlength="2000" placeholder="You can reply in any language or choose assumptions for this demo.">'+esc(S.clarification||'')+'</textarea></div><button type="button" class="qe-btn is-wide" id="qe-refine"'+(hasReplies()?'':' disabled')+'>Update setup with Quark AI →</button><p class="qe-note" style="margin-top:8px">Your answers and the selected plan are sent for AI analysis. You do not need to choose the file again.</p></div>'}
function taskParamsHTML(){const st=S.setup,t=st.task||Flow.emptyTask(),p=t.product,op=t.operation||'receiving_and_putaway';
const input=(id,label,value,type='text',max=80)=>'<div><label class="qe-lab" for="'+id+'">'+label+'</label><input class="qe-task-input" id="'+id+'" type="'+type+'" value="'+esc(value)+'"'+(type==='number'?' min="1" max="1000" inputmode="numeric"':' maxlength="'+max+'"')+'></div>';
let definition;try{definition=Flow.resolve(t,st)}catch(e){definition=null}
return '<div class="qe-task-params"><div><label class="qe-lab" for="qe-operation">RF process</label><select class="qe-task-input" id="qe-operation">'+Flow.operations.map(x=>'<option value="'+x+'"'+(op===x?' selected':'')+'>'+Flow.labels[x]+'</option>').join('')+'</select></div>'
+input('qe-product','Product',p.name||'Sample product')+input('qe-sku','Product barcode / SKU',p.sku||definition?.product.sku||'DEMO-SAMPLE-PRODUCT','text',40)+input('qe-pack-label','Packaging / UOM',p.pack_label||'Each','text',40)
+'<div class="qe-pack-grid">'+input('qe-pack-qty','Packages',p.pack_quantity||(p.serialized?3:24),'number')+input('qe-pack-units','Units per package',p.pack_units||1,'number')+'</div>'
+'<label class="qe-consent"><input id="qe-serialized" type="checkbox"'+(p.serialized?' checked':'')+'><span>Serial-controlled · one serial per base unit</span></label><label class="qe-consent"><input id="qe-lot-controlled" type="checkbox"'+(p.lot_controlled?' checked':'')+'><span>Capture a lot / batch</span></label>'
+input('qe-lpn','LPN / container',t.lpn||'DEMO-LPN-001','text',40)
+'<div><label class="qe-lab" for="qe-target-aisle">Destination aisle</label><select class="qe-task-input" id="qe-target-aisle">'+(t.destination_aisle&&t.destination_aisle.charCodeAt(0)-65>=st.aisles?'<option value="" selected>Choose an aisle</option>':'')+Array.from({length:st.aisles},(_,i)=>String.fromCharCode(65+i)).map(a=>'<option value="'+a+'"'+((t.destination_aisle||'A')===a?' selected':'')+'>'+a+'</option>').join('')+'</select></div>'
+'<p class="qe-note">Check product and packaging before starting. Missing values use sample data; sample availability is independent of your real stock.</p>'
+(definition?'<details class="qe-definition"><summary>RF process definition · '+definition.steps.length+' screens</summary><ol>'+definition.steps.map(c=>'<li>'+esc(Flow.catalogue[c].label)+'</li>').join('')+'</ol><pre>'+esc(JSON.stringify({operation:definition.operation,product:definition.product,lpn:definition.lpn,steps:definition.steps},null,2))+'</pre></details>':'')+'</div>'}
function paramsHTML(){
const st=S.setup,src=st.src;
const nf=(k,l)=>'<div class="qe-nf"><label for="qe-'+k+'">'+l+'</label><input class="qe-num" id="qe-'+k+'" data-k="'+k+'" type="number" inputmode="numeric" min="'+LIM[k][0]+'" max="'+LIM[k][1]+'" value="'+st[k]+'"><small class="'+(st.fromText[k]?'is-desc':'')+'">'+(st.manual[k]?'set manually':src==='ai'&&!st.aiKnown[k]?'not found · check':st.fromText[k]?(src==='ai'?'from AI':src==='demo'?(k==='levels'?'default · check':'from plan'):'from description'):LIM[k][0]+'–'+LIM[k][1])+'</small></div>';
const badge=src==='ai'?'<span class="qe-badge is-ai"><i aria-hidden="true"></i>Quark AI suggestions · review</span>':src==='demo'?'<span class="qe-badge is-ai"><i aria-hidden="true"></i>Sample configuration</span>':src==='file'?'<span class="qe-badge is-warn">Plan attached · review parameters</span>':src==='text'?'<span class="qe-badge is-ai"><i aria-hidden="true"></i>Sample configuration</span>':'<span class="qe-badge is-plain">Manual parameters</span>';
return '<form class="qe-setup'+(S.unfold?' is-unfold':'')+'" id="qe-form" novalidate aria-label="Warehouse parameters"><div class="qe-row" style="margin:0">'+badge+'<button type="button" class="qe-link" id="qe-restart">Start over</button></div>'
+(st.plan?'<div class="qe-thumb"><div class="qe-thumb-i">'+previewHTML()+'</div><div><b>'+esc(st.plan.name)+'</b><small>'+(st.plan.demo?'Demo schematic · levels are not shown on a floor plan':'Reviewed with Quark AI · check the suggested values')+'</small></div></div>':'')
+(src==='text'||st.text?'<div><label class="qe-lab" for="qe-desc">Description</label><textarea class="qe-ta" id="qe-desc" maxlength="5000" style="min-height:72px">'+esc(st.text)+'</textarea><div class="qe-row"><span class="qe-parsed" id="qe-parsed">'+(S.descriptionChanged?'Description changed. Analyse again to update suggestions.':'Edit the description and ask Quark AI to review it.')+'</span><button type="button" class="qe-link" id="qe-desc-go"'+(st.text.trim()?'':' disabled')+'>Analyse again with Quark AI →</button></div></div>':'')
+'<div><span class="qe-lab" id="qe-type-l">Warehouse type</span><div class="qe-seg" role="group" aria-labelledby="qe-type-l">'+TYPES.map(t=>'<button type="button" data-type="'+t+'" aria-pressed="'+(st.type===t)+'">'+t+'</button>').join('')+'</div></div>'
+'<div class="qe-nums">'+nf('aisles','Aisles')+nf('bays','Bays / rack')+nf('levels','Rack levels')+'</div>'+taskParamsHTML()
+(st.ai?questionsHTML(st.ai):'')
+'<p class="qe-note">Check the values and change any of them by hand. A value you edit stays as you set it.</p>'
+'<div class="qe-ask"><label class="qe-lab" for="qe-ask">Ask Quark AI about a preview rule</label><div class="qe-askrow"><span aria-hidden="true">&gt;_</span><input id="qe-ask" value="'+esc(S.ruleText||'')+'" maxlength="1000" placeholder="e.g. Reserve Level 4 for heavy LPNs" autocomplete="off"><button type="button" id="qe-ask-go"'+(S.ruleBusy?' disabled':'')+'>'+(S.ruleBusy?'Thinking…':'Ask Quark AI')+'</button></div>'+(st.rules&&st.rules.length?'<ul class="qe-rules">'+st.rules.map((r,i)=>'<li><span class="qe-mono">'+esc(r.code)+'</span>'+esc(r.text)+'<button type="button" class="qe-x2" data-rule="'+i+'" aria-label="Remove rule">×</button></li>').join('')+'</ul>':'')+(S.ruleErr?'<p class="qe-err" role="alert">'+esc(S.ruleErr)+'</p>':'')+'<p class="qe-note">This rule and the preview parameters are sent to Quark AI for interpretation.</p></div>'
+(S.formErr?'<p class="qe-err">'+esc(S.formErr)+'</p>':'')
+'<div><button class="qe-btn is-wide" type="submit"'+(S.phase==='preparing'||S.ruleBusy?' disabled':'')+'><span>'+(S.phase==='preparing'?'Preparing…':'Instantiate dual-render preview')+'</span><span aria-hidden="true">→</span></button><p class="qe-note" style="margin-top:8px"><span class="qe-mono">'+locCount()+'</span> location addresses · no sign-up needed</p></div></form>'}
function dropHTML(){
return '<div class="qe-setup" aria-label="Describe your warehouse"><div class="qe-row" style="margin:0"><span class="qe-lab" style="margin:0">Describe your warehouse</span><span class="qe-ai-tag"><i aria-hidden="true"></i>Quark AI layout analysis</span></div>'
+'<div class="qe-drop'+(S.dragOver?' is-over':'')+'" id="qe-drop"><input type="file" id="qe-plan" aria-label="Choose a warehouse plan for local preview" accept="image/jpeg,image/png,application/pdf"><div class="qe-drop-ic" aria-hidden="true"><i></i></div><b>[ DROP WAREHOUSE PLAN HERE ]</b><span>JPEG · PNG · PDF · up to 3 MB</span><label for="qe-plan" class="qe-btn is-ghost"><span>[ BROWSE FILES ]</span></label></div><p class="qe-note qe-ai-sub">Choose Analyze with Quark AI to send your plan or description to our AI service. Only share material you have permission to use. The warehouse preview stays a simulation.</p>'
+(S.setup.plan&&!S.setup.plan.demo?'<p class="qe-note">Selected: '+esc(S.setup.plan.name)+'</p><button type="button" class="qe-btn is-wide" id="qe-analyze-file">Analyze plan with Quark AI →</button>':'')
+(S.formErr?'<p class="qe-err" role="alert" style="margin:0">'+esc(S.formErr)+'</p>':'')
+'<div class="qe-demo-cta"><button type="button" class="qe-btn is-wide" id="qe-demo" aria-describedby="qe-demo-d"><span>[ ANALYZE SAMPLE WITH QUARK AI ]</span><span aria-hidden="true">→</span></button><small id="qe-demo-d">Uses our sample warehouse description; no file is uploaded.</small></div>'
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
async function analyze(plan,options={}){
 cancelAI();const serial=aiSerial;S.formErr='';S.ruleErr='';if(S.setup.plan&&S.setup.plan.url&&S.setup.plan!==plan)URL.revokeObjectURL(S.setup.plan.url);S.setup.plan=plan;S.stage='analyzing';render();
 try{
 const body={mode:'layout',text:options.text??(plan&&plan.demo?EXAMPLE+(S.setup.text?'\n'+S.setup.text:''):S.setup.text)};
 if(plan&&!plan.demo){if(!pendingFile)throw new Error('Choose your plan again.');body.file={type:pendingFile.type||(/\.pdf$/i.test(pendingFile.name)?'application/pdf':/\.png$/i.test(pendingFile.name)?'image/png':'image/jpeg'),data:await readPlan(pendingFile)}}
 if(S.setup.ai)body.setup={type:S.setup.type,aisles:S.setup.aisles,bays:S.setup.bays,levels:S.setup.levels,task:S.setup.task,previous_summary:S.setup.ai.summary,confirmed:Object.keys(S.setup.aiKnown||{}).filter(k=>S.setup.aiKnown[k])};
 if(serial!==aiSerial)return;const result=await requestAI(body);if(serial!==aiSerial)return;
 const st=S.setup;st.ai=result;mergeTask(result.task);st.aiKnown={};st.fromText={};
 ['type','aisles','bays','levels'].forEach(k=>{if(result[k]!=null&&!st.manual[k]){st[k]=result[k];st.fromText[k]=true;st.aiKnown[k]=true}});
 st.rules=result.rules.map(r=>({code:r.level?'L'+r.level+' → '+r.category:'RULE',text:r.text,lv:r.level,cls:r.category}));
 st.src='ai';if(options.round)S.dialog=[...(S.dialog||[]),options.round].slice(-3);S.clarification='';S.answers={};S.descriptionChanged=false;S.stage='params';S.unfold=true;render();const f=$('#qe-aisles');f&&f.focus({preventScroll:true});
 }catch(e){if(serial!==aiSerial)return;S.stage=options.refine?'params':'drop';S.formErr=e.name==='AbortError'?'Quark AI analysis timed out. Retry or set parameters manually.':e.message;render()}
}
async function askRule(){
 const input=$('#qe-ask');if(!input||!input.value.trim())return input&&input.focus();if(S.ruleBusy)return;
 const text=input.value.trim();cancelAI();const serial=aiSerial;S.ruleBusy=true;S.ruleErr='';S.ruleText=text;render();
 try{const st=S.setup,result=await requestAI({mode:'rule',text,setup:{type:st.type,aisles:st.aisles,bays:st.bays,levels:st.levels,task:st.task}});if(serial!==aiSerial)return;
 if(!result.rules.length&&!result.task?.operation)throw new Error(result.uncertainties[0]||'Add more detail about the rule you want to try.');
 mergeTask(result.task);st.rules=(st.rules||[]).concat(result.rules.map(r=>({code:r.level?'L'+r.level+' → '+r.category:'RULE',text:r.text,lv:r.level,cls:r.category}))).slice(-8);S.ruleText='';
 }catch(e){if(serial!==aiSerial)return;S.ruleErr=e.name==='AbortError'?'Quark AI request timed out. Please retry.':e.message}
 finally{if(serial===aiSerial){S.ruleBusy=false;render()}}
}
function summaryHTML(){const st=S.setup,d=S.definition;
return '<div class="qe-sum"><dl><div><dt>Type</dt><dd>'+esc(st.type)+'</dd></div><div><dt>Layout</dt><dd>'+st.aisles+' × '+st.bays+' × '+st.levels+'</dd></div><div><dt>Process</dt><dd>'+esc(Flow.labels[d.operation])+'</dd></div><div><dt>Product</dt><dd>'+esc(d.product.name)+'</dd></div><div><dt>Packaging</dt><dd>'+d.product.pack_quantity+' '+esc(d.product.pack_label)+' × '+d.product.pack_units+'</dd></div><div><dt>Tracking</dt><dd>'+(d.product.serialized?'Serial per unit':'Standard')+'</dd></div></dl><div class="qe-sum-act">'+(S.run.completed?'<button type="button" class="qe-link" id="qe-cont">Continue with this setup →</button>':'')+'<button type="button" class="qe-link" id="qe-reset">Restart task</button><button type="button" class="qe-link" id="qe-edit">Edit setup</button></div></div>'}
function processView(){return Flow.view(S.definition,S.run)}
function rfHTML(){
 if(S.phase!=='live')return '<div class="qe-rf qe-dev"><div class="qe-rf-bar">WebRF<span>no task</span></div><div class="qe-wait"><b>'+(S.phase==='preparing'?'Attaching RF process…':'No task assigned')+'</b>Analyse your request or set up a warehouse to generate a process.</div></div>';
 const d=S.definition,r=S.run,v=processView(),p=d.product,serial=v.control==='serial',captured=v.code==='verify_serials'?r.verified:r.serials.map(x=>x.value);
 const context='<dl class="qe-rf-dl"><dt>Product</dt><dd>'+esc(p.name)+'</dd><dt>SKU</dt><dd>'+esc(p.sku)+'</dd><dt>LPN</dt><dd>'+esc(d.lpn)+'</dd><dt>Packaging</dt><dd>'+p.pack_quantity+' '+esc(p.pack_label)+' × '+p.pack_units+'</dd><dt>Base units</dt><dd>'+d.total_units+'</dd><dt>At dock / stored</dt><dd>'+r.dock+' / '+r.stored+'</dd></dl>';
 let body='';if(r.completed)body='<div class="qe-done"><b>Task completed</b><span class="qe-note">'+esc(Flow.labels[d.operation])+' · '+esc(p.name)+' · '+d.total_units+' units'+(r.serials.length?' · '+r.serials.length+' serials preserved':'')+'</span></div>';
 else{
  if(r.error)body+='<div class="qe-alert" role="alert">'+esc(r.error)+'</div>';
  if(serial)body+='<div class="qe-serial-count" role="status"><b>'+captured.length+' / '+d.total_units+'</b><span>serial numbers '+(v.code==='verify_serials'?'verified':'captured')+'</span></div>'+(captured.length?'<ol class="qe-serial-list">'+captured.slice(-3).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol>':'');
  if(v.control==='confirm')body+='<div class="qe-rf-act"><button class="qe-btn is-wide" type="button" data-a="flow-confirm"><span>'+esc(v.label)+'</span><span aria-hidden="true">→</span></button></div>';
  else body+='<div class="qe-rf-act"><label class="qe-lab" for="qe-rfscan">'+esc(v.label)+(v.control==='number'?' ('+esc(p.pack_label)+')':'')+'</label><div class="qe-scanrow"><input class="qe-scan" id="qe-rfscan" data-scan="web" value="'+esc(S.draft)+'" maxlength="64"'+(v.control==='number'?' inputmode="numeric"':'')+' placeholder="'+(serial?'Scan serial, then Enter':v.control==='date'?'YYYY-MM-DD':'Scan or type, then Enter')+'" autocomplete="off" spellcheck="false"><button type="button" data-a="flow-submit">Enter</button></div><div class="qe-sims"><button class="qe-link" type="button" data-a="flow-demo">'+(serial?'Simulate next serial':'Use sample · '+esc(Flow.expected(d,r)))+'</button></div></div>';
 }
 return '<div class="qe-rf qe-dev"><div class="qe-rf-bar">'+esc(Flow.labels[d.operation])+'<span>'+Math.min(r.index+1,d.steps.length)+' / '+d.steps.length+'</span></div><div class="qe-rf-steps" aria-hidden="true">'+d.steps.map((_,i)=>'<i class="'+(i<r.index?'on':'')+'"></i>').join('')+'</div><div class="qe-rf-b"><h4 class="qe-rf-title">'+esc(v.label)+'</h4>'+context+(S.step==='scan'?'<div class="qe-rf-loc"><small>Scan location</small><b>'+esc(Flow.expected(d,r))+'</b></div>':'')+body+'</div></div>'
}
const W=32,ln=(t,c)=>({t:String(t).slice(0,W).padEnd(W,' '),c}),rule=()=>ln('-'.repeat(W),'dim');
function tuiLines(){
 const L=[ln('QUARK WMS / TERMINAL PREVIEW'),rule()];
 if(S.phase!=='live'){L.push(ln(S.phase==='preparing'?' ATTACHING RF PROCESS...':' WAITING FOR SETUP'));while(L.length<14)L.push(ln(''));L.push(rule(),ln(' [ESC] CLEAR','dim'));return L}
 const d=S.definition,r=S.run,v=processView(),count=v.code==='verify_serials'?r.verified.length:r.serials.length;
 L.push(ln(' '+Flow.labels[d.operation].toUpperCase()+' '+Math.min(r.index+1,d.steps.length)+'/'+d.steps.length),ln(' ITEM : '+d.product.name),ln(' SKU  : '+d.product.sku),ln(' PACK : '+d.product.pack_quantity+' '+d.product.pack_label+' x '+d.product.pack_units),ln(' UNITS: '+d.total_units),ln(' LPN  : '+d.lpn));
 if(v.control==='serial')L.push(ln(' SERIALS: '+count+' / '+d.total_units));else L.push(ln(' DOCK: '+r.dock+' STORED: '+r.stored));
 L.push(rule(),ln(' '+v.label.toUpperCase(),r.completed?'hi':''));
 if(r.error)L.push(ln('! '+r.error,'er'));else if(S.step==='scan')L.push(ln(' TO: '+Flow.expected(d,r),'hi'));else L.push(ln(''));
 if(!r.completed&&v.control!=='confirm')L.push({input:true});else L.push(ln(r.completed?' *** COMPLETED ***':' [ENTER] CONFIRM',r.completed?'hi':''));
 while(L.length<14)L.push(ln(''));L.push(rule(),ln(v.code==='close_receipt'?' [F8] CLOSE   [ESC] CLEAR':' [F2] ENTER [F3] DEMO [ESC] CLEAR','dim'));return L;
}
function tuiHTML(){
 const body=tuiLines().map(l=>l.input?'<span class="l">&gt; <input id="qe-tuiscan" data-scan="tui" value="'+esc(S.draft)+'" maxlength="64" size="25" autocomplete="off" spellcheck="false" aria-label="Terminal scan input"><span class="bl">_</span></span>':'<span class="l'+(l.c?' '+l.c:'')+'">'+esc(l.t)+'</span>').join('\n');
 const live=S.phase==='live',v=live?processView():null,closed=v?.code==='close_receipt';
 return '<div class="qe-tuiwrap qe-dev"><div class="qe-tuitop"><span>HANDHELD · 240×320 CLASS</span><span>'+(live?'ONLINE':'IDLE')+'</span></div><pre class="qe-tui" id="qe-tui" tabindex="0" role="application" aria-label="Terminal preview. Enter or F2 submits; F3 uses a sample; F8 closes a completed receipt capture."><code>'+body+'</code></pre><div class="qe-keys"><button type="button" data-k="'+(closed?'F8':'F2')+'"'+(live&&!S.run.completed?'':' disabled')+'><b>'+(closed?'F8':'F2')+'</b> '+(closed?'CLOSE':'ENTER')+'</button><button type="button" data-k="F3"'+(live&&!S.run.completed&&v.control!=='confirm'?'':' disabled')+'><b>F3</b> DEMO</button><button type="button" data-k="ESC"'+(live?'':' disabled')+'><b>ESC</b> CLEAR</button></div><div class="qe-tuihint">The same process definition and accepted scans drive both interfaces.<br>Device compatibility is verified separately.</div></div>'
}
function occ(code){return Flow.occupied(code)}
function faceHTML(){
if(S.phase!=='live')return '<div class="qe-face"><div class="qe-bp-empty"><span>NO LAYOUT LOADED</span><small>Rack elevation appears after generation.</small></div></div>';
const st=S.setup,f=S.face,scan=S.step==='scan',fresh=S.sync&&Date.now()-S.sync.at<1000;
const lv=[];for(let l=st.levels;l>=1;l--)lv.push(l);
const bays=[];for(let b=1;b<=st.bays;b++){
const cells=lv.map(l=>{const code=f.aisle+'-'+pad(b)+'-'+f.side+'-L'+l,t=code===TASK.target,x=S.mismatch&&S.mismatch.code===code,o=!t&&occ(code);
const cls='qe-loc'+(t?(S.step==='done'?' is-done'+(fresh?' is-anim':''):' is-t'):'')+(o?' is-o':'')+(x?' is-x':'');
const lab=t?(S.step==='done'?'<b>LOCKED</b><i>'+TASK.qty+' U · '+esc(TASK.lpn)+'</i>':'<b>TARGET</b><i>'+code+'</i>'):x?'<b>MISMATCH</b><i>'+code+'</i>':o?'<i class="qe-lpn">LPN</i><em>'+code+'</em>':'<em>'+code+'</em>';
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
function enquirySetup(){const st=S.setup,t=S.definition||st.task||{},p=t.product||{};return {warehouse:{type:st.type,aisles:st.aisles,bays:st.bays,levels:st.levels},process:{operation:t.operation||'receiving_and_putaway',product:p.name||t.item_name||TASK.itemName,pack_label:p.pack_label||'Each',pack_units:p.pack_units||1,pack_quantity:p.pack_quantity||TASK.qty,serialized:Boolean(p.serialized)}}}
function modalHTML(){if(!S.modal)return '';const st=S.setup;
return '<div class="qe-ov" id="qe-ov"><div class="qe-modal" role="dialog" aria-modal="true" aria-labelledby="qe-mh"><button type="button" class="qe-x" id="qe-mx" aria-label="Close and return to demo">×</button><h3 id="qe-mh">Continue with your warehouse setup</h3><p>Send this setup to the Quark team. We will follow up with you about your warehouse.</p>'
+'<div class="qe-msum"><span><b>'+esc(st.type)+'</b></span><span><b>'+st.aisles+'×'+st.bays+'×'+st.levels+'</b> layout</span><span><b>'+locCount()+'</b> addresses</span><span>'+esc(enquirySetup().process.operation.replaceAll('_',' '))+'</span></div>'
+(S.sent?'<p class="qe-note" style="margin-top:20px" role="status">Your setup request was sent to Quark. We will follow up at '+esc(S.em)+'.</p><div class="qe-mf"><button type="button" class="qe-btn is-ghost" id="qe-mback"><span>Back to demo</span></button></div>'
:'<form class="qe-mf" id="qe-mform" novalidate><div><label class="qe-lab" for="qe-em">Work email</label><input id="qe-em" type="email" autocomplete="email" maxlength="254" value="'+esc(S.em||'')+'"'+(S.emErr?' aria-invalid="true" aria-describedby="qe-eme"':'')+'>'+(S.emErr?'<span class="qe-err" id="qe-eme">'+esc(S.emErr)+'</span>':'')+'</div><div><label class="qe-lab" for="qe-co">Company</label><input id="qe-co" autocomplete="organization" maxlength="160" value="'+esc(S.co||'')+'"'+(S.coErr?' aria-invalid="true"':'')+'>'+(S.coErr?'<span class="qe-err">'+esc(S.coErr)+'</span>':'')+'</div><div class="qe-sr" aria-hidden="true"><label>Website<input id="qe-website" tabindex="-1" autocomplete="off"></label></div><label class="qe-consent"><input id="qe-consent" type="checkbox"'+(S.consent?' checked':'')+'><span>Send my contact details and this demo setup to Quark for follow-up. <a href="/legal/privacy.html" target="_blank" rel="noopener">Privacy policy</a></span></label>'+(S.sendErr?'<p class="qe-err" role="alert">'+esc(S.sendErr)+'</p>':'')+'<button class="qe-btn is-wide" type="submit"'+(S.sending?' disabled':'')+'><span>'+(S.sending?'Sending…':'Send my setup to Quark')+'</span><span aria-hidden="true">→</span></button></form>')
+'</div></div>'}
async function sendEnquiry(){
 if(S.sending)return;S.emErr=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((S.em||'').trim())?'':'Enter a valid work email.';S.coErr=(S.co||'').trim()?'':'Enter your company name.';S.sendErr=S.consent?'':'Please agree to send your contact details and this setup.';
 if(S.emErr||S.coErr||S.sendErr){render();const f=$('[aria-invalid="true"]')||$('#qe-consent');f&&f.focus();return}
 S.sending=true;S.sendErr='';const mailSerial=S.mailSerial=(S.mailSerial||0)+1;render();
 try{const response=await fetch('/api/engine-enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:S.em.trim(),company:S.co.trim(),consent:'yes',website:S.website||'',...enquirySetup()}),signal:AbortSignal.timeout(15000)});const result=await response.json();if(!response.ok||!result.ok)throw new Error(result.error||'Could not send. Please retry.');if(mailSerial===S.mailSerial)S.sent=true}
 catch(e){if(mailSerial===S.mailSerial)S.sendErr=e.name==='TimeoutError'?'The request timed out. Please retry.':e.message}
 finally{if(mailSerial===S.mailSerial){S.sending=false;render();const f=S.sent?$('#qe-mback'):$('#qe-em');f&&f.focus()}}
}
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
function tuiKey(k){if(S.phase!=='live')return;if(k==='F2')return act.submit('tui');if(k==='F3')return act.demo('tui');if(k==='F8'&&processView().code==='close_receipt')return act.submit('tui');if(k==='ESC')return act.back('tui')}
root.addEventListener('click',(e)=>{const t=e.target.closest('button');if(!t)return;
if(t.id==='qe-demo')return analyze(DEMO_PLAN);
if(t.id==='qe-analyze-file')return analyze(S.setup.plan);
if(t.id==='qe-ask-go')return askRule();
if(t.id==='qe-refine'){
 const questions=S.setup.ai?.uncertainties||[];
 const replies=questions.map((q,i)=>({question:q,answer:(S.answers?.[i]||'').trim()})).filter(x=>x.answer);
 const answer=(S.clarification||'').trim();if(!answer&&!replies.length)return;
 const text=(S.setup.text||'')+'\nClarification round:\nQuestions: '+questions.join(' | ')+'\nUser answers: '+JSON.stringify({replies,additional_information:answer});
 if(text.length>12000){S.formErr='Please shorten this answer before sending.';return render()}
 return analyze(S.setup.plan,{refine:true,text,round:{replies,additional_information:answer}});
}
if(t.dataset.rule!=null){S.setup.rules.splice(+t.dataset.rule,1);return render()}
if(t.id==='qe-desc-go')return analyze(S.setup.plan);
if(t.id==='qe-manual'){cancelAI();S.formErr='';S.setup.ai=null;S.setup.src='manual';S.setup.plan=null;S.setup.fromText={};S.stage='params';S.unfold=true;return render()}
if(t.id==='qe-restart'){cancelAI();pendingFile=null;S.setup.ai=null;S.setup.aiKnown={};S.setup.rules=[];S.dialog=[];S.answers={};S.clarification='';S.setup.task=Flow.emptyTask();S.setup.taskManual={};anT.forEach(clearTimeout);if(S.setup.plan&&S.setup.plan.url)URL.revokeObjectURL(S.setup.plan.url);Object.assign(S.setup,{plan:null,src:null,manual:{},fromText:{},text:''});S.stage='drop';S.formErr='';return render()}
if(t.dataset.type){S.setup.type=t.dataset.type;S.setup.manual.type=true;S.setup.fromText.type=false;return render()}
if(t.id==='qe-unplan'){pendingFile=null;if(S.setup.plan&&S.setup.plan.url)URL.revokeObjectURL(S.setup.plan.url);S.setup.plan=null;return render()}
if(t.id==='qe-edit'){cancelAI();clearTimeout(leadTimer);prepT.forEach(clearTimeout);S.phase='setup';S.stage='params';S.unfold=true;S.modal=false;return render()}
if(t.id==='qe-reset'){clearTimeout(leadTimer);S.run=Flow.create(S.definition);S.draft='';S.mismatch=null;S.modal=false;syncProcess();log('WORKFLOW','RF process restarted');synced('web');return render()}
if(t.id==='qe-cont'){S.modal=true;S.sent=false;return render()}
if(t.id==='qe-mx'||t.id==='qe-mback'){S.modal=false;return render()}
const a=t.dataset.a;
if(a==='flow-submit'||a==='flow-confirm')return act.submit('web');
if(a==='flow-demo')return act.demo('web');
if(t.dataset.k)return tuiKey(t.dataset.k);
if(t.dataset.aisle){S.face.aisle=t.dataset.aisle;return render()}
if(t.dataset.side){S.face.side=t.dataset.side;return render()}
if(t.dataset.loc&&S.step==='scan')return act.scan(t.dataset.loc,'map',true)});
root.addEventListener('click',(e)=>{if(e.target.id==='qe-ov'){S.modal=false;render()}const tui=e.target.closest('#qe-tui');if(tui&&e.target.tagName!=='INPUT'){const i=$('#qe-tuiscan');(i||tui).focus()}});
root.addEventListener('input',(e)=>{const t=e.target;
if(t.id==='qe-desc'){S.setup.text=t.value;S.descriptionChanged=true;const g=$('#qe-desc-go');if(g)g.disabled=!t.value.trim();const p=$('#qe-parsed');if(p)p.textContent=S.stage==='params'?'Description changed. Analyse again to update suggestions.':'Quark AI will suggest parameters from your description';return}
if(t.dataset.k&&t.classList.contains('qe-num')){const v=clamp(t.dataset.k,t.value);if(v!=null){S.setup[t.dataset.k]=v;S.setup.manual[t.dataset.k]=true;S.setup.fromText[t.dataset.k]=false;t.nextElementSibling.textContent='set manually';t.nextElementSibling.className='';const n=root.querySelector('.qe-setup .qe-note .qe-mono');if(n)n.textContent=locCount()}return}
if(t.dataset.scan){S.draft=t.value.slice(0,64);const other=$(t.dataset.scan==='web'?'#qe-tuiscan':'#qe-rfscan');if(other)other.value=S.draft;return}
const productFields={'qe-product':'name','qe-sku':'sku','qe-pack-label':'pack_label','qe-pack-qty':'pack_quantity','qe-pack-units':'pack_units'};
if(productFields[t.id]){const key=productFields[t.id];S.setup.task.product[key]=key.startsWith('pack_')&&key!=='pack_label'?(t.value===''?null:Number(t.value)):t.value;S.setup.taskManual['product.'+key]=true}
if(t.id==='qe-lpn'){S.setup.task.lpn=t.value;S.setup.taskManual.lpn=true}
if(t.id==='qe-answer')S.clarification=t.value;
if(t.dataset.question!=null){S.answers=S.answers||{};S.answers[t.dataset.question]=t.value}
if(t.id==='qe-answer'||t.dataset.question!=null){const b=$('#qe-refine');if(b)b.disabled=!hasReplies()}
if(t.id==='qe-ask')S.ruleText=t.value;
if(t.id==='qe-em')S.em=t.value;if(t.id==='qe-co')S.co=t.value;if(t.id==='qe-website')S.website=t.value});
root.addEventListener('change',(e)=>{const t=e.target;
if(t.classList.contains('qe-num')){t.value=S.setup[t.dataset.k];if(t.dataset.k==='aisles')return render()}
if(['qe-product','qe-sku','qe-pack-label','qe-pack-qty','qe-pack-units','qe-lpn'].includes(t.id))return render();
if(t.id==='qe-consent')S.consent=t.checked;
if(t.id==='qe-operation'){S.setup.task.operation=t.value;S.setup.task.title=Flow.labels[t.value];S.setup.task.steps=Flow.defaults(t.value,S.setup.task.product.serialized,S.setup.task.product.lot_controlled);S.setup.taskManual.operation=true;return render()}
if(t.id==='qe-serialized'||t.id==='qe-lot-controlled'){const key=t.id==='qe-serialized'?'serialized':'lot_controlled';S.setup.task.product[key]=t.checked;S.setup.taskManual['product.'+key]=true;S.setup.task.operation=S.setup.task.operation||'receiving_and_putaway';S.setup.task.steps=Flow.defaults(S.setup.task.operation,S.setup.task.product.serialized,S.setup.task.product.lot_controlled);return render()}
if(t.id==='qe-target-aisle'){S.setup.task.destination_aisle=t.value;S.setup.taskManual.destination_aisle=true}

if(t.id==='qe-plan'&&t.files[0])takeFile(t.files[0])});
function takeFile(f){if(!/\.(jpe?g|png|pdf)$/i.test(f.name)){S.formErr='Use a JPEG, PNG or PDF file.';return render()}if(f.size>3*1024*1024){S.formErr='Use a file smaller than 3 MB.';return render()}cancelAI();if(S.setup.plan&&S.setup.plan.url)URL.revokeObjectURL(S.setup.plan.url);pendingFile=f;S.setup.plan={name:f.name,size:f.size,url:/^image\//.test(f.type)?URL.createObjectURL(f):null};S.formErr='';render()}
root.addEventListener('dragover',(e)=>{const d=e.target.closest&&e.target.closest('#qe-drop');if(!d)return;e.preventDefault();if(!S.dragOver){S.dragOver=true;d.classList.add('is-over')}});
root.addEventListener('dragleave',(e)=>{const d=e.target.closest&&e.target.closest('#qe-drop');if(d&&!d.contains(e.relatedTarget)){S.dragOver=false;d.classList.remove('is-over')}});
root.addEventListener('drop',(e)=>{const d=e.target.closest&&e.target.closest('#qe-drop');if(!d)return;e.preventDefault();S.dragOver=false;const f=e.dataTransfer.files[0];if(f)takeFile(f)});
root.addEventListener('keydown',(e)=>{const t=e.target;
if(S.modal&&e.key==='Escape'){S.modal=false;return render()}
if(S.modal&&e.key==='Tab'){const f=[...root.querySelectorAll('.qe-modal button,.qe-modal input,.qe-modal a')].filter(el=>!el.disabled&&el.tabIndex!==-1&&el.offsetParent!==null);if(!f.length)return;const i=f.indexOf(document.activeElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}return}
if(t.id==='qe-ask'&&e.key==='Enter'){e.preventDefault();const b=$('#qe-ask-go');b&&b.click();return}
if(t.dataset&&t.dataset.scan&&e.key==='Enter'){e.preventDefault();return act.submit(t.dataset.scan==='web'?'web':'tui',t.value)}
if(t.closest&&t.closest('#qe-tui')){if(e.key==='F2'){e.preventDefault();tuiKey('F2')}else if(e.key==='F3'){e.preventDefault();tuiKey('F3')}else if(e.key==='F8'){e.preventDefault();tuiKey('F8')}else if(e.key==='Escape'){e.preventDefault();tuiKey('ESC')}else if(e.key==='Enter'&&t.id==='qe-tui'){e.preventDefault();tuiKey('F2')}}});
root.addEventListener('submit',(e)=>{e.preventDefault();
if(e.target.id==='qe-form'){if(!locCount()){S.formErr='Set aisles, bays and levels.';return render()}S.formErr='';return generate()}
if(e.target.id==='qe-mform')return sendEnquiry();});
render();
window.QuarkEngineDemo={state:S,act,generate};
})();
