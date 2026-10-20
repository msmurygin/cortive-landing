const { readBody, prepare } = require('../lib/lead-events');
const { emit, uuid } = require('../lib/measurement');
const events = new Set(['page_view', 'demo_cta_click', 'demo_form_submit', 'demo_form_error']);
module.exports = function handler(req, res) {
  if (!prepare(req, res)) return;
  let body;
  try { body = readBody(req); } catch { return res.status(400).json({ error: 'Invalid request' }); }
  // Outcomes require the backend. A browser cannot assert acceptance or delivery.
  if (!events.has(body.event) || !uuid(body.event_id)) return res.status(400).json({ error: 'Invalid event' });
  if (body.event.startsWith('demo_form_') && !uuid(body.attempt_id)) return res.status(400).json({ error: 'Invalid attempt' });
  if (body.event === 'demo_form_error' && !['network', 'response'].includes(body.reason)) return res.status(400).json({ error: 'Invalid error' });
  emit(req, body, body.event, { event_id: body.event_id, is_entry: body.event === 'page_view' ? body.is_entry === true : undefined, placement: body.placement, reason: body.reason });
  return res.status(204).end();
};
