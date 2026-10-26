/* Local-only budget PDF. Standard PDF fonts; no libraries, requests or storage. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./cost-model.js'));else root.QuarkCostPdf=factory(root.QuarkCost);})(typeof globalThis==='object'?globalThis:this,function(cost){
 'use strict';
 const labels={software:'Software',implementation:'Implementation',siteSetup:'Warehouse setup',integrations:'Integrations',migration:'Migration',training:'Training',devicesInfrastructure:'Devices and infrastructure',contingency:'Initial contingency',support:'Support / maintenance',operations:'Other recurring operations'};
 const money=(c,currency)=>currency+' '+(BigInt(c)/100n).toLocaleString('en-US')+'.'+String(BigInt(c)%100n).padStart(2,'0');
 const clean=s=>String(s).replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2022\u00b7]/g,'-').replace(/\u00a0/g,' ').replace(/\u00d7/g,'x');
 function documentModel(x,date=new Date().toISOString().slice(0,10)){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('Invalid report date.');
  if(!['quick','advanced'].includes(x.mode))throw Error('Choose a planner mode.');
  const plan=cost.scopePlan(x),advanced=x.mode==='advanced',r=advanced?cost.calculate(x):null;
  const profile=[['Warehouses',plan.scope.warehouses??'Unknown'],['Users',plan.scope.users??'Unknown'],['Integrations',plan.scope.integrations??'Unknown'],['Operational complexity',{standard:'Standard processes',moderate:'Several process variants',complex:'Complex or site-specific processes',unknown:'Not sure yet'}[x.complexity]]];
  const assumptions=[];
  if(advanced){
   assumptions.push(['Currency',r.currency],['Licensing',x.licensing==='subscription'?'Subscription':'Perpetual licence'],['Delivery approach',{mixed:'Internal team and partner',internal:'Internal team',partner:'Implementation partner'}[x.approach]]);
   const fields=[...(x.licensing==='subscription'?[['monthlyBase','Monthly platform fee'],['monthlyUser','Monthly fee per user']]:[['licenseBase','One-off platform licence'],['licenseUser','One-off licence per user']]),['days','Implementation person-days'],['dayRate','Cost per implementation day'],['siteSetup','One-off setup per warehouse'],['integrationCost','One-off cost per integration'],['migration','Total migration cost'],['training','Total training and transition'],['devices','Devices / infrastructure per warehouse'],['annualSupport','Annual support / maintenance total'],['annualOther','Other annual operating costs'],['contingency','Contingency on initial costs (%)']];
   for(const [key,label] of fields){const s=String(x[key]),[whole,frac='']=s.split('.');assumptions.push([label,key==='days'?String(Number(s)):key==='contingency'?s+'%':r.currency+' '+BigInt(whole).toLocaleString('en-US')+'.'+frac.padEnd(2,'0')]);}
  }
  return {date,mode:x.mode,profile,assumptions,summary:r?Object.entries({initialTotal:'Initial one-off cost',annualTotal:'Annual recurring cost',tco3:'Three-year TCO',tco5:'Five-year TCO'}).map(([k,l])=>[l,money(r[k],r.currency)]):[],breakdown:r?['initial','annual'].flatMap(phase=>Object.entries(r[phase]).map(([k,v])=>[labels[k]+' ('+(phase==='initial'?'one-off':'annual')+')',money(v,r.currency)])):[],missingScope:plan.missingScope,checklist:plan.checklist.map(([t,a])=>[clean(t.split(' — ')[0]),clean(a)]),disclaimer:'Planning only. This is not a Quark quotation, supplier recommendation, ROI forecast or implementation commitment.'};
 }
 // Helvetica AFM advances, shared approach with the existing local assessment exporter.
 const widths=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
 function ascii(s){s=clean(s);if(/[^\x20-\x7e]/.test(s))throw Error('Unsupported report text.');return s;}
 const esc=s=>ascii(s).replace(/([\\()])/g,'\\$1');
 const width=(s,size)=>[...s].reduce((n,c)=>n+(widths[c.charCodeAt(0)-32]||556),0)*size/1000;
 function wrap(s,size,max,bold=false){const out=[];let line='';for(const word of ascii(s).split(/\s+/)){if(width((line?line+' ':'')+word,size)*(bold?1.08:1)<=max){line+=(line?' ':'')+word;continue;}if(line)out.push(line);line='';for(const c of word){if(width(line+c,size)*(bold?1.08:1)>max){out.push(line);line='';}line+=c;}}if(line)out.push(line);return out;}
 function create(x,date){
  const d=documentModel(x,date),pages=[];let page=[],y=0;
  const ink='0.08 0.08 0.14',accent='0.24 0.24 0.48',muted='0.32 0.34 0.39',light='0.95 0.95 0.98';
  const box=(xx,yy,w,h,c)=>page.push(c+' rg '+xx+' '+yy+' '+w+' '+h+' re f');
  const text=(s,size,xx,yy,font='F1',color=ink)=>page.push(color+' rg BT /'+font+' '+size+' Tf 1 0 0 1 '+xx+' '+yy+' Tm ('+esc(s)+') Tj ET');
  function newPage(){if(page.length)pages.push(page);page=[];for(const [xx,yy] of [[2,0],[3,0],[4,0],[1,1],[5,1],[0,2],[6,2],[0,3],[6,3],[0,4],[6,4],[1,5],[5,5],[2,6],[3,6],[4,6],[5,6],[6,6]])box(48+xx*3,790-yy*3,3,3,xx===6&&yy===6?'0 0.65 0.54':accent);text('quark',17,80,777,'F2',accent);text('BUDGET PLANNING',8,420,784,'F2',muted);box(48,762,499,0.6,'0.80 0.81 0.85');y=738;}
  function need(h){if(y-h<60)newPage();}
  function para(s,size=10,font='F1',color=ink){const lines=wrap(s,size,499,font==='F2');for(const l of lines){need(size+4);text(l,size,48,y,font,color);y-=size+4;}y-=7;}
  function heading(s){need(85);y-=6;para(s,13,'F2',accent);}
  function table(rows){for(const [label,value] of rows){const a=wrap(label,9.5,283),b=wrap(value,9.5,184),h=Math.max(a.length,b.length)*13+14;need(h);box(48,y-h,499,h,light);a.forEach((s,i)=>text(s,9.5,56,y-14-i*13));b.forEach((s,i)=>text(s,9.5,355,y-14-i*13));y-=h+2;}y-=9;}
  newPage();para('WMS Budget Checklist',23,'F2');para('Generated '+d.date+' (UTC) | '+(d.mode==='quick'?'Quick Scope':'Advanced Budget'),9,'F1',muted);para(d.disclaimer,9,'F1',muted);
  heading('Your warehouse scope');if(d.mode==='advanced')para(d.profile.map(([label,value])=>label+': '+value).join(' | '),9);else table(d.profile);
  if(d.mode==='advanced'){
   heading('Budget from your own assumptions');table(d.summary);heading('Included cost categories');table(d.breakdown);
   newPage();heading('Your entered financial assumptions');para('All amounts use '+x.currency+'. Currency selection labels values; it does not convert them. An entered zero means no cost was included for that item.',9);table(d.assumptions);
   heading('Calculation basis and limits');para('Initial cost includes one-off software, person-days x day rate, per-warehouse setup and equipment, per-integration costs, migration and training, plus contingency on their sum. Annual cost includes 12 months of subscription fees (if selected), support and other recurring costs. TCO = initial cost + years x annual cost; annual charges start in year one.',9);para('User counts, annual charges and scope stay constant. Tax/VAT, inflation, growth, exchange rates, financing and benefits are not modelled. Confirm bundled costs are not counted twice. Zero inputs are assumptions, not evidence of free services.',9);
   newPage();heading('Validate your budget before committing');para('Use these questions to check the scope and evidence behind your entered figures. The checklist does not validate supplier estimates or calculate missing prices.',9);
  }else{
   heading('What still needs to be priced');para('Quick Scope provides planning questions, not a cost estimate. Software fees, delivery effort, connections, transition, equipment and annual costs still need to be established. Advanced Budget entries are not assessed by this checklist.',10);
  }
  if(d.missingScope.length){heading('Scope still to confirm');para(d.missingScope.join(', ')+'. Unknown information has not been treated as zero.');}
  d.checklist.forEach(([title,action],i)=>{if(d.mode==='quick'&&i===3){newPage();heading('Continue your preparation checklist');}const height=wrap(action,10,499).length*14+wrap((i+1)+'. '+title,12,499,true).length*16+20;need(height);para((i+1)+'. '+title,12,'F2',accent);para(action);});
  heading('Next step');para('Bring this checklist and the supporting estimates to your internal budget discussion. Ask suppliers to separate included, separately priced, excluded and unknown items. Use the same project scope and ownership period for each proposal.');para('Created locally in your browser. Downloading does not send your inputs to Quark. Keep this file private if your figures are confidential.',9,'F1',muted);
  if(page.length)pages.push(page);
  pages.forEach((p,i)=>p.push(muted+' rg BT /F1 8 Tf 1 0 0 1 48 30 Tm (Quark | quark.build/wms-cost | Planning only | Page '+(i+1)+' of '+pages.length+') Tj ET'));
  const objects=[];objects[1]='<< /Type /Catalog /Pages 2 0 R >>';objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';const kids=[];
  pages.forEach((p,i)=>{const id=5+i*2,stream=p.join('\n')+'\n';kids.push(id+' 0 R');objects[id]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+(id+1)+' 0 R >>';objects[id+1]='<< /Length '+stream.length+' >>\nstream\n'+stream+'endstream';});objects[2]='<< /Type /Pages /Count '+pages.length+' /Kids ['+kids.join(' ')+'] >>';let pdf='%PDF-1.4\n%Quark local budget checklist\n';const offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=i+' 0 obj\n'+objects[i]+'\nendobj\n';}const pos=pdf.length;pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';for(let i=1;i<objects.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+pos+'\n%%EOF\n';return new TextEncoder().encode(pdf);
 }
 return {documentModel,create};
});
