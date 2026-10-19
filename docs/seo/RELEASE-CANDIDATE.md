# Sprint 2 — Release Candidate & Approval Gate

19 October 2026 · PR [#3](https://github.com/msmurygin/cortive-landing/pull/3) · branch `seo/foundation-sprint-1`. **P0 and A1 APPROVED for RC-A. A2 NOT APPROVED. No merge or production release authorized.** These four approval documents supersede Sprint 2's future-release instructions where they differ; the earlier reports remain dated evidence.

## Decision in one minute

**RC-A: A1 APPROVED by the founder after review of the protected preview. A2 production release is NOT approved.** Approval covers Quick Scope/checklist, progressive Advanced Budget, USD/GBP/EUR, current TCO/assumptions, sourced configurability section, CTA, footer link and contrast. A clean local release commit with exactly eight runtime files is ready below. It has not been pushed, merged or deployed. New measurement is excluded; existing production form, legacy event code and privacy remain baseline. RC-A is independent of WMS certification and RC-B.

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

## Approved A1 content

- **Quick Scope is the default.** Four scope inputs produce a tailored seven-part supplier/budget checklist. Unknown counts and complexity are explicitly retained as unknown. Zero integrations prompts confirmation of a standalone scope. No financial fields, prices, implementation days, market averages or ROI are inferred.
- **Advanced Budget preserves the existing TCO.** Four native disclosure groups reveal software/licensing, implementation/connections, migration/training/equipment, then ongoing costs/contingency. Only the first group opens on entry. Switching modes retains values; Clear inputs resets the planner. Invalid financial fields open their containing group before native validation focuses them. Missing values never become zero.
- **EUR added alongside USD/GBP.** Currency labels do not convert entered amounts. Exact cent arithmetic, overflow protection, recurring year-one treatment and both licensing models remain unchanged.
- **Configurability explanation is general purchasing guidance.** [Microsoft warehouse documentation](https://learn.microsoft.com/en-us/dynamics365/supply-chain/warehousing/control-warehouse-location-directives) gives the work-template/location-directive example; [implementation guidance](https://learn.microsoft.com/en-us/dynamics365/guidance/implementation-guide/implementation-strategy) supports the maintenance/support cost of extensions. The evaluation recommendation is an inference from those sources, not proof of Quark functionality or savings. Configuration still needs ownership and testing.

Browser QA covered default hidden/disabled financial fields, scope 3 warehouses / 50 users / 4 integrations / complex processes, fully unknown scope, missing-field focus, retained values, reset and progressive steps. Local EUR fixture produced initial 1,100 / annual 600 / TCO3 2,900 / TCO5 4,100. Hosted EUR smoke test used synthetic 100/month and explicit zeros elsewhere, producing annual 1,200 / TCO3 3,600 / TCO5 6,000. These are arithmetic fixtures, not suggested prices. Mobile 390×844 had no horizontal overflow. Hosted contact fields remain disabled, enquiry/event endpoints return the disabled response, measurement configuration is false, and robots disallows all crawling. No repeat provider submission or production analytics activation occurred.

**A1 is now complete:** the founder explicitly approved all items above. Only the separately scoped A2 authorization below remains for RC-A. Client-side Download Budget Checklist (PDF) is recorded as a non-blocking follow-up, excluded from the initial release and unable to delay it.

The footer link and contrast fix are approved. Exact diff review found the generator had inserted the resource link at the first Screens link, in the header. The local generator now scopes insertion to the footer; regression checks prove that the header and all pre-footer homepage HTML are byte-identical to baseline. This implements the approved placement, without changing the accepted cost page or formulas. The existing hosted preview was not redeployed during this preparation. Homepage text, primary CTA, screenshots and complete Vision remain baseline; RC-B is excluded.

## Provenance and production baseline

Fresh check 19 October 2026 05:36 UTC: public home, Vision, robots and sitemap match `origin/main` byte for byte; both commercial URLs return 404. Baseline commit **24914b0b2729e2b5b4f661a2db3569a6741a227d**; GitHub Production deployment **7160016913** reports success, [deployment](https://project-ogj6r-gccjhmz8t-quark-build.vercel.app). PR input commit **426ef5c991c5b407cb6c7740f5867e7a4d69df99**. Final review commit is the PR head containing this file; generated manifests pin the exact build source commit. Never promote an earlier preview just because its check is green.

WMS source remains **d105fce525b95772730fcc00580aa18f0aeb1fa4**. All 23 hashes in the [existing provenance](evidence/sprint-2/wms-provenance.json) still match. Existing runtime results retain their original build/configuration/date. No WMS commands, certification or database changes were performed.

## Cost approval findings

The complete page is a scope/budget framework, not a Quark quote. All financial inputs start blank; explicit zero is distinct from unknown. Warehouse/user/integration counts and person-days multiply the labelled unit costs; annual support/operations are whole-scope totals. Subscription costs include year one. Perpetual licence is initial only. Currency is a label, not conversion; complexity/approach add no hidden multiplier.

In integer cents: initial subtotal = one-off licence + days×rate + sites×setup + integrations×unit integration + migration + training + sites×devices. Add contingency rounded half-up to the cent. Annual = 12×(platform + users×monthly user fee), for subscriptions only, + support + operations. TCO(N) = initial + N×annual, N=3 or 5. A boundary defect in Number multiplication could round very large valid contingency by one cent; fixed using exact integer multiplication and covered by regression. Currency display also formats integer cents directly, avoiding a separate cent loss when very large totals are divided by 100. Ordinary budget results remain the same.

No fabricated pricing, market averages, guaranteed savings/ROI or implementation duration. Input person-days are supplied by the visitor. Taxes/VAT, inflation, FX, financing, discounting, growth, depreciation and benefits are outside the model. Supplier links are reading material, not endorsed rates. CTA “Discuss Your WMS Project” opens the existing contact section and is appropriate for individually scoped early-stage evaluation. Calculator inputs never leave page memory.

## Final minimal RC-A production release plan — A2 gate

**Frozen local release commit:** `8b974f89796da5424e2a0d0e6f8d5746c0f6f5c4` on `release/rc-a-wms-cost-approved-a1`; parent `24914b0b2729e2b5b4f661a2db3569a6741a227d` (current production/main). Generator/test correction source is `8ecd039c08238e3248dc26774eeb1b71cf223243`; approved page/model/UI content source remains `5e1b8e1dde14f45c32a026b81f17706e1910bf5c`, unchanged in PR snapshot `a2eaa80254a0fcbd1abc7c5e48d9e4aa45cd772b`.

The clean release checkout and portable patch/bundle are prepared **locally only**, under `release-preparation/rc-a-2026-10-19` in this task workspace. The checkout has no remote, preventing an accidental push. [Frozen manifest and file hashes](evidence/release-candidate/rc-a-approved-a1-manifest.json). The PR source contains other proposals: **do not merge PR #3 or the protected preview snapshot branch as the production release.**

| Exact runtime path | Approved production change |
|---|---|
| `wms-cost.html` | Static approved article, Quick Scope/checklist, progressive Advanced Budget, currency options, sourced section and existing-contact CTA. Self-canonical, index/follow, BreadcrumbList. |
| `assets/seo/cost-model.js` | Approved exact-cent TCO, Quick Scope planning rules, USD/GBP/EUR; no estimated market prices/effort or network/storage. |
| `assets/seo/cost-ui.js` | Local interactions only; mode switching, disclosure groups, validation, results and reset. |
| `assets/seo/seo-content.css` | Reviewed article/planner styles and responsive layouts. |
| `assets/product.css` | Five-line approved light-theme muted-text contrast override. |
| `index.html` | One WMS cost guide link in the existing **footer**; header/main/primary CTA unchanged. |
| `vercel.json` | `/wms-cost` rewrite to HTML and permanent redirects from trailing slash and `.html` variants; baseline headers/security preserved. |
| `sitemap.xml` | Add canonical `/wms-cost` to existing home/screens/Vision entries: exactly four URLs. |

No other tracked file differs from production. In particular: no RC-B page/link, new screenshot, PDF code, proposed privacy text, new enquiry/event API, measurement library, consent UI, analytics provider, reporting job or preview-only stub/guard ships. `vision.html`, `robots.txt`, `legal/privacy.html`, `assets/main.js`, `assets/leads.js`, `api/lead.js`, `api/events.js` and `lib/lead-events.js` are byte-identical to baseline.

### Privacy and analytics settings for A2

- **New analytics OFF by exclusion**, rather than relying only on an environment flag. New `assets/measurement.js`, consent UI, `lib/measurement.js` and `/api/measurement-config` are absent. Do not enable `QUARK_MEASUREMENT_ENABLED`, GA4, Plausible, Vercel Web Analytics or any new reporting integration as part of this release. Existing project/account settings and secrets are not changed.
- Existing home enquiry submission remains active exactly as in production, using the existing Formspree route/provider. Existing legacy home CTA/form events and operational logging remain unchanged; this is **not** a claim that all baseline instrumentation is disabled. The cost page adds no tracking script and sends no scope or financial values. Reuse the single owner-confirmed delivery test; no new real submission is authorized or needed for A2.
- Production privacy/terms/consent text and provider/retention settings remain baseline. The proposed data-handling policy and complete weekly-reporting solution are excluded and require separate explicit approval before any future new analytics activation. Their open decisions do not block this minimum release.
- The eventual production page must be publicly crawlable: HTML index/follow, no preview noindex header or Disallow-all robots, canonical `https://quark.build/wms-cost`. Protected preview stays protected. Do not change Authentication settings or add a production alias to the protected snapshot.

### Deployment, verification and rollback

1. **Before A2 — completed locally:** all 30 tests pass, including the footer/header regression; static validation, JS syntax, whitespace, eight-file hashes, unchanged baseline APIs/privacy/Vision/robots and clean release checkout pass. The frozen release's EUR fixture passes. Production checked at **2026-10-19 15:10:59 UTC**: home/Vision/robots/sitemap retain baseline hashes; cost and inventory return 404. [Baseline evidence](evidence/release-candidate/rc-a-a2-production-baseline.json). No push, merge, setting change or deployment was performed.
2. **Only after explicit A2:** recheck remote main is the frozen parent and confirm the retained production deployment is available for rollback. If baseline has changed, stop and reconcile without overwriting unrelated work; seek renewed approval only if the eight-file approved payload changes. Import the prepared commit/patch into a clean release branch; validate its full hashes, open a dedicated minimal release PR and merge only that payload using the existing GitHub → Vercel project `quark-build/project-ogj6r`. Do not merge PR #3. Record the final GitHub merge/squash SHA and verify its tree equals the frozen candidate. That future merge SHA cannot exist before the authorized merge.
3. **Deployment acceptance:** Vercel reports Ready/Production for that resulting SHA and the existing `quark.build` domain. Verify `/wms-cost` HTTP 200, crawlable article HTML, exactly one H1, title/description, canonical, BreadcrumbList, production indexability, four-URL sitemap and robots sitemap reference. Verify `/wms-cost/` and `/wms-cost.html` redirect to canonical without loops. Inventory remains 404. Check home header/main/CTA and Vision against baseline; footer has one new link. Check Quick Scope unknown/zero/count cases; Advanced Budget blank validation, progressive sections, both licence models, USD/GBP/EUR, reset and an arithmetic fixture on desktop/mobile. Verify no scope/financial payload, new tracking/consent asset or measurement configuration API. Existing form/provider files must match baseline; inspect availability without sending another lead. Re-submit the existing sitemap in GSC after successful deployment if the existing authenticated access is available; no new property/account or bulk page publication.
4. **Rollback included in the proposed A2 scope:** on a hard acceptance failure (5xx/asset failure, incorrect indexability/canonical, broken calculator, wrong payload, regression of home/CTA/Vision, unexpected new tracking or data transmission), immediately restore the previous successful production deployment at `https://project-ogj6r-gccjhmz8t-quark-build.vercel.app` if retained. GitHub deployment record `7160016913` is success at baseline `24914b0…`; verify current retention before release. If restore is unavailable, revert only the actual release commit/merge via GitHub and deploy the revert (use first-parent revert for a two-parent merge). Do not reset main or discard intervening changes. Recheck baseline home/Vision/robots/sitemap, working existing enquiry path, removed cost link/route and cost 404. Record redacted incident/deployment SHAs; no lead data or secrets. A2 must authorize this rollback along with the release; none is authorized now.

**Only remaining RC-A decision:** authorize release of this exact eight-file candidate, new analytics OFF, baseline form/privacy/events unchanged, RC-B/PDF excluded, using the checks and failure rollback above. A1 is already approved; no repeated content, WMS QA, privacy-extension or analytics-provider decision is requested for this A2.

## Approval requests — no implicit approval

| ID | Founder decision | Effect |
|---|---|---|
| P0 — APPROVED / completed for RC-A only | Founder authorized a protected, non-indexable RC-A preview with enquiries and new analytics disabled. Exact URL and protection evidence are above. | Review only. No RC-B preview, A1 content approval, merge, production release or analytics activation authorized. |
| A1 — APPROVED | Founder explicitly approved the complete reviewed RC-A, including both modes, USD/GBP/EUR, TCO/assumptions, sourced section, CTA, footer and contrast. | Content approval complete; A2 remains NOT approved. |
| A2 — NOT APPROVED | Authorize frozen commit `8b974f89796da5424e2a0d0e6f8d5746c0f6f5c4` / exact eight-file manifest, new measurement OFF, baseline form/privacy/events, deployment checks and failure rollback above. | Only this minimum RC-A may be released after authorization; no RC-B, PDF, new analytics or whole-PR merge. |
| D1 | Confirm controller identity/contact and approve the retention/deletion/provider/consent proposal in [data handling](DATA-HANDLING-APPROVAL.md); Gmail notification routing is already verified. Choose a durable reporting destination before optional analytics activation. | Resolves measurement-extension policy and storage gates; does not itself deploy or activate tracking. |
| B1 | When WMS owner links the necessary existing QA/retests, approve matrix claims and no-new-image/gallery-link composition (or specific reviewed screenshots). | Makes RC-B eligible for a separate explicit release authorization. Never required for A2. |

Do not merge the whole PR as a substitute for A2: the minimum composition deliberately excludes measurement code/privacy proposals. [Checklist and rollback](RELEASE-CHECKLIST.md) define the explicit subsequent release step. This task stops at this gate.
