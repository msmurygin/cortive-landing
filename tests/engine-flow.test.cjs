const {test}=require('node:test'),a=require('node:assert/strict'),F=require('../assets/engine-demo/engine-flow');
const layout={aisles:3,bays:4,levels:4};
function task(op='receiving',serialized=false){const t=F.emptyTask();t.operation=op;t.title=F.labels[op];t.product={name:'Olive oil',sku:'OIL-001',pack_label:'Case',pack_units:6,pack_quantity:2,serialized,lot_controlled:false};t.destination_aisle='B';t.steps=F.defaults(op,serialized,false);return t}
function advance(def,r,stop){let guard=0;while(!r.completed&&F.view(def,r).code!==stop){if(++guard>200)throw Error('loop');r=F.submit(def,r,F.expected(def,r));a.equal(r.error,null)}return r}
test('direct putaway scans the existing LPN, selects a free B location and never opens receiving',()=>{
 const d=F.resolve(task('putaway'),layout);a.deepEqual(d.steps,['scan_lpn','scan_destination','move_lpn']);a.match(d.destination,/^B-/);a.equal(F.occupied(d.destination),false);
 let r=F.create(d);a.equal(r.dock,12);a.equal(r.received,0);r=F.submit(d,r,'unknown');a.equal(r.index,0);a.match(r.error,/Expected/);
 r=F.submit(d,r,d.lpn);r=F.submit(d,r,'A-01-02-L1');a.equal(r.index,1);a.equal(r.stored,0);
 r=F.submit(d,r,d.destination);r=F.submit(d,r,'');a.equal(r.completed,true);a.equal(r.dock,0);a.equal(r.stored,12);a.equal(r.received,0);
 const retry=F.submit(d,r,'');a.equal(retry.stored,12);a.match(retry.error,/already completed/);
});
test('two six-unit cases require twelve distinct serials; duplicates and early close cannot increase stock',()=>{
 const d=F.resolve(task('receiving',true),layout);let r=advance(d,F.create(d),'capture_serials');a.equal(r.received,12);a.equal(r.dock,12);
 const old=r;r=F.submit(d,r,'SN-A');a.equal(old.serials.length,0);a.equal(r.serials.length,1);
 r=F.submit(d,r,'SN-A');a.equal(r.serials.length,1);a.match(r.error,/Already scanned/);
 const early=F.submit(d,{...r,index:d.steps.indexOf('close_receipt')},'');a.equal(early.receiptClosed,false);a.equal(early.completed,false);a.match(early.error,/all 12/);
 for(let i=2;i<=12;i++)r=F.submit(d,r,'SN-'+i);a.equal(F.view(d,r).code,'close_receipt');a.equal(r.serials.length,12);a.equal(r.dock,12);
 r=F.submit(d,r,'');a.equal(r.receiptClosed,true);a.equal(r.completed,true);a.equal(r.stored,0);a.equal(r.received,12);a.equal(r.serials.every(x=>x.sku===d.product.sku&&x.lpn===d.lpn&&x.document===d.document&&x.location==='STAGE'),true);
});
test('moving a serialized intact LPN preserves every serial and its quantity without serial capture',()=>{
 const d=F.resolve(task('putaway',true),layout);let r=F.create(d);const ids=r.serials.map(x=>x.value);a.equal(ids.length,12);a.ok(!d.steps.includes('capture_serials'));
 r=advance(d,r);a.deepEqual(r.serials.map(x=>x.value),ids);a.equal(r.serials.every(x=>x.location===d.destination),true);a.equal(r.stored,12);a.equal(r.received,0);
});
test('a combined receipt and putaway keeps serials attached through the move',()=>{
 const d=F.resolve(task('receiving_and_putaway',true),layout);const r=advance(d,F.create(d));a.equal(r.completed,true);a.equal(r.receiptClosed,true);a.equal(r.received,12);a.equal(r.stored,12);a.equal(r.dock,0);a.equal(new Set(r.serials.map(x=>x.value)).size,12);a.ok(r.serials.every(x=>x.location===d.destination));
});
test('unsafe or contradictory JSON processes are rejected before rendering',()=>{
 for(const change of [t=>t.steps=['run_javascript'],t=>t.steps=['close_receipt','receive_line'],t=>t.steps.push('close_receipt'),t=>t.product.pack_units=0,t=>t.product.pack_quantity=1001,t=>t.destination_aisle='Z',t=>t.destination_aisle='D',t=>t.operation='eval']){const t=task('receiving',true);change(t);a.throws(()=>F.resolve(t,layout))}
 const t=task('receiving',true);t.steps=t.steps.filter(x=>x!=='capture_serials');a.throws(()=>F.resolve(t,layout),/capture_serials/);
 const move=task('putaway',true);move.steps.splice(1,0,'receive_line');a.throws(()=>F.resolve(move,layout));
 const huge=task('receiving',true);huge.product.pack_quantity=100;a.throws(()=>F.resolve(huge,layout),/smaller/);
});
test('all supported process templates finish through the same validated primitives',()=>{
 for(const op of F.operations)for(const serialized of [false,true]){
  const d=F.resolve(task(op,serialized),layout),r=advance(d,F.create(d));a.equal(r.completed,true,op);a.ok(r.dock>=0&&r.stored>=0&&r.processed>=0);a.equal(r.serials.length,serialized?12:0,op);
 }
});
test('actual receipt quantity uses the selected packaging; malformed quantity and dates are refused',()=>{
 const t=task();t.product.lot_controlled=true;t.steps=F.defaults('receiving',false,true);t.steps.splice(t.steps.indexOf('receive_line'),0,'enter_date');const d=F.resolve(t,layout);let r=advance(d,F.create(d),'enter_date');
 r=F.submit(d,r,'2027-02-30');a.match(r.error,/valid date/);r=F.submit(d,r,'2027-02-28');a.equal(F.view(d,r).code,'receive_line');
 r=F.submit(d,r,'12');a.match(r.error,/expects 2 Case/);a.equal(r.received,0);r=F.submit(d,r,'2');a.equal(r.received,12);
});
test('missing facts stay in the model task while explicit sample defaults make a bounded preview',()=>{
 const raw=F.emptyTask(),d=F.resolve(raw,layout);a.equal(raw.product.pack_quantity,null);a.equal(d.product.sku,'DEMO-SAMPLE-PRODUCT');a.equal(d.total_units,24);a.equal(d.operation,'receiving_and_putaway');
 raw.product.serialized=true;const serial=F.resolve(raw,layout);a.equal(serial.total_units,3);a.ok(serial.steps.includes('capture_serials'));
});
