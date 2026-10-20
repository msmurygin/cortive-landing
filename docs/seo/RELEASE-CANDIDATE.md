# Sprint 2 — Release Candidate & Approval Gate

19 October 2026 · PR [#3](https://github.com/msmurygin/cortive-landing/pull/3) · branch `seo/foundation-sprint-1`. **P0 approved for RC-A protected preview only. No merge or production release authorized.** These four approval documents supersede Sprint 2's future-release instructions where they differ; the earlier reports remain dated evidence.

## Decision in one minute

**RC-A: A1 conditionally approved; final approval of the requested UX revision remains pending. A2 production release is NOT approved.** The founder accepted the article, CTA, footer link and contrast improvement. The updated protected preview adds Quick Scope, progressive Advanced Budget, EUR and a sourced configurability explanation for final A1 review. RC-A remains independent of WMS certification. Keep new measurement OFF. Existing form and privacy remain as in production in the eventual minimum release; the review copy disables enquiries as well.

**RC-A measurement extension: BLOCKED.** Inbox receipt for the single labelled test was confirmed by the founder on 19 October 2026. The privacy proposal still requires provider/controller decisions, and current Vercel Hobby logs cannot support a complete weekly report. Do not make tracking activation a prerequisite for the first cost-page release. This is staged composition within RC-A, not another SEO sprint.

**RC-B: BLOCKED.** The implemented inventory scope is preserved. Relevant selected-build QA/retests and founder approval of claims/visual references remain outstanding. No promise that expected bug fixes are already complete.

## Exact compositions and private previews

Run `node scripts/build-rc.cjs` to reproduce three local snapshots under ignored, Vercel-excluded `review-dist/`. Each has an `RC-MANIFEST.json` with baseline, source commit, exact changed paths and content hashes. Generation never modifies public source files or authorizes deployment.

| Candidate | Private browser preview | Contents / explicit exclusions |
|---|---|---|
| RC-A, recommended minimum | [Cost](http://127.0.0.1:4180/wms-cost) | Cost static HTML/calculator/CSS, contrast fix, one home **footer** link, four-URL sitemap, canonical redirects/route. Production API, home main/CTA, privacy and measurement remain baseline. No inventory link/page. |
| RC-A measurement proposal | [Cost + proposed privacy](http://127.0.0.1:4182/wms-cost) | Same page plus Sprint 2 enquiry/event code and proposed privacy. Public flag defaults OFF. Privacy has visible unresolved approval text: **not publishable until resolved**. No inventory. |
| RC-B | [Inventory](http://127.0.0.1:4181/features/inventory-management) | Inventory HTML/CSS, one footer link, independent four-URL sitemap and route. No cost link unless cost has already been released. No measurement change or new image. |

Start previews with `node scripts/preview-rc.cjs rc-a`, `rc-b`, or `rc-a-measurement` in separate terminals. They bind loopback only, send `X-Robots-Tag: noindex, follow`, disable measurement and reject enquiry submissions. This isolates exact publication composition from the older combined mock preview at port 4173. Snapshot HTML has intended production `index,follow`; the preview response header prevents indexing. The snapshots are not online deployments.

**Current protected RC-A preview:** [cost planner](https://project-ogj6r-nk5fnrmt2-quark-build.vercel.app/wms-cost#calculator). Vercel deployment `dpl_AqpXeH84ByhQJN5MTMUXqmABGaVW`, Ready, Preview environment; isolated snapshot branch `preview/p0-rc-a-2026-10-19`, commit `d0271db0fe18b9faeb74fd2fb9fa42bdff788a11`, derived from PR source `5e1b8e1dde14f45c32a026b81f17706e1910bf5c`. All 38 snapshot files match the generated protected artifact byte for byte. **Never merge this snapshot branch.** RC-B was not deployed. The original P0 snapshot remains dated evidence, not the current approval target.

Vercel Authentication remains enabled with Require Log In / Standard Protection. Rechecked on 19 October 2026 at 11:33 UTC: eight anonymous requests without cookies, credentials or bypass parameters to both the new immutable URL and branch alias returned **302 to Vercel `/sso-api`**, `X-Robots-Tag: noindex`, and no commercial HTML. Authenticated browser access rendered both planner modes and EUR. [Current sanitized evidence and snapshot hashes](evidence/sprint-2/quick-scope-preview.json); [original P0 evidence](evidence/sprint-2/p0-preview-auth.json). No protection settings, exceptions, bypass secrets or production domains were changed.

The review copy disables the contact form through a disabled fieldset and replaces its client script with a no-request stub. Enquiry/event endpoints return a constant disabled response; measurement configuration returns `enabled:false`. Authenticated hosted responses were checked. No Formspree submission was sent. All HTML has `noindex,nofollow,noarchive`; robots is `Disallow: /`; configured global response headers also prohibit indexing. Calculator USD 100/month with other costs zero produced USD 1,200 annually, 3,600 over three years and 6,000 over five. Mobile width 390 had no horizontal overflow. Vercel's own authenticated review toolbar may load; no Quark analytics was activated.

The protected generator packages snapshots under `review-dist/protected-preview/`, without changing public source routes. It rejects production/development builds. The unsupported `public` configuration property was removed after Vercel schema validation rejected the first attempt; site access protection is provided by actual Vercel Authentication. Configuration references: [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json), [system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables).

Production recheck: main remains `24914b0b2729e2b5b4f661a2db3569a6741a227d`; home, Vision, robots and sitemap retain the recorded baseline hashes; production `/wms-cost` remains 404. No merge or production deployment occurred.

Current validation: all **30 automated tests passed**; `python3 scripts/validate.py` and `git diff --check` passed. Tests include both local snapshot compositions; only RC-A was uploaded. Public root files remain unchanged. SEO head was compared byte for byte with the previous revision; the TCO calculation function is identical except for adding EUR to the currency allowlist.

## Conditional A1 follow-up — changes for final review

- **Quick Scope is the default.** Four scope inputs produce a tailored seven-part supplier/budget checklist. Unknown counts and complexity are explicitly retained as unknown. Zero integrations prompts confirmation of a standalone scope. No financial fields, prices, implementation days, market averages or ROI are inferred.
- **Advanced Budget preserves the existing TCO.** Four native disclosure groups reveal software/licensing, implementation/connections, migration/training/equipment, then ongoing costs/contingency. Only the first group opens on entry. Switching modes retains values; Clear inputs resets the planner. Invalid financial fields open their containing group before native validation focuses them. Missing values never become zero.
- **EUR added alongside USD/GBP.** Currency labels do not convert entered amounts. Exact cent arithmetic, overflow protection, recurring year-one treatment and both licensing models remain unchanged.
- **Configurability explanation is general purchasing guidance.** [Microsoft warehouse documentation](https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/control-warehouse-location-directives) gives the work-template/location-directive example; [implementation guidance](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/implementation-strategy) supports the maintenance/support cost of extensions. The evaluation recommendation is an inference from those sources, not proof of Quark functionality or savings. Configuration still needs ownership and testing.

Browser QA covered default hidden/disabled financial fields, scope 3 warehouses / 50 users / 4 integrations / complex processes, fully unknown scope, missing-field focus, retained values, reset and progressive steps. Local EUR fixture produced initial 1,100 / annual 600 / TCO3 2,900 / TCO5 4,100. Hosted EUR smoke test used synthetic 100/month and explicit zeros elsewhere, producing annual 1,200 / TCO3 3,600 / TCO5 6,000. These are arithmetic fixtures, not suggested prices. Mobile 390×844 had no horizontal overflow. Hosted contact fields remain disabled, enquiry/event endpoints return the disabled response, measurement configuration is false, and robots disallows all crawling. No repeat provider submission or production analytics activation occurred.

**Final founder decision needed:** accept the revised Quick Scope → Advanced Budget interaction, EUR labelling and the added sourced explanation. Already accepted article/CTA/footer/contrast decisions remain recorded. This final A1 decision would approve content only; a separate explicit A2 is still required for any production release.

The proposed footer link is an approval item; existing homepage text, header navigation, primary CTA, screenshots and complete Vision stay unchanged. RC-B uses existing `/screens.html` references only. There are **no newly approved screenshots**; founder can approve this no-new-image composition, or nominate reviewed/redacted screenshots before RC-B release.

## Provenance and production baseline

Fresh check 19 October 2026 05:36 UTC: public home, Vision, robots and sitemap match `origin/main` byte for byte; both commercial URLs return 404. Baseline commit **24914b0b2729e2b5b4f661a2db3569a6741a227d**; GitHub Production deployment **7160016913** reports success, [deployment](https://project-ogj6r-gccjhmz8t-quark-build.vercel.app). PR input commit **426ef5c991c5b407cb6c7740f5867e7a4d69df99**. Final review commit is the PR head containing this file; generated manifests pin the exact build source commit. Never promote an earlier preview just because its check is green.

WMS source remains **d105fce525b95772730fcc00580aa18f0aeb1fa4**. All 23 hashes in the [existing provenance](evidence/sprint-2/wms-provenance.json) still match. Existing runtime results retain their original build/configuration/date. No WMS commands, certification or database changes were performed.

## Cost approval findings

The complete page is a scope/budget framework, not a Quark quote. All financial inputs start blank; explicit zero is distinct from unknown. Warehouse/user/integration counts and person-days multiply the labelled unit costs; annual support/operations are whole-scope totals. Subscription costs include year one. Perpetual licence is initial only. Currency is a label, not conversion; complexity/approach add no hidden multiplier.

In integer cents: initial subtotal = one-off licence + days×rate + sites×setup + integrations×unit integration + migration + training + sites×devices. Add contingency rounded half-up to the cent. Annual = 12×(platform + users×monthly user fee), for subscriptions only, + support + operations. TCO(N) = initial + N×annual, N=3 or 5. A boundary defect in Number multiplication could round very large valid contingency by one cent; fixed using exact integer multiplication and covered by regression. Currency display also formats integer cents directly, avoiding a separate cent loss when very large totals are divided by 100. Ordinary budget results remain the same.

No fabricated pricing, market averages, guaranteed savings/ROI or implementation duration. Input person-days are supplied by the visitor. Taxes/VAT, inflation, FX, financing, discounting, growth, depreciation and benefits are outside the model. Supplier links are reading material, not endorsed rates. CTA “Discuss Your WMS Project” opens the existing contact section and is appropriate for individually scoped early-stage evaluation. Calculator inputs never leave page memory.

## Approval requests — no implicit approval

| ID | Founder decision | Effect |
|---|---|---|
| P0 — APPROVED / completed for RC-A only | Founder authorized a protected, non-indexable RC-A preview with enquiries and new analytics disabled. Exact URL and protection evidence are above. | Review only. No RC-B preview, A1 content approval, merge, production release or analytics activation authorized. |
| A1 — CONDITIONAL | Article, CTA, footer link and contrast accepted. Founder reviews the revised Quick Scope / Advanced Budget, EUR and sourced configurability explanation at the current protected URL. | Final A1 still pending; content approval does not authorize A2. |
| A2 | Explicitly authorize the **RC-A minimum release**, with new measurement OFF. Inbox receipt is already owner-confirmed. | Agent can prepare the approved release commit from its manifest and deploy only that composition. No RC-B publication or measurement activation. |
| D1 | Confirm controller identity/contact and approve the retention/deletion/provider/consent proposal in [data handling](DATA-HANDLING-APPROVAL.md); Gmail notification routing is already verified. Choose a durable reporting destination before optional analytics activation. | Resolves measurement-extension policy and storage gates; does not itself deploy or activate tracking. |
| B1 | When WMS owner links the necessary existing QA/retests, approve matrix claims and no-new-image/gallery-link composition (or specific reviewed screenshots). | Makes RC-B eligible for a separate explicit release authorization. Never required for A2. |

Do not merge the whole PR as a substitute for A2: the minimum composition deliberately excludes measurement code/privacy proposals. [Checklist and rollback](RELEASE-CHECKLIST.md) define the explicit subsequent release step. This task stops at this gate.
