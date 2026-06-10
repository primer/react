# SelectPanel — 4-Layer Component Spec

> **Status:** Draft (spike)
> **Scenario:** Decompose SelectPanel so a consumer can **add tabs** (Branches / Tags
> picker) by composition instead of forking. Feeds ADR-024 (Design System Spectrum).
> **Reference implementation:** the Dialog 4-layer stack on this branch.

## Overview

This document defines a **modular, tab-capable** SelectPanel across the four layers of the
[modular component architecture](https://github.com/github/primer/issues/6546):

| Layer | Name            | What it provides                                                               |
| ----- | --------------- | ------------------------------------------------------------------------------ |
| 0     | **Hooks**       | Consumer-owned behavioural state — selection, filter, async list               |
| 1     | **Foundations** | Compound hook (`useSelectPanel`) with prop-getters + unstyled accessible parts |
| 2     | **Parts**       | Primer-styled compositional components (`SelectPanelParts.*`)                  |
| 3     | **Ready-made**  | Props-based API for the simple **no-tabs** case                                |

The leverage for tabs is **L1 + L0**, not L2. The new value is a standalone, placeable
listbox you can put inside a tab panel, plus decoupled hooks the consumer owns (selection
shareable across tabs, one filter across datasets, per-tab counts, async lists). The styled
Parts (L2) are a thin wrapper over that foundation.

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
| Tab strip               | `tablist`  | Reuses the `Tabs` primitive                                                   |
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
| `getPanelProps(tabId)` | panel   | `role="tabpanel"`, `aria-labelledby` (the active tab)                                                           |
| `getOptionProps()`     | option  | `role="option"`, `aria-selected`, `aria-disabled`, active marker                                                |

Also: `isOpen`, `open()`, `close(gesture)`, `activeDescendantId`.

**Behaviour the foundation owns:** open/close as a controlled contract, Escape to close
(`useOnEscapePress`), outside-click to close, focus save/restore (to `returnFocusRef` or the
previously-focused element), combobox keyboard navigation over options
(ArrowUp/Down/Enter, wrapping, scroll-into-view, `aria-activedescendant`), and a dev-mode
warning when no accessible name is provided.

**Tab strip:** the foundation deliberately **does not re-implement tabs**. The tab strip
reuses the existing `Tabs` primitive (`useTab` / `useTabList` / `useTabPanel`), and the
foundation provides only the single dynamic `Panel` region (`getPanelProps`) that hosts the
listbox. This honours the "reuse, don't rebuild" rule.

### Unstyled components

`SelectPanel.Root / .Anchor / .Overlay / .Title / .Input / .Panel / .List / .Option` — wrap
the hook, wire ARIA via context, add no visual styling (foundation CSS reset only). `Overlay`
renders only while open. Consumers bring their own markup for the tab strip via the `Tabs`
primitive.

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
│   ├── <Tabs>           (the Tabs primitive provides tab state/roving)
│   │   ├── .TabList     — reuses useTabList
│   │   │   └── .Tab     — reuses useTab; renders a per-tab count badge
│   │   └── .Panel       — single dynamic tabpanel (reuses useTabPanel)
│   │       └── .List
│   │           └── .Option
│   ├── .Empty
│   └── .Footer
```

- Every Part carries a `data-component="SelectPanel[.Part]"` selector (the search input reuses
  Primer's `TextInput`, which carries its own `data-component`; its `role="combobox"` is the
  stable selector).
- CSS Modules + Primer design tokens; `:where()` for variant selectors.
- `TabList` / `Tab` / `Panel` reuse the `Tabs` primitive hooks rather than re-implementing tab
  ARIA or roving focus.
- **Anchored positioning:** the `Overlay` positions against the trigger via Primer's
  `useAnchoredPosition` (`outside-bottom` / `start` by default, configurable with `side`/`align`
  props). It flips when there's no room and re-positions on scroll/resize. The `Root` is the
  positioned parent (the overlay is `position: absolute` with computed `top`/`left`), so no
  portal is required.

### Adding tabs (the headline)

```tsx
<SelectPanel.Root open={open} onOpenChange={setOpen} selectionVariant="single">
  <SelectPanel.Anchor>Switch ref: {selected}</SelectPanel.Anchor>
  <SelectPanel.Overlay>
    <SelectPanel.Header>
      <SelectPanel.Title>Switch branches/tags</SelectPanel.Title>
      <SelectPanel.Input value={filter.query} onChange={e => filter.setQuery(e.target.value)} />
    </SelectPanel.Header>
    <Tabs defaultValue="branches" onValueChange={({value}) => setActiveTab(value)}>
      <SelectPanel.TabList aria-label="Ref type">
        <SelectPanel.Tab value="branches" count={filteredBranches.length}>
          Branches
        </SelectPanel.Tab>
        <SelectPanel.Tab value="tags" count={filteredTags.length}>
          Tags
        </SelectPanel.Tab>
      </SelectPanel.TabList>
      <SelectPanel.Panel value={activeTab}>
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
      </SelectPanel.Panel>
    </Tabs>
  </SelectPanel.Overlay>
</SelectPanel.Root>
```

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
| `tablist` / `tab` / `tabpanel`              | Consumer sets    | ✅ via `Tabs` primitive   | ✅ Inherited     | n/a (no tabs)    |
| `listbox` scoped to active panel            | Consumer sets    | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| `option` + `aria-selected`                  | Consumer sets    | ✅ Automatic              | ✅ Inherited     | ✅ From state    |
| Escape closes                               | Consumer handles | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Outside-click closes                        | Consumer handles | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Focus returns on close                      | Consumer manages | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Arrow-key option navigation                 | Consumer handles | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Tab roving focus / Home/End                 | Consumer handles | ✅ via `Tabs` primitive   | ✅ Inherited     | n/a              |
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
- **Active-descendant scope (stubbed for full parity — deferred future work).**
  `aria-activedescendant` currently tracks options for keyboard navigation. A unified composite
  store letting the input's active-descendant move seamlessly between the **tab strip** and the
  **option list** (Ariakit `TabStore.composite`) is the harder, future retrofit; tab roving is
  presently handled by the `Tabs` primitive's own focus model (focus physically moves to the
  tabs). Implementing the composite store would mean keeping DOM focus permanently on the input
  and driving tabs via `aria-activedescendant` instead of roving tabindex — i.e. **not** reusing
  the Tabs primitive's focus model. This was deliberately deferred during hardening to avoid
  destabilising the shipped, tested behaviour; the keyboard model today (Arrow/Enter over
  options on the input; Arrow/Home/End over tabs when a tab is focused) is fully accessible.

---

## Open Questions

1. Should the placeable list be `SelectPanel.List` (as here) or a **shared Base `Listbox`**
   that both SelectPanel and other components consume? (Affects reuse outside the panel.)
2. **Shared vs per-tab search** — this spike shares one query (matching RefSelector); is that
   always right?
3. Adopt an **Ariakit-style composite store** so the tab strip and list share one
   `aria-activedescendant` model, rather than delegating tab focus to the `Tabs` primitive?
4. Graduate `useSelectionState` / `useFilter` / `useAsyncList` from experimental independently
   of the SelectPanel foundation?
