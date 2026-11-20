# Tooltip V2 component API scorecard

| Field                           | Value                                                                                                                                                                                               |
| :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape               | Tooltip V2; config, leaf trigger, overlay                                                                                                                                                           |
| Public surface                  | Root export and `/next`; docs metadata says beta                                                                                                                                                    |
| Mode / commit                   | Whole component / `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                                        |
| Rubric                          | Component API compliance rubric 0.1.0                                                                                                                                                               |
| Contract                        | Met; 5/5                                                                                                                                                                                            |
| ADR alignment                   | 71.3/100                                                                                                                                                                                            |
| Overall                         | 78.5/100, B                                                                                                                                                                                         |
| Open BLOCKs                     | 0                                                                                                                                                                                                   |
| Distinct defects / raw findings | 0 / 2 ADR gaps                                                                                                                                                                                      |
| Sensitivity                     | Fix the 0 open BLOCKs, change nothing else → projected 78.5 / B                                                                                                                                     |
| Unverified                      | Runtime Tooltip + ActionMenu interoperability, automated interaction tests, rendered visual quality                                                                                                 |
| N/A                             | State-change callback: no public state-transition callback is declared. Providers and imperative action refs: no shared configuration or imperative contract.                                       |
| Top fixes                       | 1. Add an opt-in named Trigger/Popup surface while keeping the wrapper. 2. Define and test merging for the new trigger boundary. 3. Record the human decision on leaf/trigger render applicability. |

## Section scores

| Section                                        | Weight | Score | State  | Rationale                                                                                                                        |
| :--------------------------------------------- | :----: | :---: | :----- | :------------------------------------------------------------------------------------------------------------------------------- |
| 1. Shipped contract fidelity                   |   25   |  5/5  | Scored | Public export, required text, label/description semantics, and default behavior are represented in docs and implementation.      |
| 2. Abstraction and composition                 |   20   |  3/5  | Scored | Wrapper API is clear, and a story demonstrates Tooltip nested with an ActionMenu anchor; parts are not independently composable. |
| 3. Element substitution and merging            |   20   | 2.5/5 | Scored | Trigger is a cloned child, with per-event behavior and refs merged locally; there is no documented part render contract.         |
| 4. State, callbacks, and lifecycle             |   20   | 4.5/5 | Scored | Tooltip owns open/close behavior and accessibility wiring; there is no exposed state callback to evaluate.                       |
| 5. Semantics, documentation, and compatibility |   15   | 4.5/5 | Scored | Docs explain label versus description, delay, direction, and hints, but expose no subcomponent contract.                         |

## Findings

### F1 — Add an opt-in composable Tooltip surface

**ADR GAP · FIX · Check A2/R1 · Section 2.** Tooltip V2 takes one child and clones it as the trigger; a Fragment produces a warning and returns without Tooltip behavior. A current Storybook example composes Tooltip with an ActionMenu anchor, which is a reachable use case for independently owned trigger behavior. Add optional `Tooltip.Root`, `Tooltip.Trigger`, and `Tooltip.Popup` parts with an explicit render contract, retaining `<Tooltip text>…</Tooltip>` and its props unchanged.

Evidence: `packages/react/src/TooltipV2/Tooltip.tsx:129-139`, `:301-326`; `packages/react/src/TooltipV2/Tooltip.examples.stories.tsx:29-35`; `packages/react/src/TooltipV2/Tooltip.docs.json:71`.

### F2 — Specify merging at the new Trigger boundary

**ADR GAP · FIX · Checks M1/M2 · Section 3.** The current wrapper composes a subset of child handlers locally, computes tooltip ARIA values, and merges the trigger refs. That is valid evidence for this implementation, but it does not define a reusable composition contract for a new part or guarantee interoperability with another behavior owner. Define and test the new Trigger's handler ordering, cancellation, ordinary attribute precedence, controlled ARIA values, and ref target; leave current child-clone ordering unchanged.

Evidence: `packages/react/src/TooltipV2/Tooltip.tsx:301-326`, `:331-405`.

## Human review

| Judgment                       | Result                                                                                                                              |
| :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| Meaningful part boundary       | Trigger and Popup are distinct for the demonstrated menu-trigger composition; optional naming and ownership need maintainer review. |
| Default elements and semantics | Existing trigger keeps its consumer element; tooltip surface owns `role=tooltip` only for description mode.                         |
| Consumer flexibility           | Current wrapper remains the default path; additive parts should be opt-in.                                                          |
| Maintainer decision            | Whether a tooltip leaf/trigger requires a render API when current use cases can supply an element through the parent part.          |

## Evidence and calibration

Read `TooltipV2/Tooltip.tsx`, its docs metadata, examples, public exports, and the earlier same-SHA audit. No test command was run. The earlier audit marked composition and merge behavior partial; those map to the ADR-gap scores above. No current-contract defect was established.
