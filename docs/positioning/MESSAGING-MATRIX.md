# Product messaging matrix

## Single product message

Quark WMS is a working warehouse management system with standard operations built in. Its configurable platform lets implementation teams adapt the system around a shared core instead of creating a new WMS for each customer. Extensions, integrations, data preparation, testing, training and rollout form the customer implementation.

## Four distinct layers

| Layer | Public treatment | Boundary |
|---|---|---|
| Standard core WMS | Present-tense operational descriptions | Founder confirms implementation; source supports the described process paths. |
| Customer implementation | Configure locations, stock rules, roles and screens; scope extensions and connections | No promise that every requirement is configuration-only or that a connector is ready-made. |
| Advanced / deployment-specific capabilities | Verify the relevant workflow, equipment and requirements | Voice, specialist packing, regulated validation and device compatibility are not blanket core guarantees. |
| AI Harness, AI Onboarding, AI Support, autonomous setup | Explicit future vision | No production availability, delivery-time, ROI, cost saving or performance promise. |

## Implementation evidence

Owner confirmation of the standard core is the positioning premise. Source inspection supports the workflow detail. This is not a new certification or a claim that every variant passed QA. The existing domain exit matrix retains scoped PASS results, outstanding cases and historical defects; those statuses are not rewritten by website copy. No source file, QA record or WMS runtime was modified.

| Capability | Proposed public statement | Evidence in WMS repository | Remaining boundary |
|---|---|---|---|
| Receiving | Receive expected goods against an ASN or record a blind receipt; capture quantities and configured stock identities. | `crates/services/app-server/src/web/rpcs/receipt_commands_rpc.rs:41` | Core; receipt-policy exceptions remain project/QA detail. |
| Putaway | Identify a destination under configured putaway rules and confirm stock placement. | `crates/services/app-server/src/web/rpcs/putaway_rpc.rs:21` | Core; physical dimensions, special storage and exceptional overrides need customer checks. |
| Putaway execution | Move the received unit to its directed destination. | `crates/libs/wms-lib-sql/sql/rf-screens/093_uc_putaway.sql:37` | Core RF flow; no blanket claim about every device or oversized case. |
| Inventory and holds | View stock context and movement records; holds affect availability. | `docs/mvp-certification/inventory/discovery-configuration.md:32` | Core; no real-time latency, universal isolation or defect-free claim. |
| Counting and adjustment | Record observations, review differences and use stock adjustment documents. | `crates/services/app-server/src/web/rpcs/inventory_count_rpc.rs:60` | Core; regulatory validation is separate. |
| Replenishment | Plan picking-location replenishment and confirm source, quantity and destination. | `crates/services/app-server/src/web/rpcs/replenishment_rpc.rs:17` | Core; serial eligibility, equipment and exceptional stock rules are not general promises. |
| Wave planning | Group outbound orders into waves, preview release eligibility and release waves for execution. | `crates/services/app-server/src/web/rpcs/wave_rpc.rs:16` (read/create/membership/release routing and implementations); `crates/libs/wms-outbound/src/waves/commands.rs:26` (order membership and release commands) | Founder confirms implementation; bounded source review supports this description. Existing tests were inspected, not rerun; no new certification or scheduling/performance promise. |
| Allocation | Reserve available stock against order demand under the configured policy. | `crates/services/app-server/src/web/rpcs/shipment_order_commands_rpc.rs:56` | Core; individual policy variants are not declared certified. |
| Picking | Confirm source, stock and quantity; record picks and short picks. | `crates/services/app-server/src/web/rpcs/pick_commands_rpc.rs:32` | Core; no throughput or error-reduction figure. |
| Packing | Verify or repack picked goods and close cartons with weight and labels. | `crates/services/app-server/src/web/rpcs/packing_rpc.rs:38` | Core; actual printer, carrier label and specialist packing requirements need project verification. |
| Dispatch and loading | Plan loads and confirm loaded units. | `crates/services/app-server/src/web/rpcs/dispatch_rpc.rs:22` | Core; loading and shipment confirmation remain distinct. |
| Shipment / goods issue | Confirm shipment and update stock and shipment records. | `crates/services/app-server/src/web/rpcs/loading_rpc.rs:14` | Core; no universal carrier connector is implied. |
| Configurable platform | Draft, review and apply module configuration around the shared core. | `crates/services/web-ui-server/src/routes/studio_handler.rs:182` | Implemented platform; not every warehouse requirement can be configured without extensions. |
| Studio data model | Adapt forms, data sources, roles and user interfaces using module metadata. | `crates/services/web-ui-server/src/services/studio/module_fork.rs:24` | Implemented platform; no promise of autonomous configuration. |
| Reporting | Use operational report definitions and templates. | `crates/services/app-server/src/web/rpcs/report_definition_rpc.rs:23` | Implemented platform; no invented BI or AI analytics product. |
| Integration visibility | Inspect integration-event delivery records. | `crates/services/app-server/src/web/rpcs/integration_event_delivery_rpc.rs:8` | Implemented visibility; customer ERP/carrier/automation connections remain project scope. |

The exact inspected source hashes and observed WMS HEAD are in [SOURCE-EVIDENCE.json](SOURCE-EVIDENCE.json). Existing evidence used: Receiving feature catalog and extended discovery, Inventory configuration discovery, Replenishment discovery, Allocation discovery and architecture/domain-exit-matrix.md. These artifacts contain older, scoped QA statuses; they were not upgraded to completed by this work.

## ACTION FOR AGENT

Only if expanding the public claims later: verify specific Phonon voice workflows, devices/languages/acoustics and connector availability; inspect the actual customer integration; obtain deployment-specific regulatory/validation evidence; measure any performance, time or cost claim. These are not blockers to describing the already implemented standard WMS core.
