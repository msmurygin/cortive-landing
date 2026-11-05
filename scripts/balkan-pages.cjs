const fs = require('node:fs');
const path = require('node:path');
const locales = require('../content/balkan-landings.json');

const root = path.resolve(__dirname, '..');
const origin = 'https://quark.build';
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const logo = home.match(/<svg class="q-pixel-lockup"[\s\S]*?<\/svg>/)[0];
const languages = [{ code: 'en', name: 'English', region: 'en', url: '/' },
  ...Object.entries(locales).map(([code, data]) => ({ code, name: data.name, region: data.region, url: '/' + code }))];

function alternatives() {
  return languages.map(lang => `<link rel="alternate" hreflang="${lang.region}" href="${origin}${lang.url}">`).join('\n')
    + `\n<link rel="alternate" hreflang="x-default" href="${origin}/">`;
}

function languageLinks(current) {
  return languages.map(lang => `<a href="${lang.url}" lang="${lang.code}" hreflang="${lang.region}"${current === lang.code ? ' aria-current="page"' : ''}>${escape(lang.name)}</a>`).join(' · ');
}

function cards(items) {
  return items.map(([heading, text], index) => `<article class="q-card"><header><span class="q-num">0${index + 1}</span></header><h3>${escape(heading)}</h3><p>${escape(text)}</p></article>`).join('\n');
}

function render(code, t) {
  const url = origin + '/' + code;
  const localizedTools = ['bg', 'ro', 'el', 'sr'].includes(code);
  const toolQuery = localizedTools ? '?lang=' + code : '';
  const toolNote = localizedTools ? '↗' : escape(t.english) + ' ↗';
  const app = {
    '@context': 'https://schema.org', '@type': ['SoftwareApplication', 'Product'],
    '@id': origin + '/#software', name: 'Quark WMS', url: origin + '/',
    applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
    description: t.description
  };
  const navigation = ['features', 'workflows', 'budget', 'contact'].map((id, index) =>
    `<a href="#${id}">${escape(t.nav[index])}</a>`).join('');
  return `<!doctype html>
<html lang="${code}" data-theme="light"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(t.title)}</title>
<meta name="description" content="${escape(t.description)}">
<meta name="robots" content="index,follow"><link rel="canonical" href="${url}">
${alternatives()}
<meta property="og:type" content="website"><meta property="og:site_name" content="Quark WMS">
<meta property="og:title" content="${escape(t.title)}"><meta property="og:description" content="${escape(t.description)}"><meta property="og:url" content="${url}">
<meta property="og:locale" content="${t.region.replace('-', '_')}">
<meta property="og:image" content="${origin}/assets/social/quark-wms-share-20261027.jpg">
<meta property="og:image:alt" content="Quark WMS">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(t.title)}"><meta name="twitter:description" content="${escape(t.description)}"><meta name="twitter:image" content="${origin}/assets/social/quark-wms-share-20261027.jpg">
<script type="application/ld+json">${JSON.stringify(app).replace(/</g, '\\u003c')}</script>
<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/design-assets/qds.css"><link rel="stylesheet" href="/design-assets/site-indigo.css"><script src="/design-assets/qds.js"></script>
</head><body class="q-indigo">
<a class="q-skip" href="#main">${escape(t.skip)}</a>
<header class="q-hdr"><div class="q-wrap q-hdr-in"><a class="q-logo" href="/${code}" aria-label="Quark WMS">${logo}</a><nav class="q-nav" aria-label="${escape(t.menu)}">${navigation}</nav><div class="q-hdr-act"><button class="q-theme" type="button" data-q-theme aria-label="${escape(t.theme)}" aria-pressed="false"><i></i></button><button class="q-burger" type="button" data-close-label="${escape(t.closeMenu)}" aria-expanded="false" aria-controls="q-mnav"><i aria-hidden="true"></i><span>${escape(t.menu)}</span></button></div><nav class="q-mnav" id="q-mnav" aria-label="${escape(t.menu)}"><ul>${['features','workflows','budget','contact'].map((id, i) => `<li><a href="#${id}">${escape(t.nav[i])}</a></li>`).join('')}</ul><div class="q-mnav-foot"><a class="q-btn is-primary" href="#contact">${escape(t.cta)}</a><button class="q-btn is-ghost" type="button" data-q-theme aria-pressed="false">${escape(t.theme)}</button></div></nav></div></header>
<main id="main">
<section class="q-hero q-grid-bg"><div class="q-wrap"><div class="q-meta"><span>Quark WMS · ${escape(t.country)}</span><nav aria-label="${escape(t.languages)}">${languageLinks(code)}</nav></div><div class="q-hero-grid"><h1 class="q-display" style="font-size:clamp(36px,4.8vw,68px)">${escape(t.hero)} <span class="q-hl" style="display:block;margin-top:12px">${escape(t.heroAccent)}</span></h1><div class="q-stack"><p class="q-lede">${escape(t.intro)}</p><div class="q-row"><a class="q-btn is-primary" href="#contact">${escape(t.cta)} <span aria-hidden="true">↗</span></a><a class="q-mlink" href="#features">${escape(t.secondary)} ↓</a></div></div></div></div></section>
<section class="q-sec" id="features"><div class="q-wrap"><header class="q-shead"><h2 class="q-h2">${escape(t.featuresTitle)}</h2></header><div class="q-three">${cards(t.features)}</div><figure style="margin:40px 0 0"><img src="/assets/product-context/warehouse-topology.webp" alt="${escape(t.imageAlt)}" width="3328" height="1864" loading="lazy" decoding="async" style="width:100%;height:auto;border:1px solid var(--q-line)"><figcaption class="q-note">${escape(t.imageCaption)}</figcaption></figure></div></section>
<section class="q-sec is-tint" id="workflows"><div class="q-wrap"><header class="q-shead"><h2 class="q-h2">${escape(t.flowTitle)}</h2></header><div class="q-three">${cards(t.flows)}</div><p class="q-lede" style="margin-top:32px">${escape(t.config)}</p><p><a class="q-mlink" href="/product" lang="en">${escape(t.secondary)} (${escape(t.english)}) ↗</a></p></div></section>
<section class="q-sec" id="budget"><div class="q-wrap"><header class="q-shead"><h2 class="q-h2">${escape(t.budgetTitle)}</h2><p>${escape(t.budget)}</p></header><div class="q-two"><a class="q-card" href="/wms-cost${toolQuery}"><h3>${escape(t.costTitle)}</h3><p>${escape(t.costText)}</p><span class="q-note">${toolNote}</span></a><a class="q-card" href="/tools/wms-readiness-assessment${toolQuery}"><h3>${escape(t.assessmentTitle)}</h3><p>${escape(t.assessmentText)}</p><span class="q-note">${toolNote}</span></a></div><p style="margin-top:24px"><a class="q-mlink" href="/pricing">${escape(t.pricingLink)} (${escape(t.english)}) ↗</a></p></div></section>
<section class="q-sec is-tint"><div class="q-wrap"><header class="q-shead"><h2 class="q-h2">${escape(t.faqTitle)}</h2></header><div class="q-steps">${t.faq.map(([question, answer]) => `<details><summary>${escape(question)}</summary><p>${escape(answer)}</p></details>`).join('')}</div><p style="margin-top:24px"><a class="q-mlink" href="/solutions/legacy-hardware/${code}">${escape(t.legacyLink)} ↗</a></p></div></section>
<section class="q-sec q-cta" id="contact"><div class="q-wrap q-cta-in"><div><h2 class="q-h2">${escape(t.contactTitle)}</h2><p>${escape(t.contactText)}</p></div><div><a class="q-btn is-primary" href="/#contact">${escape(t.cta)} ↗</a><p class="q-note">${escape(t.english)}</p></div></div></section>
</main><footer class="q-ftr"><div class="q-wrap"><nav aria-label="${escape(t.languages)}">${languageLinks(code)}</nav><div class="q-ftr-bot"><span>© 2026 Quark WMS · ${escape(t.footer)}</span><span><a href="/legal/privacy.html">${escape(t.privacy)} (${escape(t.english)})</a> · <a href="/legal/terms.html">${escape(t.terms)} (${escape(t.english)})</a></span></div></div></footer>
</body></html>\n`;
}

function apply() {
  for (const [code, data] of Object.entries(locales)) {
    fs.mkdirSync(path.join(root, code), { recursive: true });
    fs.writeFileSync(path.join(root, code, 'index.html'), render(code, data));
  }
  const head = `<!-- balkan-alternates -->\n${alternatives()}\n<!-- /balkan-alternates -->`;
  const switcher = `<!-- balkan-languages --><nav aria-label="Languages" style="margin-bottom:24px">${languageLinks('en')}</nav><!-- /balkan-languages -->`;
  const updated = home.replace(/<!-- balkan-alternates -->[\s\S]*?<!-- \/balkan-alternates -->\n?/, '')
    .replace('</head>', head + '\n</head>')
    .replace(/<!-- balkan-languages -->[\s\S]*?<!-- \/balkan-languages -->/, '')
    .replace('<div class="q-ftr-bot">', switcher + '<div class="q-ftr-bot">');
  fs.writeFileSync(path.join(root, 'index.html'), updated);
}

if (require.main === module) apply();
module.exports = { apply, languages, escape, logo, cards };
