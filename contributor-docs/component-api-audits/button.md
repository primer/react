# Button component API scorecard

**Rubric:** Component API compliance rubric 0.6.0 · **Component:** Button

## Report card

**Active grade:** 96.27 / 100 · A · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Active findings:** 1 · **Candidate checks:** 1 (1 gap) · **Applicable active weight:** 75/92 · **Evidence coverage:** 75/75

| Area                                                                    |        Active score         | Active gaps | Finding links | Issue links |
| :---------------------------------------------------------------------- | :-------------------------: | :---------: | :------------ | :---------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         |      ██████████ 5.00/5      |      0      | No open gaps  |             |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) |      ██████████ 5.00/5      |      0      | No open gaps  |             |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               |      ██████████ 5.00/5      |      0      | No open gaps  |             |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   | ██████████ 5.00/5 · LIMITED |      0      | No open gaps  |             |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) |      ████████░░ 4.00/5      |      1      | [B-F5](#b-f5) |             |

The active score uses the 92-point rubric and is normalized to 100. Scores from earlier rubric versions are not comparable. Candidate checks remain visible with proposed weights outside the grade.

## Area 1 Architecture and parts

**Active score:** ██████████ 5.00/5 · **Open findings:** 0 · **Applicable active weight:** 19/20.

No open gaps.

## Area 2 Root and part substitution

**Active score:** ██████████ 5.00/5 · **Open findings:** 0 · **Applicable active weight:** 12/12.

No open gaps.

## Area 3 Prop merge behavior

**Active score:** ██████████ 5.00/5 · **Open findings:** 0 · **Applicable active weight:** 25/25.

`MERGE-CONFIG 5/5` + `MERGE-HANDLER 8/8` + `MERGE-CLASS 3/3` + `MERGE-STYLE-ATTR 4/4` + `MERGE-REF 3/3` + `MERGE-BEHAVIOR 2/2` = 25/25 = 5.00/5.

No open gaps.

## Area 4 State and shared concepts

**Active score:** ██████████ 5.00/5 · **Open findings:** 0 · **Applicable active weight:** 5/15 · LIMITED.

No open gaps.

## Area 5 Accessibility and evidence

**Active score:** ████████░░ 4.00/5 · **Open findings:** 1 · **Applicable active weight:** 14/20.

### B-F5

**Title:** Place Button styles in the component cascade layer

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer applies utility-layer styles to Button; unlayered component rules do not participate in the declared Primer layer order.

**Observed gap:** The authored CSS Module contains no cascade-layer declaration, although ADR-021 and ADR-022 require component styles to use the named primer.components layer.

**Additive fix:** Place the component style rules in @layer primer.components.Button; retain any globally scoped registrations and all existing selectors and declarations.

**Pinned citations:**

- `contributor-docs/adrs/adr-021-css-layers.md:66-107 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `contributor-docs/adrs/adr-022-css-layer-names.md:28-65 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Button/ButtonBase.module.css:1-733 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Candidate checks

Candidate checks are visible assessments outside the active 92-point rubric. Their proposed weights do not affect the active score, denominator, section caps, evidence coverage, or status.

| Candidate     | Verdict | Proposed weight | Finding                 |
| :------------ | :------ | :-------------: | :---------------------- |
| `PART-RENDER` | GAP     | 8 (unweighted)  | [B-F1](#candidate-b-f1) |

### Candidate B-F1

**Title:** Add render forms to the Button leaf

**Candidate status:** GAP (unweighted; proposed weight 8) · **Classification / severity / check:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer needs to supply a custom button-like element or component while retaining Button's loading, accessibility, and focus behavior.

**Observed gap:** ButtonProps has no element or function render prop. Button/types.ts:20-96.

**Proposed path:** Add element and function render forms to the root part while preserving as, ref, existing props, and callback behavior.

**Pinned citations:**

- `packages/react/src/Button/Button.tsx:6-16 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Button/types.ts:20-96 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Button/ButtonBase.tsx:44-66 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Current-contract defects

No current-contract defects established.

## Audit details

<details>
<summary>Active per-check evidence matrix</summary>
| Check | Verdict | Evidence class | Evidence at audited SHA / command result | Finding ID or reason |
| :---- | :------ | :------------- | :--------------------------------------- | :------------------- |
| `MOD-01` | PASS | AGENT JUDGMENT | A single leaf control is an appropriate config/presentational surface; no extra spectrum layer required. contributor-docs/style.md:161-183 | — |
| `CHILD-01` | PASS | SOURCE VERIFIED | Button content is consumer-owned and uses children. Button/types.ts:86 | — |
| `PART-01` | PASS | SOURCE VERIFIED | The public Button root is a single interactive leaf and can serve as its one-part surface under the rubric's explicit leaf rule. Button.tsx:6-16 | — |
| `PART-DOCS` | PASS | SOURCE VERIFIED | Button root props, defaults, and as path are documented. Button.docs.json:94-103,146 | — |
| `STRUCTURE-01` | PASS | SOURCE VERIFIED | The PascalCase Button directory contains separate Button, IconButton, LinkButton, and ButtonBase controls; no compound subcomponents are exported without parent ownership. Button/index.ts:5-7. | — |
| `CUSTOM-ELEMENT-01` | N/A | SOURCE VERIFIED | Button is implemented as a React component and does not render or wrap a custom element. | ADR-009 applies only when a custom element is involved; none is part of this component surface. |
| `API-01` | PASS | SOURCE VERIFIED | The applicable ADR-003 root ref/as/DOM prop conventions remain intact. ADR-022-styled-react moves legacy sx compatibility out of @primer/react; the audited @primer/styled-react index exports styling/theming helpers, not this component. Button/index.ts:5-7; packages/styled-react/src/index.tsx:1-95. | — |
| `PART-AS` | PASS | SOURCE VERIFIED | Button is a polymorphic forwardRef component and ButtonBase consumes as. Button.tsx:6-12; ButtonBase.tsx:44-45 | — |
| `MERGE-CONFIG` | PASS | SOURCE VERIFIED | Button has a configured root; property-specific collisions are checked below. ButtonBase.tsx:68-70,108-115. | — |
| `MERGE-HANDLER` | PASS | SOURCE VERIFIED | Consumer onClick passes through when enabled; Button owns the loading guard. ButtonBase.tsx:68-70,108-115. | — |
| `MERGE-CLASS` | PASS | SOURCE VERIFIED | Component class precedes consumer class. ButtonBase.tsx:68-70,108-115. | — |
| `MERGE-STYLE-ATTR` | PASS | SOURCE VERIFIED | Consumer DOM props are spread before Button-owned attributes. ButtonBase.tsx:108-115. | — |
| `MERGE-REF` | PASS | SOURCE VERIFIED | The forwarded and internal refs are merged to the rendered Button element. ButtonBase.tsx:68-70. | — |
| `MERGE-BEHAVIOR` | PASS | SOURCE VERIFIED | Loading, disabled, data-state, and click behavior are written by Button after the consumer spread. ButtonBase.tsx:108-135. | — |
| `STATE-CALLBACK` | N/A | SOURCE VERIFIED | loading and disabled are consumer-supplied props; Button does not own their state transitions. Button/types.ts:33-45 | No consumer-observable state transition is owned by Button. |
| `NAMES-DEFAULTS` | PASS | SOURCE VERIFIED | Button and ActionMenu.Button share small/medium/large and medium default. Button/types.ts:7-8; ButtonBase.tsx:54-56 | — |
| `STATE-OWNER` | N/A | SOURCE VERIFIED | Button does not expose a controlled/uncontrolled state axis; loading/disabled are ordinary props. | The check applies only to component-owned controlled or uncontrolled state. |
| `ACCESS-01` | PASS | BEHAVIOR VERIFIED | Focused Button suite passed; semantic button/anchor target and loading accessibility behavior are covered. ButtonBase.tsx:78-97,108-135 | — |
| `LIVE-01` | PASS | BEHAVIOR VERIFIED | Loading status uses AriaStatus and the focused Button suite verifies its content. ButtonBase.tsx:200-203 | — |
| `WARN-01` | PASS | SOURCE VERIFIED | Component warnings are guarded by \_\_DEV\_\_. ButtonBase.tsx:78-97 | — |
| `SELECTOR-01` | PASS | SOURCE VERIFIED | Button has a stable data-component selector and feature tests. ButtonBase.tsx:108-120 | — |
| `STYLE-01` | GAP | SOURCE VERIFIED | packages/react/src/Button/ButtonBase.module.css has no @layer declaration across lines 1-733; ADR-021 requires component style rules in @layer primer.components.Button. packages/react/src/Button/ButtonBase.tsx:12. | `B-F5` |
| `RESP-01` | N/A | SOURCE VERIFIED | Button size/block variants are not responsive-value APIs. | Button does not own responsive values or viewport-dependent behavior. |
| `TYPE-01` | PASS | EXECUTION VERIFIED | npm run build --workspace @primer/doc-gen and npm run type-check --workspace @primer/react passed; public component types are included in the audited export surface. | — |
| `EXPORT-01` | N/A | SOURCE VERIFIED | The audited @primer/styled-react index exports BaseStyles, theming, and sx helpers, but does not re-export Button; no component-specific compatibility export applies. Button/index.ts:5-7; packages/styled-react/src/index.tsx:1-95. | No internal module is exposed and this component is not re-exported by @primer/styled-react at the audited SHA. |
| `TEST-01` | PASS | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/TooltipV2/\_\_tests\_\_/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/\_\_tests\_\_/Button.test.tsx — 5 files, 390 tests passed. | — |
| `SNAPSHOT-01` | PASS | SOURCE VERIFIED | Button snapshots are in individual block, size, variant, and alignContent tests and snapshot one button element; no catch-all render-tree snapshot is used. Button/\_\_tests\_\_/Button.test.tsx:97,155-199,218. | — |
| `INTERACTION-01` | PASS | EXECUTION VERIFIED | The focused Storybook Playwright link-underline interaction test passed. See e2e/components/Button.test.ts. | — |
| `MIG-01` | N/A | SOURCE VERIFIED | The recommendations add new parts, callback props, or styling declarations without changing an existing released API. Repository package version 38.46.0 is recorded separately; publication status is not used to score an additive design. | No recommendation changes a released prop, callback signature, or API, so release-dependent compatibility comparison does not apply. |
</details>
<details>
<summary>Unweighted candidate inventory</summary>
| Candidate | Verdict | Proposed weight | Evidence class | Evidence / reason | Candidate finding |
| :-------- | :------ | :-------------: | :------------- | :---------------- | :---------------- |
| `PART-RENDER` | GAP | 8 (unweighted) | SOURCE VERIFIED | ButtonProps has no element or function render prop. Button/types.ts:20-96. | `B-F1` |
</details>
<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | Button / interactive leaf control                                                                                                                              |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not assessed; all proposed fixes add new surfaces and none changes a released API.                                                                             |
| Mode                       | Whole component                                                                                                                                                |
| Audited source SHA         | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.6.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 96.27 / 100 · A (0 open BLOCKs)                                                                                                                                |
| Candidate checks           | 1 listed; 1 gap(s); proposed weights excluded from the active 92-point rubric                                                                                  |
| Human review               | PENDING HUMAN                                                                                                                                                  |
| Surface                    | Whole component at audited source SHA                                                                                                                          |

### Layer 3 human review

| Judgment                                                             | Result        |
| :------------------------------------------------------------------- | :------------ |
| Meaningful part boundaries                                           | PENDING HUMAN |
| Default elements and semantics                                       | PENDING HUMAN |
| Context, semantic order, collection ownership, and accessible naming | PENDING HUMAN |
| Shared names and defaults                                            | PENDING HUMAN |
| Unresolved maintainer decisions                                      | PENDING HUMAN |
| Release-dependent migration decisions                                | PENDING HUMAN |

</details>
