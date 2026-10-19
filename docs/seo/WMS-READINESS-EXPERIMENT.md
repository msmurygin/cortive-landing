# Growth Experiment 01 — Warehouse Readiness Assessment

19 October 2026. **PRIVATE PROTOTYPE / NO PUBLICATION APPROVAL.** Hypothesis: structured project preparation may help enterprise buyers and improve qualification. No conversion uplift, product fit or AI capability has been validated.

## Review and isolation

- Working loopback preview: `http://127.0.0.1:4190/tools/wms-readiness-assessment`.
- Source: [question/rule/session model](../../drafts/readiness/assessment-model.js), [UI](../../drafts/readiness/assessment-ui.js), [local PDF writer](../../drafts/readiness/assessment-pdf.js), [page](../../drafts/readiness/index.html), [styles](../../drafts/readiness/assessment.css).
- Build: `node scripts/build-readiness.cjs`. Run: `node scripts/preview-readiness.cjs` (port 4190, loopback only).
- Separate package in excluded `review-dist/readiness-experiment/`: static assets, noindex headers/metadata, Disallow-all robots and a guard refusing production builds. No deployment performed. A future external preview must have verified access protection and separate authorization; no unlisted public URL is treated as private.
- Source, scripts, tests, documentation and generated output remain excluded by the current SEO branch's `.vercelignore`. No homepage, Vision, `/wms-cost`, public routes, sitemap, API, privacy, analytics or email address was changed for the experiment. Production assessment route remains 404.
- RC-A was released first, separately, through [release PR #4](https://github.com/msmurygin/cortive-landing/pull/4), merge `2a628cbfa41cbd28a1959dc6818865342e017362` (exact tree of approved `8b974f8`). This experiment was not included. Existing draft PR #3 is not merged.

## Questionnaire and workflow

English, USA/UK enterprise evaluation audience; 12 short question groups across operations, technology, challenges and preparation. A 3–5 minute first pass is a design target, not a measured completion time.

| Question | Captured information |
|---|---|
| Q01 | Warehouses and approximate active users |
| Q02 | Daily volume, explicitly orders or order lines |
| Q03 | Receiving/putaway/picking/replenishment/packing/shipping and process variants |
| Q04 | Current management approach and ERP presence |
| Q05 | Required integration categories, including none/unknown |
| Q06 | RF/mobile usage and automation categories |
| Q07 | Multiple reported operational challenges, including none/unknown |
| Q08 | SKU/location master-data preparation |
| Q09 | Agreed operational requirements |
| Q10 | Internal project owner and capacity |
| Q11 | Intended decision/start horizon; never a supplier delivery estimate |
| Q12 | Budget-preparation status, no financial amount |

Initial unchecked consent enables **local processing only**. No answers are captured into the session before Start. Progress, Back/Next, retained answers, edit/recalculate and Restart work without registration/email. Blank numbers and unknown choices remain unknown. None/unknown are mutually exclusive with known multi-select options. Numeric bounds are technical input limits, not warehouse benchmarks.

## Disclosed deterministic rules — experimental, not certified

There is no combined score or percentage. Every finding and candidate scenario carries question IDs, answer keys, values and readable supporting answers.

**Operational complexity** uses four core inputs: site count, process variants, selected integration categories and automation. Automation, specialised process rules, three or more connection categories, or multiple sites plus a connection imply **Complex**. Other observed multi-site/variant/connection factors imply **Moderate**. With no such factors and all four core inputs known, **Standard**; otherwise **Insufficient information**. When positive factors are known but other facts remain unknown, the report shows both the observed classification and the unknown inputs. These cutoffs are transparent prototype conventions, not industry benchmarks or Quark-fit rules.

**Implementation readiness** considers data, requirements, owner/capacity and budget preparation only. All four explicitly prepared → **Ready for detailed evaluation**. Known gaps → **Preparation required**. Unknowns alone → **Insufficient information**. Explicitly exploring, undocumented requirements and no owner → **Initial exploration**. The known-dimension count is coverage, not a score. High volume, complexity, manual processes and absence of an existing WMS do not lower readiness. None of these labels certifies operations or go-live readiness.

Priority 1 findings: explicit owner/data gaps. Priority 2: scope/budget gaps, interfaces/equipment and reported problem investigations. Priority 3: unknown facts, device checks or validation of an otherwise prepared basis. Unknown recommendations provide question-specific actions, not a repeated generic warning. Reported challenges are not verified defects.

Candidate receiving/putaway, inventory/cycle-count, outbound or ERP scenarios follow selected workflows/problems/connections. They are supplier evaluation candidates only, never promises that Quark implements or fits those requirements. No costs, ROI, effort or implementation duration are inferred.

## Exports and privacy

The complete on-page report is available without email. It contains profile, separate classifications and factors, prioritised findings, supporting answers, candidate scenarios, a preparation checklist, all answers, generation time, rules and limitations.

- **PDF:** a small framework-free client writer builds a paginated text PDF from the same report sections. It includes all answers, recommendations, date, Quark/website and preliminary disclaimer. No remote font/PDF service. English questionnaire typography is normalised to printable ASCII; no arbitrary free-text collection. Browser print remains an optional alternative.
- **JSON:** local Blob download, `assessmentSchemaVersion: 1.0.0`, `rulesVersion: 0.1.0`; profile, operational characteristics, systems, problems, preparation, unknown requirements, findings and their supporting answers. No claim these are existing WMS metadata entities.
- **Storage/transmission:** no API, database, accounts, cookies, session/localStorage, analytics or automatic export. Answers exist in page memory after consent. Restart clears session/answers/report and removes consent. Local downloaded files remain the visitor's responsibility and may contain confidential operational information.
- The loopback server does not parse/log answer bodies; POST is 405 and query parameters are rejected. CSP has `connect-src 'none'` and `form-action 'none'`; all assets are local. No assessment answers are placed in a URL.
- Contact CTA is separate and disabled until explicit choice. It opens the existing contact form with **no attached answers, report, query parameters or new CRM**. The visitor then chooses whether to submit email/industry under the existing flow. Referrer policy is no-referrer. Local-processing consent is not analytics consent.

## Validation evidence and limits

[Tests](../../tests/readiness.test.cjs): **17 experiment tests; 47 tests total pass**, including prior RC-A/form/privacy/composition checks. Build, static validation, JS syntax and whitespace checks pass. Tests cover the specified small/multi-site/unknown/complex-but-prepared/owner/data/manual-management/edit/reset scenarios, traceability, explicit consent, deterministic versioned JSON, PDF object offsets/content, noindex, production-build refusal and rejected submissions.

Browser QA used synthetic data only:

- Two sites / 50 users / 1,000 order lines / interfaces and process variants / prepared data, owner, requirements and budget → **Complex + Ready for detailed evaluation**. Back/Next retained values and keyboard activation worked. Actual JSON download was reopened and validated.
- Twelve unknown question groups → both labels **Insufficient information**, no invented negative gaps. Mobile 390×844 had document width 375 with no horizontal overflow. All 12 Next actions worked by keyboard, focus moved to headings, result access required no email.
- Contact disabled before its checkbox; enabled after checking. Restart clears answers/report and returns to unchecked consent/disabled Start. [Sanitized QA record](evidence/readiness/browser-qa.json).
- Browser PDF handler generated the local PDF Blob without an error. Independently regenerated bytes from the **same client writer**, parsed all 12 questions/findings/disclaimer and visually inspected every page of the four-page synthetic example. Direct file-save completion in the in-app browser was not independently confirmed; its native print dialog could not be automated with available app permissions. Do not count a click/print request as a confirmed saved PDF. Verify normal Chrome/Edge/Safari downloads manually during the moderated test. JSON filesystem download was confirmed.

No real buyer timing, salesperson validation, accessibility screen-reader audit, cross-browser matrix, conversion improvement or product compatibility is established. The prototype is suitable for **moderated private discovery**, pending founder review and expert walkthrough before a public experiment.

## Small commercial validation plan — analytics remains OFF

1. Have at least one experienced enterprise WMS salesperson or implementation consultant walk through the questions/rules and challenge misleading classifications or missing supplier questions. Then run approximately five moderated synthetic/internal walkthroughs, including unknown and complex-but-prepared cases.
2. If understandable/useful, propose a small invitation pilot with roughly 10–15 qualified USA/UK operations/IT/3PL buyers. These are suggested observation targets, not sample-size guarantees or forecasts. Confirm language, actual completion time, which questions buyers cannot answer, whether the checklist changes their next internal/supplier discussion, and download usability.
3. Before any public instrumentation, obtain founder approval of publication, privacy/consent and durable reporting. Local-processing consent does **not** enable tracking. Do not activate new production analytics during this experiment preparation.
4. Proposed consented aggregate stages: starts, completions, PDF-download **requests**, optional print requests, JSON-download requests and CTA clicks. Payload at most event enum, tool/rules version and coarse time grouping; no answers, classes, volume, site/user counts, report contents, arbitrary URL/referrer or free text. Do not introduce cross-stage person identifiers under an 'anonymous' label. Successful browser save is not observable from a click; ask during moderated sessions if needed.
5. Keep provider acceptance, owner-confirmed inbox receipt, confirmed enquiry and manually qualified WMS opportunity separate. Existing contact flow sends no assessment ID or answers; aggregate funnel stages cannot be automatically joined into per-person conversions. Founder records qualification only in their approved existing process, not a new CRM. No new lead test is sent.
6. Minimum useful observations before expansion: expert review completed, five end-to-end walkthroughs without critical privacy/export or false-certainty issues, and qualitative buyer feedback from the small invitation cohort. Compare starts/completions and requested downloads with their actual denominators/consent coverage; small counts are directional, not evidence of causation. Expand only if buyers find the output actionable and the founder sees relevant opportunities without undue support cost. Revise or stop if outputs mislead, repeat unhelpful questions or collect unnecessary operational detail.

## Proposed SEO placement — not applied

Candidate route `/tools/wms-readiness-assessment`, intent **project preparation and vendor evaluation**, not pricing. Title/description/canonical and short explanation are prepared; noindex remains. A future approved contextual `/wms-cost` link could read: 'Not ready to request estimates? Prepare your warehouse requirements with the WMS readiness assessment.' No live link, navigation, sitemap entry or new SEO cluster was added.

## Future AI Onboarding boundary and remaining decisions

JSON can be a future consultant-reviewed input; no AI API, agent, metadata entity mapping, WMS configuration, ERP connection or backend is implemented.

**ACTION FOR AGENT:** only if a future integration is authorized, inspect the actual WMS repository for supported domain/entity/configuration schemas, validation, permission boundaries and importer/versioning contracts; map this independent assessment schema explicitly. Do not invent an existing Quark entity or API. Separate consent/data policy would be required before transmitting answers to Quark or an AI service.

Remaining: founder reviews questions/rules/copy/export behaviour; an experienced WMS expert performs the walkthrough; ordinary-browser PDF download/printing and accessibility checks are completed. Any external protected preview, contextual live link, public release or consented reporting requires separate founder approval. No public commercial activation is authorized by this prototype task. No substantial architecture change, new service or credential was needed.
