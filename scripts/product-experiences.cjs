/* Reproducible progressive enhancement of the founder-approved concept selection. */
const fs=require('node:fs'),path=require('node:path');
const model=require('../design-assets/product-experiences.js');
const root=path.resolve(__dirname,'..');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const mark=(name,h)=>`<!-- quark-experience:${name}:start -->${h}<!-- quark-experience:${name}:end -->`;
function inventory(){
 const record=model.cell(24), rows=Array.from({length:13},(_,r)=>`<div role="row">${Array.from({length:9},(_,c)=>{const i=r*9+c,v=model.cell(i);return `<span role="gridcell"><button type="button" class="q-live-bin is-${v.state}${i===24?' is-on':''}" data-location-index="${i}" tabindex="${i===24?0:-1}" aria-label="${v.location}, ${v.status}" aria-pressed="${i===24}"></button></span>`;}).join('')}</div>`).join('');
 const dl=[['sku','SKU'],['lot','Lot / expiry'],['quantity','Quantity'],['owner','Owner']].map(([key,label])=>`<dt>${label}</dt><dd data-stock-field="${key}">${esc(record[key])}</dd>`).join('');
 return mark('inventory',`<div class="q-hero-art"><div class="q-live q-experience" data-live-inventory><p class="q-live-label">Inventory in context · sample data</p><div class="q-live-stage"><div class="q-live-map" role="grid" aria-label="Illustrative warehouse locations" aria-describedby="inventory-explore-help">${rows}</div><div class="q-live-card"><header><b data-stock-field="location">${record.location}</b><span data-stock-field="status" data-state="${record.state}">${record.status}</span></header><dl>${dl}</dl><p data-stock-field="reason">${esc(record.reason)}</p></div></div><div class="q-live-legend" aria-label="Location states"><span><i aria-hidden="true"></i>Available</span><span><i class="h" aria-hidden="true"></i>On hold</span><span><i class="e" aria-hidden="true"></i>Empty</span></div><label class="q-live-picker">Choose a sample location<select data-location-picker>${Array.from({length:117},(_,i)=>{const v=model.cell(i);return `<option value="${i}"${i===24?' selected':''}>${v.location} · ${v.status}</option>`;}).join('')}</select></label><p class="q-live-hint" id="inventory-explore-help">Point or tap to explore. Keyboard: arrow keys move between locations.</p><p class="q-sr" role="status" data-inventory-announcement></p><noscript><p class="q-live-hint">An example stock record. Enable JavaScript to explore the locations.</p></noscript></div></div>`);
}
function pallet(){
 const tabs=model.steps.map((s,i)=>`<button type="button" role="tab" id="pallet-tab-${i}" aria-controls="pallet-panel-${i}" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-pallet-step><small>0${i+1}</small><strong>${esc(s.title)}</strong></button>`).join('');
 const panels=model.steps.map((s,i)=>`<div class="q-pallet-panel" id="pallet-panel-${i}" role="tabpanel" aria-labelledby="pallet-tab-${i}" tabindex="0" data-pallet-panel><div><h4>${i+1}. ${esc(s.heading)}</h4><p>${esc(s.text)}</p><div class="q-pallet-who">${s.roles.map(r=>`<span>${esc(r)}</span>`).join('')}</div><a class="q-link" href="${s.link}">${esc(s.linkLabel)} <span aria-hidden="true">↗</span></a></div><div class="q-pallet-record"><header><span>Example stock record</span><b>PAL-DEMO-01</b></header><dl>${model.fields.map((f,k)=>`<dt>${f}</dt><dd${s.changed.includes(k)?' class="is-new"':''}><span>${esc(s.values[k])}</span></dd>`).join('')}</dl></div></div>`).join('');
 return mark('pallet',`<article class="q-pallet q-experience" data-pallet-flow id="one-pallet"><header class="q-pallet-head"><span class="q-ex-label">Workflow illustration · sample data</span><h3>One pallet.<br>Five warehouse steps.</h3><p>Follow 48 cases from receipt to storage, a quality hold and a customer order. See what changes as warehouse users complete each step.</p></header><div class="q-pallet-tabs" role="tablist" aria-label="Follow one pallet">${tabs}</div>${panels}<div class="q-pallet-nav"><button type="button" data-pallet-prev disabled>← Previous step</button><button type="button" data-pallet-next>Next step →</button></div><p class="q-sr" role="status" data-pallet-announcement></p></article>`);
}
function particles(original){
 const articles=original.match(/<article\b[\s\S]*?<\/article>/g);
 if(!articles||articles.length!==12)throw Error('Expected the twelve existing Vision descriptions.');
 const panels=articles.map(article=>{
  const name=article.match(/<h3>(.*?)<\/h3>/)[1],p=model.particles.find(x=>x.name===name);if(!p)throw Error('Unrecognized particle '+name);
  const id=p.id==='phonon'?'phonon':'particle-'+p.id;
  article=article.replace(/<article\b([^>]*)>/,(_,attrs)=>`<article${attrs.replace(/\s+(?:id|data-particle-panel)="[^"]*"/g,'')} id="${id}" data-particle-panel="${p.id}">`);
  const names=model.related(p.id).map(id=>model.particles.find(x=>x.id===id).name);
  return article.replace('</article>',`<div class="q-model-related"><strong>Related ideas in this vision</strong>${names.map(n=>`<span>${esc(n)}</span>`).join('')}</div></article>`);
 }).join('\n');
 const nav=model.groups.map(([status,label])=>`<div class="q-model-group${['roadmap','future'].includes(status)?' is-wide':''}"><h3>${label}</h3><div class="q-model-tiles">${model.particles.filter(p=>p.status===status).map(p=>`<button class="q-model-tile ${status}" type="button" data-particle="${p.id}" aria-pressed="${p.id==='quark'}" aria-controls="${p.id==='phonon'?'phonon':'particle-'+p.id}" aria-label="${p.name}, ${label}"><span class="n" aria-hidden="true">${String(model.particles.indexOf(p)+1).padStart(2,'0')}</span><span class="s" aria-hidden="true">${p.symbol}</span><span class="nm">${p.name}</span></button>`).join('')}</div></div>`).join('');
 return mark('particles',`<div class="q-model q-experience" data-particle-model><div class="q-model-left"><div class="q-model-controls" id="particle-explorer" aria-label="Explore the Standard Model">${nav}</div></div><div class="q-particles"><a class="q-model-back q-link" href="#particle-explorer">← Choose another particle</a>${panels}</div><p class="q-sr" role="status" data-particle-announcement></p></div>`);
}
function apply(){
 for(const file of ['index.html','product.html','vision.html']){
  let h=fs.readFileSync(path.join(root,file),'utf8');
  if(file==='index.html')h=h.replace(/<!-- quark-experience:inventory:start -->[\s\S]*?<!-- quark-experience:inventory:end -->|<div class="q-hero-art" aria-hidden="true"><svg class="q-bin-art"[\s\S]*?<\/svg><\/div>/,inventory());
  if(file==='product.html'){
   const block=pallet();if(h.includes('quark-experience:pallet:start'))h=h.replace(/<!-- quark-experience:pallet:start -->[\s\S]*?<!-- quark-experience:pallet:end -->/,block);
   else h=h.replace(/(<section\b[^>]*id="workflows"[\s\S]*?<\/header>)/,'$1\n'+block+'\n');
  }
  if(file==='vision.html'){
   if(h.includes('quark-experience:particles:start')){
    // Strip generated additions, retaining the original article prose for repeatable generation.
    const current=h.match(/<!-- quark-experience:particles:start -->[\s\S]*?<!-- quark-experience:particles:end -->/)[0];
    const articles=current.match(/<article\b[\s\S]*?<\/article>/g).join('').replace(/<div class="q-model-related">[\s\S]*?<\/div>/g,'');
    h=h.replace(current,particles(articles));
   }else h=h.replace(/<div class="q-particles">[\s\S]*?<\/div>(?=<aside class="q-notice")/,x=>particles(x));
  }
  const css='<link rel="stylesheet" href="/design-assets/product-experiences.css">',js='<script src="/design-assets/product-experiences.js" defer></script>';
  if(!h.includes(css))h=h.replace('</head>',css+'</head>');
  if(!h.includes(js))h=h.replace('</body>',js+'</body>');
  fs.writeFileSync(path.join(root,file),h);
 }
}
if(require.main===module)apply();
module.exports={inventory,pallet,particles,apply};
