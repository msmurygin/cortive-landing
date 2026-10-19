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
  const pages=[];let page=[],y=0;
  function text(value,size,x,yy,font='F1'){page.push('BT /'+font+' '+size+' Tf 1 0 0 1 '+x+' '+yy+' Tm ('+escape(value)+') Tj ET');}
  function newPage(){if(page.length)pages.push(page);page=[];y=790;text('Quark | quark.build',10,48,y,'F2');y-=30;text('WMS Project Preparation Report',19,48,y,'F2');y-=23;text('Generated '+report.generatedAt,9,48,y);y-=28;}
  function block(value,size=10,font='F1',indent=0){const lines=wrap(value,size,499-indent),height=lines.length*(size+4)+8;if(y-height<54&&height<650)newPage();for(const line of lines){if(y<54)newPage();text(line,size,48+indent,y,font);y-=size+4;}y-=8;}
  newPage();block('Preliminary planning only. No go-live certification, product compatibility, cost, ROI or implementation timeline is established.');
  for(const section of sections){if(y<125)newPage();block(section.title,13,'F2');for(const item of section.items)block('- '+item,10,'F1',8);y-=5;}
  if(page.length)pages.push(page);
  const objects=[];objects[1]='<< /Type /Catalog /Pages 2 0 R >>';objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>';objects[4]='<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>';
  const kids=[];pages.forEach((lines,i)=>{const id=5+i*2,streamId=id+1;kids.push(id+' 0 R');const footer='BT /F1 9 Tf 1 0 0 1 48 28 Tm (Quark - Preliminary assessment | Page '+(i+1)+' of '+pages.length+') Tj ET',content=lines.concat(footer).join('\n')+'\n';objects[id]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents '+streamId+' 0 R >>';objects[streamId]='<< /Length '+content.length+' >>\nstream\n'+content+'endstream';});
  objects[2]='<< /Type /Pages /Count '+pages.length+' /Kids ['+kids.join(' ')+'] >>';
  let pdf='%PDF-1.4\n%Quark local-only assessment\n';const offsets=[0];for(let i=1;i<objects.length;i++){offsets[i]=pdf.length;pdf+=i+' 0 obj\n'+objects[i]+'\nendobj\n';}const xref=pdf.length;pdf+='xref\n0 '+objects.length+'\n0000000000 65535 f \n';for(let i=1;i<objects.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+='trailer\n<< /Size '+objects.length+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';return new TextEncoder().encode(pdf);
 }
 return {createPdf};
});
