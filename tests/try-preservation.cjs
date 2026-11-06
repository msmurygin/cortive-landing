// Normalize only the new navigation, teaser, route and existing demo function settings.
// Dedicated guided-flow tests protect this release; historical page assertions remain exact.
module.exports = function withoutTry(file, text) {
  if (file === 'vercel.json') {
    const c = JSON.parse(text);
    c.redirects = c.redirects.filter(r => !(Object.keys(r).length === 3 && r.permanent === true && ['/try/','/try.html'].includes(r.source) && r.destination === '/try'));
    c.rewrites = c.rewrites.filter(r => !(Object.keys(r).length === 2 && r.source === '/try' && r.destination === '/try.html'));
    for (const [name, expected] of Object.entries({'api/engine-analyze.js':{maxDuration:60,includeFiles:'api/_photon-system.md'},'api/engine-enquiry.js':{maxDuration:20}})) {
      if (JSON.stringify(c.functions?.[name]) === JSON.stringify(expected)) delete c.functions[name];
    }
    if (c.functions && !Object.keys(c.functions).length) delete c.functions;
    return JSON.stringify(c,null,2)+'\n';
  }
  if (!file.endsWith('.html')) return text;
  return text.replace('<li><a href="/try" data-nav="try">Try Quark</a></li>', '')
    .replace('<a href="/try" data-nav="try">Try Quark</a>', '')
    .replace(/<!-- try-teaser -->[\s\S]*?<!-- \/try-teaser -->/,'')
    .replace('<link rel="stylesheet" href="/assets/engine-demo/engine-try.css">','');
};
