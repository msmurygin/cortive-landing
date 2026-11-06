# Quark WMS confirmed capability context

Use this catalogue to answer product and process questions. It is a concise,
reviewed subset of `https://docs.quark.build`; it overrides generic warehouse
assumptions. Do not claim a capability beyond this catalogue. If a requested
setting is not covered, say it needs review instead of saying that Quark cannot
do it.

## Receiving

- A receipt is the inbound document. An ASN is a receipt with expected lines.
- The standard RF ASN flow scans the receipt, then the SKU, then receives the
  line with quantity, UOM, destination location, LPN and applicable lot data.
- The destination used during receiving can come from the owner warehouse
  settings. The standard seeded owner uses `STAGE` as its Receiving Location.
  When the customer explicitly chooses a fixed receiving location such as
  `STAGE`, treat it as an automatic destination; do not ask the receiving
  operator to scan that location unless the customer explicitly requires it.
- Receiving and putaway are separate operations. Receiving can deposit stock to
  `STAGE`; putaway later scans the LPN, obtains a suggested storage location and
  scans the destination before moving the whole LPN.
- A receipt policy can allow, warn or reject receiving without an LPN. Owner
  settings can generate LPNs or accept an operator-entered LPN. An LPN may carry
  the received stock and its position is set to the receiving location.
- Lot, expiry and serial capture are conditional SKU/policy behaviours. Do not
  ask about expiry for clearly ordinary apparel unless the visitor mentions a
  shelf-life, lot or expiry requirement. Serial-controlled goods require serial
  configuration and may capture one or more serials per scan.
- SKU, UOM and pack hierarchy are separate configuration. Handling units include
  each, inner pack, case and pallet. Quantity must respect the selected pack and
  conversion rules.
- Operational values such as colour and size that vary between received stock
  are configured through the SKU's Lot Policy and its custom
  `lot_policy_attribute` rows. They are not merely generic SKU description
  fields. The policy is selected on the SKU.
- Each Lot Policy attribute has a stable attribute code and a visitor-facing
  label. `show=true` makes the field appear during receiving; `required=true`
  prevents the receipt line from completing without a value. Expected ASN
  values may also be prefilled or locked according to the receipt policy.
- `lot_creation=Existing` reuses a lot whose identity attributes match.
  `PerReceipt` and `PerReceiveEvent` deliberately create more lot identities
  and must only be selected when the visitor requests that separation.
- `show_on_pick` and `physical_verification` can later display or verify an
  attribute during picking. Attribute-mixing policies can restrict different
  values sharing an LPN, location or zone during movement and putaway. These
  later controls are separate choices and must not be silently enabled.
- When the visitor says Colour, Size or similar values must be captured or
  considered during receiving, infer a real Lot Policy candidate with visible,
  required receiving attributes and render one RF input step per attribute.
  Do not ask for a special capture flag. Do not silently replace the visitor's
  product with the old milk or soap sample.

## Putaway and other processes

- RF putaway starts with an LPN scan, suggests a location from the putaway
  policy, then validates a destination scan and moves the LPN.
- Putaway checks can include capacity, location type, SKU mixing, lot mixing,
  multiple lots on one LPN and attribute mixing.
- The implemented process catalogue includes receiving, putaway, movement,
  stock count, allocation, replenishment, picking, packing, loading and goods
  issue. This guided preview exercises only the processes exposed by its state
  machine.

## Assisted onboarding boundary

- Assisted onboarding may inspect confirmed requirements, prepare an
  explainable configuration plan and run supported checks without saving
  changes.
- It does not automatically publish policies, activate reports, change live
  warehouse data or create a production warehouse. An administrator reviews and
  applies an approved plan through normal workflows.
- This website experience is a guided simulation. It may personalize sample
  metadata and screens, but it must not claim that a live warehouse was changed.

Source sections: Owners/SKU/UOM/Pack Hierarchy, Inbound Setup, Receiving against
an ASN, Receiving: serial numbers/lots/LPNs, Putaway journey, and Warehouse
profile and assisted onboarding on `https://docs.quark.build`.
