# ActionList component API scorecard

**Rubric:** Component API compliance rubric 0.5.0 · **Component:** ActionList

## Report card

**Render scored:** 49.46–50.54 / 100 · F · **Render deferred:** 54.12–55.29 / 100 · F · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Scored findings:** 8 · **Deferred checks/findings:** 1/1 · **Applicable weight:** 93/100 scored; 85/100 deferred · **Evidence coverage:** 92/93 scored

| Area                                                                    |      Render scored       |     Render deferred      | Scored gaps | Deferred-only gaps | Finding links                                          |
| :---------------------------------------------------------------------- | :----------------------: | :----------------------: | :---------: | :----------------: | :----------------------------------------------------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         |   `███████░░░ 3.68/5`    |   `███████░░░ 3.68/5`    |      1      |         0          | [A-F1](#a-f1)                                          |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) |   `██░░░░░░░░ 1.00/5`    |   `███░░░░░░░ 1.67/5`    |      2      |         1          | [A-F2](#a-f2), [A-F3](#a-f3), [A-F3 (deferred)](#a-f3) |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               |   `█████░░░░░ 2.40/5`    |   `█████░░░░░ 2.40/5`    |      2      |         0          | [A-F4](#a-f4), [A-F8](#a-f8)                           |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   |   `█████░░░░░ 2.33/5`    |   `█████░░░░░ 2.33/5`    |      1      |         0          | [A-F5](#a-f5)                                          |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) | `███████░░░ 3.21–3.57/5` | `███████░░░ 3.21–3.57/5` |      2      |         0          | [A-F6](#a-f6), [A-F7](#a-f7)                           |

Rubric 0.5.0 scores a missing render API once at 8 points. Existing merge behavior is scored independently. The deferred column removes only `PART-RENDER` and its own finding. Scores from rubric 0.4.1 are not comparable.

## Area 1 Architecture and parts

**Score:** render scored `███████░░░ 3.68/5` · render deferred `███████░░░ 3.68/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 19/20.

### A-F1

**Title:** Document every exported ActionList part

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-DOCS`, section 1.

**Reachable consumer:** A consumer uses ActionList.Divider between groups or composes ActionList.GroupHeading.TrailingAction to add an action to a group heading, relying on the package documentation to discover its required props and composition location.

**Observed gap:** The parent API exports Divider and nests TrailingAction under GroupHeading, while ActionList.docs.json has no Divider or GroupHeading.TrailingAction entry. Those public parts therefore lack a complete documented owner/required-props/composition contract.

**Additive fix:** Extend the ActionList documentation metadata and docs examples to include every exported part, including Divider and GroupHeading.TrailingAction, with required props, default element/ref behavior, and supported composition path; do not remove or rename existing exports.

**Pinned citations:**

- `packages/react/src/ActionList/index.ts:39-61 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Group.tsx:247-251 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/ActionList.docs.json:47-50 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/ActionList.docs.json:326-369 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 2 Root and part substitution

**Score:** render scored `██░░░░░░░░ 1.00/5` · render deferred `███░░░░░░░ 1.67/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 20/20.

### A-F2

**Title:** Make polymorphism available across the parts surface

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-AS`, section 2.

**Reachable consumer:** A consumer needs a semantic custom element or router link for a list part such as Item, Group, Divider, Description, or a Visual; current typed APIs either lack as or explicitly state that Item as has no effect.

**Observed gap:** The accepted target requires as on every part, but only selected parts provide useful polymorphism. ActionList.Item’s as is deprecated/no-op, while Group, Divider, Description, and Visuals expose fixed element props.

**Additive fix:** Add appropriately typed as support to each part while preserving current default markup, behavior, refs, and existing props. Resolve and document target-unspecified part defaults during human rollout; do not assume one element fits every part.

**Pinned citations:**

- `packages/react/src/ActionList/shared.ts:70-73 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Group.tsx:48-68 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Divider.tsx:6-14 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Description.tsx:8-25 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Visuals.tsx:10-17 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/LinkItem.tsx:31-33 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### A-F3

**Title:** Add render forms to ActionList parts

**Status by mode:** Render scored — OPEN; render deferred — excluded from the score. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer needs to render an ActionList part through a supplied element or render function while forwarding its required props, current state, and ref to a custom host.

**Observed gap:** No public part accepts the target element/function render contract; ActionList.Item renderItem is a different legacy callback. ActionList/shared.ts:68-73; ActionList/index.ts:27-61.

**Additive fix:** Add element and function render forms to the parts while retaining existing part props, callback signatures, and renderItem behavior.

**Pinned citations:**

- `packages/react/src/ActionList/index.ts:27-61 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/shared.ts:68-73 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 3 Prop merge behavior

**Score:** render scored `█████░░░░░ 2.40/5` · render deferred `█████░░░░░ 2.40/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 25/25.

Covered rows `MERGE-BEHAVIOR` belong to [A-F4](#a-f4) and remain scored at zero.

### A-F4

**Title:** Preserve ActionList item handlers and behavior props

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-HANDLER`, section 3; covered checks: `MERGE-BEHAVIOR`.

**Reachable consumer:** A consumer supplies onClick to an ActionList.Item in a selectable/list context and expects the documented onSelect selection path to continue; a consumer also adds a Group className to customize its appearance.

**Observed gap:** Consumer props spread after menuItemProps can replace the generated onClick handler and behavior attributes, including role, tabIndex, and selection ARIA state.

**Additive fix:** Keep consumer DOM attributes available while composing consumer handlers and applying ActionList-owned behavior props after the consumer spread.

**Pinned citations:**

- `packages/react/src/ActionList/Item.tsx:247-260 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Item.tsx:279-290 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Group.tsx:99-104 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### A-F8

**Title:** Order ActionList.Group classes component-first

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-CLASS`, section 3.

**Reachable consumer:** A consumer needs a semantic custom element or router link for a list part such as Item, Group, Divider, Description, or a Visual; current typed APIs either lack as or explicitly state that Item as has no effect.

**Observed gap:** ActionList.Group combines consumer className before the component class, contrary to ADR-025.

**Additive fix:** Keep existing Group props and child structure; use component-first class ordering on the configured subcomponent.

**Pinned citations:**

- `packages/react/src/ActionList/Group.tsx:99-104 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 4 State and shared concepts

**Score:** render scored `█████░░░░░ 2.33/5` · render deferred `█████░░░░░ 2.33/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 15/15.

### A-F5

**Title:** Expose an additive selection transition callback

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `STATE-CALLBACK`, section 4.

**Reachable consumer:** A consumer handles pointer or keyboard activation of a selectable ActionList.Item and updates its selected prop based on the selection transition.

**Observed gap:** The only public selection callback is onSelect(event); it does not report the proposed selected value, reason, or synchronous cancel contract required by the target transition callback.

**Additive fix:** Keep onSelect unchanged and add a separately named object callback carrying the proposed selected value, reason, originating event when present, and synchronous cancel(). Treat the callback name/coexistence shape as a pending maintainer decision.

**Pinned citations:**

- `packages/react/src/ActionList/shared.ts:17-24 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Item.tsx:114-125 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Item.tsx:147-160 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 5 Accessibility and evidence

**Score:** render scored `███████░░░ 3.21–3.57/5` · render deferred `███████░░░ 3.21–3.57/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 14/20.

### A-F6

**Title:** Align the GroupHeading stable selector with its API name

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `SELECTOR-01`, section 5.

**Reachable consumer:** A consumer or test selects the public ActionList.GroupHeading part using its documented stable data-component identifier.

**Observed gap:** GroupHeading emits data-component="GroupHeadingWrap" rather than the public API name ActionList.GroupHeading; the current selector test asserts the legacy mismatch.

**Additive fix:** Add data-component="ActionList.GroupHeading" at the public part root and preserve GroupHeadingWrap as a compatibility alias/selector during migration; update tests and docs to identify the public selector.

**Pinned citations:**

- `packages/react/src/ActionList/Group.tsx:199-210 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Group.tsx:216-229 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/ActionList.test.tsx:333-344 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### A-F7

**Title:** Place ActionList CSS Modules in the component layer

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer applies an unlayered override to ActionList and expects the component’s authored styles to participate in the documented Primer component cascade layer.

**Observed gap:** ActionList.module.css, Group.module.css, and Heading.module.css contain authored CSS rules without @layer primer.components.ActionList.

**Additive fix:** Wrap each ActionList-owned CSS Module rule set in @layer primer.components.ActionList while retaining the existing class names and declarations.

**Pinned citations:**

- `packages/react/src/ActionList/ActionList.module.css:1-8 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Group.module.css:1-8 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/ActionList/Heading.module.css:1-8 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Current-contract defects

No current-contract defects established.

## Audit details

<details>
<summary>Per-check evidence matrix</summary>

Scored and deferred verdicts are shown side by side. Deferred mode changes only `PART-RENDER`; `COVERED` rows remain in the denominator at zero.

| Check               | Render scored | Render deferred | Evidence class     | Evidence at audited SHA / command result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Finding ID or reason                                                                                                                                                       |
| :------------------ | :------------ | :-------------- | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MOD-01`            | PASS          | PASS            | AGENT JUDGMENT     | ActionList is a styled compound collection with a root and named composition parts; the existing consumer need is met without requiring a second config, base, or utility API. ActionList/index.ts:25-61 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                                     | —                                                                                                                                                                          |
| `CHILD-01`          | PASS          | PASS            | SOURCE VERIFIED    | Free-form item/list content is provided through children; ActionList consumes only its structural Heading slot and renders remaining children, while item label content remains consumer-authored. ActionList/List.tsx:30-32,103-118; ActionList/shared.ts:12-15,138-147 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                     | —                                                                                                                                                                          |
| `PART-01`           | PASS          | PASS            | SOURCE VERIFIED    | The exported ActionList namespace provides a consumer-composable collection surface with Item, LinkItem, Group, Divider, Description, visuals, Heading, GroupHeading, and TrailingAction. ActionList/index.ts:27-61 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                          | —                                                                                                                                                                          |
| `PART-DOCS`         | GAP           | GAP             | SOURCE VERIFIED    | Docs metadata lists numerous subcomponents but omits exported ActionList.Divider and the public ActionList.GroupHeading.TrailingAction nested part; consumers can reach both in the stories, but do not get a complete documented parts contract. ActionList/index.ts:39-61; ActionList/Group.tsx:247-251; ActionList/ActionList.docs.json:47-50,326-369; ActionList/ActionList.features.stories.tsx:1030-1048 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                               | `A-F1`                                                                                                                                                                     |
| `STRUCTURE-01`      | PASS          | PASS            | SOURCE VERIFIED    | ActionList has its PascalCase directory under src and exported subcomponents are attached to the parent API with Object.assign. ActionList/index.ts:1-62 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f; no replacement component is in scope.                                                                                                                                                                                                                                                                               | —                                                                                                                                                                          |
| `CUSTOM-ELEMENT-01` | N/A           | N/A             | SOURCE VERIFIED    | ActionList renders native list, item, button, and anchor elements and composes React components; no custom element is created by the component implementation. ActionList/List.tsx:103-118; ActionList/Item.tsx:323-344 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                      | The ActionList implementation does not involve a custom element; ADR-009 is conditional on custom-element use.                                                             |
| `API-01`            | PASS          | PASS            | SOURCE VERIFIED    | The root has a clear semantic polymorphism use, accepts element-specific DOM props, forwards ref to the rendered root, and merges its own class before consumer class. No sx/Styled System props are required at @primer/react under ADR-022-styled-react. ActionList/shared.ts:138-167; ActionList/List.tsx:14-18,47-48,103-116; ActionList/ActionList.types.test.tsx:41-43 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                 | —                                                                                                                                                                          |
| `PART-AS`           | GAP           | GAP             | SOURCE VERIFIED    | The required parts surface is not consistently polymorphic: ActionList.Item explicitly deprecates its ineffective as prop; Group, Divider, Description, and Visuals expose fixed element props, unlike the root, LinkItem, GroupHeading, and TrailingAction. ActionList/shared.ts:70-73; ActionList/Group.tsx:48-68; ActionList/Divider.tsx:6-14; ActionList/Description.tsx:8-25; ActionList/Visuals.tsx:10-17; ActionList/LinkItem.tsx:31-33; ActionList/Group.tsx:126-133 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f. | `A-F2`                                                                                                                                                                     |
| `PART-RENDER`       | GAP           | DEFERRED        | SOURCE VERIFIED    | No public part accepts the target element/function render contract; ActionList.Item renderItem is a different legacy callback. ActionList/shared.ts:68-73; ActionList/index.ts:27-61.                                                                                                                                                                                                                                                                                                                                    | Render-deferred mode excludes only this finding; target gap remains visible.                                                                                               |
| `MERGE-CONFIG`      | PASS          | PASS            | SOURCE VERIFIED    | ActionList exposes configured/internal prop boundaries; concrete handler, class, and behavior collisions are scored in their owning checks. Item.tsx:279-290; Group.tsx:99-104.                                                                                                                                                                                                                                                                                                                                          | —                                                                                                                                                                          |
| `MERGE-HANDLER`     | GAP           | GAP             | SOURCE VERIFIED    | Consumer onClick in Item props replaces the generated click handler because props spread after menuItemProps. Item.tsx:279-290.                                                                                                                                                                                                                                                                                                                                                                                          | `A-F4`                                                                                                                                                                     |
| `MERGE-CLASS`       | GAP           | GAP             | SOURCE VERIFIED    | ActionList.Group combines consumer className before the component class. Group.tsx:99-104.                                                                                                                                                                                                                                                                                                                                                                                                                               | `A-F8`                                                                                                                                                                     |
| `MERGE-STYLE-ATTR`  | PASS          | PASS            | SOURCE VERIFIED    | Ordinary consumer attributes are spread to the rendered item; component-owned data/state attributes are written afterward. Item.tsx:279-290,323-344.                                                                                                                                                                                                                                                                                                                                                                     | —                                                                                                                                                                          |
| `MERGE-REF`         | PASS          | PASS            | SOURCE VERIFIED    | Existing Item and List refs are forwarded to their current rendered elements. Item.tsx:323-344; List.tsx:47-48.                                                                                                                                                                                                                                                                                                                                                                                                          | —                                                                                                                                                                          |
| `MERGE-BEHAVIOR`    | COVERED       | COVERED         | SOURCE VERIFIED    | Consumer props can replace generated role, tabIndex, ARIA, and selection behavior through the same props-after-menuItemProps spread as the handler. Item.tsx:279-290.                                                                                                                                                                                                                                                                                                                                                    | `A-F4`                                                                                                                                                                     |
| `STATE-CALLBACK`    | GAP           | GAP             | SOURCE VERIFIED    | ActionList.Item exposes selection via the legacy event-only onSelect signature; it has no additive transition callback carrying the proposed selected value, reason, event, and synchronous cancel. ActionList/shared.ts:17-24; ActionList/Item.tsx:114-125,147-160 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                          | `A-F5`                                                                                                                                                                     |
| `NAMES-DEFAULTS`    | PASS          | PASS            | AGENT JUDGMENT     | Item and LinkItem share the size concept and use the same small/medium/large scale with medium as the default. LinkItem reuses ActionListItemProps.size and docs specify medium. ActionList/shared.ts:35-36; ActionList/LinkItem.tsx:25-33; ActionList/ActionList.docs.json:64-68,163-166 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                    | —                                                                                                                                                                          |
| `STATE-OWNER`       | PASS          | PASS            | SOURCE VERIFIED    | Selection/active state is supplied by the consumer through selected and active props; ActionList does not keep a competing internal selection value. ActionList/shared.ts:20-28; ActionList/Item.tsx:274-275,349 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                             | —                                                                                                                                                                          |
| `ACCESS-01`         | PASS          | PASS            | BEHAVIOR VERIFIED  | Focused ActionList unit tests passed and exercise role-based focus-zone, keyboard, and selection behavior; source associates list roles/arrow keys and generated item roles/names/descriptions with the interacting elements. npx vitest run --project '@primer/react' packages/react/src/ActionList — 6 files, 122 tests passed. ActionList/List.tsx:46-66; ActionList/Item.tsx:127-160,247-259,323-344 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                     | —                                                                                                                                                                          |
| `LIVE-01`           | N/A           | N/A             | SOURCE VERIFIED    | Loading adds visually hidden text to the item label, but ActionList does not announce changing status through a live region. ActionList/Item.tsx:359-365; ActionList/Selection.tsx:22-29 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                                                     | ActionList has no component-owned live-region/status announcement; static accessible loading label is not a changing live-region announcement.                             |
| `WARN-01`           | PASS          | PASS            | BEHAVIOR VERIFIED  | The reachable selected-without-selectionVariant misuse emits a development-only warning; the focused suite asserts the warning. ActionList/Selection.tsx:22-27; utils/warning.ts:3-19; ActionList/ActionList.test.tsx:17-34 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f; focused test command passed.                                                                                                                                                                                                                     | —                                                                                                                                                                          |
| `SELECTOR-01`       | GAP           | GAP             | SOURCE VERIFIED    | Root and most public parts use stable data-component identifiers, but GroupHeading still emits GroupHeadingWrap rather than the public API name; its test codifies the legacy value. ActionList/Group.tsx:205-206,222-223; ActionList/ActionList.test.tsx:333-344 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                            | `A-F6`                                                                                                                                                                     |
| `STYLE-01`          | GAP           | GAP             | SOURCE VERIFIED    | ActionList, Group, and Heading CSS Modules contain authored rules without the required @layer primer.components.ActionList declaration. ActionList/ActionList.module.css:1-8; ActionList/Group.module.css:1-8; ActionList/Heading.module.css:1-8 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                             | `A-F7`                                                                                                                                                                     |
| `RESP-01`           | N/A           | N/A             | SOURCE VERIFIED    | The public ActionList/Item APIs expose no responsive-value props or responsive behavior; stylesheet media rules are interaction/forced-color adaptations, not viewport-responsive component values. ActionList/shared.ts:138-167; ActionList/ActionList.module.css:1-8,125-137 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                               | ActionList owns no responsive-value API or viewport-dependent behavior, so ADR-018 does not apply.                                                                         |
| `TYPE-01`           | PASS          | PASS            | EXECUTION VERIFIED | npm run type-check --workspace @primer/react — passed (tsc --noEmit). Focused public polymorphic type assertions include root as/ref and custom LinkItem as/ref. ActionList/ActionList.types.test.tsx:4-43 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                                   | —                                                                                                                                                                          |
| `EXPORT-01`         | PASS          | PASS            | SOURCE VERIFIED    | The package exports the ActionList parent and its public prop types; implementation files are not separately re-exported as module paths. ActionList/index.ts:13-25; packages/react/src/index.ts:73-86 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                                       | —                                                                                                                                                                          |
| `TEST-01`           | PASS          | PASS            | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/ActionList — passed: 6 test files, 122 tests. This is focused behavior execution evidence.                                                                                                                                                                                                                                                                                                                                                                   | —                                                                                                                                                                          |
| `SNAPSHOT-01`       | PASS          | PASS            | SOURCE VERIFIED    | ActionList unit test files contain no render-tree toMatchSnapshot/toMatchInlineSnapshot assertions; behavior and selector assertions are explicit. packages/react/src/ActionList/\*.test.tsx @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                                                                 | —                                                                                                                                                                          |
| `INTERACTION-01`    | NOT MEASURED  | NOT MEASURED    | SOURCE VERIFIED    | e2e/components/ActionList.test.ts contains visual screenshot cases and only skipped focus-tooltip interaction cases; no runnable Storybook Playwright interaction test was executed. e2e/components/ActionList.test.ts:157-218 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                                                                                                                               | The only ActionList Playwright interaction cases in the source are test.skip cases; the focused unit suite is not a substitute for ADR-017 Storybook Playwright execution. |
| `MIG-01`            | N/A           | N/A             | SOURCE VERIFIED    | All proposed fixes can be additive: retain existing callback signatures and preserve the GroupHeadingWrap selector while adding the target selector/migration path. No recommendation requires changing a confirmed published API. packages/react/package.json:4 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f; ActionList/Group.tsx:205-206 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f.                                                                                                                                    | Recommendations are additive and compatibility-preserving; no published prop/callback removal or replacement is proposed.                                                  |

</details>

<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                                   |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | ActionList / presentational, collection, leaf interactive item, form/listbox-capable                                                                                    |
| Repository package version | 38.46.0                                                                                                                                                                 |
| Published-package metadata | Not assessed; all proposed API changes are additive or retain compatibility aliases, and no existing published prop/callback is recommended for removal or replacement. |
| Mode                       | whole component                                                                                                                                                         |
| Audited source SHA         | `d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`                                                                                                                              |
| Rubric                     | Component API compliance rubric 0.5.0                                                                                                                                   |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                              |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2`          |
| BLOCK sensitivity          | 49.46–50.54 / 100 · F (no open BLOCKs)                                                                                                                                  |
| Render scoring modes       | Scored 49.46–50.54 / 100 · F; deferred 54.12–55.29 / 100 · F                                                                                                            |
| Human review               | PENDING HUMAN                                                                                                                                                           |
| Surface                    | Whole component at audited source SHA                                                                                                                                   |

### Layer 3 human review

| Judgment                                 | Result                                                                                           |
| :--------------------------------------- | :----------------------------------------------------------------------------------------------- |
| meaningfulPartBoundaries                 | PENDING HUMAN                                                                                    |
| defaultElementsAndSemantics              | PENDING HUMAN                                                                                    |
| contextOrderCollectionOwnershipAndNaming | PENDING HUMAN                                                                                    |
| sharedNamesAndDefaults                   | PENDING HUMAN                                                                                    |
| unresolvedMaintainerDecisions            | PENDING HUMAN; callback name, part defaults, and render/as coexistence need maintainer judgment. |
| releaseDependentMigration                | PENDING HUMAN; preserve selector compatibility if a published-selector migration is confirmed.   |

</details>
