/* Isolated packaging only. Never deploys or changes public site routes. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const csp="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'";
function buildReadiness(out=path.join(root,'review-dist/readiness-experiment')){
 fs.mkdirSync(path.join(out,'assessment-assets'),{recursive:true});
 for(const file of ['assessment-model.js','discovery-model.js','assessment-pdf.js','assessment-ui.js','assessment.css'])fs.copyFileSync(path.join(root,'drafts/readiness',file),path.join(out,'assessment-assets',file));
 fs.copyFileSync(path.join(root,'drafts/readiness/index.html'),path.join(out,'index.html'));
 fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
 fs.writeFileSync(path.join(out,'preview-only.cjs'),"if(process.env.VERCEL_ENV!=='preview')throw Error('Unapproved readiness experiment: preview only.');\n");
 const config={trailingSlash:false,buildCommand:'node preview-only.cjs',outputDirectory:'.',framework:null,rewrites:[{source:'/tools/wms-readiness-assessment',destination:'/index.html'}],headers:[{source:'/(.*)',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow, noarchive'},{key:'Cache-Control',value:'no-store'},{key:'Referrer-Policy',value:'no-referrer'},{key:'Content-Security-Policy',value:csp}]}]};
 fs.writeFileSync(path.join(out,'vercel.json'),JSON.stringify(config,null,2)+'\n');return out;
}
if(require.main===module)console.log('Prepared local-only readiness prototype: '+buildReadiness());
module.exports={buildReadiness,csp};
