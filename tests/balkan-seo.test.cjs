const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const expected = { en: '/', 'bg-BG': '/bg', 'ro-RO': '/ro', 'sr-RS': '/sr', 'el-GR': '/el', 'x-default': '/' };
const config = JSON.parse(read('vercel.json'));

test('language homes are static, self-canonical and linked reciprocally without routing English visitors away', () => {
  for (const [code, route] of Object.entries({ en: '/', bg: '/bg', ro: '/ro', sr: '/sr', el: '/el' })) {
    const html = read(code === 'en' ? 'index.html' : code + '/index.html');
    assert.match(html, new RegExp('<html lang="' + code + '"'));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes('rel="canonical" href="https://quark.build' + route + '"')
      || html.includes("rel='canonical' href='https://quark.build" + route + "'"));
    const variants = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="https:\/\/quark.build([^"]+)"/g)];
    assert.deepEqual(Object.fromEntries(variants.map(m => [m[1], m[2]])), expected);
    assert.equal(variants.length, 6);
    assert.doesNotMatch(html, /http-equiv=["']refresh|navigator\.language|window\.location\s*=/i);
    if (code !== 'en') {
      assert.ok(html.includes('href="/" lang="en"'));
      assert.match(html, /loading="lazy"/);
      assert.doesNotMatch(html, /<form\b|<iframe\b|fetch\(|sendBeacon\(/);
    }
  }
  const currentMain = read('index.html').match(/<main\b[\s\S]*?<\/main>/)[0];
  const mainWithoutBilling = currentMain.replace(/\n?<section class="q-sec is-tint" id="billing"[\s\S]*?<\/section>\n?/, '\n');
  assert.equal(mainWithoutBilling,
    cp.execFileSync('git', ['show', '744b8ee:index.html'], { cwd: root, encoding: 'utf8' }).match(/<main\b[\s\S]*?<\/main>/)[0]);
});

test('locale, solution and tool aliases preserve one canonical destination and existing applications', () => {
  for (const route of ['/bg', '/ro', '/sr', '/el', '/solutions/legacy-hardware', ...['bg', 'ro', 'el', 'sr'].map(code => '/solutions/legacy-hardware/' + code)]) {
    assert.deepEqual(config.rewrites.find(r => r.source === route), { source: route, destination: route + '/index.html' });
    for (const source of [route + '/', route + '/index.html']) {
      assert.deepEqual(config.redirects.find(r => r.source === source), { source, destination: route, permanent: true });
    }
  }
  for (const source of ['/tools/wms-cost-calculator', '/tools/wms-cost-calculator/', '/tools/wms-cost-calculator.html', '/tools/wms-cost-calculator/index.html']) {
    assert.deepEqual(config.redirects.find(r => r.source === source), { source, destination: '/wms-cost', permanent: true });
  }
  for (const file of ['assets/seo/cost-model.js', 'assessment-assets/assessment-model.js', 'api/lead.js', 'assets/leads.js', 'robots.txt']) {
    assert.equal(read(file), cp.execFileSync('git', ['show', '744b8ee:' + file], { cwd: root, encoding: 'utf8' }));
  }
});

test('build output is stable and sitemap includes exactly the indexable, canonical release pages', () => {
  const files = ['index.html', 'bg/index.html', 'ro/index.html', 'sr/index.html', 'el/index.html', ...['bg', 'ro', 'el', 'sr'].map(code => 'solutions/legacy-hardware/' + code + '/index.html'), 'solutions/legacy-hardware/index.html', 'sitemap.xml'];
  const before = files.map(read);
  cp.execFileSync('node', ['scripts/balkan-pages.cjs'], { cwd: root });
  cp.execFileSync('node', ['scripts/legacy-pages.cjs'], { cwd: root });
  cp.execFileSync('node', ['scripts/generate-sitemap.cjs'], { cwd: root });
  assert.deepEqual(files.map(read), before);
  assert.equal(config.outputDirectory, '.');
  const urls = [...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.equal(urls.length, 16);
  assert.equal(new Set(urls).size, 16);
  assert.ok(urls.includes('https://quark.build/wms-cost'));
  assert.ok(urls.includes('https://quark.build/tools/wms-readiness-assessment'));
  assert.ok(urls.includes('https://quark.build/solutions/legacy-hardware'));
  assert.ok(!urls.some(u => u.includes('wms-cost-calculator')));
  for (const file of [...files.slice(1, 5), 'solutions/legacy-hardware/index.html']) {
    const html = read(file);
    assert.match(html, /name="robots" content="index,follow"/);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const data = JSON.parse(match[1]);
      assert.ok(data.name);
      assert.doesNotMatch(match[1], /aggregateRating|ratingValue|"offers"|Windows CE|Device Agnostic/);
    }
  }
});


test('hardware translations form a reciprocal group separate from language homes', () => {
  const base = '/solutions/legacy-hardware';
  const routes = { en: base, 'bg-BG': base + '/bg', 'ro-RO': base + '/ro', 'el-GR': base + '/el', 'sr-RS': base + '/sr', 'x-default': base };
  for (const route of new Set(Object.values(routes))) {
    const html = read(route.slice(1) + '/index.html');
    const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="https:\/\/quark.build([^"]+)"/g)];
    assert.equal(alternates.length, 6);
    assert.deepEqual(Object.fromEntries(alternates.map(match => [match[1], match[2]])), routes);
    assert.ok(html.includes('rel="canonical" href="https://quark.build' + route + '"'));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(html, /subsecond|sub-second|milliseconds|хиляди евро|mii de euro|χιλιάδες ευρώ|hiljade evra/i);
  }
});


test('BG/RO budget cards preserve language into both tools, while untranslated destinations are labelled', () => {
  for (const code of ['bg','ro']) {
    for (const file of [code + '/index.html', 'solutions/legacy-hardware/' + code + '/index.html']) {
      const html = read(file);
      assert.ok(html.includes('href="/wms-cost?lang=' + code + '"'));
      assert.ok(html.includes('href="/tools/wms-readiness-assessment?lang=' + code + '"'));
    }
  }
});

test('3PL billing is described consistently without unsupported scan or export claims', () => {
  const pages = ['index.html', 'bg/index.html', 'ro/index.html', 'sr/index.html', 'el/index.html'];
  for (const file of pages) {
    const html = read(file);
    const billing = html.match(/<section class="q-sec(?: is-tint)?" id="billing"[\s\S]*?<\/section>/);
    assert.ok(billing, file + ' must contain the 3PL billing section');
    assert.match(billing[0], /(?:UTF-8 CSV|CSV UTF-8)/);
    assert.match(billing[0], /EN 16931 UBL XML/);
    assert.doesNotMatch(billing[0], /every (?:physical )?scan|millisecond|XLSX|Typst|bare-metal/i);
  }
});
