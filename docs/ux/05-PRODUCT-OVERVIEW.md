> Historical proposal retained for traceability. The founder-approved functional baseline is now defined in [FUNCTIONAL-BASELINE-RC.md](FUNCTIONAL-BASELINE-RC.md). No standalone Screens/Product Experience public section remains. Recording storyboards are internal documentation only. Visual ownership: Claude Designer.

# Product Overview — central product proposal

**Question answered:** What does Quark do, how do its modules relate, and what can we evaluate now?

Audience: warehouse/operations directors, IT evaluators, 3PL owners and implementation partners. Intended target audience does not establish verified 3PL or regulated-industry fit.

## Page structure

- Clear early-stage WMS introduction and evaluation boundary.
- Connected module diagram, accessible as an ordered HTML sequence with support layers.
- Five sections; each uses business problem → implementation scope → user actions to evaluate → observable control → related Experience scenario → evidence boundary.
- Compact current maturity / conditional readiness / future Vision explanation.
- Discussion CTA with scope confirmed before commitments.

| Group | Operational explanation | Capability scope to represent | Demonstration boundary |
|---|---|---|---|
| Inbound | Follow accepted goods into a destination | Receiving, putaway | Historical receiving passes are bounded; selected build/retests and putaway acceptance remain dependencies. |
| Inventory | Explain quantity, identity, location and state | Inquiry, movements, holds, lots, serials, containers, counts, adjustments, replenishment | Exact visible representation is supported; policy enforcement/permissions need scenario evidence. |
| Outbound | Explain demand, reservation and operator handoffs | Allocation, picking, packing, dispatch/loading | Scoped Allocation top-up can anchor a recording; no end-to-end shipment claim inferred. Distinct sorting unverified. |
| Execution | Explain who does a task and how completion/exception is handled | RF/WebRF, tasks/claim/lease/progress | Select the real implementation and accepted path; public sample-data RF is not backend evidence. |
| Platform | Explain setup changes, outputs and interface responsibilities | Studio/configuration, reports, integration event surfaces | Supported before/after change required. No named connector/compliance/no-code claim inferred. |

## Connections

Receipt → putaway → inventory → allocation → picking → packing → shipping is an **intended operational scope map**, not a certified demonstration. Inventory identity/transactions form shared context. Tasks/RF, counting/replenishment and configuration/reporting are support layers, not a separate application simulator. External systems are an evaluation boundary until individual connectors are verified.

Every major area links to the internal matrix. Conditional capabilities remain visible as intended implemented scope; no “everything available” badge. A visitor should not need to infer current readiness from future Vision prose.

## Acceptance

One substantive crawlable page, one H1, coherent H2 groups, usable mobile jump links, per-group operational actions, maturity visible, no unsupported benefits/named integrations. A warehouse manager can locate a process and its evaluation path without understanding internal Rust/RPC details. A 10–15 second comprehension target is an intended usability check, not a measured result yet.
