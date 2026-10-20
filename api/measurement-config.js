const { eligible } = require('../lib/measurement');
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Method not allowed' }); }
  const environment = eligible(req);
  return res.status(200).json({ enabled: !!environment, environment });
};
