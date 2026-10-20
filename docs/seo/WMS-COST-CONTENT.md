# WMS cost content and calculator — Sprint 2

**19 October 2026 · DONE, ready for content review; not published.** Canonical draft copy lives in [drafts/wms-cost.html](../../drafts/wms-cost.html), not a parallel article in docs. Local route: /wms-cost via scripts/preview.cjs. The drafts directory, review build and scripts are excluded from Vercel. No production rewrite, sitemap entry or homepage link has been added.

## Editorial scope

- Intent: WMS pricing, implementation budgeting and total cost of ownership for USA/UK enterprise buyers. No volume/KD/CPC claim or fabricated market price range.
- Title/H1: How Much Does a Warehouse Management System Cost? One category guide; ROI stays a section, not a competing article.
- Covers subscription versus perpetual licensing, implementation labour, integrations, migration, RF devices/infrastructure, training/transition, ongoing support, three-/five-year TCO and omitted-budget risks.
- CTA: Discuss Your WMS Project, linking to the existing home contact form. It does not rename the homepage CTA or promise a demo, delivery time or quotation.
- Quark deployment, available connectors and pricing are explicitly subject to evaluation. Cloud pricing terms are explained generically; no production SaaS/AI claim is made.
- Sources: [ShipHero cost guide](https://www.shiphero.com/blog/warehouse-management-system-cost), [Mintsoft cost guide](https://www.mintsoft.com/warehouse-management/warehouse-management-software-cost/), [Extensiv business-case guide](https://www.extensiv.com/resource-library/guide/calculating_roi_for_wms), rechecked 19 October. Their figures/results are not copied as Quark estimates.

## Calculator contract

All financial inputs start blank. Counts start at one warehouse, one user and zero integrations; these are editable scoping defaults, not market estimates. Explicit zero is accepted; blank/negative/nonfinite/overprecision/unsafe totals are refused. USD and GBP label a consistent unit and do not perform FX conversion. Scope complexity and delivery approach are descriptive assumptions, with no hidden price multiplier.

Let W=warehouses, U=users, I=integrations, D=implementation person-days and R=day rate:

| Category | Formula |
|---|---|
| One-off licence | Perpetual platform + U × per-user licence; zero for subscription |
| Implementation | D × R |
| Setup | W × per-warehouse setup |
| Integrations | I × per-integration one-off cost |
| Devices/infrastructure | W × per-warehouse amount |
| Migration/training | Entered totals |
| Initial contingency | User percentage × sum of all preceding initial categories, rounded to cents |
| Annual subscription | 12 × (monthly platform + U × monthly per-user fee); zero for perpetual |
| Annual recurring | Subscription + entered annual support/maintenance + other annual operations |
| TCO | Initial total + 3 or 5 full years of recurring cost, including year one |

Money is calculated in integer cents in [cost-model.js](../../drafts/assets/cost-model.js). Support/other recurring are whole-scope totals; include hosting and interface subscription costs where applicable. Avoid entering bundled items twice. Excluded: taxes/VAT, financing, depreciation, inflation, discounting, currency conversion, growth and benefits. The UI explains these limits. ROI is not calculated or guaranteed.

Inputs remain in page memory: no network/API/storage/analytics use, no AI API and no prefilled supplier prices. Synthetic unit/browser fixtures are labelled QA inputs and are not suggested prices. Results are invalidated on change/reset; inactive licence fields are disabled and excluded.

## Internal linking and structured data

Local draft links connect cost ↔ inventory, existing gallery/Vision and contact. Breadcrumb navigation matches a minimal BreadcrumbList with home and this planned URL. No invented Organization legal entity, reviews, ratings, prices or offers; existing homepage SoftwareApplication is untouched. JSON syntax/required breadcrumb fields are checked locally. Google Rich Results Test against a public new URL is pending publication; no online rich-result validation is claimed.

## Approval and release checklist

1. Approve the cost explanations, calculator assumptions and new-page CTA. Current code is reviewable without publishing.
2. Move only the approved draft(s) to public route files; point /draft-assets references at approved public assets, configure canonical redirects/rewrites and remove review notice/noindex only at release.
3. If inventory is not approved, remove the cross-link to its draft from the released cost page. Never ship a link to an unpublished route.
4. Add the approved sitemap entry and descriptive home link together. The current home and /vision remain unchanged in this PR.
5. Complete production measurement/controlled delivery prerequisites, inspect public HTML and run post-release checks. Publication requires an explicit founder release instruction.
