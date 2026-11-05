const fs = require('node:fs');
const path = require('node:path');
const files = require('../content/seo-pages.json');
const root = path.resolve(__dirname, '..');

function generate() {
  const seen = new Set();
  const entries = files.map(file => {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/)?.[1];
    if (!canonical || new URL(canonical).origin !== 'https://quark.build') {
      throw new Error('Missing or unexpected canonical in ' + file);
    }
    if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) {
      throw new Error('Non-indexable page in sitemap manifest: ' + file);
    }
    if (seen.has(canonical)) throw new Error('Duplicate sitemap URL: ' + canonical);
    seen.add(canonical);
    return '  <url><loc>' + canonical.replace(/&/g, '&amp;') + '</loc></url>';
  });
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + entries.join('\n') + '\n</urlset>\n';
}

if (require.main === module) {
  const sitemap = generate();
  const target = path.join(root, 'sitemap.xml');
  if (process.argv.includes('--check')) {
    if (fs.readFileSync(target, 'utf8') !== sitemap) throw new Error('Run scripts/generate-sitemap.cjs');
  } else fs.writeFileSync(target, sitemap);
}
module.exports = { generate };
