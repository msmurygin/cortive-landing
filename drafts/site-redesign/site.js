/* Private proposal: navigation only. No simulator, collection, persistence or analytics. */
(()=>{'use strict';
 for(const menu of document.querySelectorAll('.ux-mobile,.ux-resources')){
 menu.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
 menu.addEventListener('click',event=>{if(event.target.closest('a'))menu.open=false;});
 }
 document.getElementById('uxTheme')?.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';});
})();
