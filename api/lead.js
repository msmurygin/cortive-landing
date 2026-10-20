const measurement = require('../lib/measurement');
const { attribution, event, readBody, prepare, randomUUID } = require('../lib/lead-events');
const industries = new Set(['', '3PL / Fulfilment', 'Pharma', 'Cold chain / Food', 'Retail / E-commerce', 'Electronics', 'Other']);
module.exports = async function handler(req, res) {
  if (!prepare(req, res)) return;
  const wantsJSON = (req.headers.accept || '').includes('application/json');
  function respond(status, responseBody) {
    if (status >= 400) measurement.emit(req, body || {}, 'demo_form_error', { reason: status === 502 ? 'provider_unavailable' : 'validation' });
    if (wantsJSON) return res.status(status).json(responseBody);
    if (status === 200) return res.redirect(303, '/thanks.html');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(status).send('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Enquiry not sent — Quark</title><h1>Your enquiry was not sent.</h1><p>Please check your email and consent, then retry. If the problem continues, email hello@quark.build.</p><a href="/#contact">Return to the form</a></html>');
  }
  let body;
  try { body = readBody(req); } catch { return respond(400, { error: 'Invalid request' }); }
  if (body.website) return respond(400, { error: 'Invalid request' });
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const industry = typeof body.industry === 'string' ? body.industry : '';
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !industries.has(industry) || body.consent !== 'yes') {
    return respond(400, { error: 'Check email and consent' });
  }
  const id = randomUUID();
  const context = { submission_id: id, ...attribution(body) };
  event('lead_submit', context);
  try {
    // Keep the existing provider and form. Never log its response body or the enquiry.
    const response = await fetch('https://formspree.io/f/mqevozlb', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, industry, consent: 'Contact about this enquiry', _subject: 'Quark warehouse enquiry [' + id + ']', submission_reference: id }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('provider');
    // This means the provider accepted the request, not that an email reached an inbox.
    event('lead_success', context);
    measurement.emit(req, { ...body, attempt_id: measurement.uuid(body.attempt_id) ? body.attempt_id : id }, 'demo_form_accepted', { submission_id: id });
    return respond(200, { ok: true, delivery_status: 'provider_accepted' });
  } catch {
    event('lead_error', { ...context, reason: 'provider_unavailable' });
    return respond(502, { error: 'Could not send. Please retry or email hello@quark.build.' });
  }
};
