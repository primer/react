# Accessibility Contract — Modular Component Architecture

Each layer shifts accessibility responsibility to the consumer differently. This table defines what each layer handles automatically and what the consumer must provide.

## Responsibility matrix

Use Dialog as the reference example. Apply the same pattern to other components — identify the ARIA pattern (dialog, tabs, menu, listbox, etc.) and map each requirement to the appropriate layer.

### Dialog example

| Requirement                            | L4 (Hooks)           | L3 (Foundations)                  | L2 (Parts)        | L1 (Ready-made)         |
| -------------------------------------- | -------------------- | --------------------------------- | ----------------- | ----------------------- |
| `role="dialog"` / `role="alertdialog"` | Consumer sets        | ✅ Automatic                      | ✅ Inherited      | ✅ Inherited            |
| `aria-modal="true"`                    | Consumer sets        | ✅ Automatic                      | ✅ Inherited      | ✅ Inherited            |
| `aria-labelledby` → title              | Consumer wires       | ✅ Auto-wired via context         | ✅ Inherited      | ✅ From `title` prop    |
| `aria-describedby` → description       | Consumer wires       | ✅ Auto-wired if Description used | ✅ Inherited      | ✅ From `subtitle` prop |
| Focus trapping                         | Consumer implements  | ✅ Native `showModal()`           | ✅ Inherited      | ✅ Inherited            |
| Escape closes                          | Consumer handles     | ✅ Automatic                      | ✅ Inherited      | ✅ Inherited            |
| Focus moves into component             | Consumer manages     | ✅ Automatic                      | ✅ Inherited      | ✅ Inherited            |
| Focus returns on close                 | Consumer manages     | ✅ Automatic                      | ✅ Inherited      | ✅ Inherited            |
| Visible close button                   | Consumer provides    | ✅ Enforced by structure          | ✅ Built-in       | ✅ Built-in             |
| Background inert                       | Consumer manages     | ✅ Native `showModal()`           | ✅ Inherited      | ✅ Inherited            |
| Scroll lock                            | `useScrollLock` hook | ✅ Automatic                      | ✅ Inherited      | ✅ Inherited            |
| Visible backdrop                       | Consumer provides    | ⚠️ Consumer must style            | ✅ Primer token   | ✅ Primer token         |
| Appropriate heading level              | Consumer chooses     | ⚠️ Consumer must choose           | ✅ `<h2>` default | ✅ `<h2>` default       |
| Colour contrast                        | Consumer responsible | ⚠️ Consumer must ensure           | ✅ Primer tokens  | ✅ Primer tokens        |

## Key principles

### Layer 3 consumer responsibilities

At Layer 3, the foundation ships a transparent backdrop by default. Per ARIA APG, `aria-modal="true"` should only be set when background content is **both** non-interactive and visually obscured. Consumers using Layer 3 foundations **must** provide visible backdrop styling to meet this requirement. Layer 2 Parts handle this automatically with Primer tokens.

### `aria-describedby` guidance

Per ARIA APG, omit `aria-describedby` when content has complex semantic structure (lists, tables, multiple paragraphs) — screen readers announce it as a flat string. At Layer 3+, don't render the Description component if content is complex. At Layer 4, don't call `getDescriptionProps()`.

### Initial focus guidance

For components with complex semantic content, set `initialFocusRef` to a static element at the top with `tabIndex={-1}` so assistive technology users can navigate the structure. For destructive actions, focus the least destructive button.

### Dev-mode warnings

The compound hook (Layer 3) should fire a dev-mode warning when:

- No accessible name is provided (neither `getTitleProps()` called nor `aria-label` passed)
- Required structural elements are missing

Use `queueMicrotask` to check after render so prop-getters have been called:

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

## Applying to other ARIA patterns

When building a component with a different ARIA pattern (tabs, menu, listbox, etc.), create a similar responsibility matrix:

1. **Identify the ARIA APG pattern** — read the W3C ARIA Authoring Practices Guide for the relevant pattern
2. **List all requirements** — roles, states, properties, keyboard interaction, focus management
3. **Assign to layers** following the same principle:
   - L4: Consumer does everything (hook provides raw behaviour only)
   - L3: Automatic ARIA wiring, focus management, keyboard interaction
   - L2: Inherits L3 + adds visual styling with Primer tokens
   - L1: Inherits L2 + maps props to Parts children
4. **Mark consumer responsibilities** — anything L3 does NOT handle automatically (⚠️) must be documented clearly

### Tabs example (skeleton)

| Requirement                     | L4 (Hooks)          | L3 (Foundations)          | L2 (Parts)       | L1 (Ready-made)  |
| ------------------------------- | ------------------- | ------------------------- | ---------------- | ---------------- |
| `role="tablist"`                | Consumer sets       | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| `role="tab"` on each tab        | Consumer sets       | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| `role="tabpanel"` on each panel | Consumer sets       | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| `aria-selected` on active tab   | Consumer manages    | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| `aria-controls` tab → panel     | Consumer wires      | ✅ Auto-wired via context | ✅ Inherited     | ✅ Inherited     |
| Arrow key navigation            | `useFocusZone` hook | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Home/End to first/last tab      | Consumer handles    | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Hidden panels (`hidden` attr)   | Consumer manages    | ✅ Automatic              | ✅ Inherited     | ✅ Inherited     |
| Focus indicator styling         | Consumer styles     | ⚠️ Consumer must style    | ✅ Primer tokens | ✅ Primer tokens |
