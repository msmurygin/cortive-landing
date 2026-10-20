# Quark website — final functional release candidate

20 October 2026. **FUNCTIONAL BASELINE APPROVED / VISUAL REVIEW PENDING / PRODUCTION RELEASE NOT APPROVED.**

This closes the functional-baseline task. Visual ownership moves to Claude Designer. No further independent visual redesign or information-architecture work is planned.

## Provenance and exact release composition

- Production baseline: `2a628cbfa41cbd28a1959dc6818865342e017362`. Current main and six live page hashes match the previously released site.
- Existing SEO worktree HEAD: `2f6a3aabe3fd289d9f1366166ae25a544b775283`, with earlier Assessment work preserved. Do not merge this broad worktree wholesale.
- Isolated candidate Git tree: `2ebcce7f93e628cffbb35a6c98391de8744b2e34`; **no release commit created**. Candidate checkout: `/Users/Maksim.Smurygin/.codex/.chatgpt-projects/g-p-6ad5207c5bf48191bc73052e505c3073/release-preparation/website-functional-rc-2026-10-20/candidate`.
- Runtime patch SHA-256: `82ad85105a8d3b32313661689a35344b1005b6565c0e896f175fb566280d6f6f`. `WEBSITE-FUNCTIONAL-RC.patch` contains exactly **12 runtime changes** against production, not Assessment/Inventory/PDF work. Forward application to a production-seeded index and reverse application to the candidate both PASS.
- Source-builder, tests and documentation are supplied separately from the deployable runtime patch. No source push, merge or deployment was performed.

| Runtime file | Change |
|---|---|
| `design-assets/site.css` | added |
| `design-assets/site.js` | added |
| `index.html` | modified |
| `legal/privacy.html` | modified |
| `legal/terms.html` | modified |
| `product.html` | added |
| `screens.html` | deleted |
| `sitemap.xml` | modified |
| `thanks.html` | modified |
| `vercel.json` | modified |
| `vision.html` | modified |
| `wms-cost.html` | modified |

## Approved corrections completed

1. `/product` is the central product page: five capability groups, shared module map and contextual workflow examples.
2. No standalone Screens / Product Experience entry remains in header, mobile navigation or footer. No standalone Screens HTML is emitted.
3. Stock investigation, allocation and configuration evaluation explanations live within `/product`. They promise no playable demo or unsupported product outcome.
4. Internal recording briefs are retained in [INTERNAL-RECORDING-STORYBOARDS.md](INTERNAL-RECORDING-STORYBOARDS.md), the historical concept and evidence matrix. They are excluded from the runtime and public links.
5. `/screens.html`, `/screens`, `/screens/` have permanent Vercel redirects to `/product` (308 in the local config-driven HTTP check). `/product.html` and `/product/` redirect to its canonical route. Relevant legacy fragment targets remain; browser `/screens.html#studio` resolves to `/product#studio`.
6. Shared full Quark wordmark, home link, header, mobile menu, footer, contact destination and existing identity are consistent. No framework or new visual concept was introduced.
7. Existing Cost main/article/formulas, legal main copy and Vision manifesto body are preserved. Vision receives only the shared shell and a semantic main wrapper. Missing shared favicon declarations use the existing logo asset. The Assessment RC remains separate, unchanged and unpublished.
8. New Home/Product marketing prose contains no QA IDs, hashes, PASS/FAIL labels, certification repetition, internal actions or recording-production notes. Early-stage maturity and individually agreed evaluation scope remain clear; AI Harness/Onboarding/Support are future-only.
9. Build, syntax, link, mobile, keyboard, SEO and regression checks completed as detailed below.

## Contact, privacy and analytics

**Release artifact:** exact production contact section, fields, optional industry, consent, honeypot, `/api/lead`, Formspree provider, response handling, `/thanks.html`, `assets/leads.js`, `/api/events` and `lib/lead-events.js` are retained. No automatic budget or Assessment payload attachment. Legal body text is unchanged; shell/favicon additions are not a privacy-policy rewrite.

**No new analytics is added or activated.** The existing approved aggregate enquiry funnel is preserved byte-for-byte; do not describe that baseline as entirely absent. No GA4/Plausible, new event schema, financial/operational answer tracking or account-setting change.

**Local private preview:** noindex/nofollow/noarchive, Disallow-all, blocked form/connect actions, disabled form fieldset and disabled endpoints. It is loopback-only, not a Vercel Authentication preview. The release artifact is generated independently, with baseline contact and normal public indexing. Never publish the private output.

Browser contact QA used a synthetic `.invalid` address against a local server that refuses all POST and never invokes provider handlers: empty email rejected; error shown after local 405; retry re-enabled. This is **not** a new inbox-delivery test. The founder’s earlier confirmed Formspree inbox receipt remains historical evidence; no additional real enquiry was sent for this task.

Legacy Vision/legal pages retain their existing Google font references. No new font host or tracker is added to production by this release. Private review blocks those requests; local release inspection permits the already-existing font hosts for an accurate lab comparison. Inspection still never forwards form/API requests.

## Test and browser evidence

- **90/90 site tests PASS** in the existing workstream: all 82 pre-existing non-redesign tests unchanged plus eight final website RC tests. The eight RC tests build both variants in temporary directories and check collection safeguards, real release contact preservation, Cost/legal/Vision content, redirects/aliases, public prose, indexability/schema, shared shell and internal links.
- Preview and release builds PASS; new JavaScript syntax checks PASS. No configured package/lint command exists, so no nonexistent lint result is claimed.
- Seven review pages at 1280×900 and 390×844: one H1/main per page, two consistent logo instances, shared navigation/footer, no horizontal overflow. Home/Product/Cost also checked at 320px and 900px.
- Keyboard Enter/Escape menu handling, restored focus, Product workflow anchor, legacy Studio fragment, Cost Quick Scope/Advanced Budget/EUR checked in the actual browser.
- Local HTTP checks: retired routes 308; `/product` 200; obsolete review and unreleased Assessment paths 404; POST `/api/lead` 405 in the preview server. No external provider call.
- Source hash comparison: all **27** previously frozen public/Assessment/test files unchanged in the broad source worktree; actual public entrypoints/config untouched. Only proposal-source/tests/UX docs were updated there.

Screenshots: `screenshots/desktop-*.png`, `mobile-*.png`, `desktop-product-workflows.png`, `mobile-product-workflows.png`; synthetic local form failure evidence is explicitly labelled. JSON observations and complete test output are in `evidence/` in the release package.

## SEO and Lighthouse

Release Home/Product/Vision/Cost are indexable with correct self-canonicals, title/description, crawlable HTML and one H1. Sitemap retains four entries: Home, Product, Vision, Cost; retired Screens and unreleased Assessment are absent. Original robots bytes are retained. Legal and Thanks remain intentionally noindex. Existing valid home SoftwareApplication and Cost breadcrumb facts are preserved; Product has factual BreadcrumbList, no pricing/offers/ratings. Review noindex safeguards are excluded from the runtime release diff.

Lighthouse 13.5.0, one local lab run per variant; no field Core Web Vitals or user-research claim:

| Candidate | Performance | Accessibility | Best practices | SEO |
|---|---:|---:|---:|---:|
| Home mobile | 100 | 100 | 100 | 100 |
| Product mobile | 100 | 100 | 100 | 100 |
| Product desktop | 100 | 100 | 100 | 100 |
| Cost mobile | 99 | 100 | 100 | 100 |
| Vision mobile | 85 | 94 | 100 | 100 |
| Privacy mobile | 91 | 95 | 100 | 66* |
| Terms mobile | 91 | 94 | 100 | 66* |
| Thanks mobile | 100 | 100 | 100 | 54* |

*Intentional noindex suppresses legal/Thanks SEO scores; Thanks also retains its pre-existing absence of a description. These are not newly deindexed marketing pages. Performance on legacy pages depends on their unchanged long content, illustrations, script and font loading; these single runs are not controlled field performance measurements.

**Inherited, nonblocking accessibility findings:** Vision contrast/heading order and legal muted-text contrast also fail in the exact production-baseline copy. Baseline → candidate accessibility: Vision 92→94, Privacy 93→95, Terms 91→94; no new failing audit types. The new semantic main wrapper resolves the baseline Vision main-landmark finding. Existing text/illustration design was not independently redesigned to chase a perfect score. Evidence: `accessibility-comparison.json`. Hand these remaining contrast/heading observations to Claude Designer with the preserved manifesto/legal constraints.

## Remaining gates and owners

| Item | Owner | Minimal action | Release status |
|---|---|---|---|
| Final visual review | Claude Designer | Review the frozen functional baseline and direct any visual changes. Keep approved routes/functionality/privacy boundaries. | Blocking visual sign-off; functional work complete. |
| Production release permission | Founder | Approve the exact final runtime diff/tree after designer review and explicitly authorize release. Functional approval alone is insufficient. | Blocking; no merge/deploy performed. |
| Existing Vision/legal accessibility observations | Claude Designer + website implementer under designer direction | Address contrast and heading semantics without rewriting manifesto/legal content, then repeat affected checks. | Existing nonblocking debt, no new regression. |
| Authentic recordings / configuration before-after | WMS/demo owner, designer, founder | Supply scoped accepted evidence and approve actual assets only if adding media later. | Deferred; not part of or a blocker for the present text/diagram candidate. |
| Assessment publication | Founder / its existing RC owner | Approve its independent release separately. | Excluded from this release, not a dependency. |

No fresh WMS certification, feature discovery or SEO research is required to close this task.

## Deployment instructions — only after separate approval

1. Confirm production main/deployment still match the recorded baseline. Record the current known-good Vercel deployment ID/URL immediately before release; do not assume a historical ID is current.
2. Use a clean main-based checkout. Apply the exact approved runtime patch and review only the 12 listed changes. Keep broad SEO/Assessment work out. If Claude changes visuals, regenerate the manifest/tree and rerun affected checks before requesting release permission.
3. Generate release output with `node scripts/build-site-redesign.cjs --release`, not preview mode. Check public canonicals/indexing/sitemap, original APIs/contact/robots, no review routes/guards/stubs and no new analytics. Apply source/tests/docs separately as reviewed supporting files; they are excluded by the unchanged `.vercelignore`.
4. Only after founder production authorization create/merge the approved release commit and let the existing GitHub→Vercel workflow deploy. Do not change production aliases, project settings, environment or Authentication during preparation.
5. Verify live Home/Product/Cost/Vision/legal/Thanks, permanent Screens redirect and relevant fragments, shared menu/logo/footer/mobile, article/calculator, normal API/consent/error/success paths, canonical/robots/sitemap/schema and absence of the unreleased Assessment route. If a new labelled real mail smoke is authorized, distinguish provider acceptance from founder-confirmed inbox receipt; do not call a local/mock test delivery.

## Rollback

If a critical release smoke fails, promote the recorded previous known-good Vercel deployment using the authorized existing workflow, or revert the exact release commit and let GitHub→Vercel rebuild. The reverse-checked runtime patch restores the previous Screens page/navigation, sitemap and shell. Do not reset or revert unrelated Assessment/SEO changes. Verify the recorded six live baseline hashes/routes, original Cost/contact/robots/sitemap, and report the restored deployment. No rollback was needed or performed here because nothing was deployed.

## Stop boundary

The functional candidate and evidence are complete. Further visual work belongs to Claude Designer. Stop here; no independent redesign, new IA, merge or deployment.
