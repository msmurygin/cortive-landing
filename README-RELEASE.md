# Quark website — release package (QDS v1)

This is a drop-in replacement for the runtime files of `cortive-landing`. Copy the contents of `site/` over the repository root on a release branch, then review the diff. Nothing has been deployed.

## What changed
- **New design system:** `design-assets/qds.css`, `qds.js` and `capability-map.css` replace `site.css` and `site.js`.
- **Home:** organised around the four buyer questions. On the inventory screenshot, the light theme shows `balances-light.png` and the dark theme shows `balances-by-location.jpg`.
- **Product:** Capability Map v2 is integrated, with modules 01–05, workflow examples and a CTA. Legacy anchors still work: `#topology`, `#movements`, `#studio`, `#stock`, `#allocation`, `#configuration`, `#inbound`.
- **Vision:** the full manifesto (§01–§07 plus the name note) is carried over in the new system. The animated console and marquee are replaced with a static change-set panel.
- **WMS Cost:** the same article and calculator; `assets/seo/cost-model.js` and `cost-ui.js` are unchanged, and all ids and names are preserved.
- **Readiness Assessment:** `/tools/wms-readiness-assessment`. The original `assessment-*.js` engine is unchanged, with a new `assessment-assets/assessment.css`. The page is **indexable** and has been added to `sitemap.xml`.
- **Thanks, Privacy, Terms:** the shell is new; the legal body text is unchanged.
- **Navigation:** Product · Resources (Cost, Assessment) · Vision · Discuss your warehouse.

## Unchanged (commercial and data handling)
`api/lead.js`, `api/events.js`, `lib/lead-events.js`, `assets/leads.js`; the contact form fields, consent and honeypot; `/thanks.html`; `robots.txt`; `webrf/`. No new analytics.

## Config
`vercel.json` is the release version plus rewrites and redirects for `/tools/wms-readiness-assessment`. `sitemap.xml` has one new URL.

## Before release
1. Run the existing test suite. Tests that assert the old `ux-*` markup will need updating.
2. Smoke-test the contact form, the Cost Quick Scope and Advanced flows (USD/GBP/EUR), the full Assessment run including PDF/JSON/print, and the mobile menu.
3. The legacy `assets/styles.css`, `product.css` and `main.js` are no longer loaded by these pages. They are still used by `webrf/`, so keep them.
