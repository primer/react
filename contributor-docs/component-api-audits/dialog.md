# Dialog component API scorecard

**Rubric:** Component API compliance rubric 0.6.0 · **Component:** Dialog

## Report card

**Active grade:** 46.76–47.30 / 100 · F · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Active findings:** 4 · **Candidate checks:** 1 (1 gap) · **Applicable active weight:** 74/92 · **Evidence coverage:** 73/74

| Area                                                                    |      Active score      | Active gaps | Finding links | Issue links |
| :---------------------------------------------------------------------- | :--------------------: | :---------: | :------------ | :---------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         |   ████░░░░░░ 1.84/5    |      1      | [D-F1](#d-f1) |             |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) |   ███░░░░░░░ 1.67/5    |      0      | No open gaps  |             |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               |   ████████░░ 4.00/5    |      1      | [D-F3](#d-f3) |             |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   |   ░░░░░░░░░░ 0.00/5    |      1      | [D-F4](#d-f4) |             |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) | ████████░░ 3.85–4.00/5 |      1      | [D-F5](#d-f5) |             |

The active score uses the 92-point rubric and is normalized to 100. Scores from earlier rubric versions are not comparable. Candidate checks remain visible with proposed weights outside the grade.

## Area 1 Architecture and parts

**Active score:** ████░░░░░░ 1.84/5 · **Open findings:** 1 · **Applicable active weight:** 19/20.

### D-F1

**Title:** Add a consumer-composable Dialog parts surface

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-01`, section 1.

**Reachable consumer:** A consumer needs to arrange dialog title, body, footer, trigger, and close behavior without supplying a custom renderer.

**Observed gap:** Dialog.Header, Title, Body, Footer, and related subcomponents are documented as custom-renderer-only and are not intended for direct use.

**Additive fix:** Add an opt-in parts entry point for the modal pattern while preserving Dialog's current config props, renderers, slots, and caller-controlled mount behavior. Keep exact part names/default elements pending review.

**Pinned citations:**

- `packages/react/src/Dialog/Dialog.tsx:316-320 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Dialog/Dialog.tsx:560-575 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Dialog/Dialog.docs.json:58-70 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 2 Root and part substitution

**Active score:** ███░░░░░░░ 1.67/5 · **Open findings:** 0 · **Applicable active weight:** 12/12.

No open gaps.

## Area 3 Prop merge behavior

**Active score:** ████████░░ 4.00/5 · **Open findings:** 1 · **Applicable active weight:** 17/25.

`MERGE-CONFIG 5/5` + `MERGE-HANDLER 0/8` + `MERGE-CLASS 0/3` + `MERGE-STYLE-ATTR 4/4` + `MERGE-REF 3/3` + `MERGE-BEHAVIOR 2/2` = 14/17 = 4.00/5.

### D-F3

**Title:** Order configured Dialog classes component-first

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-CLASS`, section 3.

**Reachable consumer:** A consumer supplies className to style the documented Dialog root.

**Observed gap:** The configured Dialog combines consumer className before the component class, contrary to ADR-025.

**Additive fix:** Keep the existing configured class behavior during migration; use component-first ordering for configured merges and preserve current public props.

**Pinned citations:**

- `contributor-docs/adrs/adr-025-prop-merging.md:24-50 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Dialog/Dialog.tsx:414-431 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 4 State and shared concepts

**Active score:** ░░░░░░░░░░ 0.00/5 · **Open findings:** 1 · **Applicable active weight:** 13/15.

### D-F4

**Title:** Expose Dialog state transitions on the new root

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `STATE-CALLBACK`, section 4.

**Reachable consumer:** A consumer needs to observe or veto a close request while using the composable Dialog surface.

**Observed gap:** Dialog reports close gestures through onClose but provides no state-transition callback with the proposed value and cancellation contract.

**Additive fix:** Add an object-shaped open-state callback to the new parts root with value, reason, event when present, and synchronous cancel; preserve onClose(gesture) and caller-controlled mounting on the existing config API.

**Pinned citations:**

- `packages/react/src/Dialog/Dialog.tsx:108-113 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Dialog/Dialog.tsx:334-340 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 5 Accessibility and evidence

**Active score:** ████████░░ 3.85–4.00/5 · **Open findings:** 1 · **Applicable active weight:** 13/20.

### D-F5

**Title:** Place Dialog styles in the component cascade layer

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer applies utility-layer styles to Dialog; unlayered component rules do not participate in the declared Primer layer order.

**Observed gap:** The authored CSS Module contains no cascade-layer declaration, although ADR-021 and ADR-022 require component styles to use the named primer.components layer.

**Additive fix:** Place the component style rules in @layer primer.components.Dialog; retain any globally scoped registrations and all existing selectors and declarations.

**Pinned citations:**

- `contributor-docs/adrs/adr-021-css-layers.md:66-107 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `contributor-docs/adrs/adr-022-css-layer-names.md:28-65 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Dialog/Dialog.module.css:1-380 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Candidate checks

Candidate checks are visible assessments outside the active 92-point rubric. Their proposed weights do not affect the active score, denominator, section caps, evidence coverage, or status.

| Candidate     | Verdict | Proposed weight | Finding                 |
| :------------ | :------ | :-------------: | :---------------------- |
| `PART-RENDER` | GAP     | 8 (unweighted)  | [D-F6](#candidate-d-f6) |

### Candidate D-F6

**Title:** Add render forms to Dialog parts

**Candidate status:** GAP (unweighted; proposed weight 8) · **Classification / severity / check:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer needs to arrange dialog title, body, footer, trigger, and close behavior without supplying a custom renderer.

**Observed gap:** Dialog does not expose a consumer-composable element/function renderer for its parts. Dialog.tsx:560-575.

**Proposed path:** Add element and function render forms to new parts while retaining the existing Dialog API, render callbacks, and callback signatures.

**Pinned citations:**

- `packages/react/src/Dialog/Dialog.tsx:316-320 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Dialog/Dialog.tsx:560-575 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/Dialog/Dialog.docs.json:58-70 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Current-contract defects

No current-contract defects established.

## Audit details

<details>
<summary>Active per-check evidence matrix</summary>
| Check | Verdict | Evidence class | Evidence at audited SHA / command result | Finding ID or reason |
| :---- | :------ | :------------- | :--------------------------------------- | :------------------- |
| `MOD-01` | PASS | AGENT JUDGMENT | Config modal pattern has a concrete use case; no artificial spectrum layer required. contributor-docs/style.md:161-183 | — |
| `CHILD-01` | PASS | SOURCE VERIFIED | Free-form body content uses children; title, role, and layout use props. Dialog.tsx:61-73 | — |
| `PART-01` | GAP | SOURCE VERIFIED | Dialog subcomponents are explicitly limited to custom renderers and are not intended for direct composition. Dialog.tsx:560-575 | `D-F1` |
| `PART-DOCS` | COVERED | SOURCE VERIFIED | Existing custom-renderer slots are not a supported parts surface; owned by D-F1. | `D-F1` |
| `STRUCTURE-01` | PASS | SOURCE VERIFIED | The PascalCase Dialog directory exposes Header, Title, Subtitle, Body, Footer, Buttons, and CloseButton on the exported parent with Object.assign at Dialog.tsx:568-575. Dialog/Dialog.tsx:568-575. | — |
| `CUSTOM-ELEMENT-01` | N/A | SOURCE VERIFIED | Dialog is implemented as a React component and does not render or wrap a custom element. | ADR-009 applies only when a custom element is involved; none is part of this component surface. |
| `API-01` | PASS | SOURCE VERIFIED | The applicable ADR-003 root ref/as/DOM prop conventions remain intact. ADR-022-styled-react moves legacy sx compatibility out of @primer/react; the audited @primer/styled-react index exports styling/theming helpers, not this component. Dialog/Dialog.tsx:568-575; packages/styled-react/src/index.tsx:1-95. | — |
| `PART-AS` | COVERED | SOURCE VERIFIED | Renderer-only subcomponents do not provide the required consumer parts substitution path; owned by D-F1. | `D-F1` |
| `MERGE-CONFIG` | PASS | SOURCE VERIFIED | Dialog uses a configured/internal merge boundary; the current class collision is scored under MERGE-CLASS. Dialog.tsx:322-324,426. | — |
| `MERGE-HANDLER` | N/A | SOURCE VERIFIED | Dialog does not expose a consumer DOM event handler that is composed with a component-owned DOM handler; onClose is a state callback. | Dialog has no consumer DOM event handler that is composed with a component-owned DOM handler; its onClose callback is a state transition. |
| `MERGE-CLASS` | GAP | SOURCE VERIFIED | The configured Dialog combines consumer className before its component class. Dialog.tsx:426. | `D-F3` |
| `MERGE-STYLE-ATTR` | PASS | SOURCE VERIFIED | Consumer style is retained and Dialog writes its owned width variable after it. Dialog.tsx:426. | — |
| `MERGE-REF` | PASS | SOURCE VERIFIED | The forwarded Dialog ref is merged with the internal dialog ref. Dialog.tsx:322-324. | — |
| `MERGE-BEHAVIOR` | PASS | SOURCE VERIFIED | Dialog role and modal relationships are written by Dialog after consumer props. Dialog.tsx:426. | — |
| `STATE-CALLBACK` | GAP | SOURCE VERIFIED | Dialog exposes onClose(gesture) but no state transition callback; visibility is controlled by caller mounting. Dialog.tsx:108-113,334-340 | `D-F4` |
| `NAMES-DEFAULTS` | COVERED | AGENT JUDGMENT | The new transition callback should align with the reviewed onOpenChange concept; owned by D-F4. | `D-F4` |
| `STATE-OWNER` | N/A | SOURCE VERIFIED | Dialog has no public open/defaultOpen axis; caller mounting controls visibility. Dialog.tsx:61-73,108-113 | The component does not expose controlled or uncontrolled visibility state. |
| `ACCESS-01` | PASS | BEHAVIOR VERIFIED | Focused Dialog suite passed; role, title/description relationships, focus trap, and escape close behavior are wired. Dialog.tsx:322-340,414-431 | — |
| `LIVE-01` | N/A | SOURCE VERIFIED | Dialog does not own changing status or alert announcements. | No changing status or alert announcement is owned by Dialog. |
| `WARN-01` | N/A | SOURCE VERIFIED | Dialog renderer JSDoc cautions are not runtime development warnings; no component-owned warning call exists. | The source contains documentation warnings only, not a component-emitted development warning. |
| `SELECTOR-01` | PASS | SOURCE VERIFIED | Dialog root and named internal regions use stable data-component selectors. Dialog.tsx:431,449,457,477,485 | — |
| `STYLE-01` | GAP | SOURCE VERIFIED | packages/react/src/Dialog/Dialog.module.css has no @layer declaration across lines 1-380; ADR-021 requires component style rules in @layer primer.components.Dialog. packages/react/src/Dialog/Dialog.tsx:15. | `D-F5` |
| `RESP-01` | PASS | SOURCE VERIFIED | Dialog position accepts ResponsiveValue. Dialog.tsx:142-144 | — |
| `TYPE-01` | PASS | EXECUTION VERIFIED | npm run build --workspace @primer/doc-gen and npm run type-check --workspace @primer/react passed; public component types are included in the audited export surface. | — |
| `EXPORT-01` | N/A | SOURCE VERIFIED | The audited @primer/styled-react index exports BaseStyles, theming, and sx helpers, but does not re-export Dialog; no component-specific compatibility export applies. Dialog/Dialog.tsx:568-575; packages/styled-react/src/index.tsx:1-95. | No internal module is exposed and this component is not re-exported by @primer/styled-react at the audited SHA. |
| `TEST-01` | PASS | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/TooltipV2/\_\_tests\_\_/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/\_\_tests\_\_/Button.test.tsx — 5 files, 390 tests passed. | — |
| `SNAPSHOT-01` | PASS | SOURCE VERIFIED | The focused Dialog unit tests contain no component render-tree toMatchSnapshot calls; the policy check is separate from the recorded test execution. | — |
| `INTERACTION-01` | NOT MEASURED | SOURCE VERIFIED | The existing e2e test visits Storybook and opens the dialog, but the selected test cannot complete because the expected Darwin screenshot baseline is absent. See e2e/components/Dialog.test.ts. | The Playwright run reached the screenshot assertion but could not complete because the repository has no Darwin-specific baseline snapshots; the execution result is not counted as a pass. |
| `MIG-01` | N/A | SOURCE VERIFIED | The recommendations add new parts, callback props, or styling declarations without changing an existing released API. Repository package version 38.46.0 is recorded separately; publication status is not used to score an additive design. | No recommendation changes a released prop, callback signature, or API, so release-dependent compatibility comparison does not apply. |
</details>
<details>
<summary>Unweighted candidate inventory</summary>
| Candidate | Verdict | Proposed weight | Evidence class | Evidence / reason | Candidate finding |
| :-------- | :------ | :-------------: | :------------- | :---------------- | :---------------- |
| `PART-RENDER` | GAP | 8 (unweighted) | SOURCE VERIFIED | Dialog does not expose a consumer-composable element/function renderer for its parts. Dialog.tsx:560-575. | `D-F6` |
</details>
<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | Dialog / config, overlay                                                                                                                                       |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not assessed; all proposed fixes add new surfaces and none changes a released API.                                                                             |
| Mode                       | Whole component                                                                                                                                                |
| Audited source SHA         | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.6.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 46.76–47.30 / 100 · F (0 open BLOCKs)                                                                                                                          |
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
