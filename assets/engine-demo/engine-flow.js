/* Declarative RF preview runtime. Only the listed primitives can run. No code generation, eval or warehouse API calls. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QuarkEngineFlow=factory()})(typeof window!=='undefined'?window:this,function(){
'use strict';
const operations=['receiving','putaway','receiving_and_putaway','picking','counting','replenishment','packing','loading'];
const labels={receiving:'Receiving',putaway:'Putaway',receiving_and_putaway:'Receiving + putaway',picking:'Picking',counting:'Inventory count',replenishment:'Replenishment',packing:'Packing',loading:'Loading'};
const catalogue={
 scan_document:{label:'Scan receipt / ASN',control:'scan'},scan_product:{label:'Scan product barcode',control:'scan'},scan_lpn:{label:'Scan LPN',control:'scan'},
 enter_lot:{label:'Enter lot number',control:'text'},enter_date:{label:'Enter expiry date',control:'date'},receive_line:{label:'Receive quantity',control:'number'},
 capture_serials:{label:'Scan serial number',control:'serial'},verify_serials:{label:'Verify serial number',control:'serial'},close_receipt:{label:'Close receipt',control:'confirm'},
 scan_source:{label:'Scan source location',control:'scan'},scan_destination:{label:'Scan destination location',control:'scan'},move_lpn:{label:'Confirm LPN placement',control:'confirm'},
 enter_quantity:{label:'Enter quantity',control:'number'},record_count:{label:'Confirm count',control:'confirm'},confirm_pick:{label:'Confirm pick',control:'confirm'},
 confirm_replenish:{label:'Confirm replenishment',control:'confirm'},confirm_pack:{label:'Confirm packing',control:'confirm'},confirm_loading:{label:'Confirm loading',control:'confirm'}
};
const pad=n=>String(n).padStart(2,'0');
const occupied=code=>{let h=0;for(const c of code)h=(h*31+c.charCodeAt(0))>>>0;return h%10<3};
function location(aisle,layout,wantOccupied){for(const side of ['02','01'])for(let bay=1;bay<=layout.bays;bay++)for(let level=1;level<=layout.levels;level++){const c=aisle+'-'+pad(bay)+'-'+side+'-L'+level;if(occupied(c)===wantOccupied)return c}return null}
function defaults(op,serial,lot){
 const track=[...(lot?['enter_lot']:[])];
 const receipt=['scan_document','scan_product','scan_lpn',...track,'receive_line',...(serial?['capture_serials']:[]),'close_receipt'];
 return {receiving:receipt,putaway:['scan_lpn','scan_destination','move_lpn'],receiving_and_putaway:[...receipt,'scan_destination','move_lpn'],picking:['scan_source','scan_product','enter_quantity',...(serial?['verify_serials']:[]),'confirm_pick'],counting:['scan_source','scan_product','enter_quantity',...(serial?['verify_serials']:[]),'record_count'],replenishment:['scan_lpn','scan_source','enter_quantity','scan_destination','confirm_replenish'],packing:['scan_lpn','scan_product','enter_quantity',...(serial?['verify_serials']:[]),'confirm_pack'],loading:['scan_lpn','scan_destination','confirm_loading']}[op];
}
function validateTask(task,layout){
 if(!task||typeof task!=='object'||Array.isArray(task))throw new Error('Missing workflow definition.');
 if(task.operation!==null&&!operations.includes(task.operation))throw new Error('Unsupported preview operation.');
 for(const k of ['title','document','lpn','destination_aisle'])if(task[k]!==null&&(typeof task[k]!=='string'||task[k].length>(k==='title'?90:k==='destination_aisle'?1:40)))throw new Error('Invalid workflow context.');
 const p=task.product;if(!p||typeof p!=='object')throw new Error('Missing product definition.');
 for(const k of ['name','sku','pack_label'])if(p[k]!==null&&(typeof p[k]!=='string'||p[k].length>(k==='name'?80:40)))throw new Error('Invalid product.');
 for(const k of ['pack_units','pack_quantity'])if(p[k]!==null&&(!Number.isSafeInteger(p[k])||p[k]<1||p[k]>1000))throw new Error('Invalid packaging or quantity.');
 if(typeof p.serialized!=='boolean'||typeof p.lot_controlled!=='boolean')throw new Error('Invalid tracking requirements.');
 if((p.pack_units||1)*(p.pack_quantity|| (p.serialized?3:24))>(p.serialized?100:10000))throw new Error('Use a smaller representative quantity for this preview.');
 const a=task.destination_aisle;if(a!==null&&(!/^[A-L]$/.test(a)||a.charCodeAt(0)-65>=(layout.aisles||12)))throw new Error('Destination aisle is outside the layout.');
 if(!Array.isArray(task.steps)||task.steps.length>18||new Set(task.steps).size!==task.steps.length||task.steps.some(c=>!catalogue[c]))throw new Error('Invalid RF steps.');
 if(task.operation===null){if(task.steps.length)throw new Error('Choose an operation before generating steps.');return task}
 const required=defaults(task.operation,p.serialized,p.lot_controlled);let last=-1;
 for(const c of required){const i=task.steps.indexOf(c);if(i<=last)throw new Error('Missing or incorrectly ordered RF step: '+c);last=i}
 const allowed=new Set(required.concat(['enter_date']));
 if(task.steps.some(c=>!allowed.has(c)))throw new Error('This step does not belong to the requested operation.');
 if(task.operation==='putaway'&&(task.steps.includes('receive_line')||task.steps.includes('capture_serials')))throw new Error('Moving an intact LPN must not receive stock or create new serials.');
 if(task.steps.includes('enter_date')&&task.steps.indexOf('enter_date')>task.steps.indexOf('receive_line'))throw new Error('Capture expiry before receiving.');
 return task;
}
function resolve(task,layout){
 validateTask(task,layout);const p=task.product,op=task.operation||'receiving_and_putaway';
 const item=p.name||'Sample product',quantity=p.pack_quantity||(p.serialized?3:24),units=p.pack_units||1;
 const result={...task,operation:op,title:task.title||labels[op],document:task.document||'ASN-DEMO-1042',lpn:task.lpn||'DEMO-LPN-001',destination_aisle:task.destination_aisle||'A',product:{...p,name:item,sku:p.sku||'DEMO-'+(item.toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,26)||'ITEM'),pack_label:p.pack_label||'Each',pack_units:units,pack_quantity:quantity},steps:task.operation?task.steps.slice():defaults(op,p.serialized,p.lot_controlled)};
 result.total_units=quantity*units;result.destination=location(result.destination_aisle,layout,false);if(!result.destination)throw new Error('No free sample location is available in this aisle.');
 result.source=location('A',layout,true)||'STAGE';return result;
}
function emptyTask(){return {operation:null,title:null,document:null,lpn:null,destination_aisle:null,product:{name:null,sku:null,pack_label:null,pack_units:null,pack_quantity:null,serialized:false,lot_controlled:false},steps:[]}}
function create(def){
 const receiving=['receiving','receiving_and_putaway'].includes(def.operation),atDock=def.operation==='putaway'||def.operation==='loading',n=def.total_units;
 const serials=!receiving&&def.product.serialized?Array.from({length:n},(_,i)=>({value:'DEMO-SN-'+String(i+1).padStart(4,'0'),sku:def.product.sku,lpn:def.lpn,location:atDock?'STAGE':def.source})):[];
 return {index:0,completed:false,error:null,values:{},serials,verified:[],receiptClosed:false,received:0,dock:atDock?n:0,stored:receiving||atDock?0:n,processed:0,events:[]};
}
function view(def,run){const code=def.steps[run.index];return run.completed?{code:'done',label:'Task completed',control:'done'}:{code,...catalogue[code]}}
function expected(def,run){const s=view(def,run);return {scan_document:def.document,scan_product:def.product.sku,scan_lpn:def.lpn,scan_source:def.source,scan_destination:def.destination,receive_line:String(def.product.pack_quantity),enter_quantity:String(def.product.pack_quantity),enter_lot:'DEMO-LOT-01',enter_date:'2027-12-31',capture_serials:'DEMO-SN-'+String(run.serials.length+1).padStart(4,'0'),verify_serials:run.serials.find(x=>!run.verified.includes(x.value))?.value||''}[s.code]||''}
function submit(def,current,value){
 const r={...current,values:{...current.values},serials:current.serials.map(x=>({...x})),verified:current.verified.slice(),events:[],error:null};
 if(r.completed){r.error='Task already completed. Stock is unchanged.';return r}
 const s=view(def,r),v=String(value??'').trim(),isReceipt=['receiving','receiving_and_putaway'].includes(def.operation),total=def.total_units;
 const fail=message=>{r.error=message;return r};
 if(s.control==='serial'){
  if(!v||v.length>64)return fail('Scan one serial number, up to 64 characters.');
  const list=s.code==='capture_serials'?r.serials.map(x=>x.value):r.verified;const count=list.length;
  if(list.includes(v))return fail('Already scanned: '+v+'. Scan the next unit.');
  if(s.code==='verify_serials'&&!r.serials.some(x=>x.value===v))return fail('Serial is not on this sample LPN: '+v);
  if(s.code==='capture_serials')r.serials.push({value:v,sku:def.product.sku,lpn:def.lpn,document:def.document,lot:r.values.enter_lot||null,expiry:r.values.enter_date||null,location:'STAGE'});else r.verified.push(v);
  r.events.push('Serial '+v+' accepted · '+(count+1)+' / '+total);
  if(count+1===total)r.index++;return r;
 }
 if(s.control==='scan'&&v.toUpperCase()!==expected(def,r).toUpperCase())return fail('Expected '+expected(def,r)+'. Scan the matching sample label.');
 if(s.control==='number'&&(!/^\d+$/.test(v)||Number(v)!==def.product.pack_quantity))return fail('This preview expects '+def.product.pack_quantity+' '+def.product.pack_label+'. Edit the setup to use another quantity.');
 if(s.control==='text'&&(!v||v.length>64))return fail('Enter a lot number, up to 64 characters.');
 if(s.control==='date'&&(!/^\d{4}-\d{2}-\d{2}$/.test(v)||Number.isNaN(Date.parse(v))||new Date(v).toISOString().slice(0,10)!==v))return fail('Use a valid date in YYYY-MM-DD format.');
 if(s.code==='receive_line'){r.dock=total;r.received=total;r.events.push('Received '+def.product.pack_quantity+' '+def.product.pack_label+' × '+def.product.pack_units+' = '+total+' units into '+def.lpn)}
 if(s.code==='close_receipt'){
  if(def.product.serialized&&r.serials.length!==total)return fail('Capture all '+total+' serial numbers before closing this receipt.');
  r.receiptClosed=true;r.events.push('Receipt closed · '+r.serials.length+' serials recorded');
 }
 if(['move_lpn','confirm_replenish'].includes(s.code)){
  if(!r.values.scan_lpn||!r.values.scan_destination)return fail('Scan the LPN and destination before confirming.');
  if(isReceipt&&!r.receiptClosed)return fail('Finish receiving and serial capture first.');
  if(s.code==='move_lpn'){r.stored+=r.dock;r.dock=0}else r.processed=total;
  r.serials.forEach(x=>{x.location=def.destination});r.events.push(def.lpn+' placed at '+def.destination+' · contents and serials preserved');
 }
 if(['confirm_pick','confirm_pack','confirm_loading'].includes(s.code)){
  if(def.product.serialized&&s.code!=='confirm_loading'&&r.verified.length!==total)return fail('Verify every serial before confirming.');
  r.processed=total;if(s.code==='confirm_pick'){r.stored-=total}else if(s.code==='confirm_loading')r.dock=0;
 }
 if(s.code==='record_count')r.processed=total;
 r.values[s.code]=s.control==='confirm'?true:v;r.events.push(s.label+' · '+(s.control==='confirm'?'confirmed':v));r.index++;r.completed=r.index===def.steps.length;return r;
}
return {operations,labels,catalogue,defaults,validateTask,resolve,emptyTask,create,view,expected,submit,occupied};
});
