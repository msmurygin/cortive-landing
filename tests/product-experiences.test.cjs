const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const model=require('../design-assets/product-experiences.js'),generator=require('../scripts/product-experiences.cjs');
const read=f=>fs.readFileSync(require('node:path').join(__dirname,'..',f),'utf8');
test('sample locations distinguish missing stock, available balances and holds without inventing live data',()=>{
 const cells=Array.from({length:117},(_,i)=>model.cell(i));a.equal(new Set(cells.map(c=>c.location)).size,117);a.equal(cells.filter(c=>c.state==='hold').length,4);
 a.equal(model.cell(24).status,'On hold');a.match(model.cell(24).reason,/QC inspection/);
 for(const c of cells)if(c.state==='empty'){a.equal(c.quantity,'0 cases');a.equal(c.sku,'No stock');a.equal(c.owner,'Not applicable');a.equal(c.lot,'Not applicable');}else {a.match(c.sku,/^DEMO-/);a.match(c.owner,/^Sample owner/);a.match(c.lot,/LOT-DEMO/);}
 for(const n of [-1,117,NaN,1.2])a.throws(()=>model.cell(n));
});
test('arrow navigation stays inside the grid and Home/End address the current row',()=>{
 a.equal(model.gridMove(0,'ArrowLeft'),0);a.equal(model.gridMove(8,'ArrowRight'),8);a.equal(model.gridMove(0,'ArrowUp'),0);a.equal(model.gridMove(116,'ArrowDown'),116);a.equal(model.gridMove(5,'ArrowUp'),5);a.equal(model.gridMove(110,'ArrowDown'),110);
 a.equal(model.gridMove(24,'ArrowLeft'),23);a.equal(model.gridMove(24,'ArrowDown'),33);a.equal(model.gridMove(24,'Home'),18);a.equal(model.gridMove(24,'End'),26);
 for(let i=0;i<117;i++)for(const key of ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End']){const n=model.gridMove(i,key);a.ok(n>=0&&n<117);}
 const html=generator.inventory();a.equal((html.match(/data-location-index=/g)||[]).length,117);a.equal((html.match(/tabindex="0"/g)||[]).length,1);a.match(html,/sample data/);a.match(html,/<noscript>/);
});
test('pallet story conserves 48 cases and explicitly releases the hold before allocation',()=>{
 a.equal(model.steps.length,5);for(const s of model.steps){a.equal(s.values.length,model.fields.length);a.ok(s.changed.every(k=>k>=0&&k<6));}
 a.equal(model.steps[2].values[2],'48 cases');a.match(model.steps[3].text,/hold is released/);a.equal(model.steps[3].values[2],'36 stored + 12 picked');a.equal(model.steps[4].values[2],'36 cases');a.match(model.steps[4].text,/shipment of those 12 cases/);
 const h=generator.pallet();a.equal((h.match(/role="tabpanel"/g)||[]).length,5);a.doesNotMatch(h,/ hidden/);for(const s of model.steps)a.ok(read('product.html').includes('id="'+s.link.slice(1)+'"'));
});
test('Vision keeps built, separate and planned products distinct; relations are editorial',()=>{
 a.equal(model.particles.length,12);a.deepEqual(model.particles.filter(p=>p.status==='built').map(p=>p.name),['Quark','Neutrino','Fermion']);a.equal(model.particles.find(p=>p.id==='phonon').status,'separate');a.equal(model.particles.find(p=>p.id==='photon').status,'future');
 for(const p of model.particles){a.ok(!model.related(p.id).includes(p.id));for(const id of model.related(p.id))a.ok(model.related(id).includes(p.id));}
 const h=read('vision.html');a.equal((h.match(/data-particle-panel=/g)||[]).length,12);a.equal((h.match(/data-particle="/g)||[]).length,12);a.match(h,/Related ideas in this vision/);a.match(h,/id="phonon" data-particle-panel/);
});
test('new interactions do not persist or transmit selections and introduce no dependencies',()=>{
 a.doesNotMatch(read('design-assets/product-experiences.js'),/fetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|cookie|\.submit\s*\(|https?:|import\s*\(/);
 const withoutDocumentationLinks=html=>html.replace(/<a href="https:\/\/docs\.quark\.build\/" data-nav="documentation"><strong>Documentation<\/strong><span>Warehouse guides, Metadata Studio and API reference\.<\/span><\/a>/g,'').replace(/<li><a href="https:\/\/docs\.quark\.build\/"(?: data-nav="documentation")?>Documentation<\/a><\/li>/g,'');
 for(const f of ['wms-cost.html','tools/wms-readiness-assessment/index.html','legal/privacy.html','legal/terms.html','assets/leads.js','api/events.js','api/lead.js','robots.txt','sitemap.xml','vercel.json'])a.equal(withoutDocumentationLinks(read(f)),cp.execFileSync('git',['show','a2be3e6:'+f],{encoding:'utf8',cwd:require('node:path').join(__dirname,'..')}),f);
});
test('generator remains stable and no-JS HTML retains all existing Vision descriptions',()=>{
 const files=['index.html','product.html','vision.html'],before=files.map(read);generator.apply();a.deepEqual(files.map(read),before);
 const base=cp.execFileSync('git',['show','a2be3e6:vision.html'],{encoding:'utf8',cwd:require('node:path').join(__dirname,'..')});
 for(const text of [...base.matchAll(/<div class="q-particles">([\s\S]*?)<\/div>(?=<aside class="q-notice")/g)][0][1].matchAll(/<p>[\s\S]*?<\/p>/g))a.ok(read('vision.html').includes(text[0]));
});
