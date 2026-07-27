---
name: modular-ds-accessibility-contract
description: 'Use when: determining which Primer React API type (config, presentational, base, or utility) should own a specific accessibility responsibility, or documenting that ownership for a new component. Covers a responsibility matrix mapping ARIA requirements to API types, worked examples for Dialog and Tabs, and how to build a matrix for a new ARIA pattern.'
---

# Modular DS — Accessibility Contract

Each API type in the spectrum of abstraction model shifts accessibility responsibility to the consumer differently. This matrix defines what each API type handles automatically and what the consumer must provide themselves.

## Responsibility matrix — Dialog example

Read the columns as **scenarios, not a mandatory stack**. Each column describes what a consumer gets when the highest API type they're working with is that one — it does not imply that every component populates every column, or that a presentational component must sit on top of a base component. Per `modular-ds-spectrum-model`, each API type earns its place independently. Where no base component exists for a given part, the presentational component owns the ✅ items directly.

"Hook only" means the consumer renders all the markup themselves and spreads the hook's prop-getters onto it. The cells in that column describe what the consumer must do **in addition to** spreading the getters — "Consumer wires" means placing `getTitleProps()` on their own title element, "Consumer handles" means responding to the `onClose` the hook fires. It doesn't mean the consumer owns everything: where the hook drives lifecycle — for a dialog it owns `showModal()`/`close()`, per the controlled component contract in `modular-ds-utilities` — the side effects of that lifecycle apply at every column, including this one.

| Requirement                            | Hook only               | Base component                    | Presentational    | Config                  |
| -------------------------------------- | ----------------------- | --------------------------------- | ----------------- | ----------------------- |
| `role="dialog"` / `role="alertdialog"` | Consumer sets           | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| `aria-modal="true"`                    | Consumer sets           | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| `aria-labelledby` → title              | Consumer wires          | ✅ Auto-wired via context         | ✅ Auto-wired     | ✅ From `title` prop    |
| `aria-describedby` → description       | Consumer wires          | ✅ Auto-wired if Description used | ✅ Auto-wired     | ✅ From `subtitle` prop |
| Focus trapping                         | ✅ Native `showModal()` | ✅ Native `showModal()`           | ✅ Automatic      | ✅ Automatic            |
| Escape closes                          | Consumer handles        | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| Focus moves into component             | Consumer manages        | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| Focus returns on close                 | ✅ Automatic            | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| Visible close control                  | Consumer provides       | ✅ Enforced by structure          | ✅ Built-in       | ✅ Built-in             |
| Background inert                       | ✅ Native `showModal()` | ✅ Native `showModal()`           | ✅ Automatic      | ✅ Automatic            |
| Scroll lock                            | Consumer implements     | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| Visible backdrop                       | Consumer provides       | ⚠️ Consumer must style            | ✅ Primer token   | ✅ Primer token         |
| Appropriate heading level              | Consumer chooses        | ⚠️ Consumer must choose           | ✅ `<h2>` default | ✅ `<h2>` default       |
| Colour contrast                        | Consumer responsible    | ⚠️ Consumer must ensure           | ✅ Primer tokens  | ✅ Primer tokens        |

## Key principles

### Base component consumer responsibilities

At the base component level, a foundation like a dialog ships a transparent backdrop by default. Per ARIA APG, `aria-modal="true"` should only be set when background content is **both** non-interactive and visually obscured — so consumers using a base component directly **must** provide visible backdrop styling to meet this requirement. Presentational components handle this automatically with Primer tokens.

### `aria-describedby` guidance

Per ARIA APG, omit `aria-describedby` when content has complex semantic structure (lists, tables, multiple paragraphs) — screen readers announce it as a flat string. At the base-component level or above, don't render a Description part if content is complex. At the utility/hook level, don't call `getDescriptionProps()`.

Where a description _is_ in play, have the compound hook always assign the generated description ID to `aria-describedby` rather than trying to set it conditionally based on whether `getDescriptionProps()` has been called. Prop-getter call order isn't guaranteed, so conditional wiring introduces a render-order dependency between getters; an `aria-describedby` pointing at an ID that was never rendered is silently ignored by assistive technology, so the unconditional version is both simpler and safe.

### Initial focus guidance

For components with complex semantic content, set an initial-focus ref to a static element at the top with `tabIndex={-1}` so assistive technology users can navigate the structure. For destructive actions, focus the least destructive control.

### Optional APG semantics

Not every semantic an APG pattern permits should be on by default. Where the guide marks something optional and it carries a cost at scale, make it opt-in and document the choice. Accordion panels are the worked example: `role="region"` is optional in the APG, and applying it to every panel floods the landmark list on a page rendering many accordions — so default it off and let consumers turn it on for the cases where a landmark genuinely helps.

Whenever you make a call like this, cover both the default and the opt-in path in tests, stories, or docs metadata (see `modular-ds-tdd-a11y-test-backfill`) so the tradeoff is visible to the next person.

### Dev-mode warnings

A component's compound hook (see `modular-ds-utilities`) should fire a dev-mode warning when no accessible name is provided (neither a title part used, nor `aria-label` passed) or when required structural elements are missing. Check after render, once prop-getters have been called:

```tsx
useEffect(() => {
  if (process.env.NODE_ENV !== 'production' && open) {
    queueMicrotask(() => {
      if (!titleUsed.current && !ariaLabel) {
        console.warn(
          '<Component>: No accessible name provided. Use getTitleProps() on a title element, or pass aria-label.',
        )
      }
    })
  }
}, [open, ariaLabel])
```

## Applying this to other ARIA patterns

When building a component with a different ARIA pattern (tabs, menu, listbox, etc.), build a similar responsibility matrix:

1. **Identify the ARIA APG pattern** — read the W3C ARIA Authoring Practices Guide for the relevant pattern.
2. **List all requirements** — roles, states, properties, keyboard interaction, focus management.
3. **Assign each requirement to the lowest API type that will actually exist for this component.** As a default: the consumer does everything at the hook-only level; a base component automates ARIA wiring, focus management, and keyboard interaction; a presentational component adds Primer-token styling on top; a config component maps props to its children. Don't assume all four exist — where a component has no base component, the presentational component owns the ARIA wiring directly.
4. **Mark consumer responsibilities (⚠️)** in **every column** where someone working at that level must handle the requirement themselves, even if a higher API type handles it automatically — `Visible backdrop` below is ⚠️ for base-component consumers _and_ ✅ for presentational ones, and both facts matter. Where a component has no base component, its ⚠️ items belong in the lowest column that does exist, not in a base column invented to hold them.

### Tabs example (skeleton)

| Requirement                     | Hook only           | Base component            | Presentational   | Config           |
| ------------------------------- | ------------------- | ------------------------- | ---------------- | ---------------- |
| `role="tablist"`                | Consumer sets       | ✅ Automatic              | ✅ Automatic     | ✅ Automatic     |
| `role="tab"` on each tab        | Consumer sets       | ✅ Automatic              | ✅ Automatic     | ✅ Automatic     |
| `role="tabpanel"` on each panel | Consumer sets       | ✅ Automatic              | ✅ Automatic     | ✅ Automatic     |
| `aria-selected` on active tab   | Consumer manages    | ✅ Automatic              | ✅ Automatic     | ✅ Automatic     |
| `aria-controls` tab → panel     | Consumer wires      | ✅ Auto-wired via context | ✅ Auto-wired    | ✅ Auto-wired    |
| Arrow key navigation            | `useFocusZone` hook | ✅ Automatic              | ✅ Automatic     | ✅ Automatic     |
| Home/End to first/last tab      | Consumer handles    | ✅ Automatic              | ✅ Automatic     | ✅ Automatic     |
| Hidden panels (`hidden` attr)   | Consumer manages    | ✅ Automatic              | ✅ Automatic     | ✅ Automatic     |
| Focus indicator styling         | Consumer styles     | ⚠️ Consumer must style    | ✅ Primer tokens | ✅ Primer tokens |
