# Sprint 2 — Release Candidate & Approval Gate

19 October 2026 · PR [#3](https://github.com/msmurygin/cortive-landing/pull/3) · branch `seo/foundation-sprint-1`. **REVIEW ONLY. No merge/deploy is authorized.** These four approval documents supersede Sprint 2's future-release instructions where they differ; the earlier reports remain dated evidence.

## Decision in one minute

**RC-A: cost page is technically prepared; release is pending founder approval and inbox receipt.** It is independent of WMS certification. Recommended first release is the page, its assets, the previously proposed contrast correction, one footer resource link and its sitemap/route changes. Keep new measurement OFF. Existing form and privacy remain as in production in this minimum composition.

**RC-A measurement extension: BLOCKED.** The implementation is prepared, but inbox delivery is not confirmed, the privacy proposal requires provider/controller decisions, and current Vercel Hobby logs cannot support a complete weekly report. Do not make tracking activation a prerequisite for the first cost-page release. This is staged composition within RC-A, not another SEO sprint.

**RC-B: BLOCKED.** The implemented inventory scope is preserved. Relevant selected-build QA/retests and founder approval of claims/visual references remain outstanding. No promise that expected bug fixes are already complete.

## Exact compositions and private previews

Run `node scripts/build-rc.cjs` to reproduce three local snapshots under ignored, Vercel-excluded `review-dist/`. Each has an `RC-MANIFEST.json` with baseline, source commit, exact changed paths and content hashes. Generation never modifies public source files or authorizes deployment.

| Candidate | Private browser preview | Contents / explicit exclusions |
|---|---|---|
| RC-A, recommended minimum | [Cost](http://127.0.0.1:4180/wms-cost) | Cost static HTML/calculator/CSS, contrast fix, one home **footer** link, four-URL sitemap, canonical redirects/route. Production API, home main/CTA, privacy and measurement remain baseline. No inventory link/page. |
| RC-A measurement proposal | [Cost + proposed privacy](http://127.0.0.1:4182/wms-cost) | Same page plus Sprint 2 enquiry/event code and proposed privacy. Public flag defaults OFF. Privacy has visible unresolved approval text: **not publishable until resolved**. No inventory. |
| RC-B | [Inventory](http://127.0.0.1:4181/features/inventory-management) | Inventory HTML/CSS, one footer link, independent four-URL sitemap and route. No cost link unless cost has already been released. No measurement change or new image. |

Start previews with `node scripts/preview-rc.cjs rc-a`, `rc-b`, or `rc-a-measurement` in separate terminals. They bind loopback only, send `X-Robots-Tag: noindex, follow`, disable measurement and reject enquiry submissions. This isolates exact publication composition from the older combined mock preview at port 4173. Snapshot HTML has intended production `index,follow`; the preview response header prevents indexing. The snapshots are not online deployments.

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
| A1 | Approve the complete cost page, calculator assumptions/disclaimer/CTA, contrast correction and one footer resource link. | Freezes RC-A minimum content and four-URL sitemap. |
| A2 | After inbox receipt is confirmed, explicitly authorize the **RC-A minimum release**, with new measurement OFF. | Agent can prepare the approved release commit from its manifest and deploy only that composition. No RC-B publication or measurement activation. |
| D1 | Confirm actual email provider/controller details and approve the retention/deletion/processor/consent proposal in [data handling](DATA-HANDLING-APPROVAL.md). Choose a durable reporting destination before optional analytics activation. | Resolves measurement-extension policy and storage gates; does not itself deploy or activate tracking. |
| B1 | When WMS owner links the necessary existing QA/retests, approve matrix claims and no-new-image/gallery-link composition (or specific reviewed screenshots). | Makes RC-B eligible for a separate explicit release authorization. Never required for A2. |

Do not merge the whole PR as a substitute for A2: the minimum composition deliberately excludes measurement code/privacy proposals. [Checklist and rollback](RELEASE-CHECKLIST.md) define the explicit subsequent release step. This task stops at this gate.
