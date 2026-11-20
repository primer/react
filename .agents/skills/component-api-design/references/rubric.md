# Component API compliance rubric

**Version: 0.1.0.**

## Table of contents

- [Purpose and authority](#purpose-and-authority), L:20
- [Modes](#modes), L:26
- [Audit procedure](#audit-procedure), L:34
- [Applicability](#applicability), L:43
- [Checks](#checks), L:74
- [Findings and evidence](#findings-and-evidence), L:97
- [Scoring](#scoring), L:105
- [Section anchors](#section-anchors), L:124
- [Human review form](#human-review-form), L:136
- [Recording results](#recording-results), L:149

This rubric grades how well a Primer React component keeps its own stated contract and how closely its API aligns with the proposed composition principles. It is a design review aid, not a release gate. It does not authorize API changes, infer new product requirements, or turn a proposed ADR into a current guarantee.

## Purpose and authority

Run the two stages in order. **Stage 1: shipped contract.** Establish the public surface from package exports, types, docs, stories, tests, and source. Decide whether current Primer guarantees and the component's own documented contract are met. Findings here are `DEFECT`s. **Stage 2: proposed alignment.** Assess applicable principles and proposed ADR-024, ADR-025, and the Base UI-compatible composition ADR. A mismatch is an `ADR GAP`, never a defect solely because a proposed capability is absent.

For conflict resolution, current adopted ADRs and objective accessibility/native-platform requirements take precedence over a component-local promise. The component-local contract establishes its current behavior and claimed use; an explicit contradiction with higher authority is a defect. ADR-024, ADR-025, and the Base UI-compatible composition ADR are proposed. Their features are scored as design gaps only.

## Modes

| Mode | Scope | Output |
| :--- | :--- | :--- |
| Whole component | Grade one named component at a pinned commit; complete both stages and all applicable checks. | Full scorecard and ledger entry. |
| PR review | Grade only behavior and contracts introduced or changed by the diff. Do not assign pre-existing findings or a whole-component grade. | Delta findings, cited to base/head SHAs; no ledger entry. |
| Nightly | Future automation may invoke one whole-component grader per component and aggregate scorecards. It must not infer human judgments, change public APIs, or claim a verified score when evidence is missing. | Future work; no current automation or merge gate. |

## Audit procedure

1. Record component name, public package entry point, version/status (stable, experimental, deprecated, or `/next`), mode, and exact commit SHA.
2. Read the component's public types, implementation, docs, stories, and focused tests. Identify each shipped contract statement before evaluating the proposed principles.
3. Classify the component's applicable shapes using the table below. Record the reason for every `N/A`.
4. Grade the shipped contract, current adopted ADRs, and objective requirements first. Then grade proposed ADR alignment, labeling each mismatch `ADR GAP`.
5. Run checks appropriate to the mode. `auto` requires deterministic machine evidence; `semi` requires a script/search to produce candidates that a reviewer adjudicates; `manual` requires a written reviewer judgment. Do not claim a check was automated when the tool did not decide pass/fail.
6. Record findings once in the section that owns the fix, attach exact citations, assign severity by the finding's current-contract or proposed-ADR scope, and calculate the score.

## Applicability

Use `Y` when the shape normally makes the check applicable, `C` when the listed behavior exists, and `—` when it is structurally inapplicable. A component may have multiple shapes.

| Shape | Definition |
| :--- | :--- |
| Config | Provides a ready-made pattern from intent, data, and defaults. |
| Presentational | Provides styled, semantic parts for consumer composition. |
| Base | Provides a low-level primitive, often unstyled, with a narrow behavior contract. |
| Utility | Provides component-agnostic state or behavior without owning a rendered pattern. |
| Leaf | Renders one main semantic control or content element. |
| Overlay | Owns floating or modal content, dismissal, or focus lifecycle. |
| Form control | Participates in native form submission or shared field context. |
| Collection | Manages related items, ordering, selection, or keyboard navigation. |

| Check | Config | Presentational | Base | Utility | Leaf | Overlay | Form | Collection |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| C1–C2 | Y | Y | Y | C | Y | Y | Y | Y |
| A1 | Y | Y | Y | C | Y | Y | Y | Y |
| A2–A3 | C | Y | C | — | — | C | C | Y |
| R1–R2 | C | C | C | — | C | C | C | C |
| M1–M2 | C | C | C | C | C | C | C | C |
| S1–S2 | C | C | C | C | C | C | C | C |
| L1 | Y | Y | Y | — | Y | Y | Y | Y |
| L2 | C | C | C | — | C | C | Y | C |
| L3 | — | — | — | — | — | Y | — | C |
| D1 | Y | Y | Y | C | Y | Y | Y | Y |
| D2 | C | C | C | C | C | C | C | C |

`C` means inspect whether that feature exists; use `N/A` with a specific reason if it does not. Do not mark an absent API as a failure when the component shape does not need it. In particular, parts, `render`, state callbacks, providers, and imperative refs are not universal requirements. ADR-003 restricts `as` to components with a clear polymorphism need.

## Checks

`Contract` checks evaluate an existing guarantee or the component's own stated contract. `ADR` checks evaluate only a proposed design pattern. Potential severity is a ceiling; a proposed ADR gap cannot be a `BLOCK`.

| ID | Stage / owner | Check and pass condition | Applicability | Class | Severity | Source |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| C1 | Contract / 1 | Public types, exports, docs, stories, and implementation agree on the component's documented behavior, defaults, and callback signatures. Record a reachable disagreement as one defect. | All public shapes | semi | BLOCK | Component's docs/types/stories; adopted ADRs |
| C2 | Contract / 1 | A changed or removed API on a released surface has the required migration/versioning path. First verify that the exact surface exists in the latest published package. Unreleased APIs do not create installed-consumer breakage. | Released surface and API change | semi | BLOCK in PR mode; FIX in whole-component mode | `contributor-docs/versioning.md`; changeset guidance |
| A1 | ADR / 2 | The layer ownership is explicit and each public layer serves a concrete use; no config/presentational/base/utility layer is required without a consumer need. | All shapes | manual | FIX | Principle 1; proposed ADR-024 |
| A2 | ADR / 2 | Each named part has a distinct consumer-controlled region and documented owner; semantic, collection, and context relationships remain valid. | Compound/collection/overlay shapes | manual | FIX | Principle 2; ADR-004 |
| A3 | ADR / 2 | Free-form content uses `children`; props/data are used when Primer owns transforming, ordering, or constraining content. | Content-bearing shapes | semi | FIX | Principle 2; ADR-004 |
| R1 | ADR / 3 | `as` is present only for a clear polymorphism need; new part `render` has an explicit supported form, default element, prop/state/ref contract, and `as`/`render` interaction rule. | Applicable roots/parts | semi | FIX | Principle 3; ADR-003; proposed composition ADR |
| R2 | ADR / 3 | New replacement targets receive required behavior props and ref; custom components are documented to spread props and forward refs. Existing renderer signatures remain unchanged. | Existing/new render or substitution boundary | semi | FIX | Principle 3; proposed composition ADR |
| M1 | Contract or ADR / 1 if DEFECT, 3 if ADR GAP | Every supported collision has a specified precedence or handler composition/cancellation rule; current configured behavior is preserved and new part behavior is documented and tested separately. | Props combine on an element | semi | BLOCK for a reachable regression; FIX for an ADR gap | Principle 4; adopted/current behavior; proposed ADR-025 and composition ADR |
| M2 | Contract or ADR / 1 if DEFECT, 3 if ADR GAP | The public ref target is documented and every consumer/internal ref required by the contract reaches the final rendered element. | Rendered component with refs | semi | BLOCK for a reachable contract break; FIX for an ADR gap | Principle 4; ADR-003 |
| S1 | Contract / 1 | For exposed component-owned state, controlled value, `default*`, and change behavior are internally consistent with the documented ownership and do not silently switch modes. | State-bearing shapes | semi | BLOCK for a reachable contract break; N/A if no such state | Principles 5–6; component contract |
| S2 | ADR / 4 | New state callbacks expose the proposed value and typed transition context; synchronous cancellation is offered only when consumer veto is needed and happens before uncontrolled state commits. Existing callback signatures are preserved. | New state-transition API | manual | FIX | Principle 7; `style.md`; proposed composition ADR |
| L1 | Contract / 1 | Required semantic roles, accessible relationships, keyboard, and focus behavior are present at the element that owns the interaction; alternate composition paths preserve them. | Rendered patterns | semi | BLOCK for an objective/reachable violation | Principle 10; applicable adopted ADR and accessibility contract |
| L2 | Contract / 1 | Native form attributes and field-context IDs/relationships reach the actual native control and preserve native submission behavior where promised. | Form controls and integrations | semi | BLOCK for a reachable break; otherwise N/A | Principle 10; component/field contract |
| L3 | Contract or ADR / 1 if DEFECT, 4 if ADR GAP | Overlay ownership states mount, portal, dismissal, focus-entry/return, and supported nested behavior. Grade only behaviors the current or proposed surface claims to support. | Overlay shapes | semi | BLOCK for a broken claimed behavior; FIX for an ADR gap | Principle 9; component contract; proposed composition ADR |
| D1 | Contract or ADR / 1 if DEFECT, 5 if ADR GAP | Public types, exports, defaults, docs, stories, identifiers, and any documented state styling describe the same supported contract. `data-component` identity is distinct from state attributes. | All public shapes | semi | FIX | Principle 11; ADR-023 |
| D2 | ADR / 5 | A provider owns configuration only when multiple descendants share it and local props cannot express it naturally; its boundary and supported overrides are documented. | Provider/context-bearing shapes | manual | NIT | Principle 12 |

## Findings and evidence

Each finding has: `DEFECT` or `ADR GAP`; one primary check ID; `BLOCK`, `FIX`, or `NIT`; one owning section; a named reachable consumer and path; a concise observed behavior; a concrete additive API fix; and one or more `path:line` citations pinned to the audited SHA. Include the relevant public type, test, docs, or story when it supports reachability or the claimed contract.

Score one root cause once in the section whose fix owns it. Cross-reference related checks without adding another defect. A finding needs a reachable victim: users in valid rare states count, and ordinary documented consumer code counts even without a current repo callsite. Code rejected by the public type and unsupported by docs or callsites is not a BLOCK; do not propose a runtime guard for an unreachable case.

Do not grade migrations against unreleased surfaces. Do not charge a consumer for proposed ADR gaps as defects. If a concern is caused by a shared primitive outside the component, label it advisory and name the owning module rather than duplicating a scored defect across consumers.

## Scoring

Score each section from 0 to 5 using its anchors below. Start from the written property anchor, then apply the ceiling for open distinct findings owned by that section.

| Open distinct findings owned by section | Maximum section score |
| :--- | :---: |
| 1 BLOCK | 3 |
| 2 BLOCKs | 2.5 |
| 3 BLOCKs | 2 |
| 4 or more BLOCKs | 1 |
| No BLOCK and 3–5 FIXes | 4 |
| No BLOCK and 6 or more FIXes | 3 |

An ADR gap may be a FIX or NIT; it cannot be a BLOCK. Contract defects may be BLOCK only when a reachable user path exists and the outcome is materially broken or violates an objective requirement.

Compute each scored section's contribution as `(section score / 5) × section weight`. Section 1 is the Stage 1 shipped-contract score; sections 2–5 are Stage 2 ADR-alignment scores. Current-contract defects are scored in section 1 even when a related principle check is listed under another section; proposed ADR gaps are scored in the ADR section that owns the fix. Report the ADR alignment score normalized across applicable sections 2–5, and the overall grade across all scored sections. Exclude `N/A` sections. Mark a section `limited` when fewer than one-third of its checks have a non-vacuous verdict; retain its score for information, but redistribute its weight proportionally among the other scored sections. Mark unverified sections `not measured`, never zero; exclude their weight rather than redistributing evidence uncertainty. If no section is scored, the overall result is `not measured`. Overall percentage maps to A (90–100), B (80–89.9), C (70–79.9), D (60–69.9), or F (below 60). Any open BLOCK caps the overall letter grade at C.

Report raw findings and distinct defects separately. Include the sensitivity line: “Fix the N open BLOCKs, change nothing else → projected X / grade Y.” Recalculate with those BLOCKs closed and all other verdicts unchanged.

## Section anchors

| Section | Weight | 5 | 3 | 1 |
| :--- | :---: | :--- | :--- | :--- |
| 1. Shipped contract fidelity | 25 | Public types, docs, defaults, callbacks, and observed behavior agree; current guarantees hold on every supported path. | One localized, reachable contract disagreement with a clear repair; remaining declared behavior is verifiable. | Multiple central contracts disagree, or a required current guarantee fails on a primary consumer path. |
| 2. Abstraction and composition | 20 | Each existing layer has a distinct owner; demonstrated composition needs are met without forcing extra abstractions; semantics and ordering remain explicit. | One demonstrated variation requires a documented workaround or one region's ownership is unclear. | Primary documented composition needs require cloning, forking, or unsupported tree surgery, or the API forces unrelated responsibilities together. |
| 3. Element substitution and merging | 20 | Applicable substitution surfaces preserve semantics, props, refs, and documented collision rules consistently; fixed elements remain fixed where their meaning requires it. | One localized target or collision rule is incomplete, without breaking the existing contract. | A supported target loses essential behavior/ref/ARIA, or collision handling makes normal composition unpredictable. |
| 4. State, callbacks, and lifecycle | 20 | Exposed state has one owner; current controlled behavior is correct; applicable transition and overlay lifecycles are explicit and verifiable. | State works, with one useful reason, event, or lifecycle detail left implicit. | A reachable state transition or claimed lifecycle is incorrect, inaccessible, or cannot be controlled as documented. |
| 5. Semantics, documentation, and compatibility | 15 | Applicable semantics, form behavior, public types, docs, examples, stable identifiers, and migration paths agree. | One localized documentation or compatibility seam is incomplete; required semantics remain intact. | A reachable accessibility/form contract is broken, public guidance misleads consumers, or a released surface has no safe migration path. |

Anchors describe API properties, not resemblance to a named component or library. A section with no applicable checks is `N/A`; a section with mostly vacuous passes is `limited`, not a high score.

## Human review form

Fill only after the source-backed checks. Record a short rationale and a reachable use case for each judgment.

| Judgment | Response |
| :--- | :--- |
| Is each proposed part boundary meaningful to a consumer who needs to position, omit, replace, style, or configure that region? | Pass / concern / N/A — why: |
| Is each default rendered element right for the behavior and semantics it owns? | Pass / concern / N/A — why: |
| Does the API retain a useful default path while exposing only needed variation? | Pass / concern — example: |
| Does composition preserve parent context, semantic order, collection ownership, and accessible naming? | Pass / concern / N/A — evidence: |
| Is any proposed provider or imperative API justified by a named integration need? | Pass / concern / N/A — why: |
| Which ADR gaps need a maintainer decision before an implementation proposal? | List / none: |

## Recording results

Keep whole-component scorecards under `contributor-docs/component-api-audits/` and index each completed grade in `contributor-docs/component-api-audit-ledger.md`. The ledger records component, public status, audited SHA, date, mode, contract result, ADR grade, BLOCK count, and scorecard link. Do not update it for PR-only delta reviews. Increment the minor rubric version when checks, severities, applicability, weights, or score rules change; increment the patch for wording or citation-only changes.

Every scorecard and ledger row uses the commit SHA as the evidence boundary. Cite `path:line` and the SHA; regenerate citations if source moves. The grader agent is designed for one component per invocation so a later workflow can run one isolated grade per component and combine only the completed scorecards.
