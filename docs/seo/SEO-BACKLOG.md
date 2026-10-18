# SEO Backlog — Quark WMS / Sprint 1

18 October 2026. Baseline 24914b0b2729e2b5b4f661a2db3569a6741a227d. PR #2 is closed. This queue is not permission to release pages or make account/billing changes.

## Priority and complexity

- **P0:** severe confirmed production/indexing regression. None found.
- **P1:** needed for credible or measurable enterprise acquisition.
- **P2:** useful bounded improvement after prerequisites.
- **P3:** defer/optional; do not compete with MVP completion.
- **S:** narrow configuration/documentation/code task; **M:** multiple steps or one researched page; **L:** product/integration work with uncertainty. Relative estimates, not committed deadlines. Impact is qualitative, not a traffic/revenue forecast.

## Actionable queue

| ID | Priority / status | Task | Expected impact | Complexity | Dependencies / owner | Acceptance criteria |
|---|---|---|---|---|---|---|
| SEO-01 | P1 / baseline read; refresh pending | Refresh existing GSC discovery | Reliable indexing baseline; discovery of current sitemap | S | Verified owner; public sitemap | Keep existing domain property; record sitemap processing date/count after refresh; inspect home, gallery and Vision. No duplicate resource or invented token. Submission success is not indexing success. |
| SEO-02 | P1 / ACTION FOR AGENT | Verify one WMS stock/hold/movement workflow | Prevent unsupported claims and enable buyer evidence | M, possible product work L | Actual WMS code/build; WMS-01/02; founder evaluation scope | Commit, code paths, test setup, happy/exception cases, persisted results and owner/role/concurrency limits recorded; missing functionality explicit. No unrelated SEO-driven feature build. |
| SEO-03 | P1 / decision needed | Choose analytics and privacy design | Organic landing-to-enquiry reporting | S decision + M setup | Founder; Plausible or GA4 approval; consent/retention design | One property/site; production entry reporting; preview/test exclusion; PII/query redaction; no secrets in code; dashboard verified after explicit release. Logs are not labelled full analytics. |
| SEO-04 | P1 / pending | Verify enquiry conversion end to end | Find dropped requests; prevent inflated conversions | S | SEO-03; Formspree owner and controlled test address | Labelled approved test reaches provider and inbox; accepted event once after API success; no success on validation/provider failure or direct thank-you refresh. Qualification separate; test traffic excluded. |
| SEO-05 | P1 / proposal only | Review home category/evaluation message | Better fit and qualified conversations | S | SEO-02, WMS-04/06/07; founder review | Approved wording identifies category, current scope and limits. No unverified production AI, cloud, connectors, certification, KPI or rollout promise. CTA/nav/copy released only after approval. |
| SEO-06 | P2 / isolated patch prepared, unreleased | Fix light product-page muted contrast | Readability/accessibility; no ranking gain claimed | S | Lighthouse defect and local verification | Normal muted text ≥4.5:1 on both light surfaces. Scoped neutral variable only; dark theme and Vision unchanged; no layout/copy/screenshot/navigation/CTA changes; before/after retained. |
| SEO-07 | P2 / recommendation | Optimize retained image delivery | Lower mobile bytes/LCP risk | M | Founder image direction; representative audit | Authorized responsive variants of the same approved assets; measured size/compression, legibility, alt/dimensions and eager hero retained. No screenshot removal/replacement under this task. |
| SEO-08 | P2 / proposal only | One inventory feature page | Distinct evidence-backed commercial coverage | M | SEO-02/03/04/05 and approved brief | Verified workflow and limits; distinct intent, one H1/static HTML/self-canonical, reviewed copy/links; sitemap at release; no screenshot-only proof or template factory. |
| SEO-09 | P2 / proposal only | One cost/business-case guide | Budgeting and qualification support | M | Founder boundaries; sources; analytics | Cost drivers/TCO/explicit-assumptions ROI; no invented Quark price, market range or savings; no duplicate ROI page; review and explicit release. Prefer brief if inventory proof is unavailable. |
| SEO-10 | P2 / data unavailable | Comparable USA/UK keyword exports | Better evidence-based prioritization | S | Authorized Ads/SEO account owner | Separate markets; same complete-month range, English/Google Search, tool/date/close variants stated. Keep ranges/missing data honest. Ads competition is not organic KD. No unnecessary signup/billing. |
| SEO-11 | P2 / specification prepared | Weekly decision summary | Feedback with low founder overhead | S | SEO-01/03/04; sufficient data | Dates/denominators, country/brand/device splits, GSC lag/small samples; accepted vs qualified leads; one next action. No automation until requested. |
| SEO-12 | P3 / defer | Assess 3PL page | Potential vertical buyer fit | L proof + M content | WMS-08; target 3PL scope | Isolation/client rules verified; explicit billing/portal/integration boundaries. Enough distinct content and approval before publication. |
| SEO-13 | P3 / defer | Assess picking/replenishment/RF page | Future task-specific buyer coverage | L proof + M content | WMS-05/08 | Real allocation→pick/short-pick→confirmation/replenishment E2E, supported devices, limits. No mock-as-product claim. One page first. |
| SEO-14 | P3 / optional | Configure www entry point | Recover legacy/typed www entries | S | DNS/Vercel owner approval | If wanted, HTTP/HTTPS www reach HTTPS apex retaining path/query, no loop or lost verification records. Missing www is not failure of apex. Historical GSC www cases documented. |
| SEO-15 | P3 / defer | Rationalize shared CSS | Small measured delivery opportunity | M | Stable templates, worthwhile measured benefit | No Vision/gallery/legal/dark regression or framework migration. Keep only verified improvement; ~11 KB estimated unused CSS does not justify redesign. |
| SEO-16 | P3 / optional proposal | Gallery social metadata consistency | Sharing-preview clarity | S | Approved social image/text | Current absolute OG/Twitter fields where appropriate; no unapproved images or claims. Not required to fix Google crawling. |

## Release control

1. Preserve evidence and complete dependencies.
2. Review a dedicated branch/PR; no main/production change is part of sprint execution.
3. Founder explicitly authorizes a release, then merge approved scope. A preview build is not release authorization.
4. Verify production responses, canonical/noindex/sitemap and approved conversion test; retain rollback option for a real regression.
5. Record outcome; repeat broad tests only after changes or unresolved issues.

## Sprint 1 definition of done

- Four documents distinguish defects, recommendations, uncertainties and external actions.
- Source/live hashes, URL checks, lab evidence and dated GSC observations retained; do not imply the redesign has been recrawled.
- All ten clusters have intent, audience, volume availability, qualitative competition method, relevance, URL ownership and priority.
- No invented features, AI status, prices, reviews, volumes, KD, CPC or target-keyword ranks.
- Only the bounded contrast patch proposed; Vision and home copy/nav/CTA/screenshots preserved.
- Relevant static/JS/API checks recorded. Missing build/lint configuration reported as not configured, not successful.
- No production release, new paid account, secret commit or scheduled automation.

## Not now

Mass articles; duplicated city/industry pages; a second general WMS page; standalone cloud/ROI/RF/accuracy pages; review-star schema; fake free pricing; framework migration; redesign; production claims for AI Harness/Onboarding/Support. Revisit only with implementation evidence and qualified demand.
