const { randomUUID } = require('node:crypto');
const paths = new Set(['/', '/vision', '/screens.html', '/wms-cost', '/features/inventory-management']);
const sources = new Set(['direct', 'google', 'bing', 'linkedin', 'newsletter', 'other']);
const mediums = new Set(['none', 'organic', 'cpc', 'email', 'social', 'referral', 'other']);
const uuid = s => typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
function eligible(req) {
  const host = String(req.headers.host || '').split(':')[0];
  if (process.env.QUARK_MEASUREMENT_LOCAL_TEST === '1' && !process.env.VERCEL_ENV && ['localhost', '127.0.0.1'].includes(host)) return 'test';
  return process.env.QUARK_MEASUREMENT_ENABLED === '1' && process.env.VERCEL_ENV === 'production' && host === 'quark.build' ? 'production' : null;
}
function context(req, body) {
  const environment = eligible(req), m = body.measurement;
  if (!environment || req.headers['sec-gpc'] === '1' || req.headers.dnt === '1' || !m || m.consent !== true) return null;
  return { environment, source: sources.has(m.source) ? m.source : 'other', medium: mediums.has(m.medium) ? m.medium : 'other', landing: paths.has(m.landing) ? m.landing : 'other', page: paths.has(m.page) ? m.page : 'other', context_scope: m.context_scope === 'tab' ? 'tab' : 'page' };
}
function emit(req, body, name, extra = {}) {
  const c = context(req, body); if (!c) return;
  // Fixed names and allowlisted fields only; never spread a request into a record.
  const record = { namespace: 'quark_funnel', schema: 2, event: name, at: new Date().toISOString(), ...c };
  if (uuid(body.attempt_id)) record.attempt_id = body.attempt_id;
  if (name === 'demo_form_accepted' && uuid(extra.submission_id)) record.submission_id = extra.submission_id;
  if (uuid(extra.event_id)) record.event_id = extra.event_id;
  if (typeof extra.is_entry === 'boolean') record.is_entry = extra.is_entry;
  if (['nav', 'hero', 'email', 'form', 'cost', 'inventory', 'other'].includes(extra.placement)) record.placement = extra.placement;
  if (['provider_unavailable', 'validation', 'network', 'response'].includes(extra.reason)) record.reason = extra.reason;
  if (name === 'demo_form_accepted') record.delivery_status = 'provider_accepted_inbox_unverified';
  console.info(JSON.stringify(record));
}
module.exports = { paths, uuid, eligible, context, emit, randomUUID };
