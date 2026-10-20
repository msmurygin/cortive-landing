const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'review-dist');
fs.mkdirSync(out,{recursive:true});
for(const n of ['index.html','vision.html','screens.html','thanks.html','assets','legal','webrf','robots.txt','sitemap.xml']) fs.cpSync(path.join(root,n),path.join(out,n),{recursive:true});
for(const [route,source] of [['wms-cost','drafts/wms-cost.html'],['features/inventory-management','drafts/features/inventory-management.html']]){const dest=path.join(out,route,'index.html');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,source),dest);}
fs.cpSync(path.join(root,'drafts/assets'),path.join(out,'draft-assets'),{recursive:true});
fs.copyFileSync(path.join(root,'drafts/legal/privacy.html'),path.join(out,'legal/privacy.html'));
console.log('Review HTML artifact built in review-dist. Local only; API handlers require scripts/preview.cjs.');
