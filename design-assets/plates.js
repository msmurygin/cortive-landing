/* Abstract plates: preview-only. Renders <figure data-plate="slot"> bands in variant A/B/C. */
(()=>{'use strict';
const NS='http://www.w3.org/2000/svg';
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const el=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};
const svg=(w,h)=>{const s=el('svg',{viewBox:`0 0 ${w} ${h}`,preserveAspectRatio:'xMinYMid slice','aria-hidden':'true',focusable:'false'});s.classList.add('pl-svg');return s};
function floor(){seed=11;const W=1440,H=380,s=svg(W,H);
el('rect',{x:24,y:150,width:72,height:80,class:'pl-line'},s);el('text',{x:60,y:250,class:'pl-t','text-anchor':'middle'},s).textContent='DOCK';
el('rect',{x:W-96,y:150,width:72,height:80,class:'pl-line'},s);el('text',{x:W-60,y:250,class:'pl-t','text-anchor':'middle'},s).textContent='STAGING';
const cols=15,x0=150,step=(W-300)/cols,bays=8,by0=56,bh=30,picks=[];
for(let i=0;i<cols;i++){const x=x0+i*step;el('text',{x:x+14,y:40,class:'pl-t','text-anchor':'middle'},s).textContent=String.fromCharCode(65+i)+'-'+String(i+1).padStart(2,'0');
for(let b=0;b<bays;b++){const y=by0+b*(bh+4);const r=el('rect',{x,y,width:28,height:bh,class:rnd()<.16?'pl-fill':'pl-line'},s);if(r.getAttribute('class')==='pl-fill')picks.push([x+28,y+bh/2]);}}
let d=`M96 190 H${x0-step/2+14}`;let up=true;
for(let i=0;i<cols;i++){const ax=x0+i*step+28+(step-28)/2;d+=` H${ax} V${up?by0-8:by0+bays*(bh+4)+4}`;up=!up}
d+=` H${W-96}`;el('path',{d,class:'pl-route'},s);
picks.slice(0,9).forEach(([x,y])=>el('rect',{x:x+(step-28)/2-5,y:y-5,width:10,height:10,class:'pl-node'},s));
el('text',{x:24,y:H-18,class:'pl-t'},s).textContent='FIG. A · FLOOR TOPOLOGY · ABSTRACT';
el('text',{x:W-24,y:H-18,class:'pl-t','text-anchor':'end'},s).textContent='NOT TO SCALE';
return s}
function rails(){seed=29;const W=1440,H=380,s=svg(W,H),labels=['RECEIVE','PUTAWAY','STOCK','ALLOCATE','PICK','PACK','SHIP'],gap=(H-90)/(labels.length-1);
const defs=el('defs',{},s),cp=el('clipPath',{id:'pl-clip'},defs);el('rect',{x:170,y:0,width:W-194,height:H},cp);const track=el('g',{'clip-path':'url(#pl-clip)'},s);
labels.forEach((l,i)=>{const y=40+i*gap;el('text',{x:24,y:y+5,class:'pl-t'},s).textContent=String(i+1).padStart(2,'0')+' '+l;
el('line',{x1:170,x2:W-24,y1:y,y2:y,class:'pl-faint'},s);
const g=el('g',{class:'pl-move',style:`--d:${28+i*5}s`},track);
for(let k=0;k<2;k++){let x=150+k*(W-174);while(x<150+(k+1)*(W-174)){const len=40+rnd()*220;el('line',{x1:x,x2:x+len,y1:y,y2:y,class:'pl-line'},g);x+=len;const n=el('rect',{x:x-5,y:y-5,width:10,height:10,class:rnd()<.35?'pl-node':'pl-box'},g);x+=30+rnd()*120}}});
el('line',{x1:W*.62,x2:W*.62,y1:16,y2:H-36,class:'pl-now'},s);el('text',{x:W*.62+8,y:24,class:'pl-t'},s).textContent='NOW';
el('text',{x:24,y:H-12,class:'pl-t'},s).textContent='FIG. B · CONNECTED OPERATIONS · ABSTRACT';return s}
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('figure[data-variant]').forEach(f=>{const v=f.dataset.variant;f.classList.add('q-band','is-'+v);if(v==='c'){f.innerHTML='<div class="q-wrap pl-type"><span class="pl-k">'+(f.dataset.k||'')+'</span><p>'+f.dataset.a+' <em>'+f.dataset.b+'</em></p><span class="pl-k pl-k-r">QUARK / WMS</span></div>';return}f.appendChild(v==='a'?floor():rails())})})})();
