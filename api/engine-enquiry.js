const {prepare,readBody}=require('../lib/lead-events');
const {createHash}=require('node:crypto');
const types=new Set(['E-commerce','Distribution','3PL','Manufacturing']);
const operations=new Set(['receiving','putaway','receiving_and_putaway','picking','counting','replenishment','packing','loading']);
const recent=new Map();
const clean=(value,max)=>typeof value==='string'&&value.trim().length<=max?value.trim():null;
module.exports=async function handler(req,res){
 if(!prepare(req,res))return;
 if(process.env.VERCEL_ENV==='production'&&process.env.ENGINE_AI_PUBLIC_ENABLED!=='true')return res.status(503).json({error:'Setup enquiries are not available here yet.'});
 let b;try{b=readBody(req)}catch{return res.status(400).json({error:'Check the enquiry.'})}
 if(b.website)return res.status(400).json({error:'Check the enquiry.'});
 const email=clean(b.email,254),company=clean(b.company,160),w=b.warehouse,p=b.process;
 if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!company||b.consent!=='yes'||!w||!types.has(w.type)||!p||!operations.has(p.operation))return res.status(400).json({error:'Check your email, company and agreement to send this setup.'});
 for(const [k,min,max] of [['aisles',1,12],['bays',1,20],['levels',1,8]])if(!Number.isInteger(w[k])||w[k]<min||w[k]>max)return res.status(400).json({error:'Check the warehouse parameters.'});
 const product=clean(p.product||'Sample product',80),pack=clean(p.pack_label||'Each',40);
 if(product===null||pack===null||![p.pack_units,p.pack_quantity].every(n=>Number.isInteger(n)&&n>0&&n<=1000)||typeof p.serialized!=='boolean')return res.status(400).json({error:'Check the product and packaging.'});
 const now=Date.now();for(const [k,v] of recent)if(now-v.time>600000)recent.delete(k);
 const id=createHash('sha256').update(String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0]).digest('hex');
 const entry=recent.get(id)||{time:now,count:0};if(entry.count>=3||recent.size>1000)return res.status(429).json({error:'Please wait a few minutes before sending another setup.'});entry.count++;recent.set(id,entry);
 const payload={email,company,_subject:(process.env.VERCEL_ENV==='production'?'':'[Preview test] ')+'Quark AI setup enquiry',consent:'Contact me about the attached demo setup',warehouse_type:w.type,layout:`${w.aisles} aisles × ${w.bays} bays × ${w.levels} levels`,workflow:p.operation,product,packaging:`${p.pack_quantity} ${pack} × ${p.pack_units} units = ${p.pack_quantity*p.pack_units} base units`,tracking:p.serialized?'Serial-controlled':'No serial capture requested',source:'https://quark.build/#engine-demo'};
 try{
  const response=await fetch('https://formspree.io/f/mqevozlb',{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(10000)});
  if(!response.ok)throw new Error('provider');return res.status(200).json({ok:true});
 }catch{return res.status(502).json({error:'Could not send this setup. Please retry or email hello@quark.build.'})}
};
