const { createHash } = require('node:crypto');
const { parseRequest, infer, InputError } = require('../lib/engine-ai');
// Best-effort warm-instance throttle only. Production remains gated until owner approves a public release and edge limits.
const buckets = new Map();
let active = 0;
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const allowed = new Set(['https://quark.build']);
  for (const name of ['VERCEL_URL', 'VERCEL_BRANCH_URL'])
    if (process.env[name]) allowed.add('https://' + process.env[name]);
  if (process.env.VERCEL_ENV !== 'production' && process.env.ENGINE_AI_PREVIEW_ORIGIN)
    allowed.add(process.env.ENGINE_AI_PREVIEW_ORIGIN);
  if (!allowed.has(req.headers.origin))
    return res.status(403).json({ error: 'Origin not allowed.' });
  if (process.env.VERCEL_ENV === 'production' && process.env.ENGINE_AI_PUBLIC_ENABLED !== 'true')
    return res
      .status(503)
      .json({ error: 'AI analysis is not available on this site yet. Use manual parameters.' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key)
    return res
      .status(503)
      .json({ error: 'AI analysis is not connected to this preview yet. Use manual parameters.' });
  let input;
  try {
    input = parseRequest(req);
  } catch (e) {
    return res
      .status(e.status || 400)
      .json({ error: e instanceof InputError ? e.message : 'Check the input.' });
  }
  const now = Date.now();
  for (const [k, v] of buckets) if (now - v.start > 300000) buckets.delete(k);
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(
    ',',
  )[0];
  const id = createHash('sha256').update(ip).digest('hex');
  const b = buckets.get(id) || { start: now, count: 0 };
  if (
    b.count >= (process.env.VERCEL_ENV === 'preview' ? 20 : 6) ||
    active >= 2 ||
    buckets.size >= 1000
  )
    return res
      .status(429)
      .json({ error: 'Preview request limit reached. Please try again in a few minutes.' });
  b.count++;
  buckets.set(id, b);
  active++;
  try {
    const result = await infer(input, {
      key,
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
    });
    return res.status(200).json({ ok: true, provider: 'Quark AI', result });
  } catch (e) {
    const detail = process.env.VERCEL_ENV !== 'production' && e.reason ? ' [' + e.reason + ']' : '';
    return res
      .status(e instanceof InputError ? e.status : 502)
      .json({
        error:
          (e instanceof InputError
            ? e.message
            : 'AI analysis did not finish. Retry or set parameters manually.') + detail,
      });
  } finally {
    active--;
  }
};
