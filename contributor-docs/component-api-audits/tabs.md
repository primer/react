# Tabs component API scorecard

**Rubric:** Component API compliance rubric 0.5.0 · **Component:** Tabs

## Report card

**Render scored:** 38.24–45.59 / 100 · F · **Render deferred:** 43.33–51.67 / 100 · F · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Scored findings:** 8 · **Deferred checks/findings:** 1/1 · **Applicable weight:** 68/100 scored; 60/100 deferred · **Evidence coverage:** 63/68 scored

| Area                                                                    |         Render scored         |        Render deferred        | Scored gaps | Deferred-only gaps | Finding links                                          |
| :---------------------------------------------------------------------- | :---------------------------: | :---------------------------: | :---------: | :----------------: | :----------------------------------------------------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         |      `███████░░░ 3.42/5`      |      `███████░░░ 3.42/5`      |      2      |         0          | [T-F1](#t-f1), [T-F4](#t-f4)                           |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) |      `██░░░░░░░░ 1.00/5`      |      `███░░░░░░░ 1.67/5`      |      2      |         1          | [T-F2](#t-f2), [T-F7](#t-f7), [T-F7 (deferred)](#t-f7) |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               | `██████████ 5.00/5` · LIMITED | `██████████ 5.00/5` · LIMITED |      0      |         0          | No open gaps                                           |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   |   `███░░░░░░░ 0.67–2.33/5`    |   `███░░░░░░░ 0.67–2.33/5`    |      1      |         0          | [T-F3](#t-f3)                                          |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) |      `████░░░░░░ 1.82/5`      |      `████░░░░░░ 1.82/5`      |      2      |         0          | [T-F5](#t-f5), [T-F6](#t-f6)                           |

Rubric 0.5.0 scores a missing render API once at 8 points. Existing merge behavior is scored independently. The deferred column removes only `PART-RENDER` and its own finding. Scores from rubric 0.4.1 are not comparable.

## Area 1 Architecture and parts

**Score:** render scored `███████░░░ 3.42/5` · render deferred `███████░░░ 3.42/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 19/20.

Covered rows `ACCESS-01` belong to [T-F1](#t-f1) and remain scored at zero.

### T-F1

**Title:** Documented hook composition spreads the wrong object

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-DOCS`, section 1; covered checks: `ACCESS-01`.

**Reachable consumer:** A consumer follows the README and writes the shown Tab/TabList/TabPanel wrappers; each hook result is spread directly, leaving the nested role/ARIA/event props unapplied.

**Observed gap:** The public README tells consumers to spread hook results, but useTab/useTabList/useTabPanel return named nested prop bags. The example fails to realize the documented accessible parts contract.

**Additive fix:** Correct the example to destructure tabProps, tabListProps, and tabPanelProps (or change the documented API shape additively); add a small docs typecheck/example test. Preserve current hook names and signatures.

**Pinned citations:**

- `packages/react/src/experimental/Tabs/README.mdx:18-39 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/types.ts:115-145 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTab.ts:45-57 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabList.ts:67-75 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabPanel.ts:11-19 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### T-F4

**Title:** Tabs is nested below the required source component directory level

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `STRUCTURE-01`, section 1.

**Reachable consumer:** A maintainer navigates the component source or tooling expects one PascalCase component directory directly under packages/react/src.

**Observed gap:** Tabs lives at packages/react/src/experimental/Tabs rather than directly at packages/react/src/Tabs; ADR-013's component-directory placement is unmet.

**Additive fix:** If retaining this experimental API, align its source ownership with the required component directory convention without changing the existing @primer/react/experimental entry point.

**Pinned citations:**

- `packages/react/src/experimental/Tabs/Tabs.tsx:17 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/index.ts:116-117 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 2 Root and part substitution

**Score:** render scored `██░░░░░░░░ 1.00/5` · render deferred `███░░░░░░░ 1.67/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 20/20.

### T-F2

**Title:** Public parts lack the uniform substitution and merge contract

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-AS`, section 2.

**Reachable consumer:** A consumer builds a custom Tab around useTab or uses useTabList/useTabPanel to compose a different semantic element; the hooks provide fixed prop bags and no supported as or render API.

**Observed gap:** The public parts do not support target-required as substitution, and therefore do not define the complete part-level handler/class/style/attribute/ref/behavior ownership rules. Convenience component implementations are not part of the public experimental barrel.

**Additive fix:** Add a composable part API with as and the agreed render contract while preserving the existing hooks and their prop-getter signatures; define and test target merge order, consumer-first classes, consumer-winning ordinary attrs/styles, final-element refs, and part-owned behavior props.

**Pinned citations:**

- `packages/react/src/experimental/Tabs/index.ts:1-5 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/Tabs.tsx:10-15,113-114 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTab.ts:9-10,45-57 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabList.ts:6-10,67-75 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabPanel.ts:5-6,11-19 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/types.ts:110-145 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### T-F7

**Title:** Add render forms to public Tabs parts

**Status by mode:** Render scored — OPEN; render deferred — excluded from the score. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer builds a custom Tab around useTab or uses useTabList/useTabPanel to compose a different semantic element; the hooks provide fixed prop bags and no supported as or render API.

**Observed gap:** The public prop-getter hooks do not expose element or function render forms. Tabs/index.ts:1-5; useTab.ts:9-10; useTabList.ts:6-7; useTabPanel.ts:5-6.

**Additive fix:** Add render-capable part APIs while retaining the existing hook exports and their return shapes.

**Pinned citations:**

- `packages/react/src/experimental/Tabs/index.ts:1-5 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/Tabs.tsx:10-15,113-114 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTab.ts:9-10,45-57 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabList.ts:6-10,67-75 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabPanel.ts:5-6,11-19 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/types.ts:110-145 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 3 Prop merge behavior

**Score:** render scored `██████████ 5.00/5` · render deferred `██████████ 5.00/5` · **Open findings:** 0 scored; 0 deferred · **Applicable weight:** 3/25 · LIMITED.

No open gaps.

## Area 4 State and shared concepts

**Score:** render scored `███░░░░░░░ 0.67–2.33/5` · render deferred `███░░░░░░░ 0.67–2.33/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 15/15.

### T-F3

**Title:** Selection transitions have no additive cancellable callback

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `STATE-CALLBACK`, section 4.

**Reachable consumer:** A consumer uses controlled or uncontrolled Tabs and needs the reason/event for a selection transition or needs to synchronously cancel an uncontrolled commit.

**Observed gap:** onValueChange only receives {value}; it cannot report reason/event or cancel the pending internal state update.

**Additive fix:** Keep onValueChange unchanged and add a separately named transition callback with value, reason, event when present, and synchronous cancel(); decide the new callback name during rollout.

**Pinned citations:**

- `packages/react/src/experimental/Tabs/types.ts:19-22,40-43 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/Tabs.tsx:39-46 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 5 Accessibility and evidence

**Score:** render scored `████░░░░░░ 1.82/5` · render deferred `████░░░░░░ 1.82/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 11/20.

### T-F5

**Title:** Public part props omit stable component identity

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `SELECTOR-01`, section 5.

**Reachable consumer:** A consumer or test needs to select a Tabs tab/panel by a stable component selector independent of its changing selected state.

**Observed gap:** The hooks supply roles, IDs, and data-selected, but no stable data-component identity distinct from state.

**Additive fix:** Add stable data-component identity to the public part props and document/test it separately from data-selected; preserve the existing ARIA and state attributes.

**Pinned citations:**

- `packages/react/src/experimental/Tabs/useTab.ts:45-56 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabList.ts:67-75 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabPanel.ts:11-18 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### T-F6

**Title:** Tabs lacks Storybook-backed Playwright interaction evidence

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `INTERACTION-01`, section 5.

**Reachable consumer:** A consumer or maintainer relies on keyboard/pointer interactions exposed by the experimental Tabs Storybook story.

**Observed gap:** Tabs has focused browser-mode unit interactions, but no repository Playwright test that visits the Storybook story and interacts with Tabs as required by ADR-017.

**Additive fix:** Add a focused Playwright test that opens the Tabs Storybook story and exercises keyboard selection/focus plus one pointer transition; keep the existing unit suite.

**Pinned citations:**

- `packages/react/src/experimental/Tabs/Tabs.test.tsx:1-7,268-289 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/Tabs.stories.tsx:1-23 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### T-C1

**Title:** README hook example does not apply the public hook prop bags

**Status / classification / severity / owner:** OPEN · `DEFECT` · `FIX` · `ACCESS-01`.

**Reachable consumer:** A consumer copies the documented MyTabs/Tab/TabList/TabPanel wrappers from the public README.

**Observed defect:** The wrapper code spreads {tabProps}, {tabListProps}, and {tabPanelProps} objects directly onto elements instead of spreading their nested contents, so the example does not apply role/ARIA/keyboard behavior promised by the docs.

**Compatible fix:** Correct the example to destructure each named prop bag and add a docs example typecheck or smoke test; no public API signature change is needed.

**Pinned citations:**

- `packages/react/src/experimental/Tabs/README.mdx:26-39 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTab.ts:45-57 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabList.ts:67-75 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/experimental/Tabs/useTabPanel.ts:11-19 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Current-contract defects

See the finding under its owning area above.

## Audit details

<details>
<summary>Per-check evidence matrix</summary>

Scored and deferred verdicts are shown side by side. Deferred mode changes only `PART-RENDER`; `COVERED` rows remain in the denominator at zero.

| Check               | Render scored | Render deferred | Evidence class     | Evidence at audited SHA / command result                                                                                                                                                                                                                                                                                                                                                      | Finding ID or reason                                                                                                                                |
| :------------------ | :------------ | :-------------- | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MOD-01`            | PASS          | PASS            | AGENT JUDGMENT     | Public surface uses a state/context provider plus focused part hooks; documented consumers can build custom parts (including ActionList composition), with no redundant config/presentational layer required. README.mdx:10-20,73-75 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                              | —                                                                                                                                                   |
| `CHILD-01`          | PASS          | PASS            | SOURCE VERIFIED    | Tabs accepts children for consumer-owned tablist/panel composition; tab and panel identity is expressed with value props. Tabs.tsx:17-18,57; types.ts:61,81-93 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                    | —                                                                                                                                                   |
| `PART-01`           | PASS          | PASS            | SOURCE VERIFIED    | The public experimental barrel exports Tabs and the three part hooks useTab/useTabList/useTabPanel; docs show consumers composing custom elements around these hooks. Tabs/index.ts:1-5; experimental/index.ts:117; README.mdx:18-39 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                              | —                                                                                                                                                   |
| `PART-DOCS`         | GAP           | GAP             | SOURCE VERIFIED    | The README's public-hook example spreads each hook result object directly, but implementations return nested tabProps/tabListProps/tabPanelProps bags. That published composition path does not apply the role/ARIA/keyboard props; owned by T-F1. README.mdx:18-39; types.ts:115-145; useTab.ts:45-57; useTabList.ts:67-75; useTabPanel.ts:11-19 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f. | `T-F1`                                                                                                                                              |
| `STRUCTURE-01`      | GAP           | GAP             | SOURCE VERIFIED    | Tabs is implemented under src/experimental/Tabs rather than a PascalCase component directory directly under src as required by ADR-013. The experimental barrel re-exports this nested component. Tabs.tsx:17; experimental/index.ts:117 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                          | `T-F4`                                                                                                                                              |
| `CUSTOM-ELEMENT-01` | N/A           | N/A             | SOURCE VERIFIED    | Tabs and its hooks use React context and native HTML elements; no custom element is involved.                                                                                                                                                                                                                                                                                                 | ADR-009 applies only when a custom element is involved; this component surface does not render or wrap one.                                         |
| `API-01`            | PASS          | PASS            | SOURCE VERIFIED    | Tabs is a non-rendering provider, not a DOM root: its public props are children, selected value/default, id, activationMode, and callback. It has no root DOM props/as/ref contract to violate; public parts are supplied as hooks. types.ts:4-61; Tabs.tsx:17-18,57 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                              | —                                                                                                                                                   |
| `PART-AS`           | GAP           | GAP             | SOURCE VERIFIED    | The public parts are prop-getter hooks with fixed output shapes and no as substitution option. Convenience TabList/Tab/TabPanel definitions in Tabs.tsx are not re-exported by the public Tabs/index.ts barrel. Tabs/index.ts:1-5; useTab.ts:9-10; useTabList.ts:6-7; useTabPanel.ts:5-6; types.ts:110-145; Tabs.tsx:113-114 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                      | `T-F2`                                                                                                                                              |
| `PART-RENDER`       | GAP           | DEFERRED        | SOURCE VERIFIED    | The public prop-getter hooks do not expose element or function render forms. Tabs/index.ts:1-5; useTab.ts:9-10; useTabList.ts:6-7; useTabPanel.ts:5-6.                                                                                                                                                                                                                                        | Render-deferred mode excludes only this finding; target gap remains visible.                                                                        |
| `MERGE-CONFIG`      | N/A           | N/A             | SOURCE VERIFIED    | The public Tabs root is a provider and has no configured DOM merge boundary; the hook outputs are scored under the existing hook contract.                                                                                                                                                                                                                                                    | The public Tabs root is a context provider with no rendered DOM props to merge.                                                                     |
| `MERGE-HANDLER`     | N/A           | N/A             | SOURCE VERIFIED    | Public hooks return Primer handlers and accept no consumer handler input to compose; consumer DOM event handlers are outside the current hook API.                                                                                                                                                                                                                                            | The public hooks accept no consumer handler input to merge with Primer handlers.                                                                    |
| `MERGE-CLASS`       | N/A           | N/A             | SOURCE VERIFIED    | Public hooks return no className or rendered component on which to merge classes.                                                                                                                                                                                                                                                                                                             | The public hook API has no rendered element or className prop.                                                                                      |
| `MERGE-STYLE-ATTR`  | N/A           | N/A             | SOURCE VERIFIED    | Public hooks return no DOM style or ordinary-attribute merge surface.                                                                                                                                                                                                                                                                                                                         | The public hook API has no rendered element or DOM attribute/style props.                                                                           |
| `MERGE-REF`         | PASS          | PASS            | SOURCE VERIFIED    | useTabList merges the external ref with its internal tablist ref. useTab and useTabPanel expose no separate existing refs. useTabList.ts:6-10,67-75.                                                                                                                                                                                                                                          | —                                                                                                                                                   |
| `MERGE-BEHAVIOR`    | N/A           | N/A             | SOURCE VERIFIED    | Public hooks expose required ARIA/keyboard props for consumer attachment and have no renderer that can merge render-element behavior props.                                                                                                                                                                                                                                                   | The hook API has no render-element path; behavior-prop ownership for that path is assessed under PART-RENDER.                                       |
| `STATE-CALLBACK`    | GAP           | GAP             | SOURCE VERIFIED    | The existing onValueChange callback only carries {value}; it omits reason, originating event, and synchronous cancel. Preserve this callback and add a separate transition callback. types.ts:19-22,40-43; Tabs.tsx:39-46 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                         | `T-F3`                                                                                                                                              |
| `NAMES-DEFAULTS`    | UNRESOLVED    | UNRESOLVED      | PENDING HUMAN      | The API has no size prop. It uses value/defaultValue/onValueChange for one selected tab, while audited SelectPanel uses selected/onSelectedChange for item or item-array selection. Whether these are the same concept requiring common naming is a Layer 3 judgment; do not assume alignment or mismatch.                                                                                    | Human review must decide whether single tab identity selection and SelectPanel item selection are a shared concept before scoring naming alignment. |
| `STATE-OWNER`       | PASS          | PASS            | BEHAVIOR VERIFIED  | Controlled value and uncontrolled defaultValue are mutually exclusive in the public type union; tests verify controlled selection, uncontrolled default, and transition callback behavior. types.ts:7-43; Tabs.test.tsx:23-67,69-88 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f. Focused test command passed.                                                                                  | —                                                                                                                                                   |
| `ACCESS-01`         | COVERED       | COVERED         | SOURCE VERIFIED    | The documented public-hook composition spreads wrapper result objects rather than nested prop bags, so its tab roles/ARIA and keyboard handlers do not reach the consumer elements; owned by the inaccurate part documentation finding T-F1. README.mdx:26-39; useTab.ts:45-57; useTabList.ts:67-75; useTabPanel.ts:11-19 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                         | `T-F1`                                                                                                                                              |
| `LIVE-01`           | N/A           | N/A             | SOURCE VERIFIED    | Tabs exposes selected/focus semantics through ARIA state and hidden panels; it does not announce changing status or alert content. useTab.ts:45-56; useTabPanel.ts:11-18 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                          | No changing status/alert announcement is owned by Tabs, so the shared live-region requirement does not apply.                                       |
| `WARN-01`           | N/A           | N/A             | SOURCE VERIFIED    | Tabs source has no component-owned development-warning path; useTabs throws on missing provider rather than emitting a development warning.                                                                                                                                                                                                                                                   | The component emits no development warning to constrain under ADR-012.                                                                              |
| `SELECTOR-01`       | GAP           | GAP             | SOURCE VERIFIED    | Public part hooks emit role/id/ARIA attributes and a data-selected state marker, but no stable data-component identity. useTab.ts:45-56; useTabPanel.ts:11-18; useTabList.ts:67-75 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                | `T-F5`                                                                                                                                              |
| `STYLE-01`          | N/A           | N/A             | SOURCE VERIFIED    | The component explicitly has no styling or visual representation and has no authored Tabs CSS module. README.mdx:10-12 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                            | Tabs owns no CSS or styling contract; consumers choose their own elements and styles.                                                               |
| `RESP-01`           | N/A           | N/A             | SOURCE VERIFIED    | Tabs props contain no responsive values or viewport-dependent behavior. types.ts:46-61 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                            | No component-owned responsive-value API exists.                                                                                                     |
| `TYPE-01`           | PASS          | PASS            | EXECUTION VERIFIED | npm run type-check --workspace @primer/react — passed (tsc --noEmit). Public Tabs types and barrel declarations are included in the package check.                                                                                                                                                                                                                                            | —                                                                                                                                                   |
| `EXPORT-01`         | PASS          | PASS            | SOURCE VERIFIED    | The experimental barrel exports the Tabs provider, three hooks, and public prop types only. It does not expose TabsContext/useTabs or the convenience TabList/Tab/TabPanel exports from Tabs.tsx. Tabs/index.ts:1-5; Tabs.tsx:113-114; experimental/index.ts:117 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f. No component-specific styled-react compatibility export applies.                 | —                                                                                                                                                   |
| `TEST-01`           | PASS          | PASS            | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/experimental/Tabs/Tabs.test.tsx — 1 file, 35 tests passed.                                                                                                                                                                                                                                                                        | —                                                                                                                                                   |
| `SNAPSHOT-01`       | PASS          | PASS            | SOURCE VERIFIED    | Tabs.test.tsx contains no catch-all render-tree snapshot assertions; test coverage uses focused role/state/interaction assertions. Search at audited source found no toMatchSnapshot/toMatchInlineSnapshot in the Tabs directory.                                                                                                                                                             | —                                                                                                                                                   |
| `INTERACTION-01`    | GAP           | GAP             | SOURCE VERIFIED    | The focused interaction suite uses Vitest Browser, while the repository has no Tabs Playwright test that visits its Storybook story and interacts with it; this fails the ADR-017 evidence policy. Tabs.test.tsx:1-7,268-289; Tabs.stories.tsx:1-23 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                               | `T-F6`                                                                                                                                              |
| `MIG-01`            | N/A           | N/A             | SOURCE VERIFIED    | All proposed changes are additive (document correction, optional part capabilities, selector, and an additional callback); no existing prop or callback signature needs replacement. Repository package version is recorded separately as 38.46.0.                                                                                                                                            | No recommendation changes an existing API on a confirmed published surface; additive changes do not trigger migration requirements.                 |

</details>

<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | Tabs / see component contract and source citations                                                                                                             |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not recorded                                                                                                                                                   |
| Mode                       | Whole component                                                                                                                                                |
| Audited source SHA         | `d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.5.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 38.24–45.59 / 100 · F (no open BLOCKs)                                                                                                                         |
| Render scoring modes       | Scored 38.24–45.59 / 100 · F; deferred 43.33–51.67 / 100 · F                                                                                                   |
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
