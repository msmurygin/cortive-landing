# Growth Experiment 01 — Warehouse Readiness Assessment

20 October 2026. **Protected release candidate. Public publication and conversion validation remain pending.** Current preview, final QA, privacy summary and deployment/rollback plan: [Assessment release candidate](ASSESSMENT-RELEASE-CANDIDATE.md).

The [Discovery Taxonomy v0.1 design](DISCOVERY-TAXONOMY-V0.1.md) remains the specification of industry/model choices, bounded conditional questions, source-traceable findings, seven complexity dimensions, independent preparation and schema-2 PDF/JSON exports. It also records testing, limits and the methodology/approval gate.

## Review and isolation

- Local review: `node scripts/preview-readiness.cjs 4192`, then `http://127.0.0.1:4192/tools/wms-readiness-assessment`.
- Plain HTML/CSS/JS; no AI, backend, database, accounts, CRM or WMS configuration. No answers transmitted or persisted by the prototype. Consent is required for local processing; downloads remain under visitor control.
- Local/protected previews retain noindex metadata/headers, Disallow-all robots and production-build refusal. The final protected Vercel preview has verified Authentication; a separate local indexable eight-file candidate awaits publication approval.
- Existing site, homepage, Vision, live cost page, form, privacy, APIs, analytics and sitemap are unchanged by the experiment. Files/output remain excluded by `.vercelignore`.
- RC-A was released separately after A2 via [PR #4](https://github.com/msmurygin/cortive-landing/pull/4), production merge `2a628cbfa41cbd28a1959dc6818865342e017362`, identical to approved `8b974f8`. Inventory RC-B was not included.

## Evolution and compatibility

The initial 12-group schema-1 model is retained at [assessment-model.js](../../drafts/readiness/assessment-model.js) with its 17 regression tests. Its [original browser record](evidence/readiness/browser-qa.json) is historical evidence, not a description of the current questionnaire. Discovery schema 2 reuses applicable fields/session/UI/export infrastructure; no former aggregate score is presented in the new brief. Original downloaded reports are not rewritten. Consumers must check schema/taxonomy/rules versions.

The [discovery engine](../../drafts/readiness/discovery-model.js) provides seven universal groups and up to six deduplicated follow-ups; overflow becomes explicit open questions. [Finalization browser QA](evidence/assessment-rc/browser-qa.json) supersedes the earlier [taxonomy browser QA](evidence/discovery/browser-qa.json) and [taxonomy validation](evidence/discovery/validation.json). The supplied Vision is a taxonomy reference only, never capability or compliance evidence.

## Commercial hypothesis and small validation plan

Hypothesis: structured warehouse discovery may make a supplier conversation more useful and improve qualification. This has not been validated as a conversion mechanism, product-fit test or implementation estimate.

1. One enterprise WMS salesperson/implementation consultant, ideally Nikolay, reviews terminology, routing priorities and whether the findings are actionable.
2. Approximately five moderated internal/synthetic walkthroughs, including unknown, conflicting and complex-but-prepared profiles. Measure actual completion time and report burden; 3–5 minutes is only a design target.
3. If useful, request approval for a small invitation pilot with roughly 10–15 qualified USA/UK operations/IT/3PL buyers. Suggested observation targets are not statistical guarantees or forecasts.
4. Record usability/meaningfulness qualitatively before expansion. Do not infer saved files from download clicks or enquiries from CTA clicks. Keep provider acceptance, owner-confirmed inbox receipt, enquiry and manually qualified opportunity distinct. No new real lead test is sent.
5. New analytics stays OFF. Any future approved aggregate stage design is limited to event enum/tool version/coarse time grouping: starts, completions, export requests and CTA clicks. No answers, classes, counts, report contents, free text, full URL/referrer or hidden scoring. Optional contact opens the existing flow without assessment payload. No automatic per-person attribution is possible under this design.
6. The requested protected preview is complete. Public publication, live links and durable reporting/privacy settings still require founder approval. Actual Chromium downloads are verified; native printing, other browser engines and full assistive-technology checks remain outside that evidence.

**ACTION FOR AGENT:** a future separately authorized AI/WMS importer must investigate actual repository schemas, capabilities, permissions, version contracts and data-handling requirements. No existing Quark entity/API/template is invented or integrated in this experiment.
