/* Loopback only. No request-body parsing/logging and no upstream connection. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {buildReadiness,csp}=require('./build-readiness.cjs');
function createPreview(root){const files={'/tools/wms-readiness-assessment':'index.html','/robots.txt':'robots.txt','/assessment-assets/assessment-model.js':'assessment-assets/assessment-model.js','/assessment-assets/assessment-pdf.js':'assessment-assets/assessment-pdf.js','/assessment-assets/assessment-ui.js':'assessment-assets/assessment-ui.js','/assessment-assets/assessment.css':'assessment-assets/assessment.css'};return http.createServer((req,res)=>{
 res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',csp);res.setHeader('Referrer-Policy','no-referrer');
 if(!['GET','HEAD'].includes(req.method)){req.resume();res.writeHead(405);return res.end('No submissions are accepted.');}
 const url=new URL(req.url,'http://127.0.0.1');if(url.search){res.writeHead(400);return res.end('Query parameters are not accepted.');}
 if(url.pathname==='/tools/wms-readiness-assessment/'){res.writeHead(308,{Location:'/tools/wms-readiness-assessment'});return res.end();}
 const file=files[url.pathname];if(!file){res.writeHead(404);return res.end('Not found');}res.setHeader('Content-Type',file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/plain');res.end(req.method==='HEAD'?'':fs.readFileSync(path.join(root,file)));
 });}
if(require.main===module){const port=Number(process.argv[2]||4190);createPreview(buildReadiness()).listen(port,'127.0.0.1',()=>console.log('Private readiness review: http://127.0.0.1:'+port+'/tools/wms-readiness-assessment — no submissions or analytics'));}
module.exports={createPreview};
