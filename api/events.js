const { attribution, event, readBody, prepare } = require('../lib/lead-events');
const events = new Set(['cta_click', 'lead_start']);
const placements = new Set(['nav', 'hero', 'email', 'form']);
module.exports = function handler(req, res) {
  if (!prepare(req, res)) return;
  let body;
  try { body = readBody(req); } catch { return res.status(400).json({ error: 'Invalid request' }); }
  if (!events.has(body.event) || !placements.has(body.placement)) return res.status(400).json({ error: 'Invalid event' });
  event(body.event, { placement: body.placement, ...attribution(body) });
  return res.status(204).end();
};
