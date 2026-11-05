const fs = require('node:fs');
const path = require('node:path');
const copy = require('../content/legacy-landings.json');
const homes = require('../content/balkan-landings.json');
const { escape, logo, cards } = require('./balkan-pages.cjs');
const root = path.resolve(__dirname, '..');
const base = '/solutions/legacy-hardware';
const versions = [{ code: 'en', tag: 'en', name: 'English', route: base },
  ...Object.keys(copy).map(code => ({ code, tag: homes[code].region, name: homes[code].name, route: base + '/' + code }))];

function alternatives() {
  return versions.map(v => '<link rel="alternate" hreflang="' + v.tag + '" href="https://quark.build' + v.route + '">').join('\n')
    + '\n<link rel="alternate" hreflang="x-default" href="https://quark.build' + base + '">';
}
function languages(code) {
  return versions.map(v => '<a lang="' + v.code + '" href="' + v.route + '"' + (v.code === code ? ' aria-current="page"' : '') + '>' + escape(v.name) + '</a>').join(' · ');
}
function render(code, t) {
  const h = homes[code];
  const toolNote = ['bg', 'ro', 'el', 'sr'].includes(code) ? '' : '<span class="q-note">' + escape(h.english) + ' ↗</span>';
  const url = 'https://quark.build' + base + '/' + code;
  const cost = '/wms-cost' + (['bg', 'ro', 'el', 'sr'].includes(code) ? '?lang=' + code : '');
  const assessment = '/tools/wms-readiness-assessment' + (['bg', 'ro', 'el', 'sr'].includes(code) ? '?lang=' + code : '');
  return `<!doctype html><html lang="${code}" data-theme="light"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(t.title)}</title><meta name="description" content="${escape(t.description)}">
<meta name="robots" content="index,follow"><link rel="canonical" href="${url}">
${alternatives()}
<meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:title" content="${escape(t.title)}"><meta property="og:description" content="${escape(t.description)}"><meta property="og:image" content="https://quark.build/assets/social/quark-wms-share-20261027.jpg"><meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:t.h1,url,inLanguage:code,about:{'@type':'SoftwareApplication',name:'Quark WMS',url:'https://quark.build/',applicationCategory:'BusinessApplication',operatingSystem:'Web'}}).replace(/</g,'\\u003c')}</script>
<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/design-assets/qds.css"><link rel="stylesheet" href="/design-assets/site-indigo.css"><script src="/design-assets/qds.js"></script></head><body class="q-indigo">
<a class="q-skip" href="#main">${escape(h.skip)}</a><header class="q-hdr"><div class="q-wrap q-hdr-in"><a class="q-logo" href="/${code}" aria-label="Quark WMS">${logo}</a><nav class="q-nav" aria-label="${escape(h.menu)}"><a href="/${code}">${escape(h.home)}</a><a href="#workflow">${escape(h.nav[1])}</a><a href="#budget">${escape(h.nav[2])}</a></nav><div class="q-hdr-act"><button class="q-theme" type="button" data-q-theme aria-label="${escape(h.theme)}" aria-pressed="false"><i></i></button><a class="q-btn is-sm" href="/${code}#contact">${escape(h.nav[3])} ↗</a></div></div></header>
<main id="main">
<section class="q-hero q-grid-bg"><div class="q-wrap"><div class="q-meta"><span>Quark WMS · RF</span><nav aria-label="${escape(h.languages)}">${languages(code)}</nav></div><div class="q-hero-grid"><h1 class="q-display" style="font-size:clamp(36px,4.8vw,68px)">${escape(t.h1)}</h1><div class="q-stack"><p class="q-lede">${escape(t.intro)}</p><a class="q-btn is-primary" href="/${code}#contact">${escape(h.cta)} ↗</a></div></div></div></section>
<section class="q-sec"><div class="q-wrap"><header class="q-shead"><h2 class="q-h2">${escape(t.section1)}</h2><p>${escape(t.section1Text)}</p></header><div class="q-two">${cards(t.cards1)}</div></div></section>
<section class="q-sec is-tint" id="workflow"><div class="q-wrap"><header class="q-shead"><h2 class="q-h2">${escape(t.section2)}</h2><p>${escape(t.section2Text)}</p></header><div class="q-two">${cards(t.cards2)}</div></div></section>
<section class="q-sec"><div class="q-wrap"><header class="q-shead"><h2 class="q-h2">${escape(t.checkTitle)}</h2></header><ol class="q-stack">${t.checks.map(text => '<li>' + escape(text) + '</li>').join('')}</ol><figure style="margin:32px 0"><img src="/assets/product-context/rf-screen-designer.jpg" width="1500" height="940" loading="lazy" decoding="async" alt="Quark RF Screen Designer" style="width:100%;height:auto"><figcaption class="q-note">${escape(t.media)}</figcaption></figure><p><a href="https://techdocs.zebra.com/enterprise-browser/1-5/guide/about/#supported-devices" lang="en">${escape(t.reference)} (${escape(h.english)}) ↗</a></p></div></section>
<section class="q-sec is-tint" id="budget"><div class="q-wrap"><header class="q-shead"><h2 class="q-h2">${escape(t.budgetTitle)}</h2><p>${escape(t.budgetText)}</p></header><div class="q-two"><a class="q-card" href="${cost}"><h3>${escape(h.costTitle)}</h3><p>${escape(h.costText)}</p>${toolNote}</a><a class="q-card" href="${assessment}"><h3>${escape(h.assessmentTitle)}</h3><p>${escape(h.assessmentText)}</p>${toolNote}</a></div></div></section>
<section class="q-sec q-cta"><div class="q-wrap q-cta-in"><div><h2 class="q-h2">${escape(t.contactTitle)}</h2><p>${escape(t.contactText)}</p></div><a class="q-btn is-primary" href="/${code}#contact">${escape(h.cta)} ↗</a></div></section>
</main><footer class="q-ftr"><div class="q-wrap"><nav aria-label="${escape(h.languages)}">${languages(code)}</nav><div class="q-ftr-bot"><span>© 2026 Quark WMS</span><a href="/${code}">${escape(h.home)}</a></div></div></footer></body></html>\n`;
}
function apply() {
  for (const [code, text] of Object.entries(copy)) {
    const dir = path.join(root, base, code);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), render(code, text));
  }
  const file = path.join(root, base, 'index.html');
  const html = fs.readFileSync(file, 'utf8').replace(/<!-- legacy-alternates -->[\s\S]*?<!-- \/legacy-alternates -->\n?/, '')
    .replace(/<!-- legacy-languages -->[\s\S]*?<!-- \/legacy-languages -->/, '');
  fs.writeFileSync(file, html.replace('</head>', '<!-- legacy-alternates -->\n' + alternatives() + '\n<!-- /legacy-alternates -->\n</head>')
    .replace('<div class="q-meta">', '<div class="q-meta"><!-- legacy-languages --><nav aria-label="Languages">' + languages('en') + '</nav><!-- /legacy-languages -->'));
}
if (require.main === module) apply();
module.exports = { apply };
