# SelectPanel component API scorecard

| Field                           | Value                                                                                                                                                                                                    |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape               | SelectPanel; config, form control, collection, overlay                                                                                                                                                   |
| Public surface                  | Root package export; user requested the stable surface; docs metadata says alpha                                                                                                                         |
| Mode / commit                   | Whole component / `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                                             |
| Rubric                          | Component API compliance rubric 0.1.0                                                                                                                                                                    |
| Contract                        | Met; 5/5                                                                                                                                                                                                 |
| ADR alignment                   | 60.7/100                                                                                                                                                                                                 |
| Overall                         | 70.5/100, C                                                                                                                                                                                              |
| Open BLOCKs                     | 0                                                                                                                                                                                                        |
| Distinct defects / raw findings | 0 / 3 ADR gaps                                                                                                                                                                                           |
| Sensitivity                     | Fix the 0 open BLOCKs, change nothing else → projected 70.5 / C                                                                                                                                          |
| Unverified                      | Published package status, nested overlay runtime behavior, field integration in consumer apps, rendered visual quality                                                                                   |
| N/A                             | New API migration rule: no API change is part of this audit. Provider: no cross-cutting configuration API.                                                                                               |
| Top fixes                       | 1. Add optional named parts for trigger, overlay/content, and collection. 2. Define a shared `render`/merge contract on new parts. 3. Add a new detailed callback while preserving positional callbacks. |

## Section scores

| Section                                        | Weight | Score | State  | Rationale                                                                                                                                                          |
| :--------------------------------------------- | :----: | :---: | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Shipped contract fidelity                   |   25   |  5/5  | Scored | Data, selection, open, anchor, modal, and callback shapes agree between public type and docs.                                                                      |
| 2. Abstraction and composition                 |   20   | 2.5/5 | Scored | Config/data API supplies item rendering and several named config escape hatches, but not independently composed panel parts.                                       |
| 3. Element substitution and merging            |   20   | 2.5/5 | Scored | `renderAnchor` is a function-only trigger escape hatch; no reusable part-level render or merge contract is exposed.                                                |
| 4. State, callbacks, and lifecycle             |   20   |  3/5  | Scored | Current open callback includes a gesture and selection callback carries values; new callbacks lack event details and synchronous veto.                             |
| 5. Semantics, documentation, and compatibility |   15   | 4.5/5 | Scored | Docs cover accessible names, selection, forms, focus, virtualization, and overlays; docs maturity metadata conflicts with the requested stable-surface assumption. |

## Findings

### F1 — Add a separate parts API for consumer-owned layout

**ADR GAP · FIX · Checks A2/A3 · Section 2.** SelectPanel's main surface is item/data-configured and exposes one `renderAnchor` callback plus nested props for internal controls. Consumers who need to change the panel's internal layout or own its trigger/popup must work through those config seams. Add an optional `SelectPanel.Root` composition API with documented Trigger, Overlay/Content, and collection parts; retain the current `SelectPanel` config API, props, and defaults.

Evidence: `packages/react/src/SelectPanel/SelectPanel.tsx:73-140`, `:175-188`, `:627-646`; `packages/react/src/SelectPanel/SelectPanel.docs.json:39-57`, `:248`.

### F2 — Define a render and merge contract for new parts

**ADR GAP · FIX · Checks R1/R2/M1/M2 · Section 3.** `renderAnchor` receives generated anchor props and rendered children, while `overlayProps`, `textInputProps`, and `actionListProps` forward configuration to internal elements. These APIs do not define one ref, attribute, handler, class, and style merge contract for a composed behavior part. Add the contract and tests to the new parts only; leave `renderAnchor` and all existing prop behavior intact.

Evidence: `packages/react/src/SelectPanel/SelectPanel.tsx:132-140`, `:175-181`, `:627-646`, `:788-796`, `:1000-1016`; `packages/react/src/FilteredActionList/FilteredActionList.tsx:52-54`, `:514-522`; `packages/react/src/SelectPanel/SelectPanel.docs.json:109-149`, `:218-221`.

### F3 — Add detailed callbacks only on the new composition surface

**ADR GAP · FIX · Check S2 · Section 4.** `onOpenChange(open, gesture)` exposes close reason, and `onSelectedChange(selected)` exposes the value, but neither includes event details or an in-callback cancellation method. Add a new object callback to the parts API when consumer veto is needed, and keep both existing callback signatures and their behavior unchanged.

Evidence: `packages/react/src/SelectPanel/SelectPanel.tsx:64-69`, `:83-89`, `:600-623`; `packages/react/src/SelectPanel/SelectPanel.docs.json:58-63`, `:121-127`.

## Human review

| Judgment                       | Result                                                                                                                             |
| :----------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| Meaningful part boundaries     | Trigger, overlay/content, input, list/items, and footer actions have distinct ownership; exact grouping remains a design decision. |
| Default elements and semantics | Keep the current listbox/search/form semantics and modal/anchored variants as the baseline.                                        |
| Consumer flexibility           | Keep config/data API as fast path; optional parts are an additive escape boundary.                                                 |
| Maintainer decision            | Confirm public stability metadata and whether the composable surface should be exported on the root or a separate entry point.     |

## Evidence and calibration

Read SelectPanel source, docs metadata, stories, tests/types paths, and root exports at the audited SHA. No test command was run. The audit baseline describes the stable configured API; the docs JSON marks it alpha. This score follows the requested stable-surface premise for compatibility recommendations, while the actual published package version was not independently queried. The earlier SelectPanel WIP comparison was not treated as source evidence because it described a different proposed branch.
