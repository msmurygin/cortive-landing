# Integrations catalogue release candidate

Date: 2026-10-27
Route: `/integrations`
Status: prepared for founder review; not a production activation of customer integrations.

## Scope

- One crawlable catalogue with 17 cards: six global commerce platforms, seven regional marketplaces, three marking systems and Telegram notifications.
- Text distinguishes connector definitions, configurable flow templates and notification channels. It describes only the specific exchange shown by each template.
- Contextual link in Product / Platform, a shared Product-footer link, canonical metadata, CollectionPage / ItemList and BreadcrumbList JSON-LD, one sitemap entry and canonical Vercel routes.
- Current header, logo, theme, forms, privacy, analytics, calculator, Assessment and existing video assets are preserved. No new dependencies or third-party scripts.

## Claim boundaries

- No promise of complete two-way synchronisation, automatic cancellation/change handling, vendor certification or live-account validation.
- Stock templates are described for Wildberries / Ozon and the Kaspi FTP feed; stock support is not inferred for all other platforms.
- OLX.kz and Avito describe listing templates, not a promised order-import workflow.
- Telegram is an alert channel. The WMS endpoint is internal, not a separate external integration.
- Validation statement: mock servers and end-to-end contract tests; no live customer marketplace account acceptance tests.
- Amazon is listed as a connector with a configurable template, with no production-readiness claim. Its current Orders v0 template needs an API-version review/update before live account activation. This does not block reviewing the catalogue.

## Validation

- `node --test tests/*.test.cjs`: 32 passed.
- `git diff --check`: passed.
- Local link / anchor / asset check: 32 references, no broken targets.
- Browser: desktop 1434 px and mobile 390 px; light/dark; mobile menu and Escape; catalogue anchor navigation; no page overflow; no browser errors observed.
- The website is static HTML/CSS; no separate build step or WMS runtime tests are required for this content-only change.
- Existing preservation tests permit only the exact new footer link, sitemap URL and route objects; all other protected settings remain compared to their baseline.

## Deployment and rollback

1. Review the protected branch preview and the exact PR diff.
2. Obtain founder approval for this catalogue release. Do not infer approval from an agent-to-agent request.
3. Merge the approved website commit to `main`; Vercel publishes the static site.
4. Check `/integrations` is 200, canonical is `https://quark.build/integrations`, HTML contains the cards and JSON-LD, and sitemap contains the URL once.
5. Check `/integrations.html` and `/integrations/` redirect permanently to `/integrations`. Smoke-check Product, contact, Cost, Assessment, Vision and mobile menu.
6. If the release introduces a regression, revert the catalogue release commit and let Vercel redeploy. Recheck the existing routes and sitemap. No database or data migration is involved.
