const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const publicHtml = cp.execFileSync('find', ['.', '-name', '*.html', '-not', '-path', './docs/seo/*'], { cwd: root, encoding: 'utf8' })
  .trim().split('\n').filter(Boolean).map(file => file.slice(2));

test('all public HTML uses the consent-first analytics loader exactly once', () => {
  for (const file of publicHtml) {
    const html = read(file);
    assert.equal((html.match(/\/assets\/analytics\.js/g) || []).length, 1, file);
    assert.equal((html.match(/\/assets\/analytics\.css/g) || []).length, 1, file);
    assert.doesNotMatch(html, /googletagmanager\.com|GTM-KG82DN24/, file);
  }
});

test('regional generators include the shared consent-first loader', () => {
  const snippet = read('scripts/analytics-snippet.cjs');
  assert.match(snippet, /assets\/analytics\.js/);
  for (const file of ['scripts/balkan-pages.cjs', 'scripts/legacy-pages.cjs']) {
    const source = read(file);
    assert.match(source, /require\('\.\/analytics-snippet\.cjs'\)/, file);
    assert.match(source, /\$\{analytics\}/, file);
  }
});

test('analytics waits for consent and sends only named interaction metadata', () => {
  const js = read('assets/analytics.js');
  assert.match(js, /consent === 'granted'/);
  assert.match(js, /navigator\.globalPrivacyControl/);
  assert.match(js, /navigator\.doNotTrack/);
  assert.match(js, /generate_lead/);
  assert.match(js, /tool_complete/);
  assert.match(js, /demo_request_click/);
  assert.doesNotMatch(js, /FormData|\.elements\[[^\]]+\]\.value|email\s*:/i);
});

test('privacy copy describes consent, analytics storage and excluded form contents', () => {
  const html = read('legal/privacy.html');
  assert.match(html, /Google Analytics and Google Tag Manager\s+load only\s+after/);
  assert.match(html, /assessment\s+answers, calculator inputs or other form contents/);
  assert.match(html, /quark-analytics-consent/);
  assert.match(html, /data-analytics-consent-reset/);
  assert.doesNotMatch(html, /send these events to\s+Google Analytics/);
  assert.doesNotMatch(html, /site itself sets no cookies/);
});
