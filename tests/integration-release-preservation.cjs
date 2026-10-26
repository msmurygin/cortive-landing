// Permit only the integration catalogue's exact footer, sitemap and route additions.
module.exports = function withoutIntegrationCatalogue(file, text) {
  if (file === 'vercel.json') {
    const config = JSON.parse(text);
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
  return text.replace('<li><a href="/integrations">Integrations</a></li>', '');
};
