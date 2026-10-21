/* No third-party script, thumbnail, preconnect or player before the visitor requests it. */
(()=>{'use strict';
 document.querySelectorAll('[data-youtube-id]').forEach(container=>{
  const id=container.dataset.youtubeId,button=container.querySelector('button');
  if(!/^[\w-]{11}$/.test(id)||!button)return;
  button.hidden=false;
  button.addEventListener('click',()=>{
   const frame=document.createElement('iframe');
   frame.title=container.dataset.title;
   frame.src='https://www.youtube-nocookie.com/embed/'+id+'?rel=0&cc_load_policy=1';
   frame.allow='encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;
   frame.referrerPolicy='strict-origin-when-cross-origin';frame.tabIndex=0;
   container.replaceChildren(frame);frame.focus();
  },{once:true});
 });
})();
