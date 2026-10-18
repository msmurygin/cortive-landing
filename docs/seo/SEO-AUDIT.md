# SEO Audit — Quark.build / Sprint 1

Audit date: 18 October 2026 (Europe/Sofia). This is a new audit of current `origin/main` and freshly fetched production responses; earlier audit documents are not used as evidence.

## Audit boundary and release status

- Source baseline: `24914b0b2729e2b5b4f661a2db3569a6741a227d` (`origin/main`). All seven fetched HTML documents matched this source byte for byte.
- The separate screenshot-removal PR #2 was closed at the founder’s request. Its branch is **not** the audit baseline. Existing visual identity, screenshots, copy, navigation, CTAs and the complete Vision manifesto are preserved.
- Static HTML/CSS/JavaScript with Vercel Node API endpoints; no `package.json`, framework build script or lint configuration exists.
- No production change or release is authorized in this sprint. Any technical patch remains on a review branch. No account credentials, secrets, subscriptions or scheduled automations are created.
- The WMS implementation repository is not available in the supplied directory. The website repository and its WebRF prototype do not establish WMS backend capabilities.

## Executive assessment

The current site is technically crawlable and has a sound small-site URL foundation. No P0 crawl/index blocker was confirmed. The important commercial gaps are limited evidence of operational capability, weak enterprise evaluation coverage and incomplete acquisition-to-qualified-lead measurement. A Lighthouse SEO score of 100 is a basic technical check, not proof of indexing, rankings, relevant traffic or product readiness.

### Confirmed technical observations vs recommendations

| ID | Classification | Observation and evidence | Priority / disposition |
|---|---|---|---|
| T01 | Confirmed accessibility defect | Lighthouse finds muted body text at 4.27:1 on `#f5f3ee`, and 4.16:1 on `#ebe8e0`, below 4.5:1 for normal text. 19 mobile / 22 desktop failing nodes. `assets/product.css` uses inherited `--mute`; `assets/styles.css` defines light `--mute` at 0.55 opacity. | P2: narrowly scope a darker neutral to light-theme product-page text; no brand/layout/copy changes. |
| T02 | Confirmed performance opportunity | Mobile hero receives the full 1800×1012 JPEG (~314 KB) for a ~358×201 rendered area. Lighthouse estimates ~398 KB combined potential image savings; estimates are not guaranteed savings. No responsive source variants. | P2 recommendation, not automatic image replacement/removal. Owner’s image direction must remain unchanged. |
| T03 | Confirmed measurement gap | No GA4/Plausible pageview integration. `assets/leads.js`, `api/events.js`, `api/lead.js` log limited events with coarse source/medium only. No landing-page/session reporting or qualification linkage. | P1: choose analytics service and establish measurement contract; see measurement section. |
| T04 | Confirmed DNS observation, optional remedy | `www.quark.build` did not resolve from the audit host. The canonical apex domain works. No internal links require www. | P3: configure www-to-apex only if the founder wants this entry point; not an apex indexing blocker. |
| T05 | Confirmed GSC state, not a crawl blocker | Existing domain property is verified. Sitemap is Success but last read 15 July with 1 URL; live sitemap now lists 3. Vision is unknown to Google; home/gallery are indexed in the historical report. | P1: refresh existing sitemap and review discovery; no new property or source rewrite needed. |
| T06 | Confirmed resource opportunity | Home loads shared CSS; Lighthouse estimates ~11 KB unused CSS and ~120 ms render-blocking savings in this mobile run. Shared CSS also serves Vision/gallery. | P3: defer selective CSS splitting until measured benefit warrants regression risk. |

### URL / indexability inventory

| URL | Current response | Declared canonical | Indexing policy / purpose |
|---|---|---|---|
| `/` | 200 | `https://quark.build/` | index,follow |
| `/vision` | 200 | `https://quark.build/vision` | index,follow |
| `/screens.html` | 200 | `https://quark.build/screens.html` | index,follow |
| `/legal/privacy.html` | 200 | `https://quark.build/legal/privacy.html` | noindex,follow |
| `/legal/terms.html` | 200 | `https://quark.build/legal/terms.html` | noindex,follow |
| `/thanks.html` | 200 | Not needed for this noindex utility/prototype | noindex,follow |
| `/webrf` | 200 | Not needed for this noindex utility/prototype | noindex,follow |

Verified: `http://quark.build/` → HTTPS 308; `/index.html` → `/` 308; `/vision.html` and `/vision/` → `/vision` 308; `/webrf/` and `/webrf/index.html` → `/webrf` 308. A deliberately nonexistent URL returns 404. `/screens` returns 404 but no site link points there: this is not a broken internal link. API GET requests return 405 as expected. `/docs/quark-seo-audit.html` returns 404 because docs are excluded from deployment.

`robots.txt` returns 200, permits crawling and points at `https://quark.build/sitemap.xml`. The sitemap returns 200 with exactly `/`, `/screens.html`, `/vision`. These are the current indexable public content URLs; legal pages, `/thanks.html`, APIs and the prototype should remain excluded. `/webrf` has both meta noindex and an `X-Robots-Tag: noindex, follow`; APIs also have noindex. Crawl access is kept open so crawlers can observe noindex.

## Metadata, HTML, links and media

- **Titles/descriptions:** all three indexable pages have distinct titles and descriptions. Home: “Quark WMS — Warehouse inventory & operations”; gallery: “Quark WMS Screens — Inventory, topology & Studio”; Vision: “Quark Vision — A long-term concept for warehouse software”. Metadata is not missing. Exact full-category wording could improve commercial clarity, but it is a copy proposal requiring review, not a technical defect. Missing descriptions on noindex `/thanks.html` and WebRF are not SEO blockers.
- **Headings:** one H1 per indexable page. Home H1 “Know your stock. See your warehouse.” then H2 sections and H3 features/steps; no H1–H3 level skip was found. Gallery has one H1 followed by figures; adding keyword headings is optional editorial work. WebRF has no static H1 but is a noindex UI prototype.
- **Social metadata:** home and Vision have OG/Twitter metadata and a clear product/concept distinction. Home has an accessible absolute JPEG preview image. Gallery lacks a full OG/Twitter set: optional consistency recommendation, not a Google index defect. Do not change image direction without review. Social network cache previews have not been independently re-scraped.
- **JSON-LD:** home has syntactically valid `SoftwareApplication` with name, category, Web operating system, description and canonical URL. It does not invent reviews, price, customers or certifications. It lacks the offer/review information required for Google’s specific software-app rich result; that is an eligibility limitation, not invalid generic JSON-LD. Do not add a fake zero price or fabricated ratings to satisfy a test. An optional minimal WebSite identity graph may be considered only if there is a concrete need.
- **HTML delivery:** titles, core copy, links, headings and home JSON-LD are in the initial HTTP HTML. These are directly served static documents, not a client-only app shell; no SSR migration or prerender framework is needed. WebRF is the separate React/Babel sample UI and is noindex.
- **Internal linking:** home links to product anchors, gallery sections, Vision, legal pages and contact. Crawled local fragment targets exist; all 15 referenced production `/assets/` resources return 200. The hidden lightbox image starts with empty alt and receives the opened image’s alt in `assets/main.js`; that placeholder is not an unlabelled content-image defect.
- **Image accessibility:** visible content images have descriptive alt text, explicit dimensions, and appropriate eager/priority loading for the hero versus lazy loading below the fold. No missing visible-image alt was confirmed. Size/format delivery remains an optimization opportunity, separate from screenshot aesthetics.
- **External dependencies:** main product content uses local assets and system-font fallbacks. Vision/gallery/legal reference Google Fonts; WebRF references pinned React/Babel CDN scripts. This sprint does not migrate those unrelated templates.
- **Trust:** privacy/terms identify an individual operator and the enquiry flow. No assertion of enterprise support SLAs, certification, hosted-service uptime or ready connectors should be inferred from these pages.

## Lighthouse and Core Web Vitals

Single production runs, Lighthouse 13.5.0, isolated Chrome profile, default simulated mobile and desktop preset, 18 October 2026. These are diagnostic snapshots from the audit machine, not a US/UK field benchmark or statistically stable trend.

| Metric | Mobile | Desktop | Interpretation |
|---|---:|---:|---|
| Performance | 87 | 100 | Lighthouse score; not a ranking prediction |
| Accessibility | 96 | 96 | Confirmed muted-text contrast failures |
| Best practices | 100 | 100 | Automated coverage only |
| SEO | 100 | 100 | Basic automated technical checks only |
| FCP | 1.36 s | 0.28 s | Lab |
| LCP | 3.09 s | 0.56 s | Mobile lab opportunity, not a field CWV failure declaration |
| Total Blocking Time | 299 ms | 0 ms | Lab responsiveness proxy; **not INP** |
| CLS | 0 | 0 | Lab stability only |

The hero inventory JPEG was identified as the LCP element. It is already discoverable in HTML, eagerly loaded and marked `fetchpriority=high`; adding another preload is not an evidence-based fix. Suggested next performance work: responsive versions of existing media, only after the owner confirms the visual direction. Do not promise a particular score gain.

Field LCP, INP, CLS and a p75 pass/fail remain **unavailable**. The GSC CWV report updated 17 October explicitly says there is insufficient usage data over the last 90 days for both mobile and desktop. Separately, PSI API returned HTTP 429; that API error itself is not evidence about traffic. Recheck GSC/CrUX when enough data exists. Desktop Lighthouse 100 is not a field CWV pass.

## First-party Search Console findings

The founder supplied the existing domain-property view during the audit. Settings shows verified ownership, valid robots files and a property creation date of 7 July 2026. No verification/access change or new property is needed. Only read operations were performed.

| Report | Observed evidence | Meaning / next action |
|---|---|---|
| Performance: Web, 17 July–16 October 2026 | 7 clicks, 507 impressions, displayed CTR 1.4%, displayed aggregate average position 20 | Historical site visibility, not proof of enterprise leads or target-keyword ranks; the range predates the new deployment. |
| Geography | USA 1 click/86 impressions; UK 0/106 | Site-specific exposure, not US/UK market search volumes or qualified demand. |
| Pages | Home 6 clicks/500 impressions; gallery 1/7 | Current measurable organic exposure concentrates on two historical URLs. |
| Devices | Desktop 5 clicks/428 impressions; mobile 2/77; tablet 0/2 | Small samples; do not infer device conversion quality. |
| Visible queries | 37 rows, all 0 clicks; top impressions include quark 105, quark solutions 67, quark website 20, quark data merge 15 | Ambiguous brand/name exposure dominates visible rows. Chart totals and visible query rows need not reconcile because query data may be withheld/aggregated. No supported enterprise WMS keyword rank or volume claim. |
| Indexing, report updated 12 October | 2 indexed: home (last crawl 8 October), gallery (2 October); 6 not indexed across noindex 2, redirect 1, alternate canonical 1, crawled-not-indexed 2 | Do not treat all six exclusions as defects or as a post-redesign report. The two crawled/not-indexed examples are legacy HTTP/HTTPS www URLs with June crawls. |
| Home URL inspection | On Google; fetch/crawl/index allowed; smartphone crawl 8 October; declared canonical https://quark.build/; Google canonical “Inspected URL” | Canonical agrees for that indexed snapshot. This does not prove the new 18 October HTML has been recrawled. |
| Vision URL inspection | Unknown to Google, not indexed, no crawl/canonical data | Newly introduced URL currently undiscovered in this inspection, not a demonstrated technical block; refresh sitemap and inspect after discovery. |
| Sitemap | Existing https://quark.build/sitemap.xml: Success, submitted 7 July, last read 15 July, 1 discovered page | Refresh the same sitemap; current live XML lists 3 URLs. Record processing result and later discovery separately. |
| CWV, updated 17 October | Insufficient usage data for both devices over 90 days | No field pass/fail can be reported. |

No sitemap resubmission, indexing request, settings change or production change was performed. Existing GSC access is now sufficient for the next discovery check; a password or another property is unnecessary. Raw aggregate observations are in evidence/gsc-observations.json; account identity/verification tokens are intentionally omitted.

## Content and positioning audit

This is an expert heuristic review, not a measured 10–15-second user test. The site identifies warehouse management and inventory quickly; its current first screen does not establish enterprise fit, implementation confidence or a unique operational advantage.

| Reader | 10–15-second understanding | Relevant problems surfaced | Missing buying evidence / recommended proposal |
|---|---|---|---|
| Warehouse Operations Director | Understands stock visibility and warehouse context; cannot assess end-to-end execution. | Location-level visibility, movement reasons, hold context, warehouse topology. | One demonstrated receiving→put-away→pick exception flow, device constraints and acceptance checks. Do not claim productivity or accuracy gains without a measured baseline. |
| IT Director evaluating WMS | Sees early product status and configuration theme; cannot establish deployment or integration viability. | Reviewable setup and records are relevant themes. | Supported deployment model, auth/roles, API contract, data import/export, backups/recovery, isolation, integration boundaries. No claim of enterprise security readiness until verified. |
| 3PL business owner | Can infer inventory ownership from screens and see 3PL in industry selector; dedicated 3PL value is not established. | Client stock visibility and operational traceability are relevant concerns. | Owner separation, customer-specific processes, billing and portal availability, onboarding limits. A form option or owner column does not prove multi-client capability. |
| WMS implementation partner | Studio/metadata idea is visible; practical delivery proposition remains unclear. | Making configuration inspectable could reduce ambiguity. | Inspect a real module lifecycle and extension boundary; publish partner responsibilities/support/integration model only after confirmation. No deployment-time or margin promises. |

### Product evidence ladder and ACTION FOR AGENT

| Current website material | What it actually demonstrates | ACTION FOR AGENT — verify in the WMS repository before a product claim |
|---|---|---|
| Inventory image: location/SKU/owner/lot/serial views, availability and holds | Supplied UI state and field labels | WMS-01: locate stock ledger, transaction boundaries and availability calculation; E2E receive/move/hold/unhold/count; concurrent and cross-owner cases; record commit, test output and limitations. |
| Movement rows and reasons | A transaction interface screenshot | WMS-02: trace stored movement to user/action, timestamp and reason; correction/reversal behavior, permissions and persisted audit integrity. |
| 3D view and bin inspector | Supplied topology UI | WMS-03: prove topology data is shared with operational location validation, not an independent visualization dataset. |
| Studio templates/version history | Screens of draft/active/version controls | WMS-04: trace metadata load, draft isolation, validation, apply, rollback and failure/concurrency paths. State exactly which changes are versioned; do not say “every change is reversible”. |
| WebRF | Runnable interface prototype with hard-coded expected ASN/sample data and local React state | WMS-05: identify actual RF/backend integration, supported hardware/browser modes, authentication and retry/offline persistence; run real receive/pick tasks. This prototype is not that evidence. |
| Early-stage founder statement | Website/operator disclosure | WMS-06: founder to confirm available evaluation build, deployment options, delivery capacity, service boundaries and references. No certifications or customers invented. |
| Cloud WMS keyword candidate | Market intent only, not a verified Quark hosting model | WMS-07: confirm WMS runtime hosting, tenancy, operational ownership, data locations and update/backup responsibilities before describing Quark as a production cloud/SaaS service. |
| 3PL/picking/replenishment candidate pages | Search opportunities only | WMS-08: verify owner isolation, client rules and whether billing/portal exist; separately verify allocation, picking confirmation, short picks, replenishment triggers and resulting stock changes. Record unsupported portions explicitly. |
| Vision’s legacy readiness labels: voice beta, RF terminal modes, lots/expiry/serials, statutory forms, reporting and identity | Statements preserved inside a labelled long-term manifesto, not implementation evidence | WMS-09: locate Phonon voice execution/device integration, both RF clients, lot/expiry/serial invariants, each statutory template/export, reporting data sources and RBAC enforcement. Verify the stated counts (sixteen forms, 757 resources) against a specific build. Treat unconfirmed items as unverified, not available. |
| Vision’s metadata, introspection, sandbox, approval and reversibility guarantees | Architectural assertions in the preserved concept | WMS-10: trace runtime metadata and OpenRPC/JSON Schema discovery; prove draft isolation, authorization/approval on every mutation path, rollback boundaries and sandbox capabilities with negative/bypass tests. Universal claims such as “no path around” cannot be established by one UI example. |

AI Harness, AI Onboarding and AI Support are **future capabilities** under the founder’s brief. The current main page describes AI-led onboarding as long-term. Do not advertise, measure as a live product benefit or imply production availability for any of the three. Keep `/vision` intact, including its long-term-concept notice; its illustrative scenarios and old readiness labels are not current implementation evidence.

### Unverified promises preserved in Vision

The introductory concept notice is visible, but strong historical readiness language remains inside the manifesto. Preserve it as requested; do not import these sentences into product pages or schema. This is a positioning risk to review, not permission to overwrite Vision.

| Claim family currently in Vision | Status / required verification before any commercial reuse |
|---|---|
| One-day / next-morning production deployment; two-week integrations or configuration; six-month legacy comparisons | Aspirational/unverified. ACTION FOR AGENT: WMS-06 plus actual implementation records, comparable scope and customer approval. No delivery promise from code alone. |
| Every feature is metadata; live self-description; every mutation reversible; unavoidable human approval; sandbox cannot escape | Universal architectural claims unverified. ACTION FOR AGENT: WMS-04/10, including unsupported extension paths and failure cases. |
| Voice picking beta; +15–25% picking lift, 99%+ accuracy in noise, $700 hardware, 5×–10× lower TCO | Product status and numbers unverified. ACTION FOR AGENT: WMS-09 plus dated device/BOM, controlled trials, task/noise conditions, baseline and TCO assumptions. Do not publish as Quark results. |
| Receiving/put-away/picking/counting/moves/holds/quarantine, two RF modes, lots/expiry/serials, sixteen forms, 757 resources | Current site assertions, not independently confirmed. ACTION FOR AGENT: WMS-01/02/05/08/09; verify each operation/count against a build and persisted results. |
| Statutory forms/languages and a new country require configuration rather than a release; suitability for regulated industries | Scope and compliance implications unverified. ACTION FOR AGENT: WMS-09/10 plus jurisdiction-specific expert review before commercial claims; no GxP certification inferred. |
| Roadmap module dates, ready identity/reporting/core labels, ERP/voice compatibility and margin/project-capacity gains | Concept labels and projections. ACTION FOR AGENT: WMS-06/09, current module inventory, actual connector contract and evidence for economic claims. Historical dates do not prove completion. |
| AI Harness, AI Onboarding, AI Support | Future under the founder’s brief. No implementation or availability claim is permitted. |

### Messaging and search intent conclusions

- Potentially relevant problems are inventory visibility, exceptions/holds, movement traceability, location context and reviewable configuration. Screens illustrate these themes; no reduction in costs, errors, lead time or staffing has been demonstrated.
- “Brought into one WMS” is category language, not a proven differentiator. Studio may become a specific differentiator after WMS-04 evidence. Vision explains ambition; it must not substitute for an enterprise product evaluation.
- “Discuss your warehouse” is appropriate to an early-stage product and does not promise immediate access. Retain it. A future review may clarify what the conversation covers and optionally collect company/use case to qualify buyers; do not add fields, change CTA or promise response times in this sprint.
- Current title/category language supports relevance but content is too thin for the full commercial WMS evaluation journey. Missing cost/risk/integration/implementation evidence matters more than keyword repetition. A H1/category clarification is a proposal, not an automatic edit.
- No ready AI capability, free production service, guaranteed rollout date, security certification or quantified ROI is substantiated by the current repository. Keep such claims out of new pages.

## Measurement and external-account readiness

### Existing operational tracking

`cta_click` and `lead_start` are client events; `lead_submit`, `lead_success`, `lead_error` are server log events. Events store fixed names, timestamp and allowlisted coarse source/medium; submissions also have a random per-submission ID. The provider receives contact details, but the event records do not include email or industry. DNT/GPC suppress optional UI events. These statements are source observations, not a completed privacy/legal review.

`lead_success` means Formspree accepted an HTTP request; it does **not** prove inbox delivery, a booked demo, a qualified opportunity or a customer. There is no pageview denominator, saved landing path, cross-page attribution, persistent analytics dashboard or CRM qualification loop. After an external entry to `/screens.html` or `/vision`, navigation to home can lose original source information. Do not report the existing logs as full organic acquisition analytics. Direct visits to `/thanks.html` are not conversions.

### Smallest useful measurement setup — proposal, not live configuration

1. Existing GSC domain-property access and verified owner status are confirmed. Reuse it; no password, extra verification meta tag or duplicate property is needed. Preserve the working verification method. The table above records the current read-only baseline.
2. Next account action: refresh the already-submitted sitemap and record its new processing date/count. Reinspect current URLs after Google revisits; do not mark the redesign indexed based on the old crawl. No resubmission or indexing request has been made during this read-only audit.
3. Founder selects **one** analytics option: privacy-conscious Plausible is a reasonable small-scope candidate; GA4 is an alternative if its attribution/reporting is preferred. This is a proposal, not a purchase or installation. Owner must approve the service, account/site identifier, privacy/consent behavior and retention before a script is released. Use the generated current provider snippet, not a guessed URL.
4. Track path-only entry pages and acquisition source/channel with query-string/PII redaction. Limit reporting to production; exclude preview/local/admin/test traffic. Preserve original landing/source during the permitted measurement session under the approved privacy design. Do not store emails, full raw URLs, form content or customer names in analytics.
5. Emit `generate_lead` (GA4) or a matching manually configured enquiry goal (Plausible) only after a successful `/api/lead` response. Keep success distinct from button clicks and generic form-submit triggers. Track form errors separately. Prevent duplicate counting from thank-you refreshes or simultaneous automatic/manual form tracking.
6. Keep a separate founder-owned qualification record: genuine enterprise need, supported process, target market and agreed evaluation next step. A submitted form is not automatically “qualified”. Share only aggregate qualification counts in the weekly summary unless a separately approved CRM design exists.
7. User/owner sends one labelled test enquiry using an address they control and confirms it in Formspree and the inbox; record timestamp and provider acceptance. The audit has not sent mail. Test an upstream failure on staging with a mock. Verify success once in the selected dashboard, and no success event for validation/provider errors.

| Event / metric | Trigger and meaning | Allowed reporting dimensions |
|---|---|---|
| Landing/pageview | Approved analytics tracker on production content page | canonical path, device category, country, acquisition channel; no raw query strings |
| CTA click | Existing labelled contact entry point | placement + page path (future approved extension) |
| Form start/error | First real form interaction / failed send | form identifier, generic error category; no field values |
| Accepted enquiry | Provider acceptance, after API success | approved initial landing/channel; no email |
| Qualified enterprise enquiry | Human qualification after follow-up | aggregate qualified count by market/landing cohort if lawful and available |

### Weekly summary specification (not an automation created by this sprint)

Owner: founder or designated SEO reviewer. Issue the summary in Europe/Sofia using a consistent completed-week comparison. Label each source’s actual dates/timezone: GSC daily reports use Pacific Time, while the chosen analytics property may use Europe/Sofia. Do not pretend their daily boundaries match; normalize only when supported exports allow it. Annotate GSC reporting delay. Segment USA/UK separately, branded/non-branded queries and mobile/desktop; other markets are candidate signals only.

| Section | Weekly fields | Decision / caveat |
|---|---|---|
| Technical | sitemap state, new indexing/canonical errors, deployed changes, form-error count | Fix actionable regression first; missing GSC data is “unavailable”, not zero. |
| Organic discovery | GSC impressions, clicks, CTR, average position by landing/query/country/device | No aggregate ranking claim or attribution identity join; use impressions as visibility, not qualified demand. |
| Acquisition | analytics organic entries/sessions by initial landing | GSC clicks and analytics sessions are different measures; do not expect equality. |
| Enquiries | accepted enquiries, organic-associated enquiries, qualified enquiries | Separate each stage; disclose attribution gaps and small sample sizes. |
| Conversion | organic-associated accepted enquiries / eligible measured organic sessions, with numerator and denominator shown | Report N/A when tracking/session data is absent or inconsistent; avoid spurious percentage trends on tiny samples. |
| Action | one observed change, confidence, one next action and owner | No mass content output, no scheduled noisy status reports; scheduling requires a separate request. |

### External actions required

- **GSC owner:** access/ownership and historical reports are now checked. Refresh the existing sitemap and follow discovery of Vision; retain period-specific exports for future comparison. Field CWV is currently insufficient, not a permissions problem.
- **Keyword-data account owner:** export USA and UK separately from Keyword Planner (Google Search, English, same date range), or a licensed SEO tool export with method/date. Absolute volume, KD, CPC and Quark rankings are currently unavailable.
- **Analytics owner:** select/approve Plausible or GA4, configure property/goal and approve privacy/consent/retention; identifiers are not passwords, secrets stay in provider environment settings.
- **Form owner:** confirm provider activation, receipt and delivery using a controlled test address; inspect permitted Vercel event-log retention if keeping operational logs.
- **DNS/Vercel owner:** optional www alias and redirect if desired. No dashboard access is required merely to commit audit files.

## Validation and implementation log

Baseline audit completed before implementation. The only runtime patch is a scoped light-theme neutral-text variable in assets/product.css, raising opacity from the inherited 0.55 to 0.62 on .product-page. The original styles, dark theme and Vision remain outside the rule. It is prepared for review, not deployed.

- Production Lighthouse: mobile 87/96/100/100 and desktop 100/96/100/100 (performance/accessibility/best practices/SEO).
- Local accessibility-only Lighthouse after patch: 100, color-contrast passes, zero failing contrast nodes. This run does not measure a performance improvement or prove complete WCAG conformance.
- Browser check at 390×844: home content and contact controls available, no horizontal document overflow. Dark theme retains its original muted variable; Vision has no .product-page and retains its content/theme. This is not a real-device or assistive-technology certification.
- Existing mocked API test suite: 5 passed. Acceptance, validation, upstream failures, privacy allowlists, non-JS redirect and preview-origin behavior are covered; no real enquiry was sent.
- JavaScript syntax checks passed for assets/main.js, assets/leads.js, api/lead.js, api/events.js and lib/lead-events.js.
- Sitemap XML, Vercel JSON and JSON-LD parse; three intended sitemap entries, unique indexable canonicals/H1s, local links/assets and preserved files validated. Details: evidence/validation.json.
- There is no configured build or lint command. These are **not configured**, not reported as passing. No framework migration or unrelated tooling added.
- Home HTML, all other existing files (including complete Vision and image assets) remain byte-identical to the baseline; the only existing-file change is the appended CSS rule. No copy, CTA, navigation, new page, image or backend changes.
- Sitemap/account changes, analytics installation and public release remain pending their explicit steps. PR #2 is closed. This sprint does not reverse the founder’s already-merged previous release.

## Sources and raw evidence

- [Crawl evidence](evidence/crawl-baseline.json): current responses, hashes, extracted metadata/headings/JSON-LD and local source matches.
- [Lighthouse measurements](evidence/lighthouse-summary.json): portable measurements and contrast failures; compressed complete JSON reports in the same directory. Full HTML reports are retained in the local sprint evidence directory.
- [PSI mobile](evidence/pagespeed-mobile.json), [PSI desktop](evidence/pagespeed-desktop.json): API quota errors, not CWV measurements.
- [Google: developer SEO basics](https://developers.google.com/search/docs/fundamentals/get-started-developers), [canonicalization](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- [Google: SoftwareApplication rich result requirements](https://developers.google.com/search/docs/appearance/structured-data/software-app), [Web Vitals and lab/field distinction](https://web.dev/articles/vitals), [Lighthouse CLI](https://github.com/GoogleChrome/lighthouse).
- [GSC performance report definitions and aggregation](https://support.google.com/webmasters/answer/7576553?hl=en), [query omissions, discrepancies and time zones](https://support.google.com/webmasters/answer/17010575?hl=en).
- [GA4 recommended events](https://support.google.com/analytics/answer/9267735), [Plausible custom-event goals](https://plausible.io/docs/custom-event-goals), [Plausible goal conversions](https://plausible.io/docs/goal-conversions).

All external sources were consulted on 18 October 2026. An external vendor’s marketing claims are not evidence of Quark implementation.
