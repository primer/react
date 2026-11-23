# Tooltip V2 component API scorecard

**Rubric:** Component API compliance rubric 0.6.0 · **Component:** Tooltip V2

## Report card

**Active grade:** 42.68–43.17 / 100 · F · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Active findings:** 5 · **Candidate checks:** 1 (1 gap) · **Applicable active weight:** 82/92 · **Evidence coverage:** 81/82

| Area                                                                    |      Active score      | Active gaps | Finding links                | Issue links |
| :---------------------------------------------------------------------- | :--------------------: | :---------: | :--------------------------- | :---------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         |   ████░░░░░░ 1.84/5    |      1      | [T-F1](#t-f1)                |             |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) |   ███░░░░░░░ 1.67/5    |      0      | No open gaps                 |             |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               |   ██████░░░░ 2.80/5    |      2      | [T-F3](#t-f3), [T-F6](#t-f6) |             |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   |   ░░░░░░░░░░ 0.00/5    |      1      | [T-F4](#t-f4)                |             |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) | ████████░░ 3.85–4.00/5 |      1      | [T-F5](#t-f5)                |             |

The active score uses the 92-point rubric and is normalized to 100. Scores from earlier rubric versions are not comparable. Candidate checks remain visible with proposed weights outside the grade.

## Area 1 Architecture and parts

**Active score:** ████░░░░░░ 1.84/5 · **Open findings:** 1 · **Applicable active weight:** 19/20.

### T-F1

**Title:** Add a consumer-composable Tooltip parts surface

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-01`, section 1.

**Reachable consumer:** A consumer composes Tooltip with an interactive trigger such as ActionMenu.Button; ActionMenu has an explicit Tooltip-wrapped anchor path.

**Observed gap:** Tooltip requires one child, clones it to inject behavior, and documents no subcomponents. It has no parts surface for consumer-controlled trigger and tooltip regions.

**Additive fix:** Add an opt-in parts entry point with trigger and tooltip-surface ownership while retaining the existing <Tooltip text> child API. Keep exact part names and default elements pending maintainer review.

**Pinned citations:**

- `packages/react/src/TooltipV2/Tooltip.tsx:135-140 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/TooltipV2/Tooltip.tsx:327-352 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/TooltipV2/Tooltip.docs.json:71 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:126-140 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 2 Root and part substitution

**Active score:** ███░░░░░░░ 1.67/5 · **Open findings:** 0 · **Applicable active weight:** 12/12.

No open gaps.

## Area 3 Prop merge behavior

**Active score:** ██████░░░░ 2.80/5 · **Open findings:** 2 · **Applicable active weight:** 25/25.

`MERGE-CONFIG 5/5` + `MERGE-HANDLER 0/8` + `MERGE-CLASS 0/3` + `MERGE-STYLE-ATTR 4/4` + `MERGE-REF 3/3` + `MERGE-BEHAVIOR 2/2` = 14/25 = 2.80/5.

### T-F3

**Title:** Preserve configured Tooltip handler order

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-HANDLER`, section 3.

**Reachable consumer:** A consumer supplies onTouchEnd and className while Tooltip adds touch dismissal and its own surface class.

**Observed gap:** The current wrapper runs consumer onTouchEnd before Primer dismissal and can skip the consumer onFocus handler when the target is not focus-visible.

**Additive fix:** Keep existing Tooltip props and callbacks; align the configured handler sequence through a compatible migration, and use the exact three-stage order for new parts.

**Pinned citations:**

- `contributor-docs/adrs/adr-025-prop-merging.md:24-50 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/TooltipV2/Tooltip.tsx:355-361 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/TooltipV2/Tooltip.tsx:392-394 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

### T-F6

**Title:** Order configured Tooltip classes component-first

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-CLASS`, section 3.

**Reachable consumer:** A consumer composes Tooltip with an interactive trigger such as ActionMenu.Button; ActionMenu has an explicit Tooltip-wrapped anchor path.

**Observed gap:** The configured tooltip element combines className before the component class, contrary to ADR-025.

**Additive fix:** Keep the existing configured class behavior during migration; make new parts consumer-first and preserve the existing public API.

**Pinned citations:**

- `packages/react/src/TooltipV2/Tooltip.tsx:392-394 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 4 State and shared concepts

**Active score:** ░░░░░░░░░░ 0.00/5 · **Open findings:** 1 · **Applicable active weight:** 13/15.

### T-F4

**Title:** Expose Tooltip open-state transitions

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `STATE-CALLBACK`, section 4.

**Reachable consumer:** A consumer needs to coordinate tooltip visibility with an adjacent interactive control or observe the transition.

**Observed gap:** Tooltip owns open state but exposes no transition callback.

**Additive fix:** Add an object-shaped onOpenChange callback with value, reason, event when present, and synchronous cancel; keep Tooltip's existing props and uncontrolled behavior.

**Pinned citations:**

- `packages/react/src/TooltipV2/Tooltip.tsx:20-48 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/TooltipV2/Tooltip.tsx:153-161 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 5 Accessibility and evidence

**Active score:** ████████░░ 3.85–4.00/5 · **Open findings:** 1 · **Applicable active weight:** 13/20.

### T-F5

**Title:** Place Tooltip V2 styles in the component cascade layer

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer applies utility-layer styles to Tooltip V2; unlayered component rules do not participate in the declared Primer layer order.

**Observed gap:** The authored CSS Module contains no cascade-layer declaration, although ADR-021 and ADR-022 require component styles to use the named primer.components layer.

**Additive fix:** Place the component style rules in @layer primer.components.Tooltip; retain any globally scoped registrations and all existing selectors and declarations.

**Pinned citations:**

- `contributor-docs/adrs/adr-021-css-layers.md:66-107 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `contributor-docs/adrs/adr-022-css-layer-names.md:28-65 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/TooltipV2/Tooltip.module.css:1-132 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Candidate checks

Candidate checks are visible assessments outside the active 92-point rubric. Their proposed weights do not affect the active score, denominator, section caps, evidence coverage, or status.

| Candidate     | Verdict | Proposed weight | Finding                 |
| :------------ | :------ | :-------------: | :---------------------- |
| `PART-RENDER` | GAP     | 8 (unweighted)  | [T-F7](#candidate-t-f7) |

### Candidate T-F7

**Title:** Add render forms to Tooltip parts

**Candidate status:** GAP (unweighted; proposed weight 8) · **Classification / severity / check:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer composes Tooltip with an interactive trigger such as ActionMenu.Button; ActionMenu has an explicit Tooltip-wrapped anchor path.

**Observed gap:** Tooltip exposes no element or function renderer for consumer-composable parts. Tooltip.tsx:135-140,327-352; Tooltip.docs.json:71.

**Proposed path:** Add element and function render forms to the new parts while retaining the existing child-based Tooltip API and callback behavior.

**Pinned citations:**

- `packages/react/src/TooltipV2/Tooltip.tsx:135-140 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/TooltipV2/Tooltip.tsx:327-352 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/TooltipV2/Tooltip.docs.json:71 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:126-140 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Current-contract defects

No current-contract defects established.

## Audit details

<details>
<summary>Active per-check evidence matrix</summary>
| Check | Verdict | Evidence class | Evidence at audited SHA / command result | Finding ID or reason |
| :---- | :------ | :------------- | :--------------------------------------- | :------------------- |
| `MOD-01` | PASS | AGENT JUDGMENT | Config overlay; no unnecessary abstraction layer. contributor-docs/style.md:161-183 | — |
| `CHILD-01` | PASS | SOURCE VERIFIED | Consumer supplies one interactive trigger child. Tooltip.tsx:20-48,135 | — |
| `PART-01` | GAP | SOURCE VERIFIED | Requires one child and clones it; docs subcomponents are empty. Tooltip.tsx:135-140,327-352; Tooltip.docs.json:71 | `T-F1` |
| `PART-DOCS` | COVERED | SOURCE VERIFIED | No named parts surface to document; owned by T-F1. | `T-F1` |
| `STRUCTURE-01` | PASS | SOURCE VERIFIED | The PascalCase TooltipV2 directory is the incremented replacement for Tooltip; its index exports one Tooltip root and no subcomponents. TooltipV2/index.ts:1; TooltipV2/Tooltip.tsx:20-48. | — |
| `CUSTOM-ELEMENT-01` | N/A | SOURCE VERIFIED | Tooltip V2 is implemented as a React component and does not render or wrap a custom element. | ADR-009 applies only when a custom element is involved; none is part of this component surface. |
| `API-01` | PASS | SOURCE VERIFIED | The applicable ADR-003 root ref/as/DOM prop conventions remain intact. ADR-022-styled-react moves legacy sx compatibility out of @primer/react; the audited @primer/styled-react index exports styling/theming helpers, not this component. TooltipV2/index.ts:1; TooltipV2/Tooltip.tsx:20-48; packages/styled-react/src/index.tsx:1-95. | — |
| `PART-AS` | COVERED | SOURCE VERIFIED | The cloned trigger has no public as contract; owned by missing parts surface T-F1. | `T-F1` |
| `MERGE-CONFIG` | PASS | SOURCE VERIFIED | The existing child-clone wrapper is a configured merge surface; its current property behavior is evaluated by the specific checks below. Tooltip.tsx:327-352. | — |
| `MERGE-HANDLER` | GAP | SOURCE VERIFIED | onTouchEnd invokes the consumer before Primer dismissal; onFocus can return before invoking the consumer when the target is not focus-visible. Tooltip.tsx:355-361. | `T-F3` |
| `MERGE-CLASS` | GAP | SOURCE VERIFIED | Configured Tooltip className is combined consumer-first. Tooltip.tsx:392-394. | `T-F6` |
| `MERGE-STYLE-ATTR` | PASS | SOURCE VERIFIED | Ordinary consumer props reach the tooltip element; Tooltip-owned role and aria-hidden are applied after the spread. Tooltip.tsx:392-405. | — |
| `MERGE-REF` | PASS | SOURCE VERIFIED | Trigger, forwarded, and child refs are merged onto the trigger. Tooltip.tsx:142-145. | — |
| `MERGE-BEHAVIOR` | PASS | SOURCE VERIFIED | Tooltip-owned role and aria-hidden values are applied after consumer props. Tooltip.tsx:392-405. | — |
| `STATE-CALLBACK` | GAP | SOURCE VERIFIED | Tooltip owns isPopoverOpen state and exposes no transition callback. Tooltip.tsx:153-161; TooltipProps:20-48 | `T-F4` |
| `NAMES-DEFAULTS` | COVERED | AGENT JUDGMENT | The additive transition callback should share the onOpenChange concept; owned by T-F4. | `T-F4` |
| `STATE-OWNER` | N/A | SOURCE VERIFIED | No public controlled/uncontrolled state prop; the component owns internal open state. Tooltip.tsx:153-161 | The check applies only to public controlled or uncontrolled state axes. |
| `ACCESS-01` | PASS | BEHAVIOR VERIFIED | Focused Tooltip suite passed; trigger ref, aria-describedby/labelledby, and escape handling are present. Tooltip.tsx:142-145,309-320,330-350 | — |
| `LIVE-01` | N/A | SOURCE VERIFIED | The tooltip is connected through aria-describedby/aria-labelledby and does not announce changing status. Tooltip.tsx:334-350 | No changing status or alert announcement is owned by Tooltip. |
| `WARN-01` | PASS | BEHAVIOR VERIFIED | Fragment and invalid-ref warnings use the development-only warning helper; focused Tooltip suite passed. Tooltip.tsx:135-140; utils/warning.ts:3-23 | — |
| `SELECTOR-01` | PASS | SOURCE VERIFIED | Tooltip root has stable data-component identity. Tooltip.tsx:392-397 | — |
| `STYLE-01` | GAP | SOURCE VERIFIED | packages/react/src/TooltipV2/Tooltip.module.css has no @layer declaration across lines 1-132; ADR-021 requires component style rules in @layer primer.components.Tooltip. packages/react/src/TooltipV2/Tooltip.tsx:9. | `T-F5` |
| `RESP-01` | N/A | SOURCE VERIFIED | Direction selects fixed placement values; no responsive value API. Tooltip.tsx:19-20,65-87 | The component does not own responsive values or viewport-dependent behavior. |
| `TYPE-01` | PASS | EXECUTION VERIFIED | npm run build --workspace @primer/doc-gen and npm run type-check --workspace @primer/react passed; public component types are included in the audited export surface. | — |
| `EXPORT-01` | N/A | SOURCE VERIFIED | The audited @primer/styled-react index exports BaseStyles, theming, and sx helpers, but does not re-export Tooltip V2; no component-specific compatibility export applies. TooltipV2/index.ts:1; TooltipV2/Tooltip.tsx:20-48; packages/styled-react/src/index.tsx:1-95. | No internal module is exposed and this component is not re-exported by @primer/styled-react at the audited SHA. |
| `TEST-01` | PASS | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/TooltipV2/\_\_tests\_\_/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/\_\_tests\_\_/Button.test.tsx — 5 files, 390 tests passed. | — |
| `SNAPSHOT-01` | PASS | SOURCE VERIFIED | The focused Tooltip V2 unit tests contain no component render-tree toMatchSnapshot calls; the policy check is separate from the recorded test execution. | — |
| `INTERACTION-01` | NOT MEASURED | SOURCE VERIFIED | The existing e2e test visits Storybook and tabs to the tooltip trigger, but the selected test cannot complete because the expected Darwin screenshot baseline is absent. See e2e/components/TooltipV2.test.ts. | The Playwright run reached the screenshot assertion but could not complete because the repository has no Darwin-specific baseline snapshots; the execution result is not counted as a pass. |
| `MIG-01` | N/A | SOURCE VERIFIED | The recommendations add new parts, callback props, or styling declarations without changing an existing released API. Repository package version 38.46.0 is recorded separately; publication status is not used to score an additive design. | No recommendation changes a released prop, callback signature, or API, so release-dependent compatibility comparison does not apply. |
</details>
<details>
<summary>Unweighted candidate inventory</summary>
| Candidate | Verdict | Proposed weight | Evidence class | Evidence / reason | Candidate finding |
| :-------- | :------ | :-------------: | :------------- | :---------------- | :---------------- |
| `PART-RENDER` | GAP | 8 (unweighted) | SOURCE VERIFIED | Tooltip exposes no element or function renderer for consumer-composable parts. Tooltip.tsx:135-140,327-352; Tooltip.docs.json:71. | `T-F7` |
</details>
<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | Tooltip V2 / config, interactive leaf trigger, overlay                                                                                                         |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not assessed; all proposed fixes add new surfaces and none changes a released API.                                                                             |
| Mode                       | Whole component                                                                                                                                                |
| Audited source SHA         | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.6.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 42.68–43.17 / 100 · F (0 open BLOCKs)                                                                                                                          |
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
