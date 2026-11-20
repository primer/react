# Component API benchmark target

## Table of contents

- [Scope and pinned sources](#scope-and-pinned-sources), L:11
- [Composition gist requirements](#composition-gist-requirements), L:19
- [Merged ADR inventory](#merged-adr-inventory), L:33
- [Requirement-to-check mapping](#requirement-to-check-mapping), L:67
- [Unresolved target decisions](#unresolved-target-decisions), L:89

## Scope and pinned sources

This benchmark inventories every decision document present at `origin/main` commit `2128032dca65a1bd565fe382c2e91c638c6473a4`, regardless of its recorded `Proposed`, `Accepted`, `Abandoned`, or `Superseded` label. The inventory includes all 27 files under `contributor-docs/adrs/`: 26 decision documents and `adr-000-template.md`, which is recorded as a template rather than a normative decision. Resolve conflicts at the requirement and scope level: explicit later decision text controls an overlapping earlier requirement even when the older ADR lacks a `Superseded by` label. Record unaffected requirements from the earlier ADR separately.

The status-agnostic inclusion rule is a benchmark assumption. It does not update ADR status, assert that the proposals have become project governance, or establish that a component implementation has shipped. Target compliance is the headline score; evidence about today's released contract is reported separately.

The external composition source is pinned to [gist revision `0f385c865492b0752f19931cc2ae5c7254ef0ad2`](https://gist.github.com/adierkens/894bb9ec4268f85e5a3119ed7de33410/0f385c865492b0752f19931cc2ae5c7254ef0ad2), file `0-2026-11-17-base-ui-foundation.md`, content SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2`. The pinned revision matches the vault copy except for a blank line before the appendix and a final newline.

## Composition gist requirements

**Parts surface:** every interactive component gets a consumer-composable parts surface. This includes interactive leaf controls; absence of an internal sub-region does not make the component N/A. Existing configured APIs, root `as` usage, slots, and legacy subcomponents remain supported.

**Substitution:** every part supports both `as` and `render`. `render` accepts an element or a function receiving the part's required props and current state; both forms preserve the part's behavior and required accessibility props. Custom targets forward the received props and ref to the rendered DOM element.

**Part merge policy:** event handlers run in this order: render-element consumer handler, consumer handler passed to the part, then Primer's handler. The gist defines no additional internal part-handler stage. A consumer's skip method stops the remaining handlers for that event; DOM `preventDefault()` and state-transition `cancel()` remain separate contracts. Classes combine with consumer classes first. Consumer style values and ordinary duplicate attributes win. All refs point to the rendered element. Behavior props such as `disabled` are owned and read by the part, not taken from the render element.

**State callbacks:** a new transition callback takes one object containing the proposed value under its normal name, `reason`, the originating DOM `event` when one exists, and a synchronous `cancel()` method. Calling `cancel()` before the callback returns prevents the uncontrolled internal commit. It is separate from DOM `preventDefault()` and the part-handler skip method. Existing callback signatures remain unchanged.

**Common concepts:** the same concept uses aligned prop names and defaults across components. Compare only components that expose the same concept; for a shared `size`, the Primer naming guidance recommends `small`, `medium`, and `large`, with `medium` as the default. Do not invent a shared concept where none exists.

**Precedence and legacy behavior:** for new parts, this gist overrides ADR-025's component-first handler and class order. ADR-025 remains the target for configured-component and internal merges. Existing subcomponents retain their current handler/prop behavior as a compatibility exception; new parts follow the gist policy.

## Merged ADR inventory

Line references below are pinned to `2128032dca65a1bd565fe382c2e91c638c6473a4`. All files are inventoried regardless of status; a non-applicability reason identifies the absence of a component public-API requirement, while an explicit supersession reason cites the later decision.

| File | Recorded status | Requirement mapping or non-applicability |
| :--- | :--- | :--- |
| `adr-000-template.md` | Placeholder status; template | Template only, not a decision: lines 16–22. |
| `adr-001-typescript.md` | Approved; Adopted | `TYPE-01`: TypeScript component implementation, lines 16–20. |
| `adr-002-behavior-isolation.md` | Explicitly superseded by ADR-009 | Inventory only; ADR-009 is the later behavior-isolation decision: status line 7, decision lines 96–104. |
| `adr-003-prop-norms.md` | Approved; Adopted | `API-01`: root `ref`, `as`, DOM-prop, Styled System, `theme`, `children`, and sequencing conventions, lines 20–67. Its `sx` requirement for `@primer/react` is superseded at that package boundary by ADR-022-styled-react's explicit compatibility-package decision, lines 16–38. |
| `adr-004-children-as-api.md` | Approved; Adopted in progress | `CHILD-01`: choose children versus constrained/composite props from content ownership and flexibility, lines 16–22, 41–110, 185–359. |
| `adr-005-box-sx.md` | Explicitly superseded by ADR-016 | Inventory only; ADR-016 replaces this Box-based styling direction: status line 7, decision lines 56–64. |
| `adr-006-drafts.md` | Approved; explicitly superseded by ADR-010 | `MIG-01`: transition/deprecation process context, lines 5, 16–46; current terminology comes from ADR-010. |
| `adr-007-experimental-components.md` | Approved; Adopted abandoned | `MIG-01`: experimental-package status context only, lines 7–8, 47–55; record its abandoned state without treating it as a new API requirement. |
| `adr-008-interaction-tests.md` | Superseded by ADR-017 | Inventory only; current interaction-test direction is ADR-017: line 4, decision lines 32–41. |
| `adr-009-behavior-isolation.md` | Approved; Adopted | `CUSTOM-ELEMENT-01`: when a component uses a custom element, preserve native HTML semantics where sufficient and require client-side behavior or a ShadowDOM benefit; N/A when no custom element is involved. Decision and non-mandatory-use clauses, lines 185–208. |
| `adr-010-drafts-are-experimental.md` | Approved; Adopted | `MIG-01`: experimental status terminology, lines 46–54. |
| `adr-011-snapshot-tests.md` | Approved; Adopted in progress | `TEST-01`: snapshot-test evidence policy, lines 49–78. |
| `adr-012-development-warnings.md` | Approved; Adopted in progress | `WARN-01`: applicable when the component emits a development warning; warning implementation must remain development-only, lines 24–60. |
| `adr-013-file-structure.md` | Approved; Adopted in progress | `STRUCTURE-01`: per-component PascalCase directory directly under `src/`, exported subcomponents as parent properties, and incremented numeric naming for replacements, lines 14–40. |
| `adr-014-npm-workspaces.md` | Approved; Adopted in progress | No component public-API requirement; workspace/repository structure only, lines 26–74. |
| `adr-015-internal-modules.md` | Approved; Adopted | `EXPORT-01`: applicable only if a component exposes an internal module as public API; internal module boundary, lines 32–60. |
| `adr-016-css.md` | Approved; Adopted | `STYLE-01`: CSS/module styling direction, lines 57–98. |
| `adr-017-interaction-tests-revisited.md` | Approved; Adopted | `TEST-01`: current Storybook/Playwright interaction evidence, lines 24–32. |
| `adr-018-responsive-values.md` | Approved; Adopted | `RESP-01`: applicable when a component owns responsive values; data-attribute/CSS bridge and avoidance of JS-driven responsive control, lines 36–123. |
| `adr-019-deprecating-props.md` | Approved; Adopted | `MIG-01`: applicable when a public prop is deprecated or migrated; types, docs, lint, and migration process, lines 38–47. |
| `adr-020-live-regions.md` | Approved; Adopted in progress | `LIVE-01`: applicable when the component announces status or alert updates; shared live-region usage, lines 43–79. |
| `adr-021-css-layers.md` | Approved and Adopted in progress | `STYLE-01`: layer use where component CSS participates, lines 66–107. |
| `adr-022-css-layer-names.md` | Approved; Adopted status commented out | `STYLE-01`: layer naming/order where component CSS participates, lines 28–65. |
| `adr-022-styled-react.md` | Accepted | `API-01` precedence: `@primer/styled-react` is the compatibility boundary for styled-components/`sx`; `@primer/react` may remove `sx`, lines 16–38. `EXPORT-01` checks actual compatibility-package exports; do not infer component-specific exports from the generic `sx` helper. |
| `adr-023-stable-selectors-api.md` | Accepted | `SELECTOR-01`: stable `data-component` identifiers, naming, CSS, tests/docs, and versioning, lines 50–59, 73–205, 234–297. |
| `adr-024-modular-ds.md` | Proposed | `MOD-01` and `PART-01`: config/presentational/base/utility spectrum and layered composition; included despite its status, lines 41–60, 74–249. |
| `adr-025-prop-merging.md` | Proposed | `MERGE-CONFIG`: component-first configured/internal merge policy and special cases; included despite its status, lines 22–141. |

## Requirement-to-check mapping

| Check IDs | Target requirement | Source |
| :--- | :--- | :--- |
| `MOD-01`, `PART-01`, `PART-DOCS` | Use the modular spectrum without requiring every API type, and expose a parts surface for every interactive component with documented parts. | ADR-024 lines 41–60, 74–249; gist sections “Decision” and “What changes”. |
| `STRUCTURE-01` | Use PascalCase component directories, attach exported subcomponents to their parent, and increment the numeric name when replacing a component. | ADR-013 lines 14–40. |
| `CUSTOM-ELEMENT-01` | Prefer native elements when they provide sufficient semantics; a custom element must provide client-side behavior or a ShadowDOM benefit. | ADR-009 decision and non-mandatory-use clauses, lines 185–208. |
| `CHILD-01` | Use `children` for free-form content and props/data for content Primer owns, transforms, orders, or constrains. | ADR-003 lines 63–67; ADR-004 lines 16–110, 185–359. |
| `API-01` | Follow root prop norms for `ref`, `as`, DOM props, Styled System props, `theme`, `children`, and sequencing. `sx` is not required on `@primer/react`; keep legacy styled-components/`sx` compatibility at the package boundary selected by ADR-022. | ADR-003 lines 20–67; ADR-022-styled-react lines 16–38. |
| `PART-AS`, `PART-RENDER` | Every part supports `as` plus element and function forms of `render`, including required props, ref, and current state. | Pinned gist sections “Decision,” “What changes,” and “Appendix: composition contract”. |
| `MERGE-CONFIG` | Preserve ADR-025 for configured-component and internal merges, including handler order, classes, consumer-winning style/ordinary props, refs, and controlled attributes. | ADR-025 lines 22–141; gist section “Configured components and internal merges (ADR-025)”. |
| `MERGE-HANDLER`, `MERGE-CLASS`, `MERGE-STYLE-ATTR`, `MERGE-REF`, `MERGE-BEHAVIOR` | Apply the gist's part-only order and collision ownership; the handler sequence is render-element consumer, consumer passed to the part, then Primer. Skip, `preventDefault()`, and transition `cancel()` are distinct. | Pinned gist sections “Customizing a part works the same way everywhere,” “Where this departs from ADR-025,” and “Appendix: composition contract”. |
| `STATE-CALLBACK` | Add new state callbacks with value, reason, event, and synchronous cancel; preserve legacy callbacks. | Pinned gist sections “Callbacks say what happened,” “What stays the same,” and “State-change callbacks”; contributor-docs/style.md lines 363–377. |
| `NAMES-DEFAULTS` | Align names/defaults only for shared concepts, including compatible common size scales. | Pinned gist sections “The same prop means the same thing everywhere”; `.agents/skills/style-guide/docs/component-prop-naming.md`, “Prefer small, medium, and large”. |
| `STATE-OWNER` | Keep component-owned state coherent with its documented controlled/uncontrolled contract. | ADR-024 lines 60–185; component public API and tests. |
| `ACCESS-01`, `LIVE-01` | Preserve pattern semantics, accessibility, native form behavior, and live-region policy where announcements occur. | ADR-020 lines 43–79; component pattern requirements and focused tests. |
| `SELECTOR-01` | Preserve stable public component selectors, state/identity distinctions, tests, and docs. | ADR-023 lines 73–205, 234–297. |
| `STYLE-01`, `RESP-01` | Verify authored component CSS Modules and their required `primer.components.<ComponentName>` cascade layer, plus responsive-value behavior where the component owns that API. | ADR-016 lines 57–98; ADR-021 lines 66–107; ADR-022 CSS layer names lines 28–65; ADR-018 lines 36–123. |
| `TYPE-01`, `EXPORT-01`, `WARN-01` | Preserve TypeScript surfaces, do not expose internal modules, verify actual compatibility-package exports, and keep development warnings development-only. | ADR-001 lines 16–20; ADR-015 lines 32–60; ADR-022-styled-react lines 16–38; ADR-012 lines 24–60. |
| `SNAPSHOT-01`, `INTERACTION-01`, `TEST-01` | Keep component snapshots focused rather than catch-all; use Playwright interactions against Storybook; record focused test execution separately from policy compliance. | ADR-011 lines 49–78; ADR-017 lines 24–32. |
| `MIG-01` | Apply deprecation and migration checks only when a recommendation changes an API confirmed on a published surface. | ADR-006/007/010; ADR-019 lines 38–47; exact published API evidence when the recommendation depends on it. |

## Unresolved target decisions

The gist explicitly leaves exact part names/default elements/state types, the behavior when `as` and `render` are supplied together, the skip-method name, and cross-overlay layer coordination to component rollout or a later decision. Preserve each as `UNRESOLVED`; do not turn it into `N/A`, invent a default, or score a missing required parts/render surface as a pass. These unresolved items prevent a conclusive grade when they apply.

The gist also leaves the coexistence/migration shape for new object callbacks with existing callback signatures to each component. Keep current signatures and record the proposed additive callback name or a major-version decision as pending; do not silently replace a released callback.

The exact repository package version recorded at the audited main snapshot is `38.46.0`. Keep repository package metadata separate from published-package evidence. Verify the compatibility package's actual exports at the audited SHA. An unknown registry result does not prove that a version or API is unpublished; `MIG-01` is N/A when all proposed fixes are additive and no recommendation changes a released API.
