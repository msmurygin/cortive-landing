const withoutPricing=require('./pricing-preservation.cjs');
// Permit exact isolated catalogue additions and the new Claude endpoint duration. Other settings remain frozen.
module.exports = function withoutIntegrationCatalogue(file, text) {
  text = withoutPricing(file, text);
  if (file === 'vercel.json') {
    const config = JSON.parse(text);
    if (config.functions && JSON.stringify(config.functions['api/engine-analyze.js']) === JSON.stringify({maxDuration:60})) {
      delete config.functions['api/engine-analyze.js'];
      if (!Object.keys(config.functions).length) delete config.functions;
    }
    config.redirects = config.redirects.filter(x => !(
      ['/integrations.html', '/integrations/'].includes(x.source) &&
      x.destination === '/integrations' && x.permanent === true && Object.keys(x).length === 3
    ));
    config.rewrites = config.rewrites.filter(x => !(
      x.source === '/integrations' && x.destination === '/integrations.html' && Object.keys(x).length === 2
    ));
    return JSON.stringify(config, null, 2) + '\n';
  }
  if (file === 'sitemap.xml') return text.replace('  <url><loc>https://quark.build/integrations</loc></url>\n', '');
  return text.replace('<li><a href="/integrations" data-nav="integrations">Integrations</a></li>', '').replace('<a href="/integrations" data-nav="integrations">Integrations</a>', '').replace('<li><a href="/integrations">Integrations</a></li>', '');
};
