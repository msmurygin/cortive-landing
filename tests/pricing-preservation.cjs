// Allow only the new Pricing navigation/footer destination, sitemap URL and route objects.
module.exports = function withoutPricing(file, text) {
  if (file === 'vercel.json') {
    const config = JSON.parse(text);
    config.redirects = config.redirects.filter(x => !(
      ['/pricing.html', '/pricing/'].includes(x.source) && x.destination === '/pricing' &&
      x.permanent === true && Object.keys(x).length === 3
    ));
    config.rewrites = config.rewrites.filter(x => !(
      x.source === '/pricing' && x.destination === '/pricing.html' && Object.keys(x).length === 2
    ));
    return JSON.stringify(config, null, 2) + '\n';
  }
  if (file === 'sitemap.xml') return text.replace('  <url><loc>https://quark.build/pricing</loc></url>\n', '');
  return text.replace('<li><a href="/pricing" data-nav="pricing">Pricing</a></li>', '').replace('<a href="/pricing" data-nav="pricing">Pricing</a>', '').replace('<li><a href="/pricing">Pricing</a></li>', '');
};
