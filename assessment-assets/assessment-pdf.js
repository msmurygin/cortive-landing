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
  return {createPdf};
});
