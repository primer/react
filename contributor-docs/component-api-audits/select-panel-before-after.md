# SelectPanel: current baseline vs. Tyler's composable API

The after grade covers one whole SelectPanel component, including configured and composable APIs. Both snapshots use rubric 0.6.0 and the same active checks. Candidate requirements are listed separately without changing either grade.

## Before and after grades

| Snapshot                    | Active grade          | Applicable active weight | Candidate checks | Status      |
| :-------------------------- | :-------------------- | :----------------------: | :--------------- | :---------- |
| Current configured baseline | 60.25 / 100 · D       |          79/92           | 1 unweighted gap | PROVISIONAL |
| Tyler's whole SelectPanel   | 41.38–42.53 / 100 · F |          87/92           | 1 unweighted gap | PROVISIONAL |

**Scope:** Before is SelectPanel at `5b50bc053cab249809ef0bad0cd1aab64e8924a5`, immediately before #7287. After is the whole component at #7287 head `1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`, including its configured and composable APIs. #7240 is already in the before base; #7228 is not linked as part of #7287 and is excluded.

Both states use ADR snapshot `2128032dca65a1bd565fe382c2e91c638c6473a4` and pinned gist `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2`.

## Change impact

The decomposition improves the architecture score. The full component grade remains lower because the new surface makes additional target contracts measurable and the audit finds gaps in those contracts.

| Measure                      | Before          | After                 | Change                  |
| :--------------------------- | :-------------- | :-------------------- | :---------------------- |
| Architecture and parts       | 2.00/5          | 3.75/5                | +1.75                   |
| `PART-01`                    | GAP             | PASS                  | Improved                |
| Whole-component active grade | 60.25 / 100 · D | 41.38–42.53 / 100 · F | -18.87 to -17.72 points |
| Applicable active weight     | 79/92           | 87/92                 | +8                      |

## Section scores

| Area                       | Before |    After    |     Delta      |
| :------------------------- | :----: | :---------: | :------------: |
| Architecture and parts     | 2.00/5 |   3.75/5    |     +1.75      |
| Root and part substitution | 1.67/5 |   1.67/5    |      0.00      |
| Prop merge behavior        | 4.00/5 |   2.20/5    |     -1.80      |
| State and shared concepts  | 3.33/5 |   0.67/5    |     -2.66      |
| Accessibility and evidence | 4.00/5 | 1.33–1.67/5 | -2.67 to -2.33 |

## Check verdict changes

| Check            | Before  | After   | Evidence on the after surface                                                                                                                                                                                                                   |
| :--------------- | :------ | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PART-01`        | GAP     | PASS    | The component exports Root plus named trigger, overlay, content, list, item, form, and action parts on SelectPanel. SelectPanelParts.tsx:37-61; SelectPanel.tsx:1171-1197.                                                                      |
| `PART-DOCS`      | COVERED | GAP     | Composition examples exist, but the docs metadata lists no subcomponents or part reference; SC-F1 owns this gap. SelectPanel.docs.json:248; SelectPanel.composition.stories.tsx:14-15,96-121.                                                   |
| `PART-AS`        | COVERED | GAP     | Title alone exposes as; the other parts render fixed targets and Root has no host. SC-F2 owns the missing all-part contract. SelectPanelParts.tsx:37-58,115-155,214-263,520-529.                                                                |
| `MERGE-HANDLER`  | N/A     | GAP     | New parts run consumer handlers before Primer behavior and use defaultPrevented as the skip signal; the pinned gist requires a separate skip contract. SelectPanelParts.tsx:92-113,378-400; SelectPanelActions.tsx:35-54.                       |
| `MERGE-REF`      | PASS    | GAP     | Root and Group do not forward refs, and Overlay has no top-level forwarded-ref contract. SelectPanelParts.tsx:37-45,520-525; SelectPanelOverlay.tsx:61-65.                                                                                      |
| `STATE-CALLBACK` | PASS    | GAP     | New Root callbacks are positional and requestOpenChange commits before calling onOpenChange; SC-F7 owns the missing value/reason/event/cancel contract. useSelectPanel.ts:16-34,103-109.                                                        |
| `ACCESS-01`      | PASS    | GAP     | npx vitest run --project '@primer/react' packages/react/src/SelectPanel — 19 files, 1681 passed and 7 failed; the same seven failures reproduced in the one-worker focused rerun. SC-F8 owns the observed overlay/focus/adapter failures.       |
| `SELECTOR-01`    | PASS    | GAP     | Public parts lack stable data-component identities; only the nested secondary action is tagged. SC-F9 owns this gap. SelectPanelParts.tsx:115-155,214-263,443,520-529.                                                                          |
| `TEST-01`        | PASS    | COVERED | The focused unit run and one-worker rerun are execution evidence for the ACCESS-01 owner finding SC-F8; the command did not pass overall, so it is not a PASS.                                                                                  |
| `INTERACTION-01` | PASS    | GAP     | The existing Playwright file lists configured stories only; composition stories are not visited by an interaction test. SC-F11 owns this gap. e2e/components/SelectPanel.test.ts:8-24,95-143; SelectPanel.composition.stories.tsx:14-15,96-121. |

`PART-01` is the direct architecture improvement: the exported Root and named parts change the absent-parts verdict to PASS. New composable use cases expose gaps that the configured-only baseline could not exercise.

## What the decomposition added

1. An opt-in `SelectPanel.Root` and named parts for trigger, overlay, content, list, items, form, and actions while retaining the configured API.
2. Consumer ownership of panel layout and optional regions through children-based composition.
3. Controlled and uncontrolled open state on the composable surface, including `defaultOpen=false`.

## Largest remaining gaps

1. Parts do not provide the uniform `as` and element/function `render` contract; the trigger alone has a function renderer. Render support remains visible as an unweighted candidate check.
2. Existing and new surfaces have merge gaps: configured and part classes use the wrong surface-specific order; handlers use `defaultPrevented` rather than the separate target skip contract; Root/Group/Overlay ref forwarding is incomplete.
3. The new state callback does not carry the target value/reason/event/cancel contract, and the composable path has seven reproduced interaction failures, missing stable selectors, and no Storybook Playwright interaction test.

The report remains provisional: Layer 3 review is pending and `TYPE-01` could not be measured reliably in the shared dependency setup. Unit-test execution is reported separately from the ADR-011 snapshot and ADR-017 Playwright policies.

Candidate `PART-RENDER` is a gap on both snapshots with proposed weight 8. It is not part of rubric 0.6.0 active scoring. The report remains provisional: Layer 3 review is pending, and SelectPanel type-check evidence could not be measured reliably in the shared dependency setup.

Candidate `PART-RENDER` is a gap on both snapshots with proposed weight 8. It is not part of rubric 0.6.0 active scoring. The report remains provisional: Layer 3 review is pending, and SelectPanel type-check evidence could not be measured reliably in the shared dependency setup.

## Detailed scorecards

## Before configured API scorecard

**Rubric:** Component API compliance rubric 0.6.0 · **Component:** SelectPanel (before, configured API)

## Before Report card

**Active grade:** 60.25 / 100 · D · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Active findings:** 4 · **Candidate checks:** 1 (1 gap) · **Applicable active weight:** 79/92 · **Evidence coverage:** 78/79

| Area                                                                           |   Active score    | Active gaps | Finding links        | Issue links |
| :----------------------------------------------------------------------------- | :---------------: | :---------: | :------------------- | :---------- |
| [Area 1 Architecture and parts](#before-area-1-architecture-and-parts)         | ████░░░░░░ 2.00/5 |      1      | [S-F1](#before-s-f1) |             |
| [Area 2 Root and part substitution](#before-area-2-root-and-part-substitution) | ███░░░░░░░ 1.67/5 |      0      | No open gaps         |             |
| [Area 3 Prop merge behavior](#before-area-3-prop-merge-behavior)               | ████████░░ 4.00/5 |      1      | [S-F4](#before-s-f4) |             |
| [Area 4 State and shared concepts](#before-area-4-state-and-shared-concepts)   | ███████░░░ 3.33/5 |      1      | [S-F3](#before-s-f3) |             |
| [Area 5 Accessibility and evidence](#before-area-5-accessibility-and-evidence) | ████████░░ 4.00/5 |      1      | [S-F5](#before-s-f5) |             |

The active score uses the 92-point rubric and is normalized to 100. Scores from earlier rubric versions are not comparable. Candidate checks remain visible with proposed weights outside the grade.

## Before Area 1 Architecture and parts

**Active score:** ████░░░░░░ 2.00/5 · **Open findings:** 1 · **Applicable active weight:** 20/20.

### Before S-F1

**Title:** Add a consumer-composable SelectPanel parts surface

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-01`, section 1.

**Reachable consumer:** A consumer needs to own the trigger, panel layout, input, list, and footer actions beyond the current item/data configuration.

**Observed gap:** SelectPanel exposes an item-configured component and function-only renderAnchor; docs report no subcomponents for a consumer-composable panel.

**Additive fix:** Add an opt-in parts entry point while retaining the existing config/data API, renderAnchor signature, and defaults. Keep exact part names/default elements pending review.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.tsx:77-100 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.tsx:132-140 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.tsx:175-181 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.docs.json:248 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`

## Before Area 2 Root and part substitution

**Active score:** ███░░░░░░░ 1.67/5 · **Open findings:** 0 · **Applicable active weight:** 12/12.

No open gaps.

## Before Area 3 Prop merge behavior

**Active score:** ████████░░ 4.00/5 · **Open findings:** 1 · **Applicable active weight:** 17/25.

`MERGE-CONFIG 5/5` + `MERGE-HANDLER 0/8` + `MERGE-CLASS 0/3` + `MERGE-STYLE-ATTR 4/4` + `MERGE-REF 3/3` + `MERGE-BEHAVIOR 2/2` = 14/17 = 4.00/5.

### Before S-F4

**Title:** Order configured SelectPanel classes component-first

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-CLASS`, section 3.

**Reachable consumer:** A consumer supplies className for the action list rendered within SelectPanel.

**Observed gap:** The configured FilteredActionList combines consumer className before its component class, contrary to ADR-025.

**Additive fix:** Keep the current configured class behavior during migration; use the required ordering for the new parts and preserve existing public props.

**Pinned citations:**

- `contributor-docs/adrs/adr-025-prop-merging.md:24-50 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.tsx:1030 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`

## Before Area 4 State and shared concepts

**Active score:** ███████░░░ 3.33/5 · **Open findings:** 1 · **Applicable active weight:** 15/15.

### Before S-F3

**Title:** Align the shared open-state contract

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `NAMES-DEFAULTS`, section 4.

**Reachable consumer:** Consumers use SelectPanel and ActionMenu together and need a predictable shared open-state name and default model.

**Observed gap:** SelectPanel requires open while ActionMenu documents open as optional with default false.

**Additive fix:** Align the new parts APIs on one open/defaultOpen model and shared default chosen by maintainers; preserve both legacy root contracts and their callbacks.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.tsx:77-86 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.tsx:132-140 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/AnchoredOverlay/AnchoredOverlay.tsx:67 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/ActionMenu/ActionMenu.docs.json:39-48 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`

## Before Area 5 Accessibility and evidence

**Active score:** ████████░░ 4.00/5 · **Open findings:** 1 · **Applicable active weight:** 15/20.

### Before S-F5

**Title:** Place SelectPanel styles in the component cascade layer

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer applies utility-layer styles to SelectPanel; unlayered component rules do not participate in the declared Primer layer order.

**Observed gap:** The authored CSS Module contains no cascade-layer declaration, although ADR-021 and ADR-022 require component styles to use the named primer.components layer.

**Additive fix:** Place the component style rules in @layer primer.components.SelectPanel; retain any globally scoped registrations and all existing selectors and declarations.

**Pinned citations:**

- `contributor-docs/adrs/adr-021-css-layers.md:66-107 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `contributor-docs/adrs/adr-022-css-layer-names.md:28-65 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.module.css:1-236 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`

## Before Candidate checks

Candidate checks are visible assessments outside the active 92-point rubric. Their proposed weights do not affect the active score, denominator, section caps, evidence coverage, or status.

| Candidate     | Verdict | Proposed weight | Finding                        |
| :------------ | :------ | :-------------: | :----------------------------- |
| `PART-RENDER` | GAP     | 8 (unweighted)  | [S-F6](#before-candidate-s-f6) |

### Before Candidate S-F6

**Title:** Add render forms to SelectPanel parts

**Candidate status:** GAP (unweighted; proposed weight 8) · **Classification / severity / check:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer needs to own the trigger, panel layout, input, list, and footer actions beyond the current item/data configuration.

**Observed gap:** The configured SelectPanel exposes renderAnchor but no uniform part element/function render contract. SelectPanel.tsx:175-181.

**Proposed path:** Add render forms to the new parts while preserving the configured renderAnchor signature, existing callbacks, and configured API.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.tsx:77-100 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.tsx:132-140 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.tsx:175-181 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`
- `packages/react/src/SelectPanel/SelectPanel.docs.json:248 @ 5b50bc053cab249809ef0bad0cd1aab64e8924a5`

## Before Current-contract defects

No current-contract defects established.

## Before Audit details

<details>
<summary>Active per-check evidence matrix</summary>
| Check | Verdict | Evidence class | Evidence at audited SHA / command result | Finding ID or reason |
| :---- | :------ | :------------- | :--------------------------------------- | :------------------- |
| `MOD-01` | PASS | AGENT JUDGMENT | Configured collection/form surface owns data ordering and selection; no unnecessary spectrum layer required. contributor-docs/style.md:161-183 | — |
| `CHILD-01` | PASS | SOURCE VERIFIED | Items and selection are data-driven because SelectPanel owns filtering, ordering, and selection. SelectPanel.tsx:132-140 | — |
| `PART-01` | GAP | SOURCE VERIFIED | SelectPanel is an item/data config with one renderAnchor and no documented subcomponents. SelectPanel.tsx:132-140,175-181; docs.json:248 | `S-F1` |
| `PART-DOCS` | COVERED | SOURCE VERIFIED | No independently composable parts are documented; owned by S-F1. | `S-F1` |
| `STRUCTURE-01` | PASS | SOURCE VERIFIED | The PascalCase SelectPanel directory exposes SecondaryActionButton, SecondaryActionLink, and Message on the exported parent with Object.assign at SelectPanel.tsx:1127-1132. SelectPanel/SelectPanel.tsx:1127-1132. | — |
| `CUSTOM-ELEMENT-01` | PASS | SOURCE VERIFIED | The component integrates the live-region custom element for client-side announcements through announceFromElement and AriaStatus. SelectPanel.tsx:21,581-585; SelectPanelMessage.tsx:6,123-127. | — |
| `API-01` | PASS | SOURCE VERIFIED | SelectPanel is a configured composite with no single host element. Its public anchorRef targets the trigger; renderAnchor receives the trigger ref and DOM props, and the default renderer spreads them onto Button. ADR-003 limits as to clear polymorphism needs, which this configurable renderAnchor already covers. ADR-022-styled-react keeps legacy sx compatibility outside @primer/react. SelectPanel/SelectPanel.tsx:132-140,175-181,188-189,598,936; AnchoredOverlay/AnchoredOverlay.tsx:30-33,59-61; packages/styled-react/src/index.tsx:1-95. | — |
| `PART-AS` | COVERED | SOURCE VERIFIED | No named parts surface has as contracts; owned by S-F1. | `S-F1` |
| `MERGE-CONFIG` | PASS | SOURCE VERIFIED | The configured collection boundary and renderAnchor callback are preserved; property-specific collisions are scored in the dedicated checks. SelectPanel.tsx:175-181,628-640. | — |
| `MERGE-HANDLER` | N/A | SOURCE VERIFIED | The configured renderAnchor callback receives the component-generated anchor props and has no separate consumer-handler input to compose. SelectPanel.tsx:628-640. | The configured renderAnchor callback receives generated handlers but accepts no separate consumer handler input to merge. |
| `MERGE-CLASS` | GAP | SOURCE VERIFIED | The configured action list combines consumer className before its component class. SelectPanel.tsx:1030. | `S-F4` |
| `MERGE-STYLE-ATTR` | PASS | SOURCE VERIFIED | The default anchor spreads generated props onto Button; component-owned selection and loading state remain controlled by SelectPanel. SelectPanel.tsx:175-181,636-640. | — |
| `MERGE-REF` | PASS | SOURCE VERIFIED | The configured anchor ref is passed through the default renderAnchor to Button. SelectPanel.tsx:598,636-640. | — |
| `MERGE-BEHAVIOR` | PASS | SOURCE VERIFIED | Configured open, selection, and disabled behavior remains owned by SelectPanel and is passed as generated anchor/list props. SelectPanel.tsx:598-640. | — |
| `STATE-CALLBACK` | PASS | SOURCE VERIFIED | Existing onOpenChange reports value and gesture; its signature remains the legacy contract. SelectPanel.tsx:83-86,599-623 | — |
| `NAMES-DEFAULTS` | GAP | SOURCE VERIFIED | SelectPanel requires open while ActionMenu documents open default false; shared state name/default shape is inconsistent. SelectPanel.tsx:77-86,132-140; ActionMenu.docs.json:39-48 | `S-F3` |
| `STATE-OWNER` | PASS | SOURCE VERIFIED | SelectPanel requires controlled open and onOpenChange; the config has one external state owner. SelectPanel.tsx:77-86,132-140 | — |
| `ACCESS-01` | PASS | BEHAVIOR VERIFIED | Focused SelectPanel suite passed; listbox, multiselect, accessible title, and focus wiring are present. SelectPanel.tsx:960-1016 | — |
| `LIVE-01` | PASS | BEHAVIOR VERIFIED | SelectPanel uses @primer/live-region-element for loading/status announcements; focused suite passed. SelectPanel.tsx:23,47-59 | — |
| `WARN-01` | N/A | SOURCE VERIFIED | No component-owned development warning call exists in SelectPanel.tsx. | SelectPanel emits no development warning. |
| `SELECTOR-01` | PASS | SOURCE VERIFIED | SelectPanel root and named regions have stable data-component attributes. SelectPanel.tsx:960-980 | — |
| `STYLE-01` | GAP | SOURCE VERIFIED | packages/react/src/SelectPanel/SelectPanel.module.css has no @layer declaration across lines 1-236; ADR-021 requires component style rules in @layer primer.components.SelectPanel. packages/react/src/SelectPanel/SelectPanel.tsx:24. | `S-F5` |
| `RESP-01` | PASS | SOURCE VERIFIED | SelectPanel uses useResponsiveValue for its responsive variant behavior. SelectPanel.tsx:27 | — |
| `TYPE-01` | NOT MEASURED | SOURCE VERIFIED | npm run type-check --workspace @primer/react failed in both snapshots with TypeScript errors in script/components-json/build.ts and src/\_\_tests\_\_/exports.test.ts, including duplicate Babel type definitions. SelectPanel-specific type execution is unverified. | The package type-check command failed in both detached worktrees on unrelated existing files because the shared dependency tree resolves duplicate @babel/types copies and incompatible parser declarations; no SelectPanel-isolated type-check could be established. |
| `EXPORT-01` | PASS | SOURCE VERIFIED | The public SelectPanel entry exports the parent API and named part types; no internal module path is re-exported, and @primer/styled-react does not re-export SelectPanel. SelectPanel/index.ts:1-13; packages/styled-react/src/index.tsx:1-95. | — |
| `TEST-01` | PASS | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/SelectPanel/SelectPanel.test.tsx — 1 file, 185 tests passed. | — |
| `SNAPSHOT-01` | PASS | SOURCE VERIFIED | The focused SelectPanel unit tests contain no component render-tree toMatchSnapshot calls; the policy check is separate from the recorded test execution. | — |
| `INTERACTION-01` | PASS | EXECUTION VERIFIED | STORYBOOK\_URL=http://127.0.0.1:6006 npx playwright test e2e/components/SelectPanel.test.ts --grep 'Filter input anchored legacy contrast false @aat light' --workers=1 — 2 Storybook Playwright tests passed (light and light\_high\_contrast). | — |
| `MIG-01` | N/A | SOURCE VERIFIED | The configured merge recommendation preserves current behavior through an opt-in or parallel path. No default switch is selected; repository package version is recorded separately, and publication must be verified before any later default change. | No release-dependent default change is selected. The configured merge fix remains opt-in or parallel to preserve current behavior, and any later default switch requires published-surface verification. |
</details>
<details>
<summary>Unweighted candidate inventory</summary>
| Candidate | Verdict | Proposed weight | Evidence class | Evidence / reason | Candidate finding |
| :-------- | :------ | :-------------: | :------------- | :---------------- | :---------------- |
| `PART-RENDER` | GAP | 8 (unweighted) | SOURCE VERIFIED | The configured SelectPanel exposes renderAnchor but no uniform part element/function render contract. SelectPanel.tsx:175-181. | `S-F6` |
</details>
<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | SelectPanel (before, configured API) / The only public SelectPanel surface at this snapshot is the configured props/data API.                                  |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not assessed; all proposed fixes add new surfaces and none changes a released API.                                                                             |
| Mode                       | whole component; surface-scoped record                                                                                                                         |
| Audited source SHA         | `5b50bc053cab249809ef0bad0cd1aab64e8924a5`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.6.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 60.25 / 100 · D (0 open BLOCKs)                                                                                                                                |
| Candidate checks           | 1 listed; 1 gap(s); proposed weights excluded from the active 92-point rubric                                                                                  |
| Human review               | PENDING HUMAN                                                                                                                                                  |
| Surface                    | The only public SelectPanel surface at this snapshot is the configured props/data API.                                                                         |

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

## After whole-component scorecard

**Rubric:** Component API compliance rubric 0.6.0 · **Component:** SelectPanel (after #7287, whole component)

## After Report card

**Active grade:** 41.38–42.53 / 100 · F · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Active findings:** 11 · **Candidate checks:** 1 (1 gap) · **Applicable active weight:** 87/92 · **Evidence coverage:** 86/87

| Area                                                                          |      Active score      | Active gaps | Finding links                                                                                  | Issue links |
| :---------------------------------------------------------------------------- | :--------------------: | :---------: | :--------------------------------------------------------------------------------------------- | :---------- |
| [Area 1 Architecture and parts](#after-area-1-architecture-and-parts)         |   ████████░░ 3.75/5    |      1      | [SC-F1](#after-sc-f1)                                                                          |             |
| [Area 2 Root and part substitution](#after-area-2-root-and-part-substitution) |   ███░░░░░░░ 1.67/5    |      1      | [SC-F2](#after-sc-f2)                                                                          |             |
| [Area 3 Prop merge behavior](#after-area-3-prop-merge-behavior)               |   ████░░░░░░ 2.20/5    |      3      | [SC-F4](#after-sc-f4), [SC-F5](#after-sc-f5), [SC-F6](#after-sc-f6)                            |             |
| [Area 4 State and shared concepts](#after-area-4-state-and-shared-concepts)   |   █░░░░░░░░░ 0.67/5    |      2      | [SC-F7](#after-sc-f7), [S-F3](#after-s-f3)                                                     |             |
| [Area 5 Accessibility and evidence](#after-area-5-accessibility-and-evidence) | ███░░░░░░░ 1.33–1.67/5 |      4      | [SC-F8](#after-sc-f8), [SC-F9](#after-sc-f9), [SC-F10](#after-sc-f10), [SC-F11](#after-sc-f11) |             |

The active score uses the 92-point rubric and is normalized to 100. Scores from earlier rubric versions are not comparable. Candidate checks remain visible with proposed weights outside the grade.

## After Area 1 Architecture and parts

**Active score:** ████████░░ 3.75/5 · **Open findings:** 1 · **Applicable active weight:** 20/20.

### After SC-F1

**Title:** Document each composable part

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-DOCS`, section 1.

**Reachable consumer:** A consumer assembles SelectPanel.Root with parts and needs to learn each part’s owner, props, ref behavior, and supported composition path without reverse-engineering examples.

**Observed gap:** The composition stories demonstrate layouts, but SelectPanel.docs.json still declares an empty subcomponents list and there is no per-part reference for required props/state/refs.

**Additive fix:** Add part-level API documentation and component metadata while keeping the configured SelectPanel docs and entry point unchanged.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.docs.json:248 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanel.composition.stories.tsx:14-15,96-121 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

## After Area 2 Root and part substitution

**Active score:** ███░░░░░░░ 1.67/5 · **Open findings:** 1 · **Applicable active weight:** 12/12.

### After SC-F2

**Title:** Add as support to every part

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-AS`, section 2.

**Reachable consumer:** A consumer needs a custom semantic element for a trigger, content region, list, or leaf part while retaining the part behavior.

**Observed gap:** Only Title exposes as; Root, Trigger, Overlay, Content, Header, Description, SearchInput, List, Item, Group, and the action/form parts do not expose a uniform as contract.

**Additive fix:** Add an additive as prop to each rendered part and preserve its required props, state, accessibility attributes, and final ref; resolve the DOM-less Root contract with maintainers rather than exempting it silently.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanelParts.tsx:37-58,115-155,214-263,520-529 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanel.tsx:1171-1197 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

## After Area 3 Prop merge behavior

**Active score:** ████░░░░░░ 2.20/5 · **Open findings:** 3 · **Applicable active weight:** 25/25.

`MERGE-CONFIG 5/5` + `MERGE-HANDLER 0/8` + `MERGE-CLASS 0/3` + `MERGE-STYLE-ATTR 4/4` + `MERGE-REF 0/3` + `MERGE-BEHAVIOR 2/2` = 11/25 = 2.20/5.

### After SC-F4

**Title:** Separate handler skipping from preventDefault

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-HANDLER`, section 3.

**Reachable consumer:** A consumer handles Trigger, Item, or action-button events and needs to prevent Primer behavior without cancelling the browser default, or skip later handlers without changing DOM cancellation.

**Observed gap:** Part handlers run consumer-first, then use event.defaultPrevented to decide whether Primer state behavior continues; the separate consumer skip contract is absent, and no render-element handler stage exists.

**Additive fix:** Add one shared part merge path with the specified render-element → part-consumer → Primer order and a distinct skip method; preserve DOM preventDefault and state cancel as separate signals.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanelParts.tsx:92-113,378-400 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanelActions.tsx:35-54 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

### After SC-F5

**Title:** Align configured and part class merging with their surface policies

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-CLASS`, section 3.

**Reachable consumer:** A consumer supplies className to the configured action list or to a composable SelectPanel part and expects the documented precedence for that surface.

**Observed gap:** The configured action list combines consumer className before its component class, while new parts put Primer classes before consumer classes. Both paths miss their respective accepted merge order.

**Additive fix:** Keep the existing configured behavior available while adding an opt-in or versioned migration to ADR-025 order; use consumer-first classes on new parts. Preserve current props and callback signatures.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanelParts.tsx:115-155,181,243,529 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanelMessage.tsx:72-80 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanel.tsx:1030 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

### After SC-F6

**Title:** Expose and merge refs consistently across parts

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-REF`, section 3.

**Reachable consumer:** A consumer needs the rendered DOM node from Root, Overlay, or Group for focus, measurement, or integration.

**Observed gap:** Root and Group are ordinary function components, and Overlay accepts an overlayProps ref rather than a part-level forwarded ref; several rendered parts therefore lack a uniform consumer ref contract.

**Additive fix:** Forward and merge every consumer/internal ref to its final rendered element; decide and document the Root ref behavior alongside its required render contract.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanelParts.tsx:37-45,520-525 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanelOverlay.tsx:16-23,61-65,118-119,208-220 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

## After Area 4 State and shared concepts

**Active score:** █░░░░░░░░░ 0.67/5 · **Open findings:** 2 · **Applicable active weight:** 15/15.

### After SC-F7

**Title:** Add the object-shaped state transition callback contract

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `STATE-CALLBACK`, section 4.

**Reachable consumer:** A consumer controls or observes open and selected state and needs the originating event, reason, and synchronous cancellation before an uncontrolled commit.

**Observed gap:** The new Root callbacks are positional; onOpenChange receives (open, reason), onSelectedChange receives only the array, and requestOpenChange commits before invoking onOpenChange.

**Additive fix:** Add the target object callback with value, reason, optional event, and synchronous cancel while preserving the existing configured SelectPanel callback signature and keeping callback naming explicit.

**Pinned citations:**

- `packages/react/src/SelectPanel/useSelectPanel.ts:16-34,103-109,112-124 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

### After S-F3

**Title:** Align the shared open-state contract

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `NAMES-DEFAULTS`, section 4.

**Reachable consumer:** Consumers use SelectPanel and ActionMenu together and need a predictable shared open-state name and default model.

**Observed gap:** SelectPanel requires open while ActionMenu documents open as optional with default false.

**Additive fix:** Align the new parts APIs on one open/defaultOpen model and shared default chosen by maintainers; preserve both legacy root contracts and their callbacks.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.tsx:77-86 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanel.tsx:132-140 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/AnchoredOverlay/AnchoredOverlay.tsx:67 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/ActionMenu/ActionMenu.docs.json:39-48 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

## After Area 5 Accessibility and evidence

**Active score:** ███░░░░░░░ 1.33–1.67/5 · **Open findings:** 4 · **Applicable active weight:** 15/20.

### After SC-F8

**Title:** Resolve failing composable interaction behaviors

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `ACCESS-01`, section 5.

**Reachable consumer:** A consumer opens an unanchored modal, removes the focused option, dismisses a nested supplemental dialog, or uses the opt-in configured adapter inside Dialog.

**Observed gap:** The focused SelectPanel directory run has 7 failures among 1688 tests; rerunning the matching cases with one worker reproduces all 7 across adapter fallback, focus repair, nested dismissal, and modal visibility.

**Additive fix:** Keep existing configured callbacks and props; correct the failing overlay, focus, and adapter behaviors, then rerun the focused suite until all cases pass.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.compatibility.test.tsx:65-75 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanel.composition.test.tsx:290-307,839-851 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanelOverlay.test.tsx:290-304 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

### After SC-F9

**Title:** Add stable selectors to each public part

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `SELECTOR-01`, section 5.

**Reachable consumer:** A consumer or component test needs to identify Trigger, Content, List, Item, or other named parts without depending on generated CSS classes.

**Observed gap:** The new public parts do not emit their own data-component identifiers; the only SelectPanel-prefixed selector in SelectPanelParts.tsx identifies a nested secondary-action affordance.

**Additive fix:** Add stable data-component identifiers to the root element of each part and cover them in the part tests and API docs.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanelParts.tsx:115-155,214-263,443,520-529 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanel.tsx:1171-1197 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

### After SC-F10

**Title:** Place SelectPanel component styles in the named cascade layer

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer combines component styles with utility-layer rules and expects Primer’s declared layer order to determine precedence.

**Observed gap:** The component, overlay, platform, and virtualized collection CSS Modules contain no @layer declaration.

**Additive fix:** Wrap runtime component styles in @layer primer.components.SelectPanel while retaining existing selectors and declarations.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanel.module.css:1-309 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanelOverlay.module.css:1-60 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/platform/PlatformSelectPanel.module.css:1-111 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/virtualization/VirtualizedSelectPanelCollection.module.css:1-25 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

### After SC-F11

**Title:** Add Storybook Playwright coverage for the composable API

**Status:** OPEN · **Classification / severity / owner:** `ADR GAP` · `FIX` · `INTERACTION-01`, section 5.

**Reachable consumer:** A consumer interacts with SelectPanel.Root and the new parts in a Storybook story and expects the keyboard, focus, and overlay behavior to remain stable.

**Observed gap:** The existing SelectPanel Playwright suite visits configured stories only; the new composition stories have Vitest coverage but no Playwright interaction scenario.

**Additive fix:** Add a focused Playwright test that visits a composable SelectPanel story and exercises the trigger, filtering, selection, dismissal, and focus-return path.

**Pinned citations:**

- `e2e/components/SelectPanel.test.ts:8-24,95-143 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`
- `packages/react/src/SelectPanel/SelectPanel.composition.stories.tsx:14-15,96-121 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

## After Candidate checks

Candidate checks are visible assessments outside the active 92-point rubric. Their proposed weights do not affect the active score, denominator, section caps, evidence coverage, or status.

| Candidate     | Verdict | Proposed weight | Finding                         |
| :------------ | :------ | :-------------: | :------------------------------ |
| `PART-RENDER` | GAP     | 8 (unweighted)  | [SC-F3](#after-candidate-sc-f3) |

### After Candidate SC-F3

**Title:** Support element and function render forms on every part

**Candidate status:** GAP (unweighted; proposed weight 8) · **Classification / severity / check:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer supplies a Button element or a state-aware render function to replace a part’s default element.

**Observed gap:** Trigger accepts only a function returning an element and receives no current state; all other parts lack render, including element form.

**Proposed path:** Implement both element and function render forms for every part, pass required behavior props/current state, and retain the existing Trigger function form as a compatible option.

**Pinned citations:**

- `packages/react/src/SelectPanel/SelectPanelParts.tsx:53-62,115-155,214-263,520-529 @ 1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`

## After Current-contract defects

No current-contract defects established.

## After Audit details

<details>
<summary>Active per-check evidence matrix</summary>
| Check | Verdict | Evidence class | Evidence at audited SHA / command result | Finding ID or reason |
| :---- | :------ | :------------- | :--------------------------------------- | :------------------- |
| `MOD-01` | PASS | AGENT JUDGMENT | The configured API and named parts serve distinct consumer needs; no additional spectrum layer is required without a consumer use case. | — |
| `CHILD-01` | PASS | SOURCE VERIFIED | The parts use children for consumer-owned layout/content, while item values and selection remain data/state props. SelectPanelParts.tsx:115-155,281-303. | — |
| `PART-01` | PASS | SOURCE VERIFIED | The component exports Root plus named trigger, overlay, content, list, item, form, and action parts on SelectPanel. SelectPanelParts.tsx:37-61; SelectPanel.tsx:1171-1197. | — |
| `PART-DOCS` | GAP | SOURCE VERIFIED | Composition examples exist, but the docs metadata lists no subcomponents or part reference; SC-F1 owns this gap. SelectPanel.docs.json:248; SelectPanel.composition.stories.tsx:14-15,96-121. | `SC-F1` |
| `STRUCTURE-01` | PASS | SOURCE VERIFIED | The implementation is in the PascalCase SelectPanel directory and the exported parts are attached as properties of SelectPanel. SelectPanel.tsx:1171-1197. | — |
| `CUSTOM-ELEMENT-01` | PASS | SOURCE VERIFIED | The component integrates the live-region custom element for client-side announcements through announceFromElement and AriaStatus. SelectPanel.tsx:21,581-585; SelectPanelMessage.tsx:6,123-127. | — |
| `API-01` | PASS | SOURCE VERIFIED | SelectPanel is a configured composite with no single host element. Its public anchorRef targets the trigger; renderAnchor receives the trigger ref and DOM props, and the default renderer spreads them onto Button. ADR-003 limits as to clear polymorphism needs, which this configurable renderAnchor already covers. ADR-022-styled-react keeps legacy sx compatibility outside @primer/react. SelectPanel/SelectPanel.tsx:142-150,170-176,596,953; AnchoredOverlay/AnchoredOverlay.tsx:30-33,59-61; packages/styled-react/src/index.tsx:1-95. | — |
| `PART-AS` | GAP | SOURCE VERIFIED | Title alone exposes as; the other parts render fixed targets and Root has no host. SC-F2 owns the missing all-part contract. SelectPanelParts.tsx:37-58,115-155,214-263,520-529. | `SC-F2` |
| `MERGE-CONFIG` | PASS | SOURCE VERIFIED | The whole component keeps the configured API alongside its new parts; configured and new-part merge boundaries are evaluated separately. SelectPanel.tsx:1030; SelectPanelParts.tsx:37-61. | — |
| `MERGE-HANDLER` | GAP | SOURCE VERIFIED | New parts run consumer handlers before Primer behavior and use defaultPrevented as the skip signal; the pinned gist requires a separate skip contract. SelectPanelParts.tsx:92-113,378-400; SelectPanelActions.tsx:35-54. | `SC-F4` |
| `MERGE-CLASS` | GAP | SOURCE VERIFIED | Configured SelectPanel merges consumer className before its component class; new parts also merge Primer classes before consumer classes. SelectPanel.tsx:1030; SelectPanelParts.tsx:115-155,181,243,529. | `SC-F5` |
| `MERGE-STYLE-ATTR` | PASS | SOURCE VERIFIED | Ordinary DOM props and styles flow through prop spreads while role, ids, disabled, and selection state are part-owned. SelectPanelParts.tsx:115-155,228-260,340-400. | — |
| `MERGE-REF` | GAP | SOURCE VERIFIED | Root and Group do not forward refs, and Overlay has no top-level forwarded-ref contract. SelectPanelParts.tsx:37-45,520-525; SelectPanelOverlay.tsx:61-65. | `SC-F6` |
| `MERGE-BEHAVIOR` | PASS | SOURCE VERIFIED | Part-owned disabled, selection, role, and ARIA state are computed from SelectPanel state and written after consumer props. SelectPanelParts.tsx:340-400. | — |
| `STATE-CALLBACK` | GAP | SOURCE VERIFIED | New Root callbacks are positional and requestOpenChange commits before calling onOpenChange; SC-F7 owns the missing value/reason/event/cancel contract. useSelectPanel.ts:16-34,103-109. | `SC-F7` |
| `NAMES-DEFAULTS` | GAP | SOURCE VERIFIED | SelectPanel requires open while ActionMenu documents open default false; shared state name/default shape is inconsistent. SelectPanel.tsx:77-86,132-140; ActionMenu.docs.json:39-48 | `S-F3` |
| `STATE-OWNER` | PASS | SOURCE VERIFIED | Open, selected, and filter state each use useControllableState with one internal owner and explicit controlled/default inputs. useSelectPanel.ts:48-80. | — |
| `ACCESS-01` | GAP | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/SelectPanel — 19 files, 1681 passed and 7 failed; the same seven failures reproduced in the one-worker focused rerun. SC-F8 owns the observed overlay/focus/adapter failures. | `SC-F8` |
| `LIVE-01` | PASS | SOURCE VERIFIED | Loading and message parts use shared AriaStatus/live-region announcement behavior. SelectPanelMessage.tsx:6,89-103,118-127. | — |
| `WARN-01` | N/A | SOURCE VERIFIED | No component-owned development warning is emitted by the composable SelectPanel surface. | No component-owned development warning exists on this surface. |
| `SELECTOR-01` | GAP | SOURCE VERIFIED | Public parts lack stable data-component identities; only the nested secondary action is tagged. SC-F9 owns this gap. SelectPanelParts.tsx:115-155,214-263,443,520-529. | `SC-F9` |
| `STYLE-01` | GAP | SOURCE VERIFIED | Runtime CSS Modules have no @layer declaration; SC-F10 owns this gap. SelectPanel.module.css:1-309; SelectPanelOverlay.module.css:1-60; platform/PlatformSelectPanel.module.css:1-111; virtualization/VirtualizedSelectPanelCollection.module.css:1-25. | `SC-F10` |
| `RESP-01` | PASS | SOURCE VERIFIED | Overlay responsive variants use useResponsiveValue rather than JS-controlled viewport state. SelectPanelOverlay.tsx:6,122-128. | — |
| `TYPE-01` | NOT MEASURED | SOURCE VERIFIED | npm run type-check --workspace @primer/react failed in both snapshots with TypeScript errors in script/components-json/build.ts and src/\_\_tests\_\_/exports.test.ts, including duplicate Babel type definitions. SelectPanel-specific type execution is unverified. | The package type-check command failed in both detached worktrees on unrelated existing files because the shared dependency tree resolves duplicate @babel/types copies and incompatible parser declarations; no SelectPanel-isolated type-check could be established. |
| `EXPORT-01` | PASS | SOURCE VERIFIED | The public SelectPanel entry exports the parent API and named part types; no internal module path is re-exported, and @primer/styled-react does not re-export SelectPanel. SelectPanel/index.ts:1-13; packages/styled-react/src/index.tsx:1-95. | — |
| `TEST-01` | COVERED | EXECUTION VERIFIED | The focused unit run and one-worker rerun are execution evidence for the ACCESS-01 owner finding SC-F8; the command did not pass overall, so it is not a PASS. | `SC-F8` |
| `SNAPSHOT-01` | PASS | SOURCE VERIFIED | No component render-tree toMatchSnapshot/toMatchInlineSnapshot calls occur in SelectPanel React tests. | — |
| `INTERACTION-01` | GAP | SOURCE VERIFIED | The existing Playwright file lists configured stories only; composition stories are not visited by an interaction test. SC-F11 owns this gap. e2e/components/SelectPanel.test.ts:8-24,95-143; SelectPanel.composition.stories.tsx:14-15,96-121. | `SC-F11` |
| `MIG-01` | N/A | SOURCE VERIFIED | The configured merge recommendation preserves current behavior through an opt-in or parallel path. No default switch is selected; repository package version is recorded separately, and publication must be verified before any later default change. | No release-dependent default change is selected. The configured merge fix remains opt-in or parallel to preserve current behavior, and any later default switch requires published-surface verification. |
</details>
<details>
<summary>Unweighted candidate inventory</summary>
| Candidate | Verdict | Proposed weight | Evidence class | Evidence / reason | Candidate finding |
| :-------- | :------ | :-------------: | :------------- | :---------------- | :---------------- |
| `PART-RENDER` | GAP | 8 (unweighted) | SOURCE VERIFIED | Trigger has a function-only render prop; other parts have no render prop or part state renderer. SelectPanelParts.tsx:53-62,115-155,214-263. | `SC-F3` |
</details>
<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | SelectPanel (after #7287, whole component) / Complete SelectPanel component: configured props/data API plus SelectPanel.Root and named parts.                  |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not assessed; all proposed fixes add new surfaces and none changes a released API.                                                                             |
| Mode                       | whole component; surface-scoped record                                                                                                                         |
| Audited source SHA         | `1cfa586ebda34edb33c01b9ffb6932b3bc7bd53b`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.6.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 41.38–42.53 / 100 · F (0 open BLOCKs)                                                                                                                          |
| Candidate checks           | 1 listed; 1 gap(s); proposed weights excluded from the active 92-point rubric                                                                                  |
| Human review               | PENDING HUMAN                                                                                                                                                  |
| Surface                    | Complete SelectPanel component: configured props/data API plus SelectPanel.Root and named parts.                                                               |

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
