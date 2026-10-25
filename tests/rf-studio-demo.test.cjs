const {test}=require('node:test');
const a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
test('approved RF Studio video remains local, accessible, captioned and explicitly started',()=>{
 const h=read('product.html'),f=h.match(/<figure class="q-context-demo" id="demo-rf-screen-designer">[\s\S]*?<\/figure>/)?.[0];
 a.ok(f);a.equal(h.split('id="demo-rf-screen-designer"').length-1,1);
 a.ok(h.indexOf(f)>h.indexOf('id="platform"')&&h.indexOf(f)<h.indexOf('</section>',h.indexOf('id="platform"')));
 a.match(f,/<video controls playsinline preload="none" width="1920" height="1204"/);
 a.match(f,/aria-describedby="rf-screen-designer-caption"/);a.match(f,/<track kind="captions"[^>]+srclang="en"[^>]+default>/);
 a.doesNotMatch(f,/autoplay|<iframe|youtube-nocookie/);
 const mp4=fs.readFileSync(path.join(root,'assets/product-context/rf-screen-designer-Michael.mp4'));
 a.equal(crypto.createHash('sha256').update(mp4).digest('hex'),'8711384395a43607ae71e221b77629b9179155fac6a917f9a17a89ce14516b64');
 a.equal(mp4.length,6256838);a.ok(mp4.indexOf(Buffer.from('moov'))<mp4.indexOf(Buffer.from('mdat')));
 for(const m of f.matchAll(/(?:src|poster|href)="(\/assets\/[^"#]+)"/g))a.ok(fs.existsSync(path.join(root,m[1])),m[1]);
 const vtt=read('assets/product-context/rf-screen-designer.en.vtt'),transcript=read('assets/product-context/rf-screen-designer-transcript.txt');
 const cues=[...vtt.matchAll(/(\d\d):(\d\d):(\d\d\.\d{3}) --> (\d\d):(\d\d):(\d\d\.\d{3})\n([\s\S]*?)(?=\n\n|$)/g)];a.equal(cues.length,14);let previous=0;
 for(const c of cues){const s=+c[1]*3600+ +c[2]*60+ +c[3],e=+c[4]*3600+ +c[5]*60+ +c[6];a.ok(s>=previous&&e>s&&e<=205);previous=e;a.ok(transcript.replace(/\s+/g,' ').includes(c[7].replace(/\s+/g,' ')));}
 const schemas=[...h.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1]));
 const schema=schemas.find(s=>s.contentUrl==='https://quark.build/assets/product-context/rf-screen-designer-Michael.mp4');
 a.equal(schema['@type'],'VideoObject');a.equal(schema.duration,'PT3M25S');a.equal(schema.uploadDate,'2026-10-25');a.equal(schema.inLanguage,'en');a.equal(schema.sameAs,'https://www.youtube.com/watch?v=JkyFtcPkfJE');
});
