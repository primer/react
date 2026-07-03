---
name: modular-ds-accessibility-contract
description: 'Use when: determining which Primer React API type (config, presentational, base, or utility) should own a specific accessibility responsibility, or documenting that ownership for a new component. Covers a responsibility matrix mapping ARIA requirements to API types, worked examples for Dialog and Tabs, and how to build a matrix for a new ARIA pattern.'
---

# Modular DS — Accessibility Contract

Each API type in the spectrum of abstraction model shifts accessibility responsibility to the consumer differently. This matrix defines what each API type handles automatically and what the consumer must provide themselves.

## Responsibility matrix — Dialog example

| Requirement                            | Utility               | Base component                    | Presentational   | Config                  |
| --------------------------------------- | --------------------- | ---------------------------------- | ----------------- | ------------------------ |
| `role="dialog"` / `role="alertdialog"`  | Consumer sets          | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited             |
| `aria-modal="true"`                     | Consumer sets          | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited             |
| `aria-labelledby` → title                | Consumer wires         | ✅ Auto-wired via context          | ✅ Inherited      | ✅ From `title` prop     |
| `aria-describedby` → description        | Consumer wires         | ✅ Auto-wired if Description used  | ✅ Inherited      | ✅ From `subtitle` prop  |
| Focus trapping                          | Consumer implements    | ✅ Native `showModal()`            | ✅ Inherited      | ✅ Inherited             |
| Escape closes                           | Consumer handles       | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited             |
| Focus moves into component               | Consumer manages       | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited             |
| Focus returns on close                  | Consumer manages       | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited             |
| Visible close control                   | Consumer provides      | ✅ Enforced by structure           | ✅ Built-in       | ✅ Built-in              |
| Background inert                        | Consumer manages       | ✅ Native `showModal()`            | ✅ Inherited      | ✅ Inherited             |
| Scroll lock                             | `useScrollLock` hook   | ✅ Automatic                       | ✅ Inherited      | ✅ Inherited             |
| Visible backdrop                        | Consumer provides      | ⚠️ Consumer must style              | ✅ Primer token   | ✅ Primer token          |
| Appropriate heading level                | Consumer chooses       | ⚠️ Consumer must choose             | ✅ `<h2>` default | ✅ `<h2>` default        |
| Colour contrast                         | Consumer responsible   | ⚠️ Consumer must ensure             | ✅ Primer tokens  | ✅ Primer tokens         |

## Key principles

### Base component consumer responsibilities

At the base component level, a foundation like a dialog ships a transparent backdrop by default. Per ARIA APG, `aria-modal="true"` should only be set when background content is **both** non-interactive and visually obscured — so consumers using a base component directly **must** provide visible backdrop styling to meet this requirement. Presentational components handle this automatically with Primer tokens.

### `aria-describedby` guidance

Per ARIA APG, omit `aria-describedby` when content has complex semantic structure (lists, tables, multiple paragraphs) — screen readers announce it as a flat string. At the base-component level or above, don't render a Description part if content is complex. At the utility/hook level, don't call `getDescriptionProps()`.

### Initial focus guidance

For components with complex semantic content, set an initial-focus ref to a static element at the top with `tabIndex={-1}` so assistive technology users can navigate the structure. For destructive actions, focus the least destructive control.

### Dev-mode warnings

A component's compound hook (see `modular-ds-utilities`) should fire a dev-mode warning when no accessible name is provided (neither a title part used, nor `aria-label` passed) or when required structural elements are missing. Check after render, once prop-getters have been called:

```tsx
useEffect(() => {
  if (process.env.NODE_ENV !== 'production' && open) {
    queueMicrotask(() => {
      if (!titleUsed.current && !ariaLabel) {
        console.warn('<Component>: No accessible name provided. Use getTitleProps() on a title element, or pass aria-label.')
      }
    })
  }
}, [open, ariaLabel])
```

## Applying this to other ARIA patterns

When building a component with a different ARIA pattern (tabs, menu, listbox, etc.), build a similar responsibility matrix:

1. **Identify the ARIA APG pattern** — read the W3C ARIA Authoring Practices Guide for the relevant pattern.
2. **List all requirements** — roles, states, properties, keyboard interaction, focus management.
3. **Assign to API types**, following the same principle: utility/consumer does everything by default; base component automates ARIA wiring, focus management, and keyboard interaction; presentational inherits the base component and adds Primer-token styling; config inherits presentational and maps props to its children.
4. **Mark consumer responsibilities** (⚠️) — anything the base component does NOT handle automatically must be documented clearly.

### Tabs example (skeleton)

| Requirement                     | Utility              | Base component             | Presentational   | Config           |
| -------------------------------- | --------------------- | --------------------------- | ----------------- | ------------------ |
| `role="tablist"`                 | Consumer sets          | ✅ Automatic                 | ✅ Inherited      | ✅ Inherited        |
| `role="tab"` on each tab          | Consumer sets          | ✅ Automatic                 | ✅ Inherited      | ✅ Inherited        |
| `role="tabpanel"` on each panel   | Consumer sets          | ✅ Automatic                 | ✅ Inherited      | ✅ Inherited        |
| `aria-selected` on active tab     | Consumer manages       | ✅ Automatic                 | ✅ Inherited      | ✅ Inherited        |
| `aria-controls` tab → panel       | Consumer wires         | ✅ Auto-wired via context    | ✅ Inherited      | ✅ Inherited        |
| Arrow key navigation              | `useFocusZone` hook    | ✅ Automatic                 | ✅ Inherited      | ✅ Inherited        |
| Home/End to first/last tab        | Consumer handles       | ✅ Automatic                 | ✅ Inherited      | ✅ Inherited        |
| Hidden panels (`hidden` attr)     | Consumer manages       | ✅ Automatic                 | ✅ Inherited      | ✅ Inherited        |
| Focus indicator styling           | Consumer styles        | ⚠️ Consumer must style        | ✅ Primer tokens  | ✅ Primer tokens    |
