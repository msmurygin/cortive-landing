const { randomUUID } = require('node:crypto');
const sources = new Set(['direct', 'google', 'bing', 'linkedin', 'newsletter', 'other']);
const mediums = new Set(['none', 'organic', 'cpc', 'email', 'social', 'referral', 'other']);
function attribution(body) {
  return {
    source: sources.has(body.source) ? body.source : 'other',
    medium: mediums.has(body.medium) ? body.medium : 'other',
  };
}
function event(name, fields) {
  // Do not add email, IP, free text, full URLs, referrers or request bodies here.
  console.info(JSON.stringify({ namespace: 'quark_leads', event: name, at: new Date().toISOString(), ...fields }));
}
function readBody(req) {
  const contentType = (req.headers['content-type'] || '').split(';')[0];
  if (!['application/json', 'application/x-www-form-urlencoded'].includes(contentType)) throw new Error('unsupported');
  if (Number(req.headers['content-length']) > 4096) throw new Error('size');
  const raw = req.body;
  if (typeof raw === 'string' && Buffer.byteLength(raw) > 4096) throw new Error('size');
  const body = typeof raw === 'string'
    ? (contentType === 'application/json' ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw)))
    : raw;
  if (!body || typeof body !== 'object' || Array.isArray(body) || Buffer.byteLength(JSON.stringify(body)) > 4096) throw new Error('invalid');
  return body;
}
function allowedOrigin(req) {
  const allowed = new Set(['https://quark.build']);
  if (process.env.VERCEL_URL) allowed.add('https://' + process.env.VERCEL_URL);
  if (process.env.VERCEL_ENV !== 'production') {
    allowed.add('http://localhost:4173');
    allowed.add('http://127.0.0.1:4173');
  }
  return allowed.has(req.headers.origin);
}
function prepare(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({ error: 'Method not allowed' }); return false; }
  if (!allowedOrigin(req)) { res.status(403).json({ error: 'Origin not allowed' }); return false; }
  return true;
}
module.exports = { attribution, event, readBody, prepare, randomUUID };
