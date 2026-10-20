/* Loopback-only, no provider calls, no optional measurement, no deployment. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const candidate=process.argv[2]||'rc-a';if(!['rc-a','rc-a-measurement','rc-b'].includes(candidate))throw Error('Unknown candidate');
const root=path.resolve(__dirname,'../review-dist',candidate),config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'))),port=candidate==='rc-a'?4180:candidate==='rc-b'?4181:4182;
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{
 res.setHeader('X-Robots-Tag','noindex, follow');const u=new URL(req.url,'http://127.0.0.1:'+port);
 if(u.pathname==='/api/measurement-config'){res.setHeader('Content-Type','application/json');return res.end('{"enabled":false}');}
 if(u.pathname.startsWith('/api/')){res.writeHead(503,{'Content-Type':'application/json'});return res.end('{"error":"Review only: no enquiries are sent"}');}
 const redirect=config.redirects.find(x=>x.source===u.pathname);if(redirect){res.writeHead(308,{Location:redirect.destination+u.search});return res.end();}
 const rewrite=config.rewrites.find(x=>x.source===u.pathname);let file;try{file=path.resolve(root,'.'+decodeURIComponent(rewrite?rewrite.destination:u.pathname==='/'?'/index.html':u.pathname));}catch{res.writeHead(400);return res.end();}
 if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()||/\/(api|lib)\//.test(file.slice(root.length))){res.writeHead(404);return res.end('Not found');}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
}).listen(port,'127.0.0.1',()=>console.log(candidate+' private review: http://127.0.0.1:'+port+' — no real form delivery'));
