(()=>{'use strict';
const root=document.documentElement,KEY='quark-theme';
const qp=new URLSearchParams(location.search);try{const s=qp.get('theme')||localStorage.getItem(KEY);if(s)root.dataset.theme=s}catch(e){}
document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('[data-q-theme]').forEach(b=>{const sync=()=>b.setAttribute('aria-pressed',root.dataset.theme==='dark');sync();b.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(KEY,root.dataset.theme)}catch(e){}document.querySelectorAll('[data-q-theme]').forEach(x=>x.setAttribute('aria-pressed',root.dataset.theme==='dark'))})});
const hdr=document.querySelector('.q-hdr'),burger=hdr&&hdr.querySelector('.q-burger');
if(burger){
const menu=hdr.querySelector('.q-mnav'),mobile=matchMedia('(max-width:900px)');
let savedBody=null,scrollY=0,background=[];
const focusable=()=>[...hdr.querySelectorAll('a[href],button')].filter(el=>!el.disabled&&!el.closest('[inert]')&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
const set=(open,returnFocus=true)=>{
 if(open===hdr.hasAttribute('data-open'))return;
 if(open){
  if(!mobile.matches)return;
  scrollY=window.scrollY;
  savedBody=document.body.getAttribute('style');
  const gap=Math.max(0,innerWidth-document.documentElement.clientWidth);
  const padding=parseFloat(getComputedStyle(document.body).paddingRight)||0;
  Object.assign(document.body.style,{position:'fixed',top:-scrollY+'px',width:'100%',overflow:'hidden',paddingRight:(padding+gap)+'px'});
  background=[...document.body.children].filter(el=>el!==hdr&&!['SCRIPT','STYLE','SVG','LINK'].includes(el.tagName)).map(el=>[el,el.inert]);
  background.forEach(([el])=>el.inert=true);
  menu.inert=false;hdr.setAttribute('data-open','');burger.setAttribute('aria-expanded','true');burger.querySelector('span').textContent='Close';
  menu.querySelector('a').focus({preventScroll:true});
 }else{
  hdr.removeAttribute('data-open');burger.setAttribute('aria-expanded','false');burger.querySelector('span').textContent='Menu';menu.inert=true;
  background.forEach(([el,inert])=>el.inert=inert);background=[];
  if(savedBody===null)document.body.removeAttribute('style');else document.body.setAttribute('style',savedBody);
  window.scrollTo({top:scrollY,left:0,behavior:'instant'});
  if(returnFocus)burger.focus({preventScroll:true});
 }
};
menu.inert=true;
burger.addEventListener('click',()=>set(!hdr.hasAttribute('data-open')));
document.addEventListener('keydown',e=>{
 if(!hdr.hasAttribute('data-open'))return;
 if(e.key==='Escape'){e.preventDefault();set(false);}
 if(e.key==='Tab'){const all=focusable(),first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
hdr.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{if(!e.defaultPrevented)set(false,false);}));
mobile.addEventListener('change',()=>{if(!mobile.matches&&hdr.hasAttribute('data-open'))set(false,false);});
if(qp.get('menu')==='open')set(true);
}
document.querySelectorAll('.q-nav details').forEach(d=>{
document.addEventListener('click',e=>{if(!d.contains(e.target))d.open=false});
d.addEventListener('keydown',e=>{if(e.key==='Escape'&&d.open){d.open=false;d.querySelector('summary').focus()}})});
const spy=document.querySelectorAll('[data-q-spy] a[href^="#"]');
if(spy.length&&'IntersectionObserver'in window){const map=new Map();spy.forEach(a=>{const t=document.getElementById(a.hash.slice(1));if(t)map.set(t,a)});
const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){spy.forEach(x=>x.classList.remove('is-on'));const a=map.get(en.target);a.classList.add('is-on');const ol=a.closest('ol');if(ol&&ol.scrollWidth>ol.clientWidth)ol.scrollTo({left:a.offsetLeft-24,behavior:'smooth'})}})},{rootMargin:'-35% 0px -60% 0px'});map.forEach((a,t)=>io.observe(t))}
document.querySelectorAll('form[data-preview]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const s=f.querySelector('[role="status"]');if(s)s.textContent='Preview only — submission is disabled in this proposal.'}));
})})();
