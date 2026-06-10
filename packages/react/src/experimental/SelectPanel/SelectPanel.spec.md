# SelectPanel — 4-Layer Component Spec

> **Status:** Draft (spike)
> **Scenario:** Decompose SelectPanel so a consumer can **add tabs** (Branches / Tags
> picker) by composition instead of forking. Feeds ADR-024 (Design System Spectrum).
> **Reference implementation:** the Dialog 4-layer stack on this branch.
>
> **Note:** this branch is a **hand-refined canonical example** of the intended
> implementation. It is the reference for "what good looks like" and may differ from
> a one-shot agent output.

## Overview

SelectPanel **does not own tabs**. A tabbed picker is a **consumer composition** of
SelectPanel's parts (overlay / search / list / options) + the generic experimental
`Tabs` primitive. This is the "compose, don't depend" rule: SelectPanel provides the
listbox-in-a-dialog machinery and the consumer brings `Tabs` — SelectPanel never
imports or re-exports tab components.

This document defines a **modular** SelectPanel across the four layers of the
[modular component architecture](https://github.com/github/primer/issues/6546):

| Layer | Name            | What it provides                                                               |
| ----- | --------------- | ------------------------------------------------------------------------------ |
| 0     | **Hooks**       | Consumer-owned behavioural state — selection, filter, async list               |
| 1     | **Foundations** | Compound hook (`useSelectPanel`) with prop-getters + unstyled accessible parts |
| 2     | **Parts**       | Primer-styled compositional components (`SelectPanelParts.*`)                  |
| 3     | **Ready-made**  | Props-based API for the simple **no-tabs** case                                |

The leverage for tabs is **L1 + L0**, not a `tabs` feature on SelectPanel. The new value is
a standalone, placeable listbox you can put inside a tab panel, plus decoupled hooks the
consumer owns (selection shareable across tabs, one filter across datasets, per-tab counts,
async lists). The consumer wires the tab strip with the generic `Tabs` primitive. The styled
Parts (L2) are a thin wrapper over that foundation, and they too contain **no tab code**.

The canonical use case — a Branches / Tags picker where tabs switch which filterable list is
shown inside **one** panel with **one** shared search input — is impossible with today's
prop-based `items` API, forcing consumers to fork the whole component. The real-world fork
this replaces is `github/github-ui` `packages/ref-selector/RefSelectorV1.tsx` (561 LOC); the
composed version is a fraction of that.

---

## Web Standards Baseline

A tabbed SelectPanel is **Combobox + Listbox + Tabs composed inside a Dialog popup**. It is
grounded in four ARIA APG patterns. The reference, screen-reader-tested composition is
Ariakit's [`combobox-tabs`](https://ariakit.com/examples/combobox-tabs).

### ⚠️ Load-bearing role decision: the popup is `role="dialog"`, not `role="listbox"`

Today's stable SelectPanel wraps everything in a single `role="listbox"`. That makes
`role="tab"` an **invalid child**, so tabs are impossible without forking. The modular
SelectPanel instead uses:

| Element                 | Role       | Notes                                                                         |
| ----------------------- | ---------- | ----------------------------------------------------------------------------- |
| Popup container         | `dialog`   | Outer shell. **Not** a listbox.                                               |
| Search input            | `combobox` | `aria-expanded`, `aria-controls` → active listbox, `aria-autocomplete="list"` |
| Tab strip               | `tablist`  | Consumer-composed with the `Tabs` primitive                                   |
| Each tab                | `tab`      | `aria-selected`, `aria-controls` → panel                                      |
| The (single) panel      | `tabpanel` | `aria-labelledby` tracks the **active** tab                                   |
| The list (in the panel) | `listbox`  | Scoped **inside** the active tab panel                                        |
| Each item               | `option`   | `aria-selected`                                                               |

`role="listbox"` / `role="option"` are **scoped to the active tab panel**. The input's
`aria-activedescendant` may reference **either** a tab or an option — all major screen readers
support this.

### Single dynamic panel (the Ariakit trick)

There is **one** `tabpanel` hosting **one** `listbox`, whose items come from the active tab's
data — not one panel/listbox per tab. This keeps the combobox's `aria-controls` stable and the
ARIA always matching the active tab. The active panel re-labels itself (`aria-labelledby`) as
the tab changes.

---

## Layer 0: Hooks (consumer-owned state)

These live in `@primer/react/hooks/experimental`. They are deliberately decoupled from any
component tree, so the **same** state can be shared across tabs.

### `useSelectionState`

```ts
const selection = useSelectionState({selectionVariant: 'single' | 'multiple', ...})
// → { selectedKeys, isSelected, toggle, setSelection, clear }
```

One selection model that two tabs (Branches / Tags) can share. Single-select replaces;
multi-select toggles. Controlled (`selectedKeys`) or uncontrolled (`defaultSelectedKeys`).

### `useFilter`

```ts
const filter = useFilter()
// → { query, setQuery, matches, filter(items, getText), count(items, getText) }
```

One shared query across tabs. `filter()` filters any dataset; `count()` produces per-tab match
counts for badges — without re-implementing the matching logic.

### `useAsyncList`

```ts
const branches = useAsyncList({filterText, load: ({filterText, cursor, signal}) => fetch(...)})
// → { items, loadingState, error, hasMore, loadMore, reload }
```

Thin async-list capability with cursor pagination and `AbortSignal` cancellation. Each tab can
own its own instance, so switching tabs / typing fetches that tab's data independently and
stale responses are discarded.

These resolve documented gaps: selection logic not reusable outside the panel, no filter reuse
across datasets, no async/cursor pagination.

---

## Layer 1: Foundations

`@primer/react/foundations/experimental` → `useSelectPanel` + unstyled `SelectPanel.*`.

### `useSelectPanel`

```ts
const panel = useSelectPanel({
  open: boolean,
  onOpenChange: (open, gesture) => void,   // controlled; this is a request, not a command
  'aria-label'?: string,
  id?: string,
  returnFocusRef?: RefObject<HTMLElement>,
})
```

Returns prop-getters:

| Getter                 | Element | Wires                                                                                                           |
| ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| `getAnchorProps()`     | trigger | `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, toggle                                              |
| `getOverlayProps()`    | popup   | `role="dialog"`, `aria-labelledby`/`aria-label`, ref                                                            |
| `getTitleProps()`      | title   | `id` (→ dialog `aria-labelledby`)                                                                               |
| `getInputProps()`      | search  | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-autocomplete`, `aria-activedescendant`, keyboard nav |
| `getListProps()`       | list    | `role="listbox"`, `id`, optional `aria-multiselectable`                                                         |
| `getOptionProps()`     | option  | `role="option"`, `aria-selected`, `aria-disabled`, active marker                                                |

Also: `isOpen`, `open()`, `close(gesture)`, `activeDescendantId`.

**Behaviour the foundation owns:** open/close as a controlled contract, Escape to close
(`useOnEscapePress`), outside-click to close, focus save/restore (to `returnFocusRef` or the
previously-focused element), combobox keyboard navigation over options
(ArrowUp/Down/Enter, wrapping, scroll-into-view, `aria-activedescendant`), and a dev-mode
warning when no accessible name is provided.

**No tabs.** The foundation owns **no tab code** — there is no `getPanelProps`, no `Panel`
component, and no dependency on the `Tabs` primitive. A tabbed picker is composed by the
consumer: they wrap the listbox in a `tabpanel` and render a tab strip using the generic
`Tabs` primitive (`useTab` / `useTabList` / `useTabPanel`). See "Composing tabs" below.

### Unstyled components

`SelectPanel.Root / .Anchor / .Overlay / .Title / .Input / .List / .Option` — wrap
the hook, wire ARIA via context, add no visual styling (foundation CSS reset only). `Overlay`
renders only while open. Consumers bring their own markup for the tab strip and tab panel via
the `Tabs` primitive.

---

## Layer 2: Parts

`@primer/react/experimental` → `SelectPanelParts`.

```
SelectPanelParts (= Root)
├── .Anchor       — Primer Button, wires getAnchorProps
├── .Overlay      — role=dialog popup, anchored, Primer surface tokens
│   ├── .Header
│   │   ├── .Title
│   │   └── .Input   — Primer TextInput (role=combobox), shared search
│   ├── .List        — placeable listbox (drop it directly, or inside a tabpanel)
│   │   └── .Option
│   ├── .Empty
│   └── .Footer
```

- Every Part carries a `data-component="SelectPanel[.Part]"` selector (the search input reuses
  Primer's `TextInput`, which carries its own `data-component`; its `role="combobox"` is the
  stable selector).
- CSS Modules + Primer design tokens; `:where()` for variant selectors.
- **No tab parts.** `SelectPanelParts` ships **no** `TabList` / `Tab` / `Panel` components and
  does not import `Tabs`. A tabbed picker is composed by the consumer (see below).
- **Anchored positioning:** the `Overlay` positions against the trigger via Primer's
  `useAnchoredPosition` (`outside-bottom` / `start` by default, configurable with `side`/`align`
  props). It flips when there's no room and re-positions on scroll/resize. The `Root` is the
  positioned parent (the overlay is `position: absolute` with computed `top`/`left`), so no
  portal is required.

### Composing tabs (the headline) — compose, don't depend

A Branches / Tags tabbed picker is built by composing SelectPanel parts with the generic
`Tabs` primitive. Because `Tabs` exports only the `useTab` / `useTabList` / `useTabPanel`
hooks, the consumer defines small local wrappers (`RefTabList` / `RefTab` / `RefTabPanel`) that
can reuse SelectPanel's `.TabList` / `.Tab` / `.TabCount` CSS. (Ideally the `Tabs` primitive
would export `Tab` / `TabList` / `TabPanel` convenience components — see Open Questions — which
would remove this glue.)

```tsx
<SelectPanel.Root open={open} onOpenChange={setOpen} selectionVariant="single">
  <SelectPanel.Anchor>Switch ref: {selected}</SelectPanel.Anchor>
  <SelectPanel.Overlay>
    <SelectPanel.Header>
      <SelectPanel.Title>Switch branches/tags</SelectPanel.Title>
      {/* one shared search input */}
      <SelectPanel.Input value={filter.query} onChange={e => filter.setQuery(e.target.value)} />
    </SelectPanel.Header>
    <Tabs
      value={activeTab}
      onValueChange={({value}) => {
        setActiveTab(value)
        inputRef.current?.focus() // return focus to the input — no dead-end
      }}
    >
      <RefTabList aria-label="Ref type">
        <RefTab value="branches" count={filteredBranches.length}>
          Branches
        </RefTab>
        <RefTab value="tags" count={filteredTags.length}>
          Tags
        </RefTab>
      </RefTabList>
      {/* NON-focusable tabpanel: do NOT set tabIndex={0} */}
      <RefTabPanel value={activeTab}>
        <SelectPanel.List>
          {activeItems.map(i => (
            <SelectPanel.Option
              key={i.id}
              id={i.id}
              selected={selection.isSelected(i.id)}
              onClick={() => selection.toggle(i.id)}
            >
              {i.name}
            </SelectPanel.Option>
          ))}
        </SelectPanel.List>
      </RefTabPanel>
    </Tabs>
  </SelectPanel.Overlay>
</SelectPanel.Root>
```

### The accessible composition pattern

The composition above is accessible **by construction**, with no keyboard dead-end:

- **Non-focusable tabpanel.** The `tabpanel` is **not** in the tab order — `useTabPanel`
  imposes no `tabIndex`, and the consumer must **not** add `tabIndex={0}`. The listbox inside
  is never reached by Tab, so the panel is never a focus trap.
- **Input-driven list.** The list is driven by the input's `aria-activedescendant`. Focus
  stays on the `combobox` input; ArrowUp/Down/Enter move and activate the active option (the
  existing `useSelectPanel` input keyboard handling), so the list needs no tab stop.
- **Roving-tabindex tabs.** The tab strip is a roving-tabindex zone from `useTabList` / `useTab`
  (ArrowLeft/Right + Home/End move between tabs; only the selected tab is tabbable).
- **Focus returns to the input on tab switch.** `onValueChange` calls `inputRef.current?.focus()`
  (or a DOM query for `[role="combobox"]`) so that after switching tabs the user is back on the
  input and can immediately keep arrowing through the new tab's options.
- **One shared search, per-tab counts.** A single `useFilter` query filters the active tab's
  data; each tab shows its own match count.

**No keyboard dead-end:** a user can focus the input and arrow through options, `Tab` to the
tablist and switch tabs (focus returns to the input), and never get trapped inside the panel.

One shared search (`useFilter`), one selection model (`useSelectionState`) shared across tabs,
per-tab counts, a single listbox that swaps data by active tab. No fork.

---

## Layer 3: Ready-made — and why it is **no-tabs only**

`@primer/react/experimental` → `SelectPanel` (props-based).

```tsx
<SelectPanel
  open={open}
  onOpenChange={setOpen}
  title="Switch branches"
  anchor={`Branch: ${name}`}
  items={items}
  selectionVariant="single"
  selectedKeys={selected}
  onSelectionChange={setSelected}
/>
```

It composes the L2 Parts internally and owns its own filter state — the drop-in for the 80%
case.

> **Decision (surfaced, not silent):** the Ready-made layer **intentionally does not support
> tabs**. The agent's own guidance names SelectPanel as the cautionary L3/config example: a
> `tabs` prop would re-introduce the config-creep (unwieldy prop/type surface) that the layered
> model exists to prevent. **Tabbed / compositional use cases are Layer 2 Parts only.** L3
> exists purely for API continuity on the simple, single-list case.

---

## Accessibility Requirements

### Responsibility matrix

| Requirement                                 | L0 (Hooks)       | L1 (Foundations)          | L2 (Parts)       | L3 (Ready-made)  |
| ------------------------------------------- | ---------------- | ------------------------- | ---------------- | ---------------- |
| Popup `role="dialog"` (not listbox)         | Consumer sets    | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| `aria-labelledby` → title / `aria-label`    | Consumer wires   | ✅ Auto-wired via context | ✅ Inherited     | ✅ From `title`  |
| Input `role="combobox"` + `aria-controls`   | Consumer sets    | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| `aria-activedescendant` (tab **or** option) | Consumer manages | ✅ Options (keyboard nav) | ✅ Inherited     | ✅ Inherited     |
| `tablist` / `tab` / `tabpanel`              | Consumer sets    | Consumer composes `Tabs` | Consumer composes `Tabs` | n/a (no tabs)    |
| `listbox` scoped to active panel            | Consumer sets    | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| `option` + `aria-selected`                  | Consumer sets    | ✅ Automatic              | ✅ Inherited     | ✅ From state    |
| Escape closes                               | Consumer handles | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Outside-click closes                        | Consumer handles | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Focus returns on close                      | Consumer manages | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Arrow-key option navigation                 | Consumer handles | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Non-focusable tabpanel / focus-return-to-input | Consumer wires | Consumer composes `Tabs` | Consumer composes `Tabs` | n/a              |
| Tab roving focus / Home/End                 | Consumer handles | Consumer composes `Tabs` | Consumer composes `Tabs` | n/a              |
| Anchored positioning / visible surface      | Consumer styles  | ⚠️ Consumer must style    | ✅ Primer tokens | ✅ Primer tokens |
| Colour contrast                             | Consumer ensures | ⚠️ Consumer must ensure   | ✅ Primer tokens | ✅ Primer tokens |

### Keyboard

- **Input:** ArrowDown/ArrowUp move the active option (wrapping); Enter activates it; Escape
  closes the panel.
- **Tabs:** ArrowLeft/ArrowRight move between tabs; Home/End jump to first/last (from the `Tabs`
  primitive).

---

## Deviations & Notes

- **Non-modal popup.** Unlike Dialog, the SelectPanel popup is an anchored, non-modal combobox
  popup — `aria-modal` is **not** set, and it does not use native `<dialog>`/`showModal()`.
  Dismissal is via Escape and outside-click. `useDialog` was evaluated for overlay/focus reuse
  but its modal, centered `<dialog>` semantics don't fit an anchored combobox popup; the
  foundation composes the lighter `useOnEscapePress` + focus-return logic instead.
- **DOM-based option navigation.** The foundation discovers options by `role="option"` in the
  active listbox rather than maintaining an option registry, mirroring the existing
  SelectPanel2 approach. This keeps the single-dynamic-panel model simple.
- **Composite-focus utility (future enhancement, not required for correctness).** A shared
  composite-focus utility (Ariakit [`combobox-tabs`](https://ariakit.com/examples/combobox-tabs)
  style) where **one** controller drives `aria-activedescendant` across **both** the tab strip
  and the option list — keeping DOM focus permanently on the input and driving tabs via
  `aria-activedescendant` instead of roving tabindex — is a **future enhancement** for premium
  UX. The composition documented here is already fully accessible without it: the tabpanel is
  non-focusable, the list is input-driven via `aria-activedescendant`, the tabs are a
  roving-tabindex zone, and focus returns to the input on tab switch — so there is no keyboard
  dead-end. The composite store is therefore an enhancement, **not** a correctness requirement.
- **Tabs convenience components (recommended follow-up).** The `Tabs` primitive currently
  exports only the `useTab` / `useTabList` / `useTabPanel` hooks, so the recipe defines local
  `RefTabList` / `RefTab` / `RefTabPanel` wrappers. Exporting styleable `Tab` / `TabList` /
  `TabPanel` convenience components from the `Tabs` primitive would remove this per-consumer
  glue while keeping SelectPanel free of any tab dependency.

---

## Open Questions

1. Should the placeable list be `SelectPanel.List` (as here) or a **shared Base `Listbox`**
   that both SelectPanel and other components consume? (Affects reuse outside the panel.)
2. **Shared vs per-tab search** — this spike shares one query (matching RefSelector); is that
   always right?
3. Adopt an **Ariakit-style composite store** so the tab strip and list share one
   `aria-activedescendant` model (one controller across tabs + options), rather than the
   roving-tabindex tabs + input-driven list composition documented here?
4. Export `Tab` / `TabList` / `TabPanel` **convenience components** from the `Tabs` primitive so
   consumers don't need local tab wrappers, without re-introducing a tab dependency in SelectPanel?
5. Graduate `useSelectionState` / `useFilter` / `useAsyncList` from experimental independently
   of the SelectPanel foundation?
