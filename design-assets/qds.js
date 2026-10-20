(()=>{'use strict';
const root=document.documentElement,KEY='quark-theme';
const qp=new URLSearchParams(location.search);try{const s=qp.get('theme')||localStorage.getItem(KEY);if(s)root.dataset.theme=s}catch(e){}
document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('[data-q-theme]').forEach(b=>{const sync=()=>b.setAttribute('aria-pressed',root.dataset.theme==='dark');sync();b.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(KEY,root.dataset.theme)}catch(e){}document.querySelectorAll('[data-q-theme]').forEach(x=>x.setAttribute('aria-pressed',root.dataset.theme==='dark'))})});
const hdr=document.querySelector('.q-hdr'),burger=hdr&&hdr.querySelector('.q-burger');
if(burger){const set=o=>{o?hdr.setAttribute('data-open',''):hdr.removeAttribute('data-open');burger.setAttribute('aria-expanded',o);burger.querySelector('span').textContent=o?'Close':'Menu';document.body.style.overflow=o?'hidden':''};
burger.addEventListener('click',()=>set(!hdr.hasAttribute('data-open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&hdr.hasAttribute('data-open')){set(false);burger.focus()}});
hdr.querySelectorAll('.q-mnav a').forEach(a=>a.addEventListener('click',()=>set(false)));if(qp.get('menu')==='open')set(true)}
document.querySelectorAll('.q-nav details').forEach(d=>{
document.addEventListener('click',e=>{if(!d.contains(e.target))d.open=false});
d.addEventListener('keydown',e=>{if(e.key==='Escape'&&d.open){d.open=false;d.querySelector('summary').focus()}})});
const spy=document.querySelectorAll('[data-q-spy] a[href^="#"]');
if(spy.length&&'IntersectionObserver'in window){const map=new Map();spy.forEach(a=>{const t=document.getElementById(a.hash.slice(1));if(t)map.set(t,a)});
const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){spy.forEach(x=>x.classList.remove('is-on'));const a=map.get(en.target);a.classList.add('is-on');const ol=a.closest('ol');if(ol&&ol.scrollWidth>ol.clientWidth)ol.scrollTo({left:a.offsetLeft-24,behavior:'smooth'})}})},{rootMargin:'-35% 0px -60% 0px'});map.forEach((a,t)=>io.observe(t))}
document.querySelectorAll('form[data-preview]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const s=f.querySelector('[role="status"]');if(s)s.textContent='Preview only — submission is disabled in this proposal.'}));
})})();
