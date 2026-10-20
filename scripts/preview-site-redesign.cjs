/* Loopback review/inspection only. No handler invocation or forwarded submissions; inspection permits existing font hosts. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(process.env.QUARK_DESIGN_OUT||path.join(__dirname,'../review-dist/site-redesign'));
const port=Number(process.env.QUARK_DESIGN_PORT||4196),inspection=process.env.QUARK_DESIGN_INSPECT_RELEASE==='1';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.json':'application/json','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{
 if(!inspection)res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Security-Policy',inspection?"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; form-action 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'":"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'");
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end('Local review: submission disabled');return;}
 let url,u;try{url=new URL(req.url,'http://localhost');u=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
 if(u.startsWith('/api/')){res.setHeader('Content-Type','application/json');res.writeHead(503);res.end('{"error":"Local review: all handlers disabled"}');return;}
 const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
 const redirect=config.redirects?.find(x=>x.source===u);if(redirect){res.writeHead(redirect.permanent?308:307,{Location:redirect.destination+url.search});res.end();return;}
 let file=config.rewrites?.find(x=>x.source===u)?.destination||u;
 let f=path.resolve(root,'.'+(file==='/'?'/index.html':file));if(!f.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');if(!fs.existsSync(f)&&!path.extname(f))f+='.html';
 if(!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end('Not found');return;}
 res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(req.method==='HEAD'?undefined:fs.readFileSync(f));
}).listen(port,'127.0.0.1',()=>console.log('Local '+(inspection?'release inspection':'private review')+': http://127.0.0.1:'+port+'/product'));
