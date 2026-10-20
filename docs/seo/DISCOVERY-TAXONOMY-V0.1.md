# Discovery Taxonomy v0.1 — private assessment extension

Taxonomy baseline: 19 October 2026. **Protected preview available; public release pending.** Current release composition, 76-test validation, reports and approval steps are in [Assessment release candidate](ASSESSMENT-RELEASE-CANDIDATE.md). Production is unchanged.

## Scope and product boundary

Extends the existing Warehouse Readiness Assessment using plain HTML/CSS/JS, its local PDF writer and isolated preview builder. The founder authorized implementation in the closed prototype, PDF/JSON, tests and a diff. The finalization sprint adds a separately protected preview; the production candidate remains local and unmerged.

The supplied `Quark Industries × Archetypes — Target Vision v1.0` is a taxonomy reference **only**. Its possible templates, suggested policies, regulatory examples, market numbers, implementation promises and AI setup narrative are not evidence or implemented functionality. No prices, ROI, legal conclusions, Quark fit, available templates or integration capabilities are inferred here.

Industry/model → relevant questions; explicit answers → user-stated characteristics; rules → hypotheses/open questions; separate product evidence → future feasibility verification. “Confirmed” means **explicitly user-reported**, not independently verified.

## Code and local review

- [Discovery model](../../drafts/readiness/discovery-model.js): local taxonomy, path selection, normalization, findings, dimensions, report and session transitions.
- [UI](../../drafts/readiness/assessment-ui.js), [HTML](../../drafts/readiness/index.html), [styles](../../drafts/readiness/assessment.css), [PDF writer](../../drafts/readiness/assessment-pdf.js).
- The original [schema-1 engine](../../drafts/readiness/assessment-model.js) remains unchanged and its tests remain in the suite. It supplies reusable field definitions and candidate baseline scenarios; its overall complexity classification is **not exposed** by the new brief.
- [Synthetic golden profiles](../../tests/discovery-profiles.cjs), [new tests](../../tests/discovery.test.cjs), [original regression tests](../../tests/readiness.test.cjs).
- `node scripts/build-readiness.cjs` builds excluded `review-dist/readiness-experiment` only. `node scripts/preview-readiness.cjs 4192` serves loopback at `http://127.0.0.1:4192/tools/wms-readiness-assessment`.
- Existing `.vercelignore` excludes drafts/scripts/tests/docs/review-dist. Meta and HTTP `noindex,nofollow,noarchive`, Disallow-all robots, no-store, no-referrer and production-build refusal remain. No production route, link or sitemap entry added.
- The finalization sprint provides a [Vercel Authentication protected preview](https://project-ogj6r-g7430ubzl-quark-build.vercel.app/tools/wms-readiness-assessment). Anonymous requests to the page/assets/API redirect to SSO. Noindex is separate from access control; production publication remains pending.

## Taxonomy and compact question path

Thirteen industries support multi-select plus exactly one primary among known selections: Pharmaceutical, Retail, E-commerce, HoReCa, FMCG, Food & Beverage, Fashion & Apparel, Electronics, Automotive & Spare Parts, Manufacturing, Healthcare (non-pharma), General Distribution and Other. All-unknown is valid. Primary is a single select limited to selected industries; Next requires a primary when known industries are selected.

Eight operating models are independent multi-select choices: Own Inventory, 3PL / Contract Logistics, Manufacturing Supply, Finished Goods Distribution, Retail Distribution Center, E-commerce Fulfillment, Cross-docking, Hybrid / Other. Other/Hybrid descriptions are optional, bounded to 120 characters and should contain no personal/confidential details. Hybrid without a concrete model yields a clarification, not a complete characterization.

IDs belong only to this assessment; they are **not** Quark WMS entities or APIs.

| Universal step | Reused / new inputs |
| --- | --- |
| D01 | Industries, one primary, conditional Other description |
| D02 | Operating models, conditional Hybrid description |
| D03 | Warehouses, active users, daily volume/unit; blank numbers are unknown |
| D04 | Quantity/lot/serial/expiry, ownership, environment, channel, UoM |
| D05 | Existing management, ERP, connections, RF, equipment |
| D06 | Workflows, process variants, reported challenges |
| D07 | Master data, requirements, owner, budget, horizon; progressive optional stakeholders, integration ownership, test preparation |

Seven universal groups reuse earlier inputs rather than duplicating them. Relevant conditional groups are deduplicated and capped at six. The 3–5 minute experience is a **design target, not observed timing**; some groups contain several fields. Expert/buyer walkthroughs must validate actual burden before publication. Skipped optional inputs remain explicitly unknown, not failed checks.

| Follow-up / priority | Trigger | Information sought |
| --- | --- | --- |
| COWN / 1 | 3PL or explicit multiple/mixed ownership | Depositors, cross-client differences, isolation/billing/labels/reports/interfaces |
| CREG / 2 | Pharma/healthcare, explicit lot/serial/expiry, or hazardous area | Jurisdiction, user-identified obligations, QC/release; no law inferred |
| CMFG / 3 | Manufacturing industry or manufacturing-supply model | Raw/WIP/finished, staging/issue/returns/batch, production order interface |
| CCOLD / 4 | Explicit cool/refrigerated or frozen/ultra-cold environment | Zones, monitoring, exception authority, segregation |
| CFLOW / 5 | FMCG/food/retail/HoReCa or retail DC | Pallet/case/each, replenishment, dispatch/promotion variation |
| CECOM / 5 | Fashion/e-commerce or e-commerce fulfilment | Variants, returns, packing/branding, peak variation |
| CSITES / 6 | More than one site | Process similarity and potential reuse |
| CAUTO / 7 | Explicit equipment or automation connection | Control ownership and fallback/recovery |
| CIF / 8 | Explicit external connections | Exchange pattern, owners and recovery/reconciliation |

Lower numeric priority is asked first; equal priority uses stable question ID. These are disclosed prototype routing conventions requiring methodology review, not industry benchmarks. A selected but displaced topic is recorded with its trigger evidence and a follow-up action in `questionPath.deferred` and the brief. It is never silently treated as answered.

## Findings, uncertainty and independent dimensions

Each finding has a unique assessment-local `ruleId`, `conclusionType` (`confirmed_answer`, `derived_hypothesis`, `unknown`, `recommendation`), explanation, uncertainty, action, priority and exact supporting question/answer references. Dimension factors reference the same fact rules. JSON retains complete evidence; human sections show readable source references.

Seven dimensions: Process Variability; Inventory & Traceability; Integrations; Automation; Compliance; Multi-owner Operations; Deployment Replicability. Each shows stated factors plus unknown/deferred/not-selected inputs. Qualitative status is `Evidence to evaluate` or `Insufficient information`; no overall percentage, precise effort rating or automatic “complex” label based on count/volume. Twenty identical 3PL clients remain distinguishable from three substantially different clients.

Readiness is separate: data, requirements, owner, budget, stakeholders, relevant integration ownership and test preparation. Explicit gaps → Preparation required; unknown preparation/horizon alone → Insufficient information; all relevant dimensions ready and horizon stated → Ready for detailed evaluation. Explicit exploration with no documented requirements and no owner → Initial exploration. Integration ownership is not a readiness requirement when the user explicitly selects no connections. Complexity, volume, manual operation or lack of WMS never penalize readiness. “Ready for detailed evaluation” does not mean ready for go-live, certified compliance or complete system requirements.

Owner/data gaps have priority 1; scope/interface/operational follow-ups priority 2; ordinary unknowns priority 3. Reported legal obligations get specialist verification priority 1, without endorsing applicability. Conflict questions (quantity-only plus tracking, ownership inconsistencies, ERP plans, incomplete Hybrid) preserve both statements and request clarification.

Conditional answers outside the current path and hidden Other/obligation descriptions are removed before assessment/export. Answers displaced by the cap are also removed; returning to the topic leaves them unknown. Form navigation keeps active answers, recalculates the path, focuses the step heading and supports restart. Unknowns are not converted to negative facts.

## Brief, compatibility and exports

The full ungated brief contains profile; explicit user-reported facts; derived discovery hypotheses; seven dimensions with uncertainty; separate implementation preparation; prioritized questions/actions; candidate pilot scenarios; answers in the active path; versions, date and limitations.

Candidate production, client separation, return/disposition, replenishment, stock release or baseline warehouse scenarios follow explicit answers. They are proposals for supplier validation, **not Quark product claims**.

JSON uses `assessmentSchemaVersion: 2.0.0`, `taxonomyVersion: 0.1.0`, `rulesVersion: 0.2.0`. This is a deliberate schema change: `complexityDimensions` replaces the former aggregate `operationalComplexity`. Existing answer keys remain where reused; sources now refer to Dxx/Cxx groups. A consumer must check version and not assume schema-1 question IDs or aggregate fields. Original schema-1 engine remains available for old fixtures; no backend importer exists or was altered. No silent conversion of old downloads is attempted.

PDF uses the existing small local writer, now selecting the Brief title for schema 2 and retaining the Report title for schema 1. PDF and JSON are generated in the browser; print remains available. Direct PDF supports printable English/ASCII plus the existing normalized typography. Non-ASCII free text is retained exactly in JSON/on-screen/print; direct PDF reports an unsupported-character error and directs the user to browser print, without silently corrupting or transliterating it. A Unicode embedded-font exporter is not included. This limitation must be evaluated in the English pilot.

The finalization package supplies ten synthetic browser-exported answer/brief JSON pairs, their PDFs and five highlighted examples. They are illustrative, not customer evidence, price/ROI estimates, legal advice or verified WMS scope.

## Privacy and publication boundary

Unchecked local-processing consent is required to start. No API calls, analytics, database/accounts, cookies or browser persistence. Answers live in memory; restart/close discards them. Downloaded reports remain under the visitor's control and can contain operational/confidential information. Optional free text is bounded, rendered with textContent, PDF-escaped and never automatically sent; do not enter personal/sensitive data.

CSP retains `connect-src 'none'` / `form-action 'none'`; loopback rejects POST and query strings. The separate contact choice opens the existing production contact form **without any answers, report, IDs or query parameters**. No new sharing subset, CRM, events or lead test is implemented. New analytics remains OFF; existing production settings and form/privacy untouched. Aggregate measurement remains a proposal under the previous experiment plan, requiring approved data policy and durable reporting before activation.

## QA, evidence and review gate

Taxonomy baseline machine-readable counts/results and source hashes (current finalization evidence is linked from the Assessment release candidate): [validation record](evidence/discovery/validation.json); [browser record](evidence/discovery/browser-qa.json); [provenance](evidence/discovery/provenance.json). No new WMS certification or SEO audit.

Automated scenarios cover small manual; large/repeatable; many-owner 3PL; pharma 3PL cold chain; pharma manufacturing; FMCG; fashion e-commerce; mixed/deduplicated/capped topics; unknown/conflict/primary validation; source traceability; edit/back/reset and cap displacement; schema versions; PDF content; no network/PII payload; noindex/local assets and rejected submissions. The pre-existing 47 tests are retained.

The earlier taxonomy browser record covered mixed, edited and unknown flows. It is superseded by the finalization record: all ten requested scenarios and actual saved PDF/JSON files, a complete protected-host flow, mobile 390×844 and 320×740, navigation, validation and privacy checks. See the Assessment release candidate for current evidence. Native printing, additional browser engines and full assistive-technology coverage remain manual checks.

**Remaining owners / minimal actions:**

1. Founder + Nikolay or another experienced enterprise WMS salesperson: one methodology walkthrough of routing priorities, terminology, report usefulness, burden and explicit unknowns. Revise if the output is too long or questions exceed the intended first pass.
2. QA: native print/free-text fallback, Safari/Firefox and screen-reader checks remain outside completed Chromium export QA. Current browser QA is not a full accessibility audit.
3. Founder: review the completed protected preview and the Assessment release candidate. Public publication, merge and tracking remain separate approvals.
4. **ACTION FOR AGENT**, only for a separately approved future WMS/AI integration: investigate actual entity/configuration/import schemas, permissions, compatibility and version contracts in the WMS repository; validate mappings against implementation/QA. Do not invent an existing metadata entity, API, template or AI capability. Separate consent/data handling is needed before any answer transmission.

Suitable for private moderated discovery, not validated as a conversion mechanism. Reuse the existing experiment's expert → five walkthroughs → small invitation cohort plan; do not expand into a new application or SEO content cluster.
