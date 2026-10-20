> Historical proposal retained for traceability. The founder-approved functional baseline is now defined in [FUNCTIONAL-BASELINE-RC.md](FUNCTIONAL-BASELINE-RC.md). No standalone Screens/Product Experience public section remains. Recording storyboards are internal documentation only. Visual ownership: Claude Designer.

# Shared website design system — PROPOSED / local components IMPLEMENTED

Preserve Quark’s existing logo and cream / ink / teal / purple identity. This is not rebranding or a WMS application redesign.

- One full existing SVG wordmark, consistent home link and accessible name across website pages. No symbol/transcription-only alternate header.
- Shared build-time header/footer generators; no client-side fragment fetch or new framework. Current site is static HTML/CSS/JS without a package build framework; proposal adds an isolated optional builder, not a replacement site architecture.
- Navigation: central Product Overview, Product Experience, Resources, Vision and current discussion CTA. Native details mobile menu with Escape/focus behaviour. Keep useful Cost article TOC inside the shared shell.
- Responsive content width ~1160px, 20–32px side padding, 16px body base, clear headings, current font-family/fallbacks. No external font request introduced.
- Primary teal action with dark text, secondary outline, underlined contextual links; focus-visible outline, ≥44px principal interactive targets, no decorative motion dependency.
- Capability block: problem, scope, evaluation actions, evidence boundary, Experience link. No fifteen disconnected feature cards or screenshot card carousel.
- Workflow map: ordered text/HTML, readable labels and support layers; semantic equivalents for connecting arrows, single column on small screens. It explains modules, does not imitate application controls/state.
- Guided demonstration block: context/goal/steps/result, authentic video and transcript once approved, narrow evidence caption and related Overview section. **No screenshot-frame/lightbox component in the new concept.**
- Maturity labels distinguish verified representation, bounded/conditional operation and future Vision. Internal QA details remain review material and must be edited into accurate concise customer wording before publication.
- CTA section reuses existing approved contact flow in a future release. Local review contains no active form or collection. Privacy and required consent remain unchanged unless separately approved.

Private shell examples wrap Vision, Cost and legal bodies without rewriting their content. Assessment shell adoption is a separate approved release; its source is untouched.

Dark theme is a review preference with in-memory toggle only. Light/dark contrast and mobile widths must pass QA; exact type/spacing choices are reviewable preferences, not audited production defects.
