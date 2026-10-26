/* Small, local illustrative interactions. No warehouse connection, storage, forms or telemetry. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();
  else {const api=factory();api.init(root.document);}
})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const map=['111111111','111111000','001111101','111111111','111100000','111111111','111111011','110000011','111111111','111101111','000000111','111111111','111111100'];
  const holds={'2-6':'QC inspection pending','4-2':'Carton damage reported','6-5':'Expiry review pending','9-3':'Owner requested a dispatch hold'};
  const products=['DEMO-10482 / Olive oil 1L','DEMO-20117 / Coffee beans 1kg','DEMO-33090 / Paper towels','DEMO-41203 / Dish tabs','DEMO-50876 / Basmati rice','DEMO-61544 / Tomato passata'];
  const fields=['Location','Status','Quantity','Lot / expiry','Task / process','Order'];
  const steps=[
    {title:'Receive',heading:'Goods arrive against the expected receipt.',text:'The receiving clerk identifies the inbound line, confirms 48 cases and records their lot. The received stock is recorded at the dock.',roles:['RF terminal','Receiving clerk'],values:['DOCK-02','Received','48 cases','LOT-DEMO-01 / 05/2027','Receiving complete','No order assigned'],changed:[0,1,2,3],link:'#demo-receiving',linkLabel:'Watch receiving in Quark'},
    {title:'Put away',heading:'Confirm the destination and move stock into storage.',text:'The putaway workflow identifies a destination. The operator confirms the location and movement, placing the 48 cases at A-07-05.',roles:['RF terminal','Putaway operator'],values:['A-07-05','Available','48 cases','LOT-DEMO-01 / 05/2027','Putaway complete','No order assigned'],changed:[0,1,4],link:'#demo-putaway',linkLabel:'Watch putaway in Quark'},
    {title:'Hold',heading:'Block stock while keeping its quantity visible.',text:'A hold records a pending quality check and its reason. The 48 cases remain visible at the location, with the hold affecting their availability for allocation.',roles:['Web workspace','Inventory supervisor'],values:['A-07-05','Hold / quality check','48 cases','LOT-DEMO-01 / 05/2027','Quality check pending','No order assigned'],changed:[1,4],link:'#inventory',linkLabel:'Explore inventory control'},
    {title:'Allocate & pick',heading:'Release the hold, reserve stock and confirm the pick.',text:'After the quality check, the hold is released. Order SO-DEMO-01 reserves 12 cases. The picker confirms the pick, leaving 36 cases in storage and 12 picked for the order.',roles:['Web workspace','RF terminal','Picker'],values:['A-07-05 / picked stock','Hold released; 12 cases picked','36 stored + 12 picked','LOT-DEMO-01 / 05/2027','Picking complete','SO-DEMO-01'],changed:[0,1,2,4,5],link:'#outbound-in-action',linkLabel:'See outbound workflow examples'},
    {title:'Pack & ship',heading:'Confirm shipment of the picked cases.',text:'The picked cases pass through packing and loading. Goods issue records the shipment of those 12 cases; the remaining 36 stay available at A-07-05.',roles:['Packing station','Dispatch'],values:['A-07-05','Available','36 cases','LOT-DEMO-01 / 05/2027','Goods issue complete','SO-DEMO-01 / issued'],changed:[0,1,2,4,5],link:'#outbound-in-action',linkLabel:'See dispatch and goods issue'}
  ];
  // Editorial associations from the supplied concept, not assertions of installed interfaces.
  const particles=[
    {id:'quark',symbol:'Q',name:'Quark',status:'built',related:[]},
    {id:'neutrino',symbol:'ν',name:'Neutrino',status:'built',related:['quark']},
    {id:'fermion',symbol:'ƒ',name:'Fermion',status:'built',related:['quark']},
    {id:'phonon',symbol:'φ',name:'Phonon',status:'separate',related:['quark','axion']},
    {id:'gluon',symbol:'g',name:'Gluon',status:'roadmap',related:['quark','boson','meson']},
    {id:'boson',symbol:'B',name:'Boson',status:'roadmap',related:['quark','gluon']},
    {id:'lepton',symbol:'ℓ',name:'Lepton',status:'roadmap',related:['quark']},
    {id:'hadron',symbol:'H',name:'Hadron',status:'roadmap',related:['quark','higgs']},
    {id:'axion',symbol:'α',name:'Axion',status:'future',related:['phonon']},
    {id:'photon',symbol:'γ',name:'Photon',status:'future',related:['higgs','quark']},
    {id:'higgs',symbol:'h',name:'Higgs',status:'future',related:['quark','photon','hadron']},
    {id:'meson',symbol:'π',name:'Meson',status:'future',related:['gluon']}
  ];
  const groups=[['built','Built'],['separate','Separate product'],['roadmap','Roadmap'],['future','Future']];
  function cell(index){
    if(!Number.isInteger(index)||index<0||index>=117)throw Error('Invalid sample location.');
    const row=Math.floor(index/9),column=index%9,location='A-'+String(13-row).padStart(2,'0')+'-'+String(column+1).padStart(2,'0');
    if(map[row][column]==='0')return {location,state:'empty',status:'Empty',sku:'No stock',lot:'Not applicable',quantity:'0 cases',owner:'Not applicable',reason:'This sample location has no stock.'};
    const seed=index*7,hold=holds[row+'-'+column];
    return {location,state:hold?'hold':'available',status:hold?'On hold':'Available',sku:products[seed%products.length],lot:'LOT-DEMO-'+String(seed%97).padStart(2,'0')+' / '+['03','04','05','06'][seed%4]+'/2027',quantity:(24+seed%48)+' cases',owner:'Sample owner '+(1+seed%3),reason:hold?hold+'. The hold is visible alongside the stock balance.':'This example shows stock available for allocation.'};
  }
  function gridMove(index,key){
    if(!Number.isInteger(index)||index<0||index>116)throw Error('Invalid grid position.');
    const row=Math.floor(index/9),col=index%9;
    return ({ArrowLeft:row*9+Math.max(0,col-1),ArrowRight:row*9+Math.min(8,col+1),ArrowUp:row===0?index:index-9,ArrowDown:row===12?index:index+9,Home:row*9,End:row*9+8})[key]??index;
  }
  function related(id){
    const p=particles.find(x=>x.id===id);if(!p)throw Error('Unknown particle.');
    return particles.filter(x=>p.related.includes(x.id)||x.related.includes(id)).map(x=>x.id);
  }
  function init(doc){
    if(!doc)return;
    const root=doc.querySelector('[data-live-inventory]');
    if(root){
      const buttons=[...root.querySelectorAll('[data-location-index]')],picker=root.querySelector('[data-location-picker]'),announcement=root.querySelector('[data-inventory-announcement]');let active=24;
      const display=(index,announce=false)=>{
        const r=cell(index);active=index;
        buttons.forEach((b,i)=>{b.tabIndex=i===index?0:-1;b.classList.toggle('is-on',i===index);b.setAttribute('aria-pressed',String(i===index));});
        for(const key of ['location','status','sku','lot','quantity','owner','reason'])root.querySelector('[data-stock-field="'+key+'"]').textContent=r[key];
        root.querySelector('[data-stock-field="status"]').dataset.state=r.state;
        picker.value=String(index);
        if(announce)announcement.textContent=r.location+'. '+r.status+'. '+r.quantity+'. '+r.reason;
      };
      buttons.forEach((b,index)=>{
        b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&doc.defaultView.matchMedia('(min-width:621px)').matches)display(index);});
        b.addEventListener('focus',()=>display(index));b.addEventListener('click',()=>display(index,true));
        b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const next=gridMove(index,e.key);display(next,true);buttons[next].focus();});
      });
      picker.addEventListener('change',()=>display(Number(picker.value),true));
      display(active);root.classList.add('is-ready');
    }
    const pallet=doc.querySelector('[data-pallet-flow]');
    if(pallet){
      const tabs=[...pallet.querySelectorAll('[data-pallet-step]')],panels=[...pallet.querySelectorAll('[data-pallet-panel]')],previous=pallet.querySelector('[data-pallet-prev]'),next=pallet.querySelector('[data-pallet-next]'),status=pallet.querySelector('[data-pallet-announcement]');let active=0;
      const select=(index,announce=false)=>{
        if(!Number.isInteger(index)||index<0||index>=tabs.length)return;active=index;
        tabs.forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});
        previous.disabled=index===0;next.disabled=index===tabs.length-1;
        if(announce)status.textContent='Step '+(index+1)+' of '+steps.length+': '+steps[index].title+'. '+steps[index].heading;
      };
      tabs.forEach((b,i)=>{
        b.addEventListener('click',()=>select(i,true));
        b.addEventListener('keydown',e=>{const k=e.key;if(!['ArrowLeft','ArrowRight','Home','End'].includes(k))return;e.preventDefault();const index=k==='Home'?0:k==='End'?tabs.length-1:(i+(k==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(index);tabs[index].focus();});
      });
      previous.addEventListener('click',()=>select(active-1,true));next.addEventListener('click',()=>select(active+1,true));
      select(0);pallet.classList.add('is-ready');
    }
    const model=doc.querySelector('[data-particle-model]');
    if(model){
      // Keep the name note attached to the particle table, independently of the detail height.
      // The static HTML leaves it after all descriptions for a meaningful no-script fallback.
      const note=model.nextElementSibling,left=model.querySelector('.q-model-left');
      if(left&&note&&note.matches('aside.q-notice'))left.append(note);
      const buttons=[...model.querySelectorAll('[data-particle]')],panels=[...model.querySelectorAll('[data-particle-panel]')],ann=model.querySelector('[data-particle-announcement]'),labels=Object.fromEntries(groups);
      const show=(id,announce=false)=>{
        const selected=particles.find(p=>p.id===id);if(!selected)return;const peers=related(id);
        buttons.forEach(b=>{const chosen=b.dataset.particle===id;b.classList.toggle('is-on',chosen);b.classList.toggle('is-related',peers.includes(b.dataset.particle));b.setAttribute('aria-pressed',String(chosen));});
        panels.forEach(p=>{p.hidden=p.dataset.particlePanel!==id;});
        if(announce)ann.textContent=selected.name+'. '+labels[selected.status]+'. Related ideas: '+peers.map(k=>particles.find(p=>p.id===k).name).join(', ')+'.';
      };
      buttons.forEach((b,i)=>{
        b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&doc.defaultView.matchMedia('(min-width:1001px)').matches)show(b.dataset.particle);});b.addEventListener('focus',()=>show(b.dataset.particle));b.addEventListener('click',()=>{show(b.dataset.particle,true);if(doc.defaultView.matchMedia('(max-width:1000px)').matches)model.querySelector('.q-particles').scrollIntoView({block:'start',behavior:doc.defaultView.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});});
        b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const index=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+buttons.length)%buttons.length;buttons[index].focus();});
      });
      const fromHash=()=>{const p=panels.find(p=>'#'+p.id===doc.location.hash);if(p)show(p.dataset.particlePanel);};
      doc.defaultView.addEventListener('hashchange',fromHash);show('quark');fromHash();model.classList.add('is-ready');
    }
  }
  return {cell,gridMove,fields,steps,particles,groups,related,init};
});
