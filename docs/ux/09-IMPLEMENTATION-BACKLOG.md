> Historical proposal retained for traceability. The founder-approved functional baseline is now defined in [FUNCTIONAL-BASELINE-RC.md](FUNCTIONAL-BASELINE-RC.md). No standalone Screens/Product Experience public section remains. Recording storyboards are internal documentation only. Visual ownership: Claude Designer.

# Implementation backlog — updated to workflow-first presentation

PROPOSED. Every phase is independently reviewable; no production authorization is implied. Estimates are planning ranges for agent engineering after decisions/assets are available, not promises and not WMS completion estimates.

| ID / phase | Priority / expected impact | Work / complexity | Dependencies / owner | Acceptance criteria |
|---|---|---|---|---|
| A1 / Consistency | P0 / restore product discovery on mobile | Shared header/footer, full logo, responsive navigation. Small–medium. | Founder navigation approval; website engineer | Same logo/home link/navigation on core pages; keyboard, Escape, focus, 320–1280px checks; no missing mobile links. |
| A2 / Consistency | P1 / accessible coherent reading | Shared type, spacing, button/focus tokens. Small. | A1 / website engineer | Principal controls ≥44px, measured text contrast; no horizontal overflow; same identity. Preserve useful article TOC. |
| A3 / Consistency | P0 / protect approved assets | Exact release manifest, SEO and regression gates. Small. | Production baseline / website engineer | Existing canonicals and valid JSON-LD retained; intentional legal noindex retained; no review noindex on public core; Cost/Assessment/contact/privacy unchanged except approved shell. |
| B1 / Product Presentation | P0 / central capability understanding | One substantive `/product` with five grouped sections and module relationships. Medium. | Evidence matrix + founder claims approval / website engineer, product owner | Problem→scope→actions→observable result→Experience link; intended scope separated from release readiness; no unsupported connectors, AI or sorting claim. |
| B2 / Product Presentation | P0 / explain operations | Replace gallery at `/screens.html` with Product Experience workflow narratives and semantic maps. Medium. | B1, founder content approval / website engineer | Page explains workflow before playback; same canonical; legacy fragments preserved; no standalone screenshot gallery, simulator or fake WMS UI. |
| B3 / Product Presentation | P0 / authentic proof | Record initially 1–2 bounded real operations; captions/transcripts and evidence. Medium; blocked assets, not coding architecture. | Selected accepted build/path, data permission; WMS/demo owner + founder asset approval | Start/action/readback tied to existing QA; actual UI; limits stated; no secrets; keyboard/mobile playback; no autoplay/third-party collection. Screenshots supporting only. |
| B4 / Product Presentation | P1 / credible configurability | One supported before/after story. Medium. | Existing change/activation acceptance; WMS/demo owner | Same operation/data before/after; version and expected result identified; restoration boundary explicit; no zero-code/savings claim. Remains blocked until evidence; must not hold unrelated valid scenario hostage. |
| B5 / Product Presentation | P2 / retain wider scope honestly | Add further inbound/outbound stories only when existing acceptance supports them. Medium per scenario. | Relevant defect/retest closure and evidence / WMS owner | No implication that expected bug fixes are already verified; no website-driven full certification. Not required for lightweight first release. |
| C1 / Commercial UX | P1 / route qualified interest | Apply approved homepage narrative and Overview→Experience→discussion links. Medium. | B1/B2, commercial approval / founder + website engineer | Honest early-stage positioning, clear scope/CTA; no unsupported benefits/testimonials or new form fields. |
| C2 / Commercial UX | P1 / useful preparation | Contextual Cost and Assessment links. Small. | Cost live; Assessment independent approval / founder + website engineer | Cost logic/assumptions untouched; Assessment link public only when approved; no automatic attachment of answers/financial inputs. |
| C3 / Commercial UX | P1 / usable conversion | Final mobile/keyboard/performance checks and controlled release. Small–medium. | A/B/C exact diff approved / website engineer | Existing delivery preserved; no extra analytics activated; comparable Lighthouse and SEO checks; rollback tested/documented. |
| Later | P2 / optional demo prototype clarity | Public WebRF responsive wrapper and clear prototype boundary. Separate small task. | Separate approval / website engineer | Does not redesign WMS; no prototype screenshot passed off as actual operation. |

## Explicitly removed from scope

“Better screenshot gallery”, screenshot frames/crop/theme projects as the Screens replacement, interactive WMS simulator, new SaaS/backend/framework, AI/agent orchestration, new connectors, broad WMS certification, bulk SEO pages. Existing screenshots are inspected only as evidence; no capture volume target.

## Phasing and effort

- Phase A: approximately 1–2 agent engineering days after navigation approval.
- Phase B: approximately 2–3 engineering days once accepted paths/media are supplied. Recording/evidence availability is an external dependency; do not mask it inside a guaranteed delivery date.
- Phase C: approximately 1–2 engineering days after commercial copy approval.

These are independent planning ranges (roughly 4–7 days total, excluding WMS fixes/retests/media ownership delays). Start with A + central Overview + module map + a small accepted recording set. Do not wait for every module to be certified, and do not claim uncertified scope is ready.

## Release gate

Founder approves exact phase diff, capability wording and actual public media. Website engineer then prepares an isolated release candidate and checks current production provenance. No merge, production deploy or new analytics until that explicit release step.
