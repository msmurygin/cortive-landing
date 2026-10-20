> Historical proposal retained for traceability. The founder-approved functional baseline is now defined in [FUNCTIONAL-BASELINE-RC.md](FUNCTIONAL-BASELINE-RC.md). No standalone Screens/Product Experience public section remains. Recording storyboards are internal documentation only. Visual ownership: Claude Designer.

# Product Experience — replacement concept, not a gallery redesign

**Question answered:** How does a capability work in an actual warehouse operation?

Founder-directed name: **Product Experience**. Product Overview remains central. Screens URL `/screens.html` remains canonical in the first release to preserve SEO assets; visible “Screens” navigation is replaced.

## First release: deliberately lightweight

- One module/workflow overview, built in semantic HTML/CSS.
- One or two authentic, short, captioned recordings inside bounded workflow explanations.
- Each story: warehouse context → operator goal → starting state → real Quark actions → verifiable result → limits → related capability.
- A still image is optional supporting evidence for a specific step, never the organising principle or a standalone gallery card.
- No simulator, drag-and-drop warehouse, fake application state, AI interface, user accounts or new frontend framework.

## Initial candidates and evidence gates

| Scenario | Proposed story | What is actually supported | What blocks publication |
|---|---|---|---|
| Stock investigation | Explain one location/identity, hold context and corresponding movement | Real supplied inventory/transaction views plus source | Need same coherent sample case, matching readback, build and asset approval. A montage of unrelated screenshots is insufficient. |
| Allocation top-up | Show before state, invoke the retained normal top-up path, verify remaining demand/reservation | Existing TOPUP-01 scoped PASS at d105fce52 | Bind recording to selected accepted build/policy. No picking/shipping/throughput inference. |
| Supported configuration change | Repeat the same operation before and after one supported setting change; identify version/activation/owner and restoration boundary | Studio/lifecycle source and UI exist | No chosen complete operational before/after evidence yet. Select an existing accepted change; do not invent configuration capabilities. This is conditional, not a requirement to block an otherwise valid first bounded demo. |
| Receipt into storage | Follow the same stock identity from accepted receipt to destination readback | Receipt/putaway implementation; bounded historical receiving checks | Defer unless applicable retests and putaway acceptance already support it. No new full certification to produce website media. |

## Example storyboard (Allocation)

Context: partial demand remains. Goal: understand what an additional normal allocation does. Step 1: show the initial accepted scenario state. Step 2: invoke the exact retained normal path. Step 3: read back reservation and remaining demand. Result: explain the bounded change in this scenario. Caption discloses build, scope and limits. Link returns to Product Overview → Outbound.

Do not substitute an API acceptance result with a fictitious operator UI. If the accepted path has no usable real UI, show an accurately labelled short technical walkthrough only after founder approval, or select a different accepted operator scenario.

## Why this changes the concept

The page is useful as an explanation before any video starts. A recording proves a step; a visitor can understand the operation from the text and diagram. Screenshot resolution, crops, frames, themes and lightboxes cannot satisfy this acceptance criterion. No backlog item may equate “better screenshots” with replacing Screens.
