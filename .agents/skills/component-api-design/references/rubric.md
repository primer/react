# Component API compliance rubric

**Version: 0.4.1.**

## Table of contents

- [Purpose and authority](#purpose-and-authority), L:22
- [Target baseline](#target-baseline), L:28
- [Grading modes](#grading-modes), L:38
- [Audit procedure](#audit-procedure), L:46
- [Applicability](#applicability), L:57
- [Check catalog](#check-catalog), L:91
- [Evidence and verdicts](#evidence-and-verdicts), L:128
- [Findings and citations](#findings-and-citations), L:146
- [Scoring and validation](#scoring-and-validation), L:154
- [Section anchors](#section-anchors), L:176
- [Layer 3 human review](#layer-3-human-review), L:188
- [Recording results](#recording-results), L:201

This rubric evaluates a component against the accepted benchmark target. It records current-contract defects separately and never changes production APIs, ADR status, release status, or merge policy.

## Purpose and authority

Establish the component's own stated contract from exports, types, docs, stories, and tests before grading. Report a reachable violation of that contract as a `DEFECT`. Then grade compliance with the accepted target; missing target requirements are `ADR GAP`s even when the released component never promised them. The accepted-target score is the headline result. Keep current-contract findings in a separate context table.

An accepted-target gap is a `FIX` or `NIT`. A `BLOCK` is reserved for a reachable current-contract defect or an objective accessibility/native-platform violation. Any open `BLOCK` caps the overall letter grade at D. Record the BLOCK count separately from target-gap counts.

## Target baseline

Use the [pinned target baseline](./target-baseline.md) for all ADR inventory, gist requirements, precedence, mappings, and unresolved decisions. For the audited snapshot, every ADR file present at the pinned `origin/main` SHA is in scope regardless of its status label. The pinned composition gist is also in scope. This is a benchmark assumption and does not edit existing ADR metadata.

The gist requires a parts surface for every interactive component, including interactive leaf controls. Every part supports `as` and element/function `render`. New-part handlers run in this exact order: render-element consumer handler, consumer handler passed to the part, then Primer's handler. The gist defines no additional internal part-handler stage. A consumer skip method stops the remaining handlers for that event; DOM `preventDefault()` and state-transition `cancel()` are separate contracts. Consumer classes come first; consumer style and ordinary attributes win; all refs are merged; behavior props remain part-owned. The gist takes precedence over ADR-025 for new parts. ADR-025 remains in force for configured/internal merges, and existing subcomponents retain their current handler/prop behavior.

New state-transition callbacks use one object with the proposed value, `reason`, originating `event` when present, and synchronous `cancel()`. Existing callback signatures remain unchanged. The gist leaves exact part names/default elements/state types, simultaneous `as` and `render`, skip-method name, and overlay coordination implementation unresolved. Never mark a required interactive part or render form N/A because the current component lacks it.

For rubric 0.4.1, the user-directed scoring scope defers `PART-RENDER` while preserving it as a target requirement and evidence row. Mark only that check `DEFERRED` with a reason; this excludes its weight, its own finding and its section cap from the score. Do not mark it `N/A` or treat it as met. Other checks remain scored, including `COVERED` rows attached to a deferred render finding.

## Grading modes

| Mode | Scope | Output |
| :--- | :--- | :--- |
| Whole component | One named component at a pinned commit; complete the stated-contract review and every applicable target check. | Target scorecard, current-contract context, evidence matrix, and ledger input. |
| PR review | Grade only API behavior introduced or changed by the diff; compare base and head. | Delta findings with no whole-component grade or ledger entry. |
| Nightly | Future automation may run one isolated whole-component grader per component and aggregate its output. | Future work only; no automation or merge gate is created by this rubric. |

## Audit procedure

1. Record component name, import/export paths, docs maturity metadata, repository package version, audited SHA, and mode. Keep published-package metadata separate; verify a published surface only when a recommendation changes an existing released API. Root export and sample selection do not prove stable status.
2. Read the component's own public contract from exports, types, docs, stories, implementation, and focused tests. Record contract defects separately from target gaps.
3. Classify component shapes and complete one verdict row for every check ID. Apply every interactive-part requirement to interactive leaves. Record `N/A` only with a shape-based reason.
4. Record focused unit/integration test execution as `TEST-01` evidence. Separately inspect the snapshot policy (`SNAPSHOT-01`) and Storybook Playwright interaction policy (`INTERACTION-01`); run the smallest relevant Playwright test when feasible. Keep source structure, execution, agent judgment, and human verification as separate evidence classes.
5. Link each gap to one owning finding and one owning check. Use `COVERED` for related unmet check rows owned by the same root finding. A `COVERED` row remains in the denominator and scores zero; it adds no distinct finding or section cap. Use `N/A` only when the target requirement genuinely does not apply.
6. Fill the Layer 3 review form with `PENDING HUMAN` until a human reviewer supplies each required judgment. An agent's opinion is `AGENT JUDGMENT`, not human sign-off.
7. Run the deterministic validator on the structured scorecard data. Confirm all section scores, the threshold grade, caps, distinct finding counts, and BLOCK sensitivity match the rendered report.
8. Verify every cited `path:line` against the pinned source SHA. Record the exact test, type-check, and validator commands and their outcomes.

## Applicability

Shapes can overlap. Use the matrix as a starting point and cite the public contract when resolving a conditional row.

A single interactive leaf may use its public root as its parts surface; this does not waive `PART-AS`, `PART-RENDER`, or the part merge checks.

| Shape | Definition |
| :--- | :--- |
| Config | Provides a ready-made pattern from intent, data, and defaults. |
| Presentational | Provides styled, semantic parts for consumer composition. |
| Base | Provides a low-level primitive with a narrow behavior contract. |
| Utility | Provides component-agnostic behavior or state without necessarily rendering UI. |
| Leaf | Renders one main semantic control or content element. |
| Overlay | Owns floating or modal content, dismissal, or focus lifecycle. |
| Form control | Participates in native form submission or shared field context. |
| Collection | Manages related items, ordering, selection, or keyboard navigation. |

| Check family | Applicability rule |
| :--- | :--- |
| `MOD-01`, `CHILD-01`, `API-01` | All public components; `CHILD-01` is N/A for components with no consumer content. |
| `STRUCTURE-01` | All component implementations; replacement naming applies only when replacing an existing component, and subcomponent ownership applies only when subcomponents are exported. |
| `CUSTOM-ELEMENT-01` | Components that involve a custom element; N/A when the component uses no custom element. |
| `PART-01`, `PART-DOCS`, `PART-AS`, `PART-RENDER`, `MERGE-HANDLER`, `MERGE-CLASS`, `MERGE-STYLE-ATTR`, `MERGE-REF`, `MERGE-BEHAVIOR` | Every component with pointer, keyboard, focus, form, or state interaction, including leaf controls. Utilities and pure content components with no rendered interaction are N/A. |
| `MERGE-CONFIG` | Configured or internal component/consumer merge exists. |
| `STATE-CALLBACK` | A consumer-observable interactive state transition exists. |
| `NAMES-DEFAULTS` | At least one concept is shared with another component under review; compare only that shared concept. |
| `STATE-OWNER` | Public controlled or uncontrolled component-owned state exists. |
| `ACCESS-01`, `SELECTOR-01`, `TYPE-01`, `EXPORT-01`, `TEST-01`, `SNAPSHOT-01`, `INTERACTION-01` | Rendered public components. `TYPE-01` checks the public TypeScript surface; `EXPORT-01` checks internal and actual compatibility-package boundaries; `TEST-01` records focused test execution; `SNAPSHOT-01` and `INTERACTION-01` check the distinct ADR-011 and ADR-017 policies. |
| `LIVE-01` | Component announces changing content or status to assistive technology. |
| `WARN-01` | Component emits a development warning; otherwise mark N/A with evidence that no component-owned warning exists. |
| `STYLE-01` | Component owns CSS or a styling contract; inspect authored CSS modules and cascade-layer declarations directly. |
| `RESP-01` | Component owns responsive values or behavior. |
| `MIG-01` | A recommendation changes an existing API on a published package surface. Mark N/A when all recommendations are additive; do not infer publication state from an unverified registry lookup. |

## Check catalog

Each check has a section weight and a verification class. The listed target gaps default to `FIX`; `BLOCK` is available only for a separately recorded current-contract defect or objective violation.

| ID | Section / weight | Checkable pass condition | Class | Severity for target gap | Source |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `MOD-01` | 1 / 3 | Public layers are classified by their responsibility; each existing layer has a concrete consumer need. No spectrum layer is required without such a need. | semi | FIX | ADR-024; principles 1 |
| `CHILD-01` | 1 / 3 | Consumer-owned free-form content uses `children`; props/data own content Primer transforms, orders, or constrains. | semi | FIX | ADR-004; principles 2 |
| `PART-01` | 1 / 7 | Every interactive component exposes a parts surface, including a root part for an interactive leaf. | semi | FIX | ADR-024; pinned gist |
| `PART-DOCS` | 1 / 5 | Each part has a documented owner, required props/state/ref, and supported composition path. Document the default element when resolved; surface target-unstated names/defaults as unresolved. | semi | FIX | Pinned gist |
| `STRUCTURE-01` | 1 / 1 | Each component is in a PascalCase directory directly under `src/`; exported subcomponents are parent properties; replacements use an incremented numeric name. Apply the latter two rules only when their conditions exist. | semi | FIX | ADR-013 |
| `CUSTOM-ELEMENT-01` | 1 / 1 | A custom element is used only when it provides client-side behavior or a ShadowDOM benefit; retain native elements when they provide sufficient semantics and UI. N/A if none is involved. | semi | FIX | ADR-009 |
| `API-01` | 2 / 4 | Root props follow ADR-003 for `ref`, `as`, DOM attributes, Styled System props, `theme`, `children`, and prop sequencing. `sx` is not required on `@primer/react`; ADR-022-styled-react places legacy `sx` compatibility at the package boundary. Root `as` is required only for a clear polymorphism need. | semi | FIX | ADR-003; ADR-022-styled-react |
| `PART-AS` | 2 / 8 | Every interactive part supports `as` with required behavior props and refs reaching the rendered element. | semi | FIX | Pinned gist; ADR-003 applies to roots |
| `PART-RENDER` | 2 / 8 | Every interactive part supports render-element and render-function forms; the function receives required props and current state. Preserve existing renderer signatures. | semi | FIX | Pinned gist |
| `MERGE-CONFIG` | 3 / 5 | Existing configured/internal merges follow ADR-025; record explicit gist legacy exceptions for existing subcomponents. | semi | FIX | ADR-025; pinned gist |
| `MERGE-HANDLER` | 3 / 8 | New-part handlers run render-element consumer, consumer handler passed to the part, then Primer. A consumer skip method stops remaining handlers for that event; no additional internal part-handler stage is assumed. | semi | FIX | Pinned gist |
| `MERGE-CLASS` | 3 / 3 | New-part classes combine with consumer classes first. | semi | FIX | Pinned gist |
| `MERGE-STYLE-ATTR` | 3 / 4 | New-part consumer style and ordinary duplicate attributes win; behavior props remain part-owned. | semi | FIX | Pinned gist |
| `MERGE-REF` | 3 / 3 | Consumer and internal refs all resolve to the final rendered element. | semi | FIX | ADR-025; pinned gist |
| `MERGE-BEHAVIOR` | 3 / 2 | Part behavior reads its behavior props from the part; render-element props cannot silently replace part-owned behavior. | semi | FIX | Pinned gist |
| `STATE-CALLBACK` | 4 / 8 | Each consumer-observable transition exposes a callback. A new callback uses the proposed state value under its normal name, `reason`, `event` when present, and synchronous `cancel()`; preserve existing callback signatures and record the additive callback-name decision. | semi | FIX | Pinned gist; `contributor-docs/style.md` |
| `NAMES-DEFAULTS` | 4 / 5 | Shared concepts use aligned names and defaults. A shared size uses `small`, `medium`, `large` and `medium` default where that scale applies. | manual | FIX | Pinned gist; style-guide prop naming |
| `STATE-OWNER` | 4 / 2 | A public controlled/uncontrolled state axis has one owner and its value, default, and transition behavior agree with the documented contract. | semi | FIX | ADR-024; component contract |
| `ACCESS-01` | 5 / 4 | Required role, accessible relationships, keyboard, focus, and native form behavior remain on the element that owns the interaction, including alternate composition paths. | semi | FIX | ADR-020 where applicable; accessibility contract |
| `LIVE-01` | 5 / 1 | Changing announcements use the shared live-region policy where the component announces status. | semi | FIX | ADR-020 |
| `WARN-01` | 5 / 1 | Component-emitted development warnings are development-only and describe a reachable invalid or discouraged usage. | semi | FIX | ADR-012 |
| `SELECTOR-01` | 5 / 2 | Stable `data-component` identity is present and distinguished from state attributes; associated tests/docs identify the public selector. | semi | FIX | ADR-023 |
| `STYLE-01` | 5 / 2 | Inspect each authored component CSS file. Styles use CSS Modules and are wrapped in `@layer primer.components.<ComponentName>`; component import and a TypeScript build alone do not prove this. | semi | FIX | ADR-016, ADR-021, ADR-022 CSS layer names |
| `RESP-01` | 5 / 1 | Component-owned responsive behavior uses the accepted responsive-value approach and preserves supported viewport behavior. | semi | FIX | ADR-018 |
| `TYPE-01` | 5 / 1 | Public TypeScript types and exports compile and match the documented component contract. | auto | FIX | ADR-001 |
| `EXPORT-01` | 5 / 1 | Internal modules are not exposed as public API; applicable styled-react compatibility exports follow the documented boundary. | semi | FIX | ADR-015, ADR-022 styled-react |
| `TEST-01` | 5 / 1 | The smallest focused existing unit/integration test command for behavior claims passes; record the exact command and outcome as execution evidence. | auto | FIX | Audit evidence requirement |
| `SNAPSHOT-01` | 5 / 1 | Component tests avoid catch-all render-tree snapshots; snapshots are limited to static outputs with a clear change signal. | semi | FIX | ADR-011 |
| `INTERACTION-01` | 5 / 1 | Tests involving interaction use Playwright to visit a Storybook story and interact with the component; a passing result requires source evidence plus executed test evidence. | semi | FIX | ADR-017 |
| `MIG-01` | 5 / 4 | When a recommendation changes an API confirmed on a published surface, it preserves existing props/callback signatures or names a safe additive/versioned migration. All-additive recommendations are N/A. | semi | FIX | ADR-006, ADR-007, ADR-010, ADR-019; versioning guidance |

## Evidence and verdicts

Every scorecard contains exactly one row for every check ID. Use these verdicts:

| Verdict | Meaning | Scoring treatment |
| :--- | :--- | :--- |
| `PASS` | The property is verified with the evidence required by its check. | Earn the full check weight. |
| `GAP` | The accepted target or current contract is violated and has one owning finding ID. | Earn zero check weight. |
| `N/A` | The shape or contract makes the requirement inapplicable; provide a specific reason. | Exclude the check weight from the section denominator. |
| `COVERED` | A related target check is unmet for the same underlying issue as its owning finding; include that finding ID. | Keep the weight in the denominator and award zero; do not create another distinct finding or section cap. |
| `DEFERRED` | A rubric-versioned scoring exclusion applies; provide a reason and keep the requirement visible in the evidence matrix. In rubric 0.4.1, only `PART-RENDER` may use this verdict. | Exclude the check's weight and a finding owned only by this check from the score, evidence coverage, distinct-gap count, and section cap. Keep other checks linked to that finding scored according to their own verdicts. |
| `NOT MEASURED` | Required evidence was not run or cannot be obtained. Include the missing command/source and reason. | Keep the check weight in the denominator as unknown; do not score it as a pass or zero. Report a provisional score range. |
| `UNRESOLVED` | The target explicitly leaves a decision open or the reviewer cannot resolve it from evidence. State the decision and scope. | Keep the check weight in the denominator as unknown; do not score it as a pass or zero. Report a provisional score range. |

Every row records an evidence class: `SOURCE VERIFIED`, `EXECUTION VERIFIED`, `BEHAVIOR VERIFIED`, `AGENT JUDGMENT`, or `PENDING HUMAN`. Source inspection proves structure only. `TYPE-01`, `TEST-01`, and `INTERACTION-01` cannot pass without `EXECUTION VERIFIED`; runtime claims need an executed test or observable behavior result. A `PENDING HUMAN` evidence row must remain `UNRESOLVED`, and an audit must explicitly carry a boolean `pendingHuman` value. Human review rows remain pending until an actual human supplies the judgment. An agent-filled review form never counts as human sign-off.

`COVERED` rows are measured failures and remain in the applicable denominator with zero earned weight. Grouping related checks under one finding prevents duplicate issue counts while preserving every unmet target obligation in the grade. `DEFERRED` rows are excluded only for the explicit rubric-versioned scope exception and are reported separately; they are not N/A, passes, unknown evidence, or zero-valued failures. `NOT MEASURED` and `UNRESOLVED` remain in the applicable denominator as unknown evidence, not zero-valued failures or passes. A section is `LIMITED` when less than 50% of its published check weight is applicable, regardless of verdict. Still score every applicable row, apply the distinct-finding cap, and include its applicable weight in the overall denominator; `LIMITED` never hides a failure or removes weight when a GAP is fixed. For every section, compute the lower bound as `5 × earned PASS weight / applicable weight` and the upper bound as `5 × (earned PASS weight + unknown weight) / applicable weight`, then apply the same mechanical cap to both bounds. Report an exact score only when the bounds are equal. Aggregate section bounds by their applicable check weight. Keep the result provisional when any section is limited or required evidence/human judgment is incomplete.

## Findings and citations

Each finding has a unique ID, classification (`DEFECT` or `ADR GAP`), severity, one owning section/check, affected check IDs, reachable consumer path, observed behavior, concrete additive fix, and evidence. A finding cites its check ID and one or more exact `path:line` references with the full audited commit SHA. Every `GAP` row points to exactly one finding. Every finding has exactly one primary `GAP` row. Related unmet rows use `COVERED` and the same finding ID; each covered row's check weight still scores zero in the denominator.

A reachable victim is a valid consumer invocation or documented user state that reaches the behavior. A type-rejected, undocumented input is not a reachable victim. Group observations with one owning fix into one distinct finding; report raw observations separately. A finding appears in only one owning section. New-part policy gaps are FIX-level `ADR GAP`s; existing contract and objective violations may be BLOCK-level `DEFECT`s.

For each recommendation that changes a released surface, retain existing props, callback signatures, and behavior through an additive path or a documented versioned migration. Apply `MIG-01` only when the recommendation depends on an API confirmed in a published package. Mark it `N/A` when the proposed changes only add new surfaces; record repository package version separately. A registry lookup that cannot establish publication is not evidence that an API is absent.

## Scoring and validation

Check weights in each section sum to that section's published weight. For each section, `applicable weight` is the sum of weights for every row except `N/A` and `DEFERRED`, including `COVERED`. Earned weight is the sum for `PASS` rows only. `NOT MEASURED` and `UNRESOLVED` weights are unknown and contribute to the score interval, never as a fixed zero. `COVERED` weights are measured failures and score zero. Compute lower and upper section scores using the interval formula above and report two decimal places. Apply the mechanical cap to both bounds. Every section with applicable rows contributes its applicable weight to the overall denominator, including limited sections. Count raw observations as the number of `GAP` and `COVERED` matrix rows plus current-contract findings; report deferred checks and findings separately. Count scored distinct findings by unique non-deferred finding ID after grouping related observations under one owner.

| Open distinct findings owned by section | Maximum section score |
| :--- | :---: |
| 1 BLOCK | 3 |
| 2 BLOCKs | 2.5 |
| 3 BLOCKs | 2 |
| 4 or more BLOCKs | 1 |
| No BLOCK and 1–2 FIX/NIT findings | 4 |
| No BLOCK and 3–4 FIX/NIT findings | 3 |
| No BLOCK and 5 or more FIX/NIT findings | 2 |

Compute each endpoint of the overall target score range as `100 × sum(applicable check weight × capped section endpoint / 5) / sum(applicable check weight)`. A limited section contributes its applicable check weight and score. Report a single numeric score and grade only when the range endpoints match; otherwise report the score interval and corresponding letter-grade interval. Grade endpoints use A (90–100), B (80–89.99), C (70–79.99), D (60–69.99), and F (below 60). An open BLOCK caps each letter-grade endpoint at D. The 78.5 boundary is C; 80.0 is B.

Report `CONCLUSIVE`, `PROVISIONAL`, or `UNKNOWN`. Any `NOT MEASURED`, `UNRESOLVED`, limited section, or pending human review makes the result `PROVISIONAL`; show the calculated provisional score range, check-evidence coverage, and grade range. Use `UNKNOWN` when no scored section exists. Only use `CONCLUSIVE` when all applicable checks and required evidence are complete and required human judgments have been supplied.

The scorecard reports `BLOCK count`, `distinct defects`, and `raw findings` separately. Its sensitivity line is “Fix the N open BLOCKs, change nothing else → projected X / grade Y.” Recalculate with each BLOCK finding's primary check changed to PASS and the BLOCK cap removed; preserve every other verdict and evidence state.

Run `.agents/skills/component-api-design/references/scorecard-calculator.mjs` against the structured JSON audit data. It validates check coverage, verdicts, evidence classes, N/A reasons, finding ownership/counts, section caps, grade thresholds, provisional status, and sensitivity. Focused tests run with `node --test .agents/skills/component-api-design/references/scorecard-calculator.test.mjs`.

## Section anchors

| Section | Weight | 5-point anchor | 3-point anchor | 1-point anchor |
| :--- | :---: | :--- | :--- | :--- |
| 1. Architecture and parts | 20 | All applicable layers have distinct ownership, content ownership is explicit, and every interactive component has a documented parts surface. | Most structure is verifiable; one local boundary or part-contract gap remains. | The primary interactive surface lacks a coherent owner or parts boundary. |
| 2. Root and part substitution | 20 | Root props follow ADR-003; every part supports both `as` and element/function `render` with its required behavior and refs. | Root conventions hold and most parts preserve the contract, with a localized substitution gap. | The main consumer path cannot substitute the interactive element while retaining behavior. |
| 3. Prop merge behavior | 25 | Configured/internal and new-part merge policies are independently documented and verified, including all collision classes. | Most collisions have a verifiable rule; a localized part merge remains incomplete. | Normal consumer composition loses handlers, refs, behavior, or ownership unpredictably. |
| 4. State and shared concepts | 15 | Observable transitions, callback contracts, state ownership, and shared names/defaults are aligned and verifiable. | State works with one localized callback or shared-concept inconsistency. | A central state transition is unobservable or has conflicting ownership. |
| 5. Accessibility and evidence | 20 | Applicable semantics, selectors, styles, responsive behavior, types, runtime tests, and released-surface migrations have the required evidence. | Most applicable requirements are verified; one local evidence or compatibility gap remains. | Central semantics or behavior evidence is absent or a released contract has no safe migration. |

Anchors describe observable properties of the API and evidence. Apply the numeric formula and mechanical ceilings; anchors do not replace calculation or excuse a missing required check.

## Layer 3 human review

Complete this form after source and runtime checks. Record rationale, a reachable use case, and the human reviewer. Keep each item `PENDING HUMAN` until a human answers.

| Judgment item | Result and rationale |
| :--- | :--- |
| Does each proposed part boundary map to a consumer-controlled region? | Pass / concern / pending / N/A — reason and use case: |
| Is the default element suitable for the behavior and semantics it owns? | Pass / concern / pending / N/A — reason and evidence: |
| Do both `as` and `render` preserve parent context, semantic order, collection ownership, and accessible naming? | Pass / concern / pending / N/A — reason and evidence: |
| Are shared names/defaults coherent for concepts this component shares with the audited set? | Pass / concern / pending / N/A — shared concepts: |
| Which unresolved target decisions need maintainer direction? | Decision IDs / none: |
| Is the proposed fix additive for the exact released surface? | Pass / concern / pending / N/A — package evidence: |

## Recording results

Store whole-component scorecards under `contributor-docs/component-api-audits/` and index completed results in `contributor-docs/component-api-audit-ledger.md`. Keep structured inputs next to the reports or in the audit data file named in each scorecard. One aggregator owns ledger updates; an isolated grader emits its scorecard and structured data to its caller. Do not have parallel graders write the shared ledger.

PR reviews grade the changed diff only and do not enter the whole-component ledger. Future nightly orchestration may fan out one grader per component, validate each result, and let one aggregator update the ledger. It must keep incomplete results provisional and preserve exact citations.
