/* Minimal local PDF text/layout writer. No framework, remote font, API or telemetry. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.QuarkReadinessPdf=factory();})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 // Standard Helvetica ASCII advances, in 1/1000 em (AFM metrics).
 const widths=[278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
 function ascii(text){const out=String(text).replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[\u2022\u00b7]/g,'-').replace(/\u00a0/g,' ').replace(/\u00d7/g,'x');if(/[^\x09\x0a\x0d\x20-\x7e]/.test(out))throw Error('The PDF contains an unsupported character. Use the printable report instead.');return out;}
 function escape(text){return ascii(text).replace(/([\\()])/g,'\\$1');}
 function width(text,size){return [...ascii(text)].reduce((n,c)=>n+(widths[c.charCodeAt(0)-32]||556),0)*size/1000;}
 function wrap(text,size,max){const lines=[];let line='';for(const word of ascii(text).split(/\s+/)){if(width((line?line+' ':'')+word,size)<=max){line+=(line?' ':'')+word;continue;}if(line)lines.push(line);line='';for(const char of word){if(width(line+char,size)>max){lines.push(line);line='';}line+=char;}}if(line)lines.push(line);return lines;}
 function createPdf(report,sections){
  if(sections.some(s=>s.table))return createMeetingPdf(report,sections);
  const pages=[];let page=[],y=0;
  function text(value,size,x,yy,font='F1'){page.push('BT /'+font+' '+size+' Tf 1 0 0 1 '+x+' '+yy+' Tm ('+escape(value)+') Tj ET');}
  function newPage(){if(page.length)pages.push(page);page=[];y=790;text('Quark | quark.build',10,48,y,'F2');y-=30;text(report.reportTitle||'WMS Project Preparation Report',19,48,y,'F2');y-=23;text('Generated '+report.generatedAt,9,48,y);y-=28;}
  function block(value,size=10,font='F1',indent=0){const lines=wrap(value,size,499-indent),height=lines.length*(size+4)+8;if(y-height<54&&height<650)newPage();for(const line of lines){if(y<54)newPage();text(line,size,48+indent,y,font);y-=size+4;}y-=8;}
  newPage();block('Preliminary planning only. No go-live certification, product compatibility, cost, ROI or implementation timeline is established.');
  for(const section of sections){const headingHeight=wrap(section.title,13,499).length*17+8,firstHeight=section.items.length?wrap('- '+section.items[0],10,491).length*14+8:0;if(y-headingHeight-Math.min(firstHeight,560)<54)newPage();block(section.title,13,'F2');for(const item of section.items)block('- '+item,10,'F1',8);y-=5;}
  if(page.length)pages.push(page);
  return serialize(pages);
 }
 function createMeetingPdf(report,sections){
  const pages=[];let page=[],y=0;
  const ink='0.05 0.09 0.10',muted='0.28 0.33 0.34',accent='0 0.43 0.39';
  const drawText=(value,size,x,yy,font='F1',color=ink)=>page.push(color+' rg BT /'+font+' '+size+' Tf 1 0 0 1 '+x+' '+yy+' Tm ('+escape(value)+') Tj ET');
  const box=(x,yy,w,h,color)=>page.push(color+' rg '+x+' '+yy+' '+w+' '+h+' re f');
  function newPage(){if(page.length)pages.push(page);page=[];box(42,795,26,5,accent);drawText('QUARK',13,78,790,'F2');drawText('PROJECT PREPARATION',8,374,793,'F2',muted);box(42,775,511,0.7,'0.79 0.82 0.81');y=751;}
  function paragraph(value,size=10,font='F1',color=ink){const lines=wrap(value,size,font==='F2'?465:511),step=size+4;for(const line of lines){if(y<59)newPage();drawText(line,size,42,y,font,color);y-=step;}y-=6;}
  function heading(title){if(y<145)newPage();y-=7;paragraph(title,12,'F2',accent);}
  function table(headers,rows){
   const widths= headers.length===2?[160,351]:[130,255,126];
   const rowLines=row=>row.map((s,i)=>wrap(s,9,widths[i]-16));
   function header(){if(y<95)newPage();box(42,y-23,511,25,'0.08 0.14 0.15');let x=42;headers.forEach((s,i)=>{drawText(s,8.5,x+8,y-14,'F2','1 1 1');x+=widths[i];});y-=25;}
   header();
   if(!rows.length)rows=[headers.map((_,i)=>i===0?'No explicit item in these answers.':'')];
   rows.forEach((row,index)=>{const lines=rowLines(row);let start=0,total=Math.max(...lines.map(x=>x.length),1);
    while(start<total){let capacity=Math.floor((y-63-14)/12);if(capacity<2){newPage();header();capacity=Math.floor((y-63-14)/12);}const remaining=total-start;
     if(remaining>capacity&&remaining<45&&start===0){newPage();header();capacity=Math.floor((y-63-14)/12);}
     const take=Math.min(total-start,capacity),height=take*12+14;box(42,y-height,511,height,index%2?'0.97 0.98 0.97':'0.93 0.95 0.94');let x=42;
     lines.forEach((column,i)=>{column.slice(start,start+take).forEach((line,n)=>drawText(line,9,x+8,y-15-n*12));x+=widths[i];});y-=height+1;start+=take;if(start<total){newPage();header();}
    }
   });y-=10;
  }
  newPage();paragraph(report.reportTitle||'WMS Project Preparation Brief',21,'F2');paragraph('Prepared '+report.generatedAt.slice(0,10)+' | Taxonomy '+report.taxonomyVersion+' | Rules '+report.rulesVersion+' | Schema '+report.assessmentSchemaVersion,9,'F1',muted);paragraph('Your discussion brief: explicit answers, open questions and practical next actions. No email is required. Preliminary discovery, not product-fit, compliance or go-live certification.',10);
  for(const section of sections){if(section.table){const first=section.table.rows[0]||[],columnWidths=first.length===2?[160,351]:[130,255,126],firstHeight=Math.max(1,...first.map((s,i)=>wrap(s,9,columnWidths[i]-16).length))*12+14,notesHeight=(section.notes||[]).reduce((n,s)=>n+wrap(s,9,511).length*13+6,0);if(y-(50+Math.min(firstHeight,560)+notesHeight)<63)newPage();}heading(section.title);if(section.table){for(const note of section.notes||[])paragraph(note,9,'F1',muted);table(section.table.headers,section.table.rows);}else for(const item of section.items)paragraph(item);}
  if(page.length)pages.push(page);
  pages.forEach((lines,i)=>{lines.push('0.79 0.82 0.81 rg 42 43 511 0.7 re f');lines.push('0.28 0.33 0.34 rg BT /F1 8 Tf 1 0 0 1 42 29 Tm (Quark | quark.build | Preliminary discovery | Page '+(i+1)+' of '+pages.length+') Tj ET');});
  return serialize(pages,true);
 }
 function serialize(pages,meeting=false){
  const objects=[];objects[1]='<< /Type /Catalog /Pages 2 0 R >>';objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  const kids=[];pages.forEach((lines,i)=>{const id=5+i*2,streamId=id+1;kids.push(id+' 0 R');const footer='BT /F1 9 Tf 1 0 0 1 48 28 Tm (Quark - Preliminary assessment | Page '+(i+1)+' of '+pages.length+') Tj ET',content=(meeting?lines:lines.concat(footer)).join('\n')+'\n';objects[id]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+streamId+' 0 R >>';objects[streamId]='<< /Length '+content.length+' >>\nstream\n'+content+'endstream';});
  objects[2]='<< /Type /Pages /Count '+pages.length+' /Kids ['+kids.join(' ')+'] >>';
  let pdf='%PDF-1.4\n%Quark local-only assessment\n';const offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=i+' 0 obj\n'+objects[i]+'\nendobj\n';}const xref=pdf.length;pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';for(let i=1;i<objects.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';return new TextEncoder().encode(pdf);
 }
 // Customer presentation only. The assessment, its JSON and the legacy PDF API stay unchanged.
 function customerDocument(r,engine){
  const clean=s=>ascii(String(s??'')).replace(/\s+/g,' ').trim();
  const withoutRefs=s=>clean(s).replace(/\s*\[[^\]]*\]/g,'').trim();
  const unique=values=>[...new Set(values.filter(Boolean))];
  const value=k=>clean(engine.display(k,r.answers[k]));
  const label=k=>clean(engine.fields.find(f=>f.key===k)?.label||k);
  const plural=(n,one,many=one+'s')=>n==null?'Not specified':n+' '+(n===1?one:many);
  const taxonomyLabel=(options,v)=>clean(options.find(o=>o.value===v)?.label||'Not specified');
  const primary=taxonomyLabel(engine.industries,r.selectedTaxonomy.primaryIndustry);
  const additional=r.selectedTaxonomy.industries.filter(v=>v!==r.selectedTaxonomy.primaryIndustry&&v!=='unknown').map(v=>taxonomyLabel(engine.industries,v));
  const models=r.selectedTaxonomy.operatingModels.filter(v=>v!=='unknown').map(v=>taxonomyLabel(engine.operatingModels,v));
  const profile=[['Primary industry',primary],...(additional.length?[['Additional industries',unique(additional).join(', ')]]:[]),...(models.length?[['Operating models',unique(models).join(', ')]]:[]),['Warehouse footprint',r.warehouseProfile.warehouses==null?'Not specified':plural(r.warehouseProfile.warehouses,'warehouse')],...(r.warehouseProfile.activeUsers==null?[]:[['Active users',plural(r.warehouseProfile.activeUsers,'active user')]]),...(r.warehouseProfile.dailyVolume==null?[]:[['Daily volume',r.warehouseProfile.volumeUnit==='unknown'?r.warehouseProfile.dailyVolume+' (unit not specified)':plural(r.warehouseProfile.dailyVolume,r.warehouseProfile.volumeUnit==='lines'?'order line':'order')+' per day']]),...(r.answers.currentSystem==='unknown'&&r.answers.erp==='unknown'?[]:[['Current systems',value('currentSystem')+'; ERP: '+value('erp')]])];
  const sentenceTitle=s=>clean(s).replace(/^(Clarify|Prepare|Investigate) ([A-Z])/,(_,a,b)=>a+' '+b.toLowerCase());
  const sources=x=>unique(x.supportingAnswers.map(s=>clean(s.label)+': '+clean(s.display))).join('; ');
  const tasks=[],byAction=new Map();
  for(const x of r.recommendations){const key=clean(x.action).toLowerCase(),prior=byAction.get(key);if(prior){prior.ruleIds.push(x.ruleId);prior.titles=unique([...prior.titles,sentenceTitle(x.title)]);prior.why=unique([...prior.why,clean(x.explanation)]);prior.basis=unique([...prior.basis,sources(x)]);continue;}const item={ruleIds:[x.ruleId],titles:[sentenceTitle(x.title)],action:clean(x.action),why:[clean(x.explanation)],basis:[sources(x)],priority:x.priority};tasks.push(item);byAction.set(key,item);}
  const first=tasks.slice(0,3),remaining=tasks.slice(3);
  const oldNext=engine.meetingSections(r).find(s=>/^10\./.test(s.title)).items;
  const fallback=[{title:'Confirm the stated project basis',action:tasks.length?null:withoutRefs(oldNext[0])},{title:'Choose a supplier-evaluation scenario',action:r.candidateEvaluationScenarios[0]?.action},{title:'Bring the right people together',action:withoutRefs(oldNext[oldNext.length-2])}];
  for(const item of fallback)if(first.length<3&&item.action&&!first.some(x=>x.action===clean(item.action)))first.push({ruleIds:[],titles:[item.title],action:clean(item.action),why:[],basis:[],priority:null});
  const dimensionLabels={variants:'Process variation',clientVariance:'Client variation',dispatch:'Dispatch',packing:'Packing',siteSimilarity:'Site processes',tracking:'Tracking',ownership:'Ownership',units:'Units',qc:'QC release',productVariants:'SKU variants',integrations:'Connections',interfacePattern:'Exchange',interfaceOwnership:'Owners',interfaceRecovery:'Recovery',productionLink:'Production interface',rf:'RF/mobile',automation:'Equipment',equipmentOwner:'Equipment owner',fallback:'Fallback',jurisdiction:'Jurisdiction',obligations:'Obligations',obligationNotes:'Reported obligations',owners:'Depositors',clientNeeds:'Client rules',sites:'Sites',replication:'Process reuse'};
  const dimensions=r.complexityDimensions.map(d=>({title:clean(d.title),factors:d.factors.map(f=>(dimensionLabels[f.answerKey]||label(f.answerKey))+': '+value(f.answerKey)),unknowns:d.uncertainty.filter(x=>x.reason!=='Not selected by this path; relevance not established').map(x=>(dimensionLabels[x.answerKey]||label(x.answerKey))+': '+(x.reason==='Unknown answer'?'not specified':'not asked in this short assessment'))}));
  const readinessLabels={masterData:'Master data',requirements:'Requirements',owner:'Project owner',budget:'Budget basis',stakeholders:'Operations and IT',integrationOwner:'Interface owners',uat:'Acceptance tests',horizon:'Target window'};
  const readiness=[...r.implementationReadiness.keys,'horizon'].map(k=>[readinessLabels[k]||label(k),value(k)]);
  const required=new Set(['tracking','units','integrations','clientNeeds','qc','productionFlows','productionLink','returns','replenishment','productVariants','segregation']);
  const requirements=r.confirmedCharacteristics.filter(x=>required.has(x.supportingAnswers[0].answerKey)).map(x=>clean(x.title));
  const hypotheses=r.derivedHypotheses.map(x=>({title:clean(x.title),basis:sources(x)}));
  const scenarioAction=unique(r.candidateEvaluationScenarios.map(x=>clean(x.action)));
  const scenarios=r.candidateEvaluationScenarios.map(x=>({title:clean(x.title),why:clean(x.explanation),action:scenarioAction.length>1?clean(x.action):null}));
  const appendix=engine.plan(r.answers).active.map(q=>({title:clean(q.title),answers:engine.visibleFields(q,r.answers).filter(f=>f.key!=='primaryIndustry').map(f=>[clean(f.label),f.key==='industries'?r.selectedTaxonomy.industries.filter(v=>v!=='unknown').map(v=>taxonomyLabel(engine.industries,v)+(v===r.selectedTaxonomy.primaryIndustry?' (primary)':'')).join(', ')||'Not specified':value(f.key)])})).filter(q=>q.answers.length);
  return {profile,primary,models,first,remaining,dimensions,readiness,requirements,hypotheses,scenarios,scenarioAction:scenarioAction.length===1?scenarioAction[0]:null,appendix,readinessLevel:clean(r.implementationReadiness.level),disclaimer:clean(r.disclaimer),generatedAt:clean(r.generatedAt),allRecommendationRuleIds:tasks.flatMap(t=>t.ruleIds)};
 }
 function createCustomerPdf(report,engine){
  const doc=customerDocument(report,engine),pages=[];let page=[],y=0,area='';
  const ink='0.08 0.16 0.17',muted='0.30 0.37 0.38',accent='0 0.43 0.39',light='0.94 0.97 0.96',line='0.80 0.85 0.83';
  const left=48,total=499,bottom=61;
  const draw=(s,size,x,yy,font='F1',color=ink)=>page.push(color+' rg BT /'+font+' '+size+' Tf 1 0 0 1 '+x+' '+yy+' Tm ('+escape(s)+') Tj ET');
  const rect=(x,yy,w,h,color)=>page.push(color+' rg '+x+' '+yy+' '+w+' '+h+' re f');
  const lines=(s,size,max,font='F1')=>wrap(s,size,max/(font==='F2'?1.07:1));
  function newPage(name=area){if(page.length)pages.push(page);area=name;page=[];rect(left,796,23,5,accent);draw('QUARK',13,81,791,'F2');draw('WMS PROJECT PREPARATION',8,357,794,'F2',muted);rect(left,776,total,0.7,line);y=754;}
  function need(height){if(y-height<bottom)newPage();}
  function paragraph(s,size=10.5,color=ink,font='F1',gap=7){if(!s)return;const text=lines(s,size,total,font),step=size+4;for(const t of text){need(step);draw(t,size,left,y,font,color);y-=step;}y-=gap;}
  function heading(s){need(120);y-=6;paragraph(s,13,accent,'F2',9);}
  function title(s,subtitle){paragraph(s,23,ink,'F2',7);if(subtitle)paragraph(subtitle,9.5,muted,'F1',12);}
  function table(headers,rows,{widths=[137,362],size=9.5,gap=11,maxLines=null,padding=14}={}){
   if(!rows.length)return;const step=size+3.5,pad=8;
   function header(){need(60);rect(left,y-22,total,24,ink);let x=left;headers.forEach((s,i)=>{draw(s,8.7,x+pad,y-14,'F2','1 1 1');x+=widths[i];});y-=24;}
   header();
   rows.forEach((row,index)=>{const columns=row.map((s,i)=>lines(s,size,widths[i]-pad*2));let start=0,length=Math.max(...columns.map(c=>c.length),1);
    if(maxLines&&length>maxLines)throw Error('Customer PDF summary exceeds its reserved space.');
    while(start<length){let capacity=Math.floor((y-bottom-padding)/step);if(capacity<1){newPage();header();capacity=Math.floor((y-bottom-padding)/step);}const remaining=length-start;
     if(start===0&&remaining>capacity&&remaining<35){newPage();header();capacity=Math.floor((y-bottom-padding)/step);}
     const count=Math.min(remaining,capacity),height=count*step+padding;rect(left,y-height,total,height,index%2?'0.98 0.99 0.98':light);let x=left;
     columns.forEach((column,i)=>{column.slice(start,start+count).forEach((s,n)=>draw(s,size,x+pad,y-15-n*step));x+=widths[i];});y-=height+1;start+=count;if(start<length){newPage();header();}
    }
   });y-=gap;
  }
  function action(item,number,compact=false){
   const name=item.titles.join('; '),reason=item.why.join(' '),body=[item.action,...(reason?['Why: '+reason]:[])];
   const size=compact?10:10.5,step=size+4,wrapped=body.flatMap((s,i)=>lines(s,i===0?size:9.5,total-24)),titleLines=lines(number+'. '+name,11,total-24,'F2');
   const estimated=titleLines.length*15+wrapped.length*step+25;
   if(estimated<610)need(estimated);rect(left,y-3,4,13,accent);
   for(const s of titleLines){need(18);draw(s,11,left+12,y,'F2');y-=15;}y-=5;
   paragraph(item.action,size);if(reason)paragraph('Why: '+reason,9.5,muted);y-=5;
  }
  newPage('Executive summary');title('WMS Project Preparation Brief','Prepared '+report.generatedAt.slice(0,10)+' | Your warehouse project at a glance');
  paragraph('Executive summary',13,accent,'F2');
  paragraph('Preparation status: '+doc.readinessLevel+'. This describes preparation for supplier evaluation, not readiness to go live.',10.5);
  table(['Business profile','Your stated position'],doc.profile,{size:9.5,gap:11});
  heading('Your top 3 actions');
  doc.first.forEach((x,i)=>action(x,i+1,true));
  if(pages.length)throw Error('Executive summary does not fit page one.');
  paragraph('Preliminary, user-reported discovery. No product compatibility, compliance, cost, ROI or delivery commitment is established.',8.5,muted);
  if(pages.length)throw Error('Executive summary does not fit page one.');
  newPage('Complexity and preparation');title('Complexity and readiness','Operational scope and implementation preparation are assessed independently.');
  heading('Operational complexity factors');
  const short=(chunks,max=3)=>{const chosen=[];for(const chunk of chunks){if(lines([...chosen,chunk].join('; '),9,346).length>max){chosen.push('Further details in the appendix');break;}chosen.push(chunk);}while(lines(chosen.join('; '),9,346).length>max&&chosen.length>1)chosen.splice(chosen.length-2,1);return chosen.join('; ');};
  const notAssessed=[];
  const dimensionRows=doc.dimensions.flatMap(d=>{const data=[...d.factors,...(d.unknowns.length?['Open: '+d.unknowns.join('; ')]:[])];if(!data.length){notAssessed.push(d.title);return [];}return [[d.title,short(data)]];});
  table(['Dimension','Stated factors and open questions'],dimensionRows,{size:9,widths:[137,362],maxLines:3,gap:10,padding:8});
  if(notAssessed.length)paragraph('Not assessed from these answers: '+notAssessed.join(', ')+'. No requirement is inferred.',8.5,muted,'F1',3);
  heading('Implementation readiness: '+doc.readinessLevel);
  table(['Preparation area','Your stated preparation'],doc.readiness,{size:9,widths:[137,362],gap:10,padding:8});
  paragraph('Unknown answers are open questions, not failed checks. Scale, industry and complexity do not lower this readiness result. Full answers follow in the appendix.',8.5,muted);
  if(pages.length!==1)throw Error('Complexity and readiness do not fit page two.');
  if(doc.remaining.length||doc.requirements.length||doc.hypotheses.length||doc.scenarios.length){
   newPage('Preparation and discovery');title('Preparation and discovery','Use the following items to prepare an internal project meeting or supplier discussion.');
   if(doc.remaining.length){heading('Further preparation tasks');paragraph('Complete the three actions on page one, then work through the remaining findings below. Priorities follow your answers; they are not estimates of effort.',9.5,muted);doc.remaining.forEach((x,i)=>{action(x,i+4);if(x.basis.some(Boolean))paragraph('Based on your answers: '+x.basis.filter(Boolean).join('; '),9,muted);});}
   if(doc.requirements.length){heading('Requirements you explicitly reported');paragraph('These are your stated requirements, not independently verified facts or promises of Quark support.',9.5,muted);table(['Requirement','Your answer'],doc.requirements.map(s=>{const split=s.indexOf(': ');return split<0?['Stated requirement',s]:[s.slice(0,split),s.slice(split+2)];}));}
   if(doc.hypotheses.length){heading('Discovery topics to validate');paragraph('Your industry and operating model select these topics. They do not establish applicable regulations, mandatory features or supplier compatibility.',9.5,muted);table(['Topic for discussion','Why it was selected'],doc.hypotheses.map(x=>[x.title,x.basis]));}
   if(doc.scenarios.length){heading('Candidate supplier-evaluation scenarios');paragraph('These are proposals to validate with suppliers, not Quark capabilities or a committed pilot scope.',9.5,muted);if(doc.scenarioAction&&!doc.first.some(x=>x.action===doc.scenarioAction))paragraph(doc.scenarioAction,9.5);table(['Candidate scenario','Reason to evaluate it'],doc.scenarios.map(x=>[x.title,x.why+(x.action?' '+x.action:'')]));}
   paragraph('Keep operational details within your organisation unless sharing is authorised. Contacting Quark is optional and never attaches this report automatically.',9,muted);
  }
  paragraph(doc.disclaimer,9,muted);
  newPage('Answers appendix');title('Appendix: your complete answers','Generated '+doc.generatedAt+' | Taxonomy '+report.taxonomyVersion+' | Rules '+report.rulesVersion+' | JSON schema '+report.assessmentSchemaVersion);
  paragraph('Only questions in your active assessment path are included. Not specified means unknown, not no. Full answer-to-rule traceability remains in the structured JSON export.',9,muted);
  for(const q of doc.appendix){heading(q.title);table(['Question detail','Your answer'],q.answers,{padding:10,gap:7});}
  if(page.length)pages.push(page);
  pages.forEach((p,i)=>{p.push(line+' rg '+left+' 43 '+total+' 0.7 re f');p.push(muted+' rg BT /F1 8 Tf 1 0 0 1 '+left+' 28 Tm (Quark | quark.build | Preliminary discovery) Tj ET');p.push(muted+' rg BT /F1 8 Tf 1 0 0 1 469 28 Tm (Page '+(i+1)+' of '+pages.length+') Tj ET');});
  return serialize(pages,true);
 }
  return {createPdf,createCustomerPdf,customerDocument};
});
