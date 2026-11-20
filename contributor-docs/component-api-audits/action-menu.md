# ActionMenu component API scorecard

| Field                           | Value                                                                                                                                                                                         |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape               | ActionMenu; config, collection, overlay                                                                                                                                                       |
| Public surface                  | Root package export; docs metadata says beta                                                                                                                                                  |
| Mode / commit                   | Whole component / `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                                  |
| Rubric                          | Component API compliance rubric 0.1.0                                                                                                                                                         |
| Contract                        | Met; 5/5                                                                                                                                                                                      |
| ADR alignment                   | 60.7/100                                                                                                                                                                                      |
| Overall                         | 70.5/100, C                                                                                                                                                                                   |
| Open BLOCKs                     | 0                                                                                                                                                                                             |
| Distinct defects / raw findings | 0 / 3 ADR gaps                                                                                                                                                                                |
| Sensitivity                     | Fix the 0 open BLOCKs, change nothing else → projected 70.5 / C                                                                                                                               |
| Unverified                      | Nested overlay interoperability, behavior under custom wrappers beyond supported slot markers, rendered visual quality                                                                        |
| N/A                             | Provider: no cross-cutting configuration contract. State callbacks are present; new cancellation semantics are assessed only for a future parts API.                                          |
| Top fixes                       | 1. Add parts that do not discover triggers by child identity. 2. Define merging for new parts. 3. Add a new detailed state callback on the new surface without changing `onOpenChange(open)`. |

## Section scores

| Section                                        | Weight | Score | State  | Rationale                                                                                                                                                 |
| :--------------------------------------------- | :----: | :---: | :----- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Shipped contract fidelity                   |   25   |  5/5  | Scored | Existing `children`, controlled `open`, `onOpenChange(boolean)`, anchor, and overlay contracts are documented and implemented.                            |
| 2. Abstraction and composition                 |   20   | 2.5/5 | Scored | The config API is useful, but the root locates and extracts recognized children and contains special handling for Tooltip nesting.                        |
| 3. Element substitution and merging            |   20   | 2.5/5 | Scored | A local helper composes click/key handlers and class names; no uniform `render`, attribute, cancellation, and ref merge contract is documented for parts. |
| 4. State, callbacks, and lifecycle             |   20   |  3/5  | Scored | Open state is controlled/uncontrolled through the existing contract, but the public callback does not expose a reason, event, or synchronous veto.        |
| 5. Semantics, documentation, and compatibility |   15   | 4.5/5 | Scored | Root and subcomponent API documentation describes anchors, overlay, focus-return settings, and callback shape.                                            |

## Findings

### F1 — Add parts that preserve the current configured API

**ADR GAP · FIX · Check A2 · Section 2.** The root finds `ActionMenu.Button`/`Anchor` by element type or slot marker, maps over children, and clones trigger props. Tooltip nesting requires a dedicated branch. Add an opt-in `Root`/`Trigger`/`Popup` composition surface backed by context, keeping `ActionMenu.Button`, `ActionMenu.Anchor`, `ActionMenu.Overlay`, and the default export working as-is.

Evidence: `packages/react/src/ActionMenu/ActionMenu.tsx:37-53`, `:111-173`; `packages/react/src/ActionMenu/ActionMenu.docs.json:57-95`.

### F2 — Define merge behavior for new part props

**ADR GAP · FIX · Checks M1/M2/R2 · Section 3.** `mergeAnchorHandlers` composes click and keydown callbacks and combines class names; other child props and the final composed refs are handled in separate branches. Add a tested merge helper for the new parts, covering handler order and cancellation, class/style/attribute precedence, and final refs; do not change the configured API's existing ordering.

Evidence: `packages/react/src/ActionMenu/ActionMenu.tsx:56-78`, `:118-172`.

### F3 — Add a detailed callback alongside the boolean callback

**ADR GAP · FIX · Check S2 · Section 4.** The current `onOpenChange` reports only the next boolean even though the implementation has close gestures and the overlay handles Escape/outside dismissal. Add a typed object callback to the new parts API for value, reason, originating event when present, and synchronous cancellation when an uncontrolled transition needs a veto. Preserve `onOpenChange(open)` and its current controlled-state contract.

Evidence: `packages/react/src/ActionMenu/ActionMenu.tsx:45-53`, `:92-108`, `:24-26`, `:309-317`, `:355-361`; `packages/react/src/AnchoredOverlay/AnchoredOverlay.tsx:214-215`, `:422`, `:424`; `packages/react/src/ActionMenu/ActionMenu.docs.json:39-51`.

## Human review

| Judgment                       | Result                                                                                                                         |
| :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| Meaningful part boundaries     | Root, trigger, and overlay are already distinct in the public API; context-owned behavior can remove child identity discovery. |
| Default elements and semantics | Existing `Button`/`Anchor` remain defaults and should remain valid targets.                                                    |
| Consumer flexibility           | Keep the configured tree as the recommended path; parts are an additive escape boundary.                                       |
| Maintainer decision            | Confirm the intended custom-wrapper and submenu composition boundary before finalizing part names.                             |

## Evidence and calibration

Read ActionMenu source, docs metadata, examples, tests/types file paths, and exports at the audited SHA. No test command was run. The earlier audit marked parts, prop/ref merging, callback detail, and overlay lifecycle partial; this score preserves the main gaps while recording no runtime failure or current-contract defect.
