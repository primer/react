# TreeView component API scorecard

**Rubric:** Component API compliance rubric 0.5.0 · **Component:** TreeView

## Report card

**Render scored:** 31.81 / 100 · F · **Render deferred:** 35.20 / 100 · F · **Status:** PROVISIONAL

**Open BLOCKs:** 0 · **Scored findings:** 9 · **Deferred checks/findings:** 1/1 · **Applicable weight:** 83/100 scored; 75/100 deferred · **Evidence coverage:** 83/83 scored

| Area                                                                    |    Render scored    |   Render deferred   | Scored gaps | Deferred-only gaps | Finding links                                                |
| :---------------------------------------------------------------------- | :-----------------: | :-----------------: | :---------: | :----------------: | :----------------------------------------------------------- |
| [Area 1 Architecture and parts](#area-1-architecture-and-parts)         | `████░░░░░░ 1.84/5` | `████░░░░░░ 1.84/5` |      1      |         0          | [TV-F1](#tv-f1)                                              |
| [Area 2 Root and part substitution](#area-2-root-and-part-substitution) | `░░░░░░░░░░ 0.00/5` | `░░░░░░░░░░ 0.00/5` |      2      |         1          | [TV-F2](#tv-f2), [TV-F3](#tv-f3), [TV-F3 (deferred)](#tv-f3) |
| [Area 3 Prop merge behavior](#area-3-prop-merge-behavior)               | `█████░░░░░ 2.25/5` | `█████░░░░░ 2.25/5` |      2      |         0          | [TV-F4](#tv-f4), [TV-F9](#tv-f9)                             |
| [Area 4 State and shared concepts](#area-4-state-and-shared-concepts)   | `██░░░░░░░░ 1.00/5` | `██░░░░░░░░ 1.00/5` |      1      |         0          | [TV-F5](#tv-f5)                                              |
| [Area 5 Accessibility and evidence](#area-5-accessibility-and-evidence) | `██████░░░░ 3.00/5` | `██████░░░░ 3.00/5` |      3      |         0          | [TV-F6](#tv-f6), [TV-F7](#tv-f7), [TV-F8](#tv-f8)            |

Rubric 0.5.0 scores a missing render API once at 8 points. Existing merge behavior is scored independently. The deferred column removes only `PART-RENDER` and its own finding. Scores from rubric 0.4.1 are not comparable.

## Area 1 Architecture and parts

**Score:** render scored `████░░░░░░ 1.84/5` · render deferred `████░░░░░░ 1.84/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 19/20.

Covered rows `PART-DOCS`, `PART-AS` belong to [TV-F1](#tv-f1) and remain scored at zero.

### TV-F1

**Title:** Add a uniform consumer-composable TreeView parts surface

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-01`, section 1; covered checks: `PART-DOCS`, `PART-AS`.

**Reachable consumer:** A consumer using <TreeView><TreeView.Item as={CustomLink}>... needs to compose or replace an interactive tree region while retaining TreeView context, item state, required semantics, and refs; the existing compound API has only an Item-specific as path and no uniform root/part contract.

**Observed gap:** TreeView exposes legacy compound subcomponents, but there is no parts surface giving each interactive part its required props/state/ref and consistent composition contract.

**Additive fix:** Add a target-aligned parts API alongside the current compound components; define root/item boundaries and document required behavior/state/ref. Keep exact part names/default elements pending maintainer review; preserve existing props, slots, subcomponents, and Item.as behavior.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.tsx:92-100 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.tsx:203-212 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.tsx:1042-1050 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.docs.json:63-145 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 2 Root and part substitution

**Score:** render scored `░░░░░░░░░░ 0.00/5` · render deferred `░░░░░░░░░░ 0.00/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 20/20.

### TV-F2

**Title:** Complete TreeView root DOM and ref conventions

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `API-01`, section 2.

**Reachable consumer:** A consumer needs to focus, measure, scroll, or attach a DOM attribute such as id to the tree container while retaining role=tree and internal keyboard management.

**Observed gap:** TreeViewProps exposes only aria-label/labelledby, children, flat, truncate, className, and style; Root is not ref-forwarding and has only a private ref to its <ul>.

**Additive fix:** Extend the root API with a forwarded ref and appropriate <ul> DOM props while keeping TreeView-owned role, keyboard handlers, and accessibility attributes authoritative. Add root as only if a reviewed semantic polymorphism use case exists.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.tsx:92-100 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.tsx:112-125 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.tsx:203-212 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### TV-F3

**Title:** Add render forms to TreeView parts

**Status by mode:** Render scored — OPEN; render deferred — excluded from the score. **Classification / severity / owner:** `ADR GAP` · `FIX` · `PART-RENDER`, section 2.

**Reachable consumer:** A consumer composing a future TreeView part may need an element or render-function replacement receiving required tree behavior and current item state.

**Observed gap:** TreeView has no part element or function render contract. TreeView.tsx:226-239,250-253.

**Additive fix:** Add element and function render forms to the parts while retaining existing tree behavior and callbacks.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.tsx:226-239 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.tsx:250-253 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.docs.json:63-145 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 3 Prop merge behavior

**Score:** render scored `█████░░░░░ 2.25/5` · render deferred `█████░░░░░ 2.25/5` · **Open findings:** 2 scored; 0 deferred · **Applicable weight:** 20/25.

### TV-F4

**Title:** Order TreeView root classes component-first

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-CLASS`, section 3.

**Reachable consumer:** A consumer supplies root className while TreeView adds its root reset/module class.

**Observed gap:** TreeView.Root combines consumer className before the component class, contrary to ADR-025.

**Additive fix:** Keep the current root API and use component-first class ordering in a compatible migration.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.tsx:203-212 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### TV-F9

**Title:** Compose TreeView item keyboard handlers

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `MERGE-HANDLER`, section 3.

**Reachable consumer:** A consumer using <TreeView><TreeView.Item as={CustomLink}>... needs to compose or replace an interactive tree region while retaining TreeView context, item state, required semantics, and refs; the existing compound API has only an Item-specific as path and no uniform root/part contract.

**Observed gap:** A consumer-supplied onKeyDown is accepted in TreeView.Item props but replaced by the internal handler.

**Additive fix:** Compose the consumer handler with TreeView keyboard behavior while preserving the existing onSelect and expansion callback signatures.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.tsx:226-239,404-421 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 4 State and shared concepts

**Score:** render scored `██░░░░░░░░ 1.00/5` · render deferred `██░░░░░░░░ 1.00/5` · **Open findings:** 1 scored; 0 deferred · **Applicable weight:** 10/15.

### TV-F5

**Title:** Add an object-shaped expanded-state transition callback

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `STATE-CALLBACK`, section 4.

**Reachable consumer:** A controlled consumer needs to distinguish pointer, keyboard, and programmatic expansion, inspect the originating event, or synchronously cancel a proposed expansion.

**Observed gap:** The existing onExpandedChange callback receives only a boolean; it lacks the target reason/event/cancel contract.

**Additive fix:** Add a separately named object callback carrying expanded, reason, event when present, and synchronous cancel(); preserve onExpandedChange(expanded) unchanged. Resolve the additive name during maintainer review.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.tsx:226-239 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.tsx:327-333 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.docs.json:123-126 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Area 5 Accessibility and evidence

**Score:** render scored `██████░░░░ 3.00/5` · render deferred `██████░░░░ 3.00/5` · **Open findings:** 3 scored; 0 deferred · **Applicable weight:** 14/20.

### TV-F6

**Title:** Add a stable public TreeView component selector

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `SELECTOR-01`, section 5.

**Reachable consumer:** A consumer or integration test needs a stable selector independent of private CSS-module hashes and state attributes.

**Observed gap:** The root has role=tree and implementation data attributes but no stable data-component identity or documented public selector.

**Additive fix:** Add a stable data-component identifier to the root, document it, and test identity separately from state data attributes.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.tsx:203-212 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.docs.json:1-26 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### TV-F7

**Title:** Place TreeView CSS Module rules in its Primer cascade layer

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `STYLE-01`, section 5.

**Reachable consumer:** A consumer styles TreeView alongside Primer utility/component layers and expects the documented component layer ordering.

**Observed gap:** The authored TreeView CSS Module contains unlayered rules rather than @layer primer.components.TreeView.

**Additive fix:** Wrap the TreeView component rules in @layer primer.components.TreeView without changing selectors or declarations.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.module.css:1-5 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `packages/react/src/TreeView/TreeView.tsx:10 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

### TV-F8

**Title:** Add Storybook Playwright interaction coverage for TreeView

**Status by mode:** Render scored — OPEN; render deferred — OPEN. **Classification / severity / owner:** `ADR GAP` · `FIX` · `INTERACTION-01`, section 5.

**Reachable consumer:** A keyboard or pointer user expands/collapses an item, moves focus, or loads asynchronous children; these behaviors currently have unit coverage but no Storybook Playwright interaction path.

**Observed gap:** The TreeView Playwright suite visits stories and captures VRT screenshots only; its tests do not interact with the component.

**Additive fix:** Add a Storybook Playwright test exercising a representative keyboard/pointer tree interaction and asserting focus/expanded behavior; keep unit tests and visual snapshots.

**Pinned citations:**

- `packages/react/src/TreeView/TreeView.test.tsx:884-935 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `e2e/components/TreeView.test.ts:5-19 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`
- `e2e/components/TreeView.test.ts:24-109 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`

## Current-contract defects

No current-contract defects established.

## Audit details

<details>
<summary>Per-check evidence matrix</summary>

Scored and deferred verdicts are shown side by side. Deferred mode changes only `PART-RENDER`; `COVERED` rows remain in the denominator at zero.

| Check               | Render scored | Render deferred | Evidence class     | Evidence at audited SHA / command result                                                                                                                                                                                                                                                                                  | Finding ID or reason                                                                                                                                              |
| :------------------ | :------------ | :-------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MOD-01`            | PASS          | PASS            | AGENT JUDGMENT     | Compound TreeView composition has a concrete need for nested/async trees; the exported roving-tabindex hook is a separate reusable keyboard-management utility. No redundant public base layer is evident. TreeView.tsx:92-100,1042-1050; useRovingTabIndex.hookDocs.json:1-38 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f | —                                                                                                                                                                 |
| `CHILD-01`          | PASS          | PASS            | SOURCE VERIFIED    | Free-form item labels, visuals, subtree rows, and root content use children; secondary-action data and async subtree state use props. TreeView.tsx:92-100,226-239; TreeView.docs.json:63-80,184-199 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                            | —                                                                                                                                                                 |
| `PART-01`           | GAP           | GAP             | SOURCE VERIFIED    | The compound API exposes TreeView.Item/SubTree/visual/action subcomponents, but lacks the target’s uniform consumer-composable parts surface for the root and interactive regions. TreeView.tsx:92-100,203-212,1042-1050; TreeView.docs.json:63-145 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                            | `TV-F1`                                                                                                                                                           |
| `PART-DOCS`         | COVERED       | COVERED         | SOURCE VERIFIED    | Existing compound parts have props documentation, but there is no documented target parts contract for ownership, required behavior/state/ref, and composition; owned by TV-F1. TreeView.docs.json:63-145,184-199 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                              | `TV-F1`                                                                                                                                                           |
| `STRUCTURE-01`      | PASS          | PASS            | SOURCE VERIFIED    | TreeView is in a PascalCase directory directly under src; exported subcomponents are attached to the TreeView parent. TreeView/index.ts:1; TreeView.tsx:1042-1050 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                                              | —                                                                                                                                                                 |
| `CUSTOM-ELEMENT-01` | N/A           | N/A             | SOURCE VERIFIED    | TreeView renders React/native HTML elements and no custom element is involved. TreeView.tsx:203-212,404-421 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                                                                                                    | ADR-009 applies only when a custom element is used; none is part of this component surface.                                                                       |
| `API-01`            | GAP           | GAP             | SOURCE VERIFIED    | The root public props are narrow rather than root <ul> props, Root is not ref-forwarding, and its rendered tree element only has a private ref. TreeView.tsx:92-100,112-125,203-212 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                            | `TV-F2`                                                                                                                                                           |
| `PART-AS`           | COVERED       | COVERED         | SOURCE VERIFIED    | TreeView.Item supports as, but root and target parts have no uniform as contract; the missing parts surface TV-F1 owns this. TreeView.tsx:92-100,250-253,404-421 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                                               | `TV-F1`                                                                                                                                                           |
| `PART-RENDER`       | GAP           | DEFERRED        | SOURCE VERIFIED    | TreeView has no part element or function render contract. TreeView.tsx:226-239,250-253.                                                                                                                                                                                                                                   | Render-deferred mode excludes only this finding; target gap remains visible.                                                                                      |
| `MERGE-CONFIG`      | N/A           | N/A             | SOURCE VERIFIED    | TreeView exposes a compound root and item API without a separate configured/internal consumer merge boundary.                                                                                                                                                                                                             | The component has no configured/internal consumer DOM-prop merge boundary; property-specific root and item behavior is scored separately.                         |
| `MERGE-HANDLER`     | GAP           | GAP             | SOURCE VERIFIED    | TreeView.Item accepts native onKeyDown through restProps but overwrites it with handleKeyDown, so the consumer handler is not called. TreeView.tsx:226-239,404-421.                                                                                                                                                       | `TV-F9`                                                                                                                                                           |
| `MERGE-CLASS`       | GAP           | GAP             | SOURCE VERIFIED    | TreeView.Root combines consumer className before its component class. TreeView.tsx:203-212.                                                                                                                                                                                                                               | `TV-F4`                                                                                                                                                           |
| `MERGE-STYLE-ATTR`  | PASS          | PASS            | SOURCE VERIFIED    | TreeView.Root forwards consumer style to the rendered ul; TreeView.Item preserves ordinary style props. TreeView.tsx:203-212,404-421.                                                                                                                                                                                     | —                                                                                                                                                                 |
| `MERGE-REF`         | PASS          | PASS            | SOURCE VERIFIED    | TreeView.Item forwards its ref to the polymorphic rendered element; TreeView.Root exposes no ref to merge. TreeView.tsx:250-253,404-421.                                                                                                                                                                                  | —                                                                                                                                                                 |
| `MERGE-BEHAVIOR`    | PASS          | PASS            | SOURCE VERIFIED    | TreeView.Item writes role, aria state, and its behavior handlers after restProps. TreeView.tsx:404-421.                                                                                                                                                                                                                   | —                                                                                                                                                                 |
| `STATE-CALLBACK`    | GAP           | GAP             | SOURCE VERIFIED    | Expansion exposes onExpandedChange(expanded: boolean), not the target object callback with reason, event, and synchronous cancel. TreeView.tsx:226-239,327-333; TreeView.docs.json:123-126 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                     | `TV-F5`                                                                                                                                                           |
| `NAMES-DEFAULTS`    | N/A           | N/A             | AGENT JUDGMENT     | No same-semantic prop/default concept is shared with the audited comparison set; expanded tree-item state differs from overlay open state. TreeView.tsx:226-239 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                                                | The check is comparative and no directly shared semantic prop concept is established for TreeView among the audited components.                                   |
| `STATE-OWNER`       | PASS          | PASS            | BEHAVIOR VERIFIED  | The controlled expanded/onExpandedChange path is tested, and the 86-test TreeView suite passed. TreeView.tsx:226-239,303-333; TreeView.test.tsx:2126-2159 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                                                      | —                                                                                                                                                                 |
| `ACCESS-01`         | PASS          | PASS            | BEHAVIOR VERIFIED  | The focused suite passed and verifies tree/treeitem roles, accessible names, current/expanded state, polymorphic role/ref forwarding, and keyboard focus/navigation. TreeView.test.tsx:23-73,97-114,420-518,884-935 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                            | —                                                                                                                                                                 |
| `LIVE-01`           | PASS          | PASS            | BEHAVIOR VERIFIED  | Async loading/completion is announced through shared AriaStatus; the focused suite asserts both announcements and passed. TreeView.tsx:199-202,587-619; TreeView.test.tsx:2213-2229 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                            | —                                                                                                                                                                 |
| `WARN-01`           | N/A           | N/A             | SOURCE VERIFIED    | No TreeView-owned development warning is emitted in the component implementation. TreeView.tsx:1-1050 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                                                                                                          | The check applies only to component-emitted development warnings; none is present in TreeView.                                                                    |
| `SELECTOR-01`       | GAP           | GAP             | SOURCE VERIFIED    | The root exposes role and implementation data attributes but no stable data-component identity; no component selector is documented. TreeView.tsx:203-212; TreeView.docs.json:1-26 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                             | `TV-F6`                                                                                                                                                           |
| `STYLE-01`          | GAP           | GAP             | SOURCE VERIFIED    | TreeView owns an imported CSS Module, but the module has unlayered rules and no @layer primer.components.TreeView declaration. TreeView.tsx:10; TreeView.module.css:1-5,1-291 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                                  | `TV-F7`                                                                                                                                                           |
| `RESP-01`           | N/A           | N/A             | SOURCE VERIFIED    | TreeView has no responsive-valued props or viewport breakpoint API; CSS media rules adapt touch targets to pointer capability and forced-colors behavior. TreeView.module.css:68-80,87-99 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                      | ADR-018 applies to component-owned responsive values; these modality/accessibility media queries are not a responsive-value API or JS-driven responsive behavior. |
| `TYPE-01`           | PASS          | PASS            | EXECUTION VERIFIED | npm run type-check --workspace @primer/react — passed (tsc --noEmit); public TreeView and polymorphic Item types were included.                                                                                                                                                                                           | —                                                                                                                                                                 |
| `EXPORT-01`         | PASS          | PASS            | SOURCE VERIFIED    | TreeView/types are package-root exports; useRovingTabIndex has public hook documentation, while component-internal contexts/hooks are not root exports. packages/react/src/index.ts:222-230; useRovingTabIndex.hookDocs.json:1-38 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                              | —                                                                                                                                                                 |
| `TEST-01`           | PASS          | PASS            | EXECUTION VERIFIED | npx vitest run --project '@primer/react' packages/react/src/TreeView/TreeView.test.tsx — passed: 1 file, 86 tests.                                                                                                                                                                                                        | —                                                                                                                                                                 |
| `SNAPSHOT-01`       | PASS          | PASS            | SOURCE VERIFIED    | Focused unit tests use behavior assertions, not render-tree snapshots; separate Playwright VRT snapshots are story-specific screenshots with direct visual change signals. TreeView.test.tsx:19-73; e2e/components/TreeView.test.ts:5-109 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                      | —                                                                                                                                                                 |
| `INTERACTION-01`    | GAP           | GAP             | SOURCE VERIFIED    | TreeView has unit interaction tests, but its Storybook Playwright suite only captures screenshots and never interacts with the tree. TreeView.test.tsx:884-935; e2e/components/TreeView.test.ts:5-109 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                          | `TV-F8`                                                                                                                                                           |
| `MIG-01`            | N/A           | N/A             | SOURCE VERIFIED    | Recommendations are additive and preserve existing callback signatures/API; package version 38.46.0 recorded, publication need not be assessed. TreeView.tsx:92-100,226-239 @ d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f                                                                                                    | All proposed fixes are additive and preserve existing public callbacks and composition; release-dependent migration review does not apply.                        |

</details>

<details>
<summary>Audit identity and human review</summary>

| Field                      | Value                                                                                                                                                          |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Component / shape          | TreeView / see component contract and source citations                                                                                                         |
| Repository package version | 38.46.0                                                                                                                                                        |
| Published-package metadata | Not assessed; all proposed remediations are additive and preserve existing callback signatures.                                                                |
| Mode                       | Whole component                                                                                                                                                |
| Audited source SHA         | `d1f3c9bd4bab643bd720ba59874aaa8f63d54d7f`                                                                                                                     |
| Rubric                     | Component API compliance rubric 0.5.0                                                                                                                          |
| Accepted ADR snapshot      | `2128032dca65a1bd565fe382c2e91c638c6473a4`                                                                                                                     |
| Pinned composition gist    | `0f385c865492b0752f19931cc2ae5c7254ef0ad2` / `0-2026-11-17-base-ui-foundation.md` / SHA-256 `30d60a7e9a5f84e9256ccd2cc2d1e681607257a16d4cb2b739a0fbd6e6cd22e2` |
| BLOCK sensitivity          | 31.81 / 100 · F (no open BLOCKs)                                                                                                                               |
| Render scoring modes       | Scored 31.81 / 100 · F; deferred 35.20 / 100 · F                                                                                                               |
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
