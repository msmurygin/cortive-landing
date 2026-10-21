/* Separate publication gate. No fetch, API key, generated footage or guessed media metadata. */
const fs = require('node:fs'), path = require('node:path');
const placements = {receiving:'inbound',putaway:'inbound','inventory-counting':'inventory',replenishment:'execution'};
const escape = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function validate(demo, root) {
  if (!Object.hasOwn(placements,demo.key) || placements[demo.key] !== demo.section) throw Error('Incorrect operational placement');
  if (!demo.publicationApproved) return false;
  if (!demo.metadataVerified || !/^[\w-]{11}$/.test(demo.youtubeId || '')) throw Error('Verified YouTube ID required');
  if (!demo.captionsConfirmed && !demo.accessibleDescription) throw Error('Captions or a verified text description required before publication');
  for (const local of [demo.poster, demo.transcript].filter(Boolean)) {
    if (!/^\/assets\/demos\/[a-zA-Z0-9_./-]+$/.test(local) || local.includes('..') || !fs.existsSync(path.join(root, local))) throw Error('Approved local media asset required');
  }
  if (!demo.poster || !demo.width || !demo.height || !Number.isInteger(demo.width) || !Number.isInteger(demo.height) || demo.width<1 || demo.height<1) throw Error('Verified poster and original aspect ratio required');
  if (!demo.stages?.length || !demo.title || !demo.description || !demo.problem) throw Error('Approved recording-specific narrative required');
  if (demo.uploadDate && (!Number.isFinite(Date.parse(demo.uploadDate)) || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:Z|[+-]\d\d:\d\d)$/.test(demo.uploadDate))) throw Error('Verified ISO upload date required');
  if (demo.duration && !/^PT(?=\d)(?:\d+H)?(?:\d+M)?(?:\d+S)?$/.test(demo.duration)) throw Error('Invalid verified duration');
  return true;
}
function render(demo) {
  const watch='https://www.youtube.com/watch?v='+demo.youtubeId;
  const schema=demo.uploadDate?{'@context':'https://schema.org','@type':'VideoObject',name:demo.title,description:demo.description,thumbnailUrl:'https://quark.build'+demo.poster,uploadDate:demo.uploadDate,embedUrl:'https://www.youtube-nocookie.com/embed/'+demo.youtubeId,...(demo.duration?{duration:demo.duration}:{})}:null;
  return `<figure class="q-demo" id="demo-${demo.key}"><h3>${escape(demo.title)}</h3><p>${escape(demo.problem)}</p><ol class="q-checks">${demo.stages.map(stage=>'<li>'+escape(stage)+'</li>').join('')}</ol><div class="q-demo-player" style="aspect-ratio:${demo.width}/${demo.height}" data-youtube-id="${demo.youtubeId}" data-title="${escape(demo.title)}"><img src="${escape(demo.poster)}" width="${demo.width}" height="${demo.height}" alt="${escape(demo.title)}: recording preview" loading="lazy" decoding="async"><button type="button" hidden>Load video player: ${escape(demo.title)}</button></div><figcaption><p>${escape(demo.description)}</p>${demo.accessibleDescription?'<details><summary>Text description of this demonstration</summary><p>'+escape(demo.accessibleDescription)+'</p></details>':''}<p>Loading the player connects to YouTube. YouTube processes connection data and may use storage when you interact with the player. No player connection is made before you choose to load it.</p><a href="${watch}" rel="noopener noreferrer" target="_blank">Watch on YouTube (opens a new tab)</a> · <a href="/product#${demo.section}">About this warehouse operation</a>${demo.transcript?' · <a href="'+escape(demo.transcript)+'">Read the transcript</a>':''}</figcaption></figure>${schema?'<script type="application/ld+json">'+JSON.stringify(schema).replace(/</g,'\\u003c')+'</script>':''}`;
}
function build(root, demos) {
  const file=path.join(root,'product.html');let html=fs.readFileSync(file,'utf8'),active=0;
  for(const demo of demos){if(!validate(demo,root))continue;const slot=`<div data-product-demo-slot="${demo.key}" hidden></div>`;if(!html.includes(slot))throw Error('Missing/activated demo slot: '+demo.key);html=html.replace(slot,render(demo));active++;}
  if(active){html=html.replace('</head>','<link rel="stylesheet" href="/design-assets/product-demos.css"><script src="/assets/product-demos.js" defer></script></head>');fs.writeFileSync(file,html);}
  return {active,status:active?'REVIEW REQUIRED':'WAITING FOR YOUTUBE URLS'};
}
if(require.main===module)console.log(JSON.stringify(build(path.resolve(__dirname,'..'),require('../content/product-demos.json'))));
module.exports={validate,render,build};
