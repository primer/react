# ActionMenu component API scorecard

**Rubric:** Component API compliance rubric 0.5.0 · **Component:** ActionMenu

## Report card

**Render scored:** 68.48–68.91 / 100 · D · **Render deferred:** 75.00–75.48 / 100 · C · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Scored findings:** 5 · **Deferred checks/findings:** 1/1 · **Applicable weight:** 92/100 scored; 84/100 deferred · **Evidence coverage:** 91/92 scored

| Area                                                                    |      Render scored       |     Render deferred      | Scored gaps | Deferred-only gaps | Finding links                                          |
| :---------------------------------------------------------------------- | :----------------------: | :----------------------: | :---------: | :----------------: | :----------------------------------------------------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         |   `██████████ 5.00/5`    |   `██████████ 5.00/5`    |      0      |         0          | No open gaps                                           |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) |   `██░░░░░░░░ 1.00/5`    |   `███░░░░░░░ 1.67/5`    |      2      |         1          | [A-F1](#a-f1), [A-F9](#a-f9), [A-F9 (deferred)](#a-f9) |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               |   `████████░░ 4.00/5`    |   `████████░░ 4.00/5`    |      1      |         0          | [A-F8](#a-f8)                                          |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   |   `███████░░░ 3.33/5`    |   `███████░░░ 3.33/5`    |      1      |         0          | [A-F3](#a-f3)                                          |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) | `████████░░ 3.85–4.00/5` | `████████░░ 3.85–4.00/5` |      1      |         0          | [A-F5](#a-f5)                                          |

Rubric 0.5.0 scores a missing render API once at 8 points. Existing merge behavior is scored independently. The deferred column removes only `PART-RENDER` and its own finding. Scores from rubric 0.4.1 are not comparable.

## Area 1 Architecture and parts

**Score:** render scored `██████████ 5.00/5` · render deferred `██████████ 5.00/5` · **Open findings:** 0 scored; 0 deferred · **Applicable weight:** 19/20.

No open gaps.

## Area 2 Root and part substitution

**Score:** render scored `██░░░░░░░░ 1.00/5` · render deferred `███░░░░░░░ 1.67/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 20/20.

### A-F1

**Title:** Complete the ActionMenu part substitution contract

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-AS`, section 2.

**Reachable consumer:** A consumer needs a custom semantic trigger or overlay while retaining ActionMenu's anchor behavior, refs, and menu lifecycle.

**Observed gap:** ActionMenu.Anchor requires a child element and has no as prop; the rendered parts do not provide the required element/function render contract.

**Additive fix:** Add as support to ActionMenu.Anchor and element/function render support to each rendered part while preserving ActionMenu.Button, Anchor, Overlay, and the configured default export; keep simultaneous as/render precedence pending review.

**Pinned citations:**

- `packages/react/src/ActionMenu/ActionMenu.tsx:198-209 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:261-267 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:274-282 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:373-384 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:390-394 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

### A-F9

**Title:** Add render forms to ActionMenu parts

**Status by mode:** Render scored — OPEN; render deferred — excluded from the score. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer needs a custom semantic trigger or overlay while retaining ActionMenu's anchor behavior, refs, and menu lifecycle.

**Observed gap:** ActionMenu parts do not expose element or function render forms. ActionMenu.tsx:198-209,274-282,390-394.

**Additive fix:** Add element and function render forms to the parts while preserving the configured ActionMenu API and its existing callback signatures.

**Pinned citations:**

- `packages/react/src/ActionMenu/ActionMenu.tsx:198-209 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:261-267 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:274-282 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:373-384 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.tsx:390-394 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 3 Prop merge behavior

**Score:** render scored `████████░░ 4.00/5` · render deferred `████████░░ 4.00/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 25/25.

### A-F8

**Title:** Preserve ActionMenu child refs

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-REF`, section 3.

**Reachable consumer:** A consumer needs a custom semantic trigger or overlay while retaining ActionMenu's anchor behavior, refs, and menu lifecycle.

**Observed gap:** ActionMenu.Anchor replaces the child element ref with the anchored-overlay ref, so a consumer ref on the child is not called.

**Additive fix:** Merge the child ref with the anchor ref on the final trigger element while preserving ActionMenu.Button and Anchor behavior.

**Pinned citations:**

- `packages/react/src/ActionMenu/ActionMenu.tsx:133-139 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 4 State and shared concepts

**Score:** render scored `███████░░░ 3.33/5` · render deferred `███████░░░ 3.33/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 15/15.

### A-F3

**Title:** Align the shared open-state contract

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `NAMES-DEFAULTS`, section 4.

**Reachable consumer:** Consumers use ActionMenu and SelectPanel together and need a predictable shared open-state name and default model.

**Observed gap:** ActionMenu documents open as optional with default false; SelectPanel requires open, so the shared concept has inconsistent default/control shape.

**Additive fix:** Align the new parts APIs on one open/defaultOpen model and shared default chosen by maintainers; retain both legacy root contracts and callback signatures.

**Pinned citations:**

- `packages/react/src/ActionMenu/ActionMenu.docs.json:39-48 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.tsx:77-86 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/SelectPanel/SelectPanel.tsx:132-140 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/AnchoredOverlay/AnchoredOverlay.tsx:67 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Area 5 Accessibility and evidence

**Score:** render scored `████████░░ 3.85–4.00/5` · render deferred `████████░░ 3.85–4.00/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 13/20.

### A-F5

**Title:** Place ActionMenu styles in the component cascade layer

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer applies utility-layer styles to ActionMenu; unlayered component rules do not participate in the declared Primer layer order.

**Observed gap:** The authored CSS Module contains no cascade-layer declaration, although ADR-021 and ADR-022 require component styles to use the named primer.components layer.

**Additive fix:** Place the component style rules in @layer primer.components.ActionMenu; retain any globally scoped registrations and all existing selectors and declarations.

**Pinned citations:**

- `contributor-docs/adrs/adr-021-css-layers.md:66-107 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `contributor-docs/adrs/adr-022-css-layer-names.md:28-65 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`
- `packages/react/src/ActionMenu/ActionMenu.module.css:1-70 @ 2128032dca65a1bd565fe382c2e91c638c6473a4`

## Current-contract defects

No current-contract defects established.

## Audit details

<details>
<summary>Per-check evidence matrix</summary>

Scored and deferred verdicts are shown side by side. Deferred mode changes only `PART-RENDER`; `COVERED` rows remain in the denominator at zero.

| Check               | Render scored | Render deferred | Evidence class     | Evidence at audited SHA / command result                                                                                                                                                                                                                                                                                                  | Finding ID or reason                                                                                                                                                                        |
| :------------------ | :------------ | :-------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `MOD-01`            | PASS          | PASS            | AGENT JUDGMENT     | Config collection/overlay pattern has a concrete consumer need; no extra spectrum layer required. contributor-docs/style.md:161-183                                                                                                                                                                                                       | —                                                                                                                                                                                           |
| `CHILD-01`          | PASS          | PASS            | SOURCE VERIFIED    | Consumers compose documented Button, Anchor, and Overlay children. ActionMenu.tsx:37-42,390-394                                                                                                                                                                                                                                           | —                                                                                                                                                                                           |
| `PART-01`           | PASS          | PASS            | SOURCE VERIFIED    | Public ActionMenu.Button, Anchor, Overlay, and Divider parts are exported. ActionMenu.tsx:390-394                                                                                                                                                                                                                                         | —                                                                                                                                                                                           |
| `PART-DOCS`         | PASS          | PASS            | SOURCE VERIFIED    | Docs list the configured parts and root composition contract. ActionMenu.docs.json:35-60                                                                                                                                                                                                                                                  | —                                                                                                                                                                                           |
| `STRUCTURE-01`      | PASS          | PASS            | SOURCE VERIFIED    | The PascalCase ActionMenu directory exposes Button, Anchor, Overlay, and Divider on the exported parent with Object.assign at ActionMenu.tsx:394. ActionMenu/ActionMenu.tsx:394.                                                                                                                                                          | —                                                                                                                                                                                           |
| `CUSTOM-ELEMENT-01` | N/A           | N/A             | SOURCE VERIFIED    | ActionMenu is implemented as a React component and does not render or wrap a custom element.                                                                                                                                                                                                                                              | ADR-009 applies only when a custom element is involved; none is part of this component surface.                                                                                             |
| `API-01`            | PASS          | PASS            | SOURCE VERIFIED    | The applicable ADR-003 root ref/as/DOM prop conventions remain intact. ADR-022-styled-react moves legacy sx compatibility out of @primer/react; the audited @primer/styled-react index exports styling/theming helpers, not this component. ActionMenu/ActionMenu.tsx:394; packages/styled-react/src/index.tsx:1-95.                      | —                                                                                                                                                                                           |
| `PART-AS`           | GAP           | GAP             | SOURCE VERIFIED    | ActionMenu.Anchor requires a consumer-supplied React element and exposes no as prop; ActionMenu's rendered parts do not expose element/function render. ActionMenu.tsx:198-209,274-282                                                                                                                                                    | `A-F1`                                                                                                                                                                                      |
| `PART-RENDER`       | GAP           | DEFERRED        | SOURCE VERIFIED    | ActionMenu parts do not expose element or function render forms. ActionMenu.tsx:198-209,274-282,390-394.                                                                                                                                                                                                                                  | Render-deferred mode excludes only this finding; target gap remains visible.                                                                                                                |
| `MERGE-CONFIG`      | PASS          | PASS            | SOURCE VERIFIED    | ActionMenu.Anchor and Button retain their existing legacy subcomponent boundary; property-specific behavior is scored below. ActionMenu.tsx:118-139,161-173.                                                                                                                                                                              | —                                                                                                                                                                                           |
| `MERGE-HANDLER`     | PASS          | PASS            | SOURCE VERIFIED    | The existing Anchor invokes its child handler and then the anchored handler; the gist render-element stage applies only to new render parts. ActionMenu.tsx:133-139.                                                                                                                                                                      | —                                                                                                                                                                                           |
| `MERGE-CLASS`       | PASS          | PASS            | SOURCE VERIFIED    | Generated anchor classes precede the consumer class. ActionMenu.tsx:55-81,161-173.                                                                                                                                                                                                                                                        | —                                                                                                                                                                                           |
| `MERGE-STYLE-ATTR`  | PASS          | PASS            | SOURCE VERIFIED    | Anchor-owned ARIA and id props are applied on the existing clone path; ordinary child props remain on the child. ActionMenu.tsx:133-139,161-173.                                                                                                                                                                                          | —                                                                                                                                                                                           |
| `MERGE-REF`         | GAP           | GAP             | SOURCE VERIFIED    | Cloning ActionMenu.Anchor replaces a child ref with anchorRef rather than merging both refs. ActionMenu.tsx:133-139.                                                                                                                                                                                                                      | `A-F8`                                                                                                                                                                                      |
| `MERGE-BEHAVIOR`    | PASS          | PASS            | SOURCE VERIFIED    | Generated anchor behavior and ARIA props are applied after consumer props on the cloned anchor. ActionMenu.tsx:133-139.                                                                                                                                                                                                                   | —                                                                                                                                                                                           |
| `STATE-CALLBACK`    | PASS          | PASS            | SOURCE VERIFIED    | Existing onOpenChange reports state changes; legacy boolean signature remains unchanged. ActionMenu.tsx:45-53,84-93                                                                                                                                                                                                                       | —                                                                                                                                                                                           |
| `NAMES-DEFAULTS`    | GAP           | GAP             | SOURCE VERIFIED    | ActionMenu open defaults false while SelectPanel requires open; shared state name/default shape is inconsistent. ActionMenu.docs.json:39-48; SelectPanel.tsx:77-86,132-140; AnchoredOverlay.tsx:67                                                                                                                                        | `A-F3`                                                                                                                                                                                      |
| `STATE-OWNER`       | PASS          | PASS            | SOURCE VERIFIED    | useProvidedStateOrCreate owns the optional controlled/uncontrolled open axis and defaults false. ActionMenu.tsx:84-93                                                                                                                                                                                                                     | —                                                                                                                                                                                           |
| `ACCESS-01`         | PASS          | PASS            | BEHAVIOR VERIFIED  | Focused ActionMenu suite passed; anchor and overlay behavior remain wired through AnchoredOverlay. ActionMenu.tsx:354-384                                                                                                                                                                                                                 | —                                                                                                                                                                                           |
| `LIVE-01`           | N/A           | N/A             | SOURCE VERIFIED    | ActionMenu does not own changing status or alert announcements.                                                                                                                                                                                                                                                                           | No changing status or alert announcement is owned by ActionMenu.                                                                                                                            |
| `WARN-01`           | N/A           | N/A             | SOURCE VERIFIED    | No component-owned development warning call exists in ActionMenu.tsx.                                                                                                                                                                                                                                                                     | ActionMenu emits no development warning.                                                                                                                                                    |
| `SELECTOR-01`       | PASS          | PASS            | SOURCE VERIFIED    | ActionMenu overlay and related parts use stable data-component selectors. ActionMenu.tsx:364-367                                                                                                                                                                                                                                          | —                                                                                                                                                                                           |
| `STYLE-01`          | GAP           | GAP             | SOURCE VERIFIED    | packages/react/src/ActionMenu/ActionMenu.module.css has no @layer declaration across lines 1-70; ADR-021 requires component style rules in @layer primer.components.ActionMenu. packages/react/src/ActionMenu/ActionMenu.tsx:17.                                                                                                          | `A-F5`                                                                                                                                                                                      |
| `RESP-01`           | PASS          | PASS            | SOURCE VERIFIED    | ActionMenu computes responsive overlay variant through useResponsiveValue.                                                                                                                                                                                                                                                                | —                                                                                                                                                                                           |
| `TYPE-01`           | PASS          | PASS            | EXECUTION VERIFIED | npm run build --workspace @primer/doc-gen and npm run type-check --workspace @primer/react passed; public component types are included in the audited export surface.                                                                                                                                                                     | —                                                                                                                                                                                           |
| `EXPORT-01`         | N/A           | N/A             | SOURCE VERIFIED    | The audited @primer/styled-react index exports BaseStyles, theming, and sx helpers, but does not re-export ActionMenu; no component-specific compatibility export applies. ActionMenu/ActionMenu.tsx:394; packages/styled-react/src/index.tsx:1-95.                                                                                       | No internal module is exposed and this component is not re-exported by @primer/styled-react at the audited SHA.                                                                             |
| `TEST-01`           | PASS          | PASS            | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/TooltipV2/\_\_tests\_\_/Tooltip.test.tsx packages/react/src/ActionMenu/ActionMenu.test.tsx packages/react/src/Dialog/Dialog.test.tsx packages/react/src/SelectPanel/SelectPanel.test.tsx packages/react/src/Button/\_\_tests\_\_/Button.test.tsx — 5 files, 390 tests passed. | —                                                                                                                                                                                           |
| `SNAPSHOT-01`       | PASS          | PASS            | SOURCE VERIFIED    | The focused ActionMenu unit tests contain no component render-tree toMatchSnapshot calls; the policy check is separate from the recorded test execution.                                                                                                                                                                                  | —                                                                                                                                                                                           |
| `INTERACTION-01`    | NOT MEASURED  | NOT MEASURED    | SOURCE VERIFIED    | The existing e2e test visits Storybook and clicks the menu trigger, but the selected test cannot complete because the expected Darwin screenshot baseline is absent. See e2e/components/ActionMenu.test.ts.                                                                                                                               | The Playwright run reached the screenshot assertion but could not complete because the repository has no Darwin-specific baseline snapshots; the execution result is not counted as a pass. |
| `MIG-01`            | N/A           | N/A             | SOURCE VERIFIED    | The recommendations add new parts, callback props, or styling declarations without changing an existing released API. Repository package version 38.46.0 is recorded separately; publication status is not used to score an additive design.                                                                                              | No recommendation changes a released prop, callback signature, or API, so release-dependent compatibility comparison does not apply.                                                        |

</details>

<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | ActionMenu / config, collection, overlay, trigger parts                                                                                                        |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not assessed; all proposed fixes add new surfaces and none changes a released API.                                                                             |
| Mode                       | Whole component                                                                                                                                                |
| Audited source SHA         | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.5.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 68.48–68.91 / 100 · D (no open BLOCKs)                                                                                                                         |
| Render scoring modes       | Scored 68.48–68.91 / 100 · D; deferred 75.00–75.48 / 100 · C                                                                                                   |
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
