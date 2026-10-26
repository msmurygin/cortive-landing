# WMS cost: supplier examples and local PDF checklist

Status: founder approved publication on 26 October 2026. Prepared against the base below; deployment and live verification are recorded separately in the local release evidence.
Base: origin/main b9cfb896bc888d5786d78937db4e70da52f60c2f.
Branch: proposal/wms-cost-pricing-checklist-2026-10-26.

## Scope

Two requested additions to /wms-cost:
- Dated, attributed examples of publicly published supplier pricing and their different charging units.
- Download Budget Checklist (PDF), generated entirely in the browser after a successful Quick Scope or Advanced Budget result.

No changes to the demo offer, author byline, homepage, Product, Vision, Assessment, financial model, currencies, metadata, forms, privacy policy, analytics or deployment configuration.

## Pricing evidence

Checked against the official pages on 26 October 2026:

| Supplier | Fact used | Scope to preserve | Source |
| --- | --- | --- | --- |
| Mintsoft | Medium from GBP 325/month | Up to 5,000 orders/month; unlimited browser users. Mobile app user licences required. Confirm modules, onboarding and support. | https://www.mintsoft.com/warehouse-management/pricing/ |
| Ongoing WMS | International platform EUR 1,299/month; onboarding EUR 6,200 | Five named warehouse users included; onboarding includes 40 hours. Additional users, services, sites and shipment/provider charges need checking. | https://ongoingwarehouse.com/product/pricing/ |
| Logiwa | No numeric public price | Quote depends on fulfillment volume and complexity, rather than user count. | https://www.logiwa.com/pricing |

These are examples, not an average, comparable vendor ranking, complete project budgets or Quark prices. No exchange-rate conversion. No values are copied into calculator defaults. No supplier Offer/price structured data is introduced. Recheck sources immediately before release if approval is delayed, then quarterly or when a changed source is detected. Keep the checked date honest.

## PDF behaviour and privacy

- Available after generating a checklist or calculating a valid budget. Changing mode/inputs or resetting invalidates the previous export snapshot.
- Quick Scope: scope (including unknowns), missing assumptions and all seven preparation actions. Two pages.
- Advanced: scope, exact calculated totals and category breakdown, active licensing inputs, all financial assumptions, formula, exclusions and preparation checklist. Three pages in regression fixtures.
- USD/GBP/EUR are written as currency codes in the PDF to avoid font-dependent currency glyph issues. Cents remain exact. Formulas are reused from the unchanged cost-model.js.
- No email gate, account, upload, API, cookie, browser storage or added analytics event. Extra input properties such as email/notes/Assessment answers are ignored.
- Blob download is created locally, then its object URL is revoked after 60 seconds. The downloaded file persists on the visitor's own device; they control retention/deletion. The interface warns about confidential figures.
- The PDF date is UTC. The PDF is a planning checklist, not a quotation, ROI promise or implementation commitment.

## Verification

- `node --test tests/*.test.cjs`: 23 passed, 0 failed.
- `node --check` passed for cost-model.js, cost-ui.js, cost-pdf.js; `git diff --check` passed.
- Static site: no build/lint package or compilation pipeline is configured; no build result is invented.
- Ten synthetic PDF fixtures parsed with pypdf, rendered with Poppler, and checked for all seven checklist sections and safe text bounds: Quick known/unknown; USD/GBP/EUR subscription/perpetual; zero costs; large safe totals. Representative pages visually inspected.
- Browser: real Quick Scope PDF downloaded and parsed. Advanced EUR result matched EUR 19,360 initial / 3,600 annual / 30,160 three years / 37,360 five years. Keyboard export action succeeded. Input changes and reset hid stale results. Unknown inputs remained unknown.
- Mobile viewport requested 390x844 (page content width 375 due to scrollbar): no horizontal overflow; export button, focus outline, menu open/close and reset checked. This is responsive browser QA, not physical iOS/Android certification.
- No browser console errors observed. No form submission or live enquiry was sent.
- Existing regression assertions keep other site content, forms, configuration, SEO and financial formulas frozen. The old whole-file UI equality assertion is replaced by targeted cost tests because the UI now contains the export action.

Local evidence and sample PDFs remain outside the public repository. Only this source note and tests belong in the proposed diff.

## Release gate

Founder approved this variant and then explicitly authorized publication on 26 October 2026. The approved preview is local, bound to 127.0.0.1 with X-Robots-Tag: noindex, nofollow, noarchive. The production page keeps its existing index,follow metadata.

Release procedure: rerun tests and recheck supplier terms if needed, commit the six-file diff and release via the existing Git/Vercel process. Verify /wms-cost, the new PDF asset, calculator and unchanged canonical after deployment. Roll back by reverting the isolated release commit and redeploying the previous production revision.
