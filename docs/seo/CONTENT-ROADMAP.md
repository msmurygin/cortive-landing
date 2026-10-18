# Content Roadmap — Quark WMS / Sprint 1

18 October 2026. **Proposals only.** No page creation, commercial copy rewrite, new navigation, CTA change or publication is included in this sprint. Preserve the deployed visual identity and the full /vision manifesto. The screenshot-removal proposal has been cancelled.

## Architecture decision: start with three existing URLs, at most two additions

The current homepage can own “warehouse management system / warehouse management software” intent. A second general WMS landing page would divide a small amount of product evidence across near-duplicates. Retain /screens.html as supporting interface material and /vision as long-term positioning.

The smallest useful expansion is **one verified inventory feature page** and **one buying/cost guide**, released separately after review. Neither needs a whole blog or an industry/location page factory. If inventory evidence is insufficient, prepare the guide brief and finish MVP evidence rather than publishing a thin feature page.

| Candidate | Decision | Distinct purpose / cannibalization control | Publication gate |
|---|---|---|---|
| Existing / | Sole category/product landing | Quark + enterprise WMS evaluation context, overview, fit and an honest conversation CTA | Copy/claims reviewed; early-stage disclosure retained |
| /warehouse-management-system | Do not add now | Same broad buyer/keyword intent as home | Revisit only if home later has a clearly different purpose and a deliberate migration/canonical plan |
| /features/inventory-management | First product-page candidate | How stock by location/owner/hold actually changes through a verified workflow; accuracy as supporting content | WMS-01/02 evidence in SEO-AUDIT.md, scope and copy approval |
| /wms-cost | First supporting buyer-guide candidate | Cost drivers, implementation scope, TCO and explicit-assumptions ROI; no invented Quark prices | Editorial review of model, sources and assumptions; no unsupported market ranges or savings |
| /solutions/3pl | Defer | Multi-client operating problem and fit, not a reworded inventory page | WMS-08 proves isolation/client processes; approved billing/portal/integration boundaries and target 3PL profile |
| /features/warehouse-picking | Defer | Task allocation/confirmation, short picks and replenishment; RF as a subsection | WMS-05/08 real operations/device E2E; prototype is insufficient |
| Existing /vision | Preserve intact | Manifesto, architecture ambition and future AI Harness/Onboarding/Support | No presentation as production functionality |
| Existing /screens.html | Retain as supporting material | Interface inspection, avoiding duplicated feature-page explanations | Captions remain factual; screenshot presence is not workflow proof |

Do not add separate cloud-WMS, ROI, inventory-accuracy, RF, US/UK or city/vertical pages yet. Cover related intent within a sufficiently useful parent page first.

## Evidence before copy

For each proposed product page, retain:

- WMS repository and exact commit.
- Relevant handler/service, schema or migration and supported configuration.
- Reproducible happy path **and** exception/failure path.
- Persisted result, role/owner constraints and known limitations.
- What is implemented, prototype, setup-specific or future.
- An approved description matching this evidence.

Use **ACTION FOR AGENT** for unresolved checks. Never silently turn an unresolved check into a published capability. Customer, certification, country coverage, connector, SLA, duration and ROI claims additionally need founder/operational evidence; code alone is insufficient.

## Review proposals for the existing homepage

No production copy has been changed. Consider a focused review:

1. Name the full product category and early-stage evaluation scope naturally in the first screen. The existing H1 is valid but broad; do not add another H1 or mechanically repeat keywords.
2. Explain a particular operational problem using the first completed WMS evidence record. Keep unsupported receiving/picking/cloud/security claims out of the hero.
3. Explain what a buyer can evaluate now: available build, workflow and limitations. Do not imply a self-service live demo exists.
4. Keep “Discuss your warehouse”. An agenda clarifier may help, but response-time/onboarding promises need approval. Extra qualification fields are a separate form/privacy decision.
5. Preserve current visual direction; decide separately which interface materials belong where. This sprint does not remove or replace screenshots.

This is a brief for review, not approved final commercial copy.

## Page brief 1 — inventory management

**Proposed URL:** /features/inventory-management

**Audience:** operations director, inventory controller, IT evaluator.

**Primary intent:** warehouse inventory management software. Secondary: location/owner/hold inventory and accuracy.

**Purpose:** make one supported stock-control use case understandable and testable.

Suggested structure, conditional on evidence:

- One H1 naming warehouse inventory management.
- Operational problem and precise available-build scope.
- A workflow: starting state → permitted operation → stored movement/balance → exception handling.
- Supported dimensions and calculation of availability/holds; omit unsupported behavior.
- Accuracy/reconciliation section describing a verifiable process, without an invented accuracy percentage.
- Evaluation checklist: data, permissions, device/integration constraints and failure checks.
- Known limits and a conversation CTA consistent with home.

**ACTION FOR AGENT:** complete WMS-01/02, including concurrent updates and cross-owner boundaries. Do not infer correct ATP, serial tracking, cycle counts or client segregation from visible columns.

**Links after approval:** home product section → feature page; feature page → gallery anchor, approved cost guide and contact. Link to Vision only to explain current scope versus ambition. Self-canonical; sitemap entry at release.

## Page brief 2 — cost and implementation business case

**Proposed URL:** /wms-cost

**Audience:** operations/IT/finance sponsor and 3PL owner building a shortlist.

**Primary intent:** WMS implementation cost. Secondary: WMS business case/ROI.

**Purpose:** help scope an evaluation without fabricating a price list.

Suggested structure:

- One H1 naming WMS cost and implementation scope.
- Distinguish software/subscription, configuration, integration, migration, devices/network, testing, training, transition, support and ongoing changes.
- Scoping questions and assumptions needed for a useful estimate.
- Explain that Quark commercial scope/pricing is individually confirmed; no unpublished fee table or free-implementation promise.
- TCO and ROI with a consistent horizon. Define ROI = (benefits − costs) / costs; payback is separate. Label hypothetical assumptions; do not borrow vendor savings as Quark results or double-count capacity and cost savings.
- Factual US/UK considerations without local-service claims. Currency examples must be explicitly hypothetical or dated/sourced, not a Quark quote.
- Evaluation checklist and existing low-commitment enquiry route.

**ACTION FOR AGENT:** founder confirms quotable cost categories, evaluation scope and third-party dependencies. No calculator is needed until assumptions and demand justify it.

**Links after approval:** home → guide; inventory ↔ guide where useful; guide → contact. Keep cost/ROI together until data supports two distinct useful intents. Do not add FAQ schema merely to chase rich results.

## Release gates

1. Written approval of positioning, claims, purpose and CTA; capability evidence attached.
2. Distinct intent; no duplicated paragraphs with country/industry swaps.
3. One H1, useful H2/H3, reviewed title/description, static HTML and self-canonical.
4. Resolved links; meaningful alt/dimensions for retained images; mobile/keyboard checks.
5. Accepted-enquiry measurement verified, separately from qualification and inbox delivery.
6. Preview reviewed, then an **explicit release step**. No automatic merge or production-branch push. Update sitemap and inspect public URLs at release.
7. Review relevant queries, discovery and qualified enquiries before another page. No fixed ranking promise or arbitrary publication quota.

## Recommended next sprint

1. Finish one inventory/hold/movement evidence package in the WMS repository.
2. Approve one analytics service and verify an owner-controlled test enquiry and organic landing report.
3. Review one inventory brief; alternatively review the cost guide if product evidence is not ready. Release at most one approved page.
4. Refresh the already-submitted sitemap and check discovery of the newly introduced /vision without rewriting it.
5. Use USA/UK exports and first-party query data to pick the next subject.

Founder decisions are limited to target operation, evaluation/deployment scope, analytics choice and one content brief. SEO must not require parallel development of unrelated WMS capabilities.
