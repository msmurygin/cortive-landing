const localePaths = ['/bg', '/ro', '/sr', '/el'];
const newPaths = [...localePaths, '/solutions/legacy-hardware'];
const aliases = ['/tools/wms-cost-calculator', '/tools/wms-cost-calculator/',
  '/tools/wms-cost-calculator.html', '/tools/wms-cost-calculator/index.html'];

// Keep historical release assertions scoped to the content they originally protected.
module.exports = function withoutBalkanPages(file, text) {
  if (file === 'design-assets/qds.js') {
    return text.replace("const menuLabel=burger.querySelector('span').textContent,closeLabel=burger.dataset.closeLabel||'Close';\n", '')
      .replace("burger.querySelector('span').textContent=closeLabel", "burger.querySelector('span').textContent='Close'")
      .replace("burger.querySelector('span').textContent=menuLabel", "burger.querySelector('span').textContent='Menu'");
  }
  if (file === 'vercel.json') {
    const config = JSON.parse(text);
    config.redirects = config.redirects.filter(rule => !(
      Object.keys(rule).length === 3 && rule.permanent === true && (
        newPaths.some(base => [base + '/', base + '/index.html'].includes(rule.source) && rule.destination === base)
        || (aliases.includes(rule.source) && rule.destination === '/wms-cost')
      )
    ));
    config.rewrites = config.rewrites.filter(rule => !(
      Object.keys(rule).length === 2 && newPaths.includes(rule.source) && rule.destination === rule.source + '/index.html'
    ));
    if (config.buildCommand === 'node scripts/balkan-pages.cjs && node scripts/generate-sitemap.cjs') delete config.buildCommand;
    return JSON.stringify(config, null, 2) + '\n';
  }
  if (file === 'sitemap.xml') {
    for (const route of newPaths) text = text.replace('  <url><loc>https://quark.build' + route + '</loc></url>\n', '');
    return text;
  }
  return text.replace(/<!-- balkan-alternates -->[\s\S]*?<!-- \/balkan-alternates -->\n?/, '')
    .replace(/<!-- balkan-languages -->[\s\S]*?<!-- \/balkan-languages -->/, '')
    .replace('<li><a href="/solutions/legacy-hardware">Legacy RF terminals</a></li>', '');
};
