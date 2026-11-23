# SelectPanel component API scorecard

**Rubric:** Component API compliance rubric 0.5.0 · **Component:** SelectPanel

## Report card

**Render scored:** 53.88 / 100 · F · **Render deferred:** 59.48 / 100 · F · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Scored findings:** 5 · **Deferred checks/findings:** 1/1 · **Applicable weight:** 85/100 scored; 77/100 deferred · **Evidence coverage:** 85/85 scored

| Area                                                                    |    Render scored    |   Render deferred   | Scored gaps | Deferred-only gaps | Finding links                           |
| :---------------------------------------------------------------------- | :-----------------: | :-----------------: | :---------: | :----------------: | :-------------------------------------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         | `████░░░░░░ 1.84/5` | `████░░░░░░ 1.84/5` |      1      |         0          | [S-F1](#s-f1)                           |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) | `██░░░░░░░░ 1.00/5` | `███░░░░░░░ 1.67/5` |      1      |         1          | [S-F6](#s-f6), [S-F6 (deferred)](#s-f6) |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               | `████████░░ 4.00/5` | `████████░░ 4.00/5` |      1      |         0          | [S-F4](#s-f4)                           |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   | `███████░░░ 3.33/5` | `███████░░░ 3.33/5` |      1      |         0          | [S-F3](#s-f3)                           |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) | `████████░░ 4.00/5` | `████████░░ 4.00/5` |      1      |         0          | [S-F5](#s-f5)                           |

Rubric 0.5.0 scores a missing render API once at 8 points. Existing merge behavior is scored independently. The deferred column removes only `PART-RENDER` and its own finding. Scores from rubric 0.4.1 are not comparable.

## Area 1 Architecture and parts

**Score:** render scored `████░░░░░░ 1.84/5` · render deferred `████░░░░░░ 1.84/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 19/20.

Covered rows `PART-DOCS`, `PART-AS` belong to [S-F1](#s-f1) and remain scored at zero.

### S-F1

**Title:** Add a consumer-composable SelectPanel parts surface

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-01`, section 1; covered checks: `PART-DOCS`, `PART-AS`.

**Reachable consumer:** A consumer needs to own the trigger, panel layout, input, list, and footer actions beyond the current item/data configuration.

**Observed gap:** SelectPanel exposes an item-configured component and function-only renderAnchor; docs report no subcomponents for a consumer-composable panel.

**Additive fix:** Add an opt-in parts entry point while retaining the existing config/data API, renderAnchor signature, and defaults. Keep exact part names/default elements pending review.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.tsx:77-100 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.tsx:132-140 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.tsx:175-181 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.docs.json:248 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 2 Root and part substitution

**Score:** render scored `██░░░░░░░░ 1.00/5` · render deferred `███░░░░░░░ 1.67/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 20/20.

### S-F6

**Title:** Add render forms to SelectPanel parts

**Status by mode:** Render scored — OPEN; render deferred — excluded from the score. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer needs to own the trigger, panel layout, input, list, and footer actions beyond the current item/data configuration.

**Observed gap:** The configured SelectPanel exposes renderAnchor but no uniform part element/function render contract. SelectPanel.tsx:175-181.

**Additive fix:** Add render forms to the new parts while preserving the configured renderAnchor signature, existing callbacks, and configured API.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.tsx:77-100 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.tsx:132-140 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.tsx:175-181 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.docs.json:248 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 3 Prop merge behavior

**Score:** render scored `████████░░ 4.00/5` · render deferred `████████░░ 4.00/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 17/25.

### S-F4

**Title:** Order configured SelectPanel classes component-first

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-CLASS`, section 3.

**Reachable consumer:** A consumer supplies className for the action list rendered within SelectPanel.

**Observed gap:** The configured FilteredActionList combines consumer className before its component class, contrary to ADR-025.

**Additive fix:** Keep the current configured class behavior during migration; use the required ordering for the new parts and preserve existing public props.

**Pinned citations:**

- `contributor-docs/adrs/adr-025-prop-merging.md:24-50 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.tsx:1030 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 4 State and shared concepts

**Score:** render scored `███████░░░ 3.33/5` · render deferred `███████░░░ 3.33/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 15/15.

### S-F3

**Title:** Align the shared open-state contract

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `NAMES-DEFAULTS`, section 4.

**Reachable consumer:** Consumers use SelectPanel and ActionMenu together and need a predictable shared open-state name and default model.

**Observed gap:** SelectPanel requires open while ActionMenu documents open as optional with default false.

**Additive fix:** Align the new parts APIs on one open/defaultOpen model and shared default chosen by maintainers; preserve both legacy root contracts and their callbacks.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.tsx:77-86 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.tsx:132-140 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/AnchoredOverlay/AnchoredOverlay.tsx:67 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.docs.json:39-48 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 5 Accessibility and evidence

**Score:** render scored `████████░░ 4.00/5` · render deferred `████████░░ 4.00/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 14/20.

### S-F5

**Title:** Place SelectPanel styles in the component cascade layer

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer applies utility-layer styles to SelectPanel; unlayered component rules do not participate in the declared Primer layer order.

**Observed gap:** The authored CSS Module contains no cascade-layer declaration, although ADR-021 and ADR-022 require component styles to use the named primer.components layer.

**Additive fix:** Place the component style rules in @layer primer.components.SelectPanel; retain any globally scoped registrations and all existing selectors and declarations.

**Pinned citations:**

- `contributor-docs/adrs/adr-021-css-layers.md:66-107 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `contributor-docs/adrs/adr-022-css-layer-names.md:28-65 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.module.css:1-236 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Current-contract defects

No current-contract defects established.

## Audit details

<details>
<summary>Per-check evidence matrix</summary>

Scored and deferred verdicts are shown side by side. Deferred mode changes only `PART-RENDER`; `COVERED` rows remain in the denominator at zero.

| Check               | Render scored | Render deferred | Evidence class     | Evidence at audited SHA / command result                                                                                                                                                                                                                                                                                                  | Finding ID or reason                                                                                                                 |
| :------------------ | :------------ | :-------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `MOD-01`            | PASS          | PASS            | AGENT JUDGMENT     | Configured collection/form surface owns data ordering and selection; no unnecessary spectrum layer required. contributor-docs/style.md:161-183                                                                                                                                                                                            | —                                                                                                                                    |
| `CHILD-01`          | PASS          | PASS            | SOURCE VERIFIED    | Items and selection are data-driven because SelectPanel owns filtering, ordering, and selection. SelectPanel.tsx:132-140                                                                                                                                                                                                                  | —                                                                                                                                    |
| `PART-01`           | GAP           | GAP             | SOURCE VERIFIED    | SelectPanel is an item/data config with one renderAnchor and no documented subcomponents. SelectPanel.tsx:132-140,175-181; docs.json:248                                                                                                                                                                                                  | `S-F1`                                                                                                                               |
| `PART-DOCS`         | COVERED       | COVERED         | SOURCE VERIFIED    | No independently composable parts are documented; owned by S-F1.                                                                                                                                                                                                                                                                          | `S-F1`                                                                                                                               |
| `STRUCTURE-01`      | PASS          | PASS            | SOURCE VERIFIED    | The PascalCase SelectPanel directory exposes SecondaryActionButton, SecondaryActionLink, and Message on the exported parent with Object.assign at SelectPanel.tsx:1127-1132. SelectPanel/SelectPanel.tsx:1127-1132.                                                                                                                       | —                                                                                                                                    |
| `CUSTOM-ELEMENT-01` | N/A           | N/A             | SOURCE VERIFIED    | SelectPanel is implemented as a React component and does not render or wrap a custom element.                                                                                                                                                                                                                                             | ADR-009 applies only when a custom element is involved; none is part of this component surface.                                      |
| `API-01`            | PASS          | PASS            | SOURCE VERIFIED    | The applicable ADR-003 root ref/as/DOM prop conventions remain intact. ADR-022-styled-react moves legacy sx compatibility out of @primer/react; the audited @primer/styled-react index exports styling/theming helpers, not this component. SelectPanel/SelectPanel.tsx:1127-1132; packages/styled-react/src/index.tsx:1-95.              | —                                                                                                                                    |
| `PART-AS`           | COVERED       | COVERED         | SOURCE VERIFIED    | No named parts surface has as contracts; owned by S-F1.                                                                                                                                                                                                                                                                                   | `S-F1`                                                                                                                               |
| `PART-RENDER`       | GAP           | DEFERRED        | SOURCE VERIFIED    | The configured SelectPanel exposes renderAnchor but no uniform part element/function render contract. SelectPanel.tsx:175-181.                                                                                                                                                                                                            | Render-deferred mode excludes only this finding; target gap remains visible.                                                         |
| `MERGE-CONFIG`      | PASS          | PASS            | SOURCE VERIFIED    | The configured collection boundary and renderAnchor callback are preserved; property-specific collisions are scored in the dedicated checks. SelectPanel.tsx:175-181,628-640.                                                                                                                                                             | —                                                                                                                                    |
| `MERGE-HANDLER`     | N/A           | N/A             | SOURCE VERIFIED    | The configured renderAnchor callback receives the component-generated anchor props and has no separate consumer-handler input to compose. SelectPanel.tsx:628-640.                                                                                                                                                                        | The configured renderAnchor callback receives generated handlers but accepts no separate consumer handler input to merge.            |
| `MERGE-CLASS`       | GAP           | GAP             | SOURCE VERIFIED    | The configured action list combines consumer className before its component class. SelectPanel.tsx:1030.                                                                                                                                                                                                                                  | `S-F4`                                                                                                                               |
| `MERGE-STYLE-ATTR`  | PASS          | PASS            | SOURCE VERIFIED    | The default anchor spreads generated props onto Button; component-owned selection and loading state remain controlled by SelectPanel. SelectPanel.tsx:175-181,636-640.                                                                                                                                                                    | —                                                                                                                                    |
| `MERGE-REF`         | PASS          | PASS            | SOURCE VERIFIED    | The configured anchor ref is passed through the default renderAnchor to Button. SelectPanel.tsx:598,636-640.                                                                                                                                                                                                                              | —                                                                                                                                    |
| `MERGE-BEHAVIOR`    | PASS          | PASS            | SOURCE VERIFIED    | Configured open, selection, and disabled behavior remains owned by SelectPanel and is passed as generated anchor/list props. SelectPanel.tsx:598-640.                                                                                                                                                                                     | —                                                                                                                                    |
| `STATE-CALLBACK`    | PASS          | PASS            | SOURCE VERIFIED    | Existing onOpenChange reports value and gesture; its signature remains the legacy contract. SelectPanel.tsx:83-86,599-623                                                                                                                                                                                                                 | —                                                                                                                                    |
| `NAMES-DEFAULTS`    | GAP           | GAP             | SOURCE VERIFIED    | SelectPanel requires open while ActionMenu documents open default false; shared state name/default shape is inconsistent. SelectPanel.tsx:77-86,132-140; ActionMenu.docs.json:39-48                                                                                                                                                       | `S-F3`                                                                                                                               |
| `STATE-OWNER`       | PASS          | PASS            | SOURCE VERIFIED    | SelectPanel requires controlled open and onOpenChange; the config has one external state owner. SelectPanel.tsx:77-86,132-140                                                                                                                                                                                                             | —                                                                                                                                    |
| `ACCESS-01`         | PASS          | PASS            | BEHAVIOR VERIFIED  | Focused SelectPanel suite passed; listbox, multiselect, accessible title, and focus wiring are present. SelectPanel.tsx:960-1016                                                                                                                                                                                                          | —                                                                                                                                    |
| `LIVE-01`           | PASS          | PASS            | BEHAVIOR VERIFIED  | SelectPanel uses @primer/live-region-element for loading/status announcements; focused suite passed. SelectPanel.tsx:23,47-59                                                                                                                                                                                                             | —                                                                                                                                    |
| `WARN-01`           | N/A           | N/A             | SOURCE VERIFIED    | No component-owned development warning call exists in SelectPanel.tsx.                                                                                                                                                                                                                                                                    | SelectPanel emits no development warning.                                                                                            |
| `SELECTOR-01`       | PASS          | PASS            | SOURCE VERIFIED    | SelectPanel root and named regions have stable data-component attributes. SelectPanel.tsx:960-980                                                                                                                                                                                                                                         | —                                                                                                                                    |
| `STYLE-01`          | GAP           | GAP             | SOURCE VERIFIED    | packages/react/src/SelectPanel/SelectPanel.module.css has no @layer declaration across lines 1-236; ADR-021 requires component style rules in @layer primer.components.SelectPanel. packages/react/src/SelectPanel/SelectPanel.tsx:24.                                                                                                    | `S-F5`                                                                                                                               |
| `RESP-01`           | PASS          | PASS            | SOURCE VERIFIED    | SelectPanel uses useResponsiveValue for its responsive variant behavior. SelectPanel.tsx:27                                                                                                                                                                                                                                               | —                                                                                                                                    |
| `TYPE-01`           | PASS          | PASS            | EXECUTION VERIFIED | npm run build --workspace @primer/doc-gen and npm run type-check --workspace @primer/react passed; public component types are included in the audited export surface.                                                                                                                                                                     | —                                                                                                                                    |
| `EXPORT-01`         | N/A           | N/A             | SOURCE VERIFIED    | The audited @primer/styled-react index exports BaseStyles, theming, and sx helpers, but does not re-export SelectPanel; no component-specific compatibility export applies. SelectPanel/SelectPanel.tsx:1127-1132; packages/styled-react/src/index.tsx:1-95.                                                                              | No internal module is exposed and this component is not re-exported by @primer/styled-react at the audited SHA.                      |
| `TEST-01`           | PASS          | PASS            | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/TooltipV2/\_\_tests\_\_/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/\_\_tests\_\_/Button.test.tsx — 5 files, 390 tests passed. | —                                                                                                                                    |
| `SNAPSHOT-01`       | PASS          | PASS            | SOURCE VERIFIED    | The focused SelectPanel unit tests contain no component render-tree toMatchSnapshot calls; the policy check is separate from the recorded test execution.                                                                                                                                                                                 | —                                                                                                                                    |
| `INTERACTION-01`    | PASS          | PASS            | EXECUTION VERIFIED | The focused Storybook Playwright filter interaction test passed, including light and light-high-contrast variants. See e2e/components/SelectPanel.test.ts.                                                                                                                                                                                | —                                                                                                                                    |
| `MIG-01`            | N/A           | N/A             | SOURCE VERIFIED    | The recommendations add new parts, callback props, or styling declarations without changing an existing released API. Repository package version 38.46.0 is recorded separately; publication status is not used to score an additive design.                                                                                              | No recommendation changes a released prop, callback signature, or API, so release-dependent compatibility comparison does not apply. |

</details>

<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | SelectPanel / config, form control, collection, overlay                                                                                                        |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not assessed; all proposed fixes add new surfaces and none changes a released API.                                                                             |
| Mode                       | Whole component                                                                                                                                                |
| Audited source SHA         | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.5.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 53.88 / 100 · F (no open BLOCKs)                                                                                                                               |
| Render scoring modes       | Scored 53.88 / 100 · F; deferred 59.48 / 100 · F                                                                                                               |
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
