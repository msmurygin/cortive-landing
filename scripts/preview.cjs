/* Local review only. All provider calls are mocked; this server cannot send enquiries. */
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const evidence = process.env.QUARK_REVIEW_LOG || path.join(root, '.review-events.ndjson');
process.env.QUARK_MEASUREMENT_LOCAL_TEST = '1';
// No real provider forwarding in local review, including accidental form submissions.
global.fetch = async () => ({ ok: true });
const handlers = { '/api/lead': require('../api/lead'), '/api/events': require('../api/events'), '/api/measurement-config': require('../api/measurement-config') };
const originalInfo = console.info;
console.info = value => { if (typeof value === 'string' && value.startsWith('{')) fs.appendFileSync(evidence, value + '\n'); else originalInfo(value); };
const drafts = { '/wms-cost': 'drafts/wms-cost.html', '/features/inventory-management': 'drafts/features/inventory-management.html', '/legal/privacy.html': 'drafts/legal/privacy.html' };
const mime = { '.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.xml':'application/xml','.txt':'text/plain' };
http.createServer(async (req, res) => {
 const url = new URL(req.url, 'http://127.0.0.1:4173'), route = url.pathname;
 res.setHeader('X-Robots-Tag', 'noindex, follow');
 if (handlers[route]) {
   let raw = ''; for await (const chunk of req) { raw += chunk; if (raw.length > 4096) { res.writeHead(413); return res.end(); } }
   req.body = raw;
   res.status = n => { res.statusCode = n; return res; };
   res.json = value => { res.setHeader('Content-Type','application/json'); res.end(JSON.stringify(value)); return res; };
   res.send = value => { res.end(value); return res; };
   res.redirect = (n,to) => { res.writeHead(n,{Location:to});res.end();return res; };
   if (route === '/api/lead' && req.headers['x-quark-review-failure'] === '1') { res.status(502).json({ error:'Mocked provider refusal' });return; }
   try { await handlers[route](req,res); } catch { res.status(500).json({error:'Local review error'}); } return;
 }
 const redirect = {'/index.html':'/','/vision.html':'/vision','/vision/':'/vision','/webrf/':'/webrf','/webrf/index.html':'/webrf'}[route];
 if (redirect) { res.writeHead(308,{Location:redirect+url.search});res.end();return; }
 let file = drafts[route] || ({'/':'index.html','/vision':'vision.html','/webrf':'webrf/index.html'}[route]) || (route.startsWith('/draft-assets/') ? 'drafts/assets/'+route.slice('/draft-assets/'.length) : route.slice(1));
 let resolved;try{resolved=path.resolve(root,decodeURIComponent(file));}catch{res.writeHead(400);res.end();return;}
 if (!resolved.startsWith(root+path.sep) || !fs.existsSync(resolved) || !fs.statSync(resolved).isFile() || /(^|\/)\./.test(file) || file.startsWith('docs/') || file.startsWith('scripts/') || file.startsWith('tests/')) { res.writeHead(404);res.end('Not found');return; }
 res.setHeader('Content-Type',mime[path.extname(resolved)] || 'application/octet-stream');res.end(fs.readFileSync(resolved));
}).listen(4173,'127.0.0.1',()=>console.log('Local review: http://127.0.0.1:4173/wms-cost — all form deliveries mocked.'));
