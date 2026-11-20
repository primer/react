# Dialog component API scorecard

| Field                           | Value                                                                                                                                                                                    |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape               | Dialog; config, overlay                                                                                                                                                                  |
| Public surface                  | Root package export; docs metadata says alpha                                                                                                                                            |
| Mode / commit                   | Whole component / `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                             |
| Rubric                          | Component API compliance rubric 0.1.0                                                                                                                                                    |
| Contract                        | Met; 5/5                                                                                                                                                                                 |
| ADR alignment                   | 79.3/100                                                                                                                                                                                 |
| Overall                         | 84.5/100, B                                                                                                                                                                              |
| Open BLOCKs                     | 0                                                                                                                                                                                        |
| Distinct defects / raw findings | 0 / 2 ADR gaps                                                                                                                                                                           |
| Sensitivity                     | Fix the 0 open BLOCKs, change nothing else → projected 84.5 / B                                                                                                                          |
| Unverified                      | Cross-overlay Escape/focus behavior, assistive-technology interaction, rendered visual quality                                                                                           |
| N/A                             | `open` state callback: caller controls mounting; no state callback is declared. Provider: Dialog context only marks descendants inside a Dialog.                                         |
| Top fixes                       | 1. Add an independent composition surface alongside the config API. 2. Define render and merge semantics for its new parts. 3. Keep the existing `onClose(gesture)` signature untouched. |

## Section scores

| Section                                        | Weight | Score | State  | Rationale                                                                                                                                       |
| :--------------------------------------------- | :----: | :---: | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Shipped contract fidelity                   |   25   |  5/5  | Scored | Config renderers, slot behavior, `onClose(gesture)`, and caller-controlled mounting are stated and implemented.                                 |
| 2. Abstraction and composition                 |   20   | 3.5/5 | Scored | Header/body/footer renderers and custom slots support some structure changes; the default Dialog remains one configured tree.                   |
| 3. Element substitution and merging            |   20   |  3/5  | Scored | Several parts forward refs and props, while custom rendering uses fixed renderer contracts rather than one part-level render/merge contract.    |
| 4. State, callbacks, and lifecycle             |   20   |  5/5  | Scored | Dialog owns portal, focus trap, Escape, accessible relationships, and backdrop lifecycle; external mounting is a documented ownership boundary. |
| 5. Semantics, documentation, and compatibility |   15   | 4.5/5 | Scored | The title, subtitle, modal role, focus refs, defaults, and custom-renderer limits are documented.                                               |

## Findings

### F1 — Add optional composed Dialog parts

**ADR GAP · FIX · Checks A2/A3 · Section 2.** Dialog offers `renderHeader`, `renderBody`, and `renderFooter`, plus Header/Body/Footer slots intended for custom renderers. Consumers cannot independently arrange a consumer-supplied trigger, popup, title, and close behavior as named parts. Add an opt-in parts API or a separate composition entry point; retain the existing config component, renderers, slots, and caller-controlled mount behavior.

Evidence: `packages/react/src/Dialog/Dialog.tsx:82-113`, `:316-360`, `:550-568`; `packages/react/src/Dialog/Dialog.docs.json:58-73`, `:134-172`.

### F2 — Specify part-level replacement and merge rules

**ADR GAP · FIX · Checks R1/R2/M1/M2 · Section 3.** Existing Header, Title, Body, and Footer elements forward refs and consumer props, but there is no supported part `render` contract or shared handler/attribute merge policy. Define that contract only on the new surface and test semantic relationships and ref targets. Preserve current renderer props and `onClose(gesture)`.

Evidence: `packages/react/src/Dialog/Dialog.tsx:449-485`; `packages/react/src/Dialog/Dialog.docs.json:78-80`.

## Human review

| Judgment                       | Result                                                                                                                                            |
| :----------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| Meaningful part boundaries     | Trigger, popup, title, content, and close behavior are potential independently owned regions; maintainers should settle optionality and ordering. |
| Default elements and semantics | Current `role=dialog`, title/description IDs, Portal, and focus trap are the baseline to preserve.                                                |
| Consumer flexibility           | Keep the config component as the fast path; only introduce parts as an additional entry point.                                                    |
| Maintainer decision            | Decide whether the new root owns open state or continues to require consumer-controlled mounting.                                                 |

## Evidence and calibration

Read Dialog source, docs metadata, stories, tests/types paths, and exports at the audited SHA. No test command was run. The earlier audit rated the config contract and accessibility as met, part composition as N/A for the current config surface, and lifecycle as partial. This grade preserves the strong current contract and treats the proposed parts surface as an additive ADR gap.
