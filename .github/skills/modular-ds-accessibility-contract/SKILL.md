---
name: modular-ds-accessibility-contract
description: 'Use when: determining which Primer React API type (config, presentational, base, or utility) should own a specific accessibility responsibility, or documenting that ownership for a new component. Covers a responsibility matrix mapping ARIA requirements to API types, worked examples for Dialog and Tabs, and how to build a matrix for a new ARIA pattern.'
---

# Modular DS — Accessibility Contract

Each API type in the spectrum of abstraction model shifts accessibility responsibility to the consumer differently. This matrix defines what each API type handles automatically and what the consumer must provide themselves.

## Responsibility matrix — Dialog example

Read the columns as **scenarios, not a mandatory stack**. Each column describes what a consumer gets when the highest API type they're working with is that one — it does not imply that every component populates every column, or that a presentational component must sit on top of a base component. Per `modular-ds-spectrum-model`, each API type earns its place independently. Where no base component exists for a given part, the presentational component owns the ✅ items directly.

"Hook only" means the consumer renders all the markup themselves and spreads the hook's prop-getters onto it. The cells in that column describe what the consumer must do **in addition to** spreading the getters — "Consumer wires" means placing `getTitleProps()` on their own title element, "Consumer handles" means responding to the `onClose` the hook fires. It doesn't mean the consumer owns everything: where the hook drives lifecycle — for a dialog it owns `showModal()`/`close()`, per the controlled component contract in `modular-ds-utilities` — the side effects of that lifecycle apply at every column, including this one.

| Requirement                            | Hook only                | Base component                    | Presentational    | Config                  |
| -------------------------------------- | ------------------------ | --------------------------------- | ----------------- | ----------------------- |
| `role="dialog"` / `role="alertdialog"` | ✅ From `getRootProps()` | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| `aria-modal="true"`                    | ✅ From `getRootProps()` | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| `aria-labelledby` → title              | Consumer wires           | ✅ Auto-wired via context         | ✅ Auto-wired     | ✅ From `title` prop    |
| `aria-describedby` → description       | Consumer wires           | ✅ Auto-wired if Description used | ✅ Auto-wired     | ✅ From `subtitle` prop |
| Focus trapping                         | ✅ Native `showModal()`  | ✅ Native `showModal()`           | ✅ Automatic      | ✅ Automatic            |
| Escape closes                          | Consumer handles         | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| Focus moves into component             | Consumer manages         | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| Focus returns on close                 | ✅ Automatic             | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| Visible close control                  | Consumer provides        | ✅ Enforced by structure          | ✅ Built-in       | ✅ Built-in             |
| Background inert                       | ✅ Native `showModal()`  | ✅ Native `showModal()`           | ✅ Automatic      | ✅ Automatic            |
| Scroll lock                            | Consumer implements      | ✅ Automatic                      | ✅ Automatic      | ✅ Automatic            |
| Visible backdrop                       | Consumer provides        | ⚠️ Consumer must style            | ✅ Primer token   | ✅ Primer token         |
| Appropriate heading level              | Consumer chooses         | ⚠️ Consumer must choose           | ✅ `<h2>` default | ✅ `<h2>` default       |
| Colour contrast                        | Consumer responsible     | ⚠️ Consumer must ensure           | ✅ Primer tokens  | ✅ Primer tokens        |

## Key principles

### Base component consumer responsibilities

At the base component level, a foundation like a dialog ships a transparent backdrop by default. Per ARIA APG, `aria-modal="true"` should only be set when background content is **both** non-interactive and visually obscured — so consumers using a base component directly **must** provide visible backdrop styling to meet this requirement. Presentational components handle this automatically with Primer tokens.

### Wiring `aria-labelledby` and `aria-describedby`

**A getter must not emit an ID reference to a part that may not have rendered.** Gate the reference on the referenced part registering itself, using the same callback-ref mechanism for both attributes — `modular-ds-utilities` shows one. Don't gate on whether a getter was called: prop-getter call order isn't guaranteed, so that introduces a render-order dependency between getters. A callback ref doesn't, because it fires at commit rather than during render.

Where a hook has no registration mechanism, `aria-describedby` **may** be assigned unconditionally. A dangling `describedby` is silently ignored by assistive technology, so the simpler version is safe.

`aria-labelledby` may not. It outranks `aria-label` in the accessible name computation, so a reference to an element that never rendered both fails to name the component _and_ suppresses the `aria-label` fallback — leaving it with no accessible name at all.

Separately, per ARIA APG, omit `aria-describedby` entirely when content has complex semantic structure (lists, tables, multiple paragraphs) — screen readers announce it as a flat string. At the base-component level or above, don't render a Description part if content is complex. At the utility/hook level, don't call `getDescriptionProps()`.

### Initial focus guidance

For components with complex semantic content, set an initial-focus ref to a static element at the top with `tabIndex={-1}` so assistive technology users can navigate the structure. For destructive actions, focus the least destructive control.

### Optional APG semantics

Not every semantic an APG pattern permits should be on by default. When you build a component, go through the APG pattern and list **every** semantic and interaction it marks optional — not just the one named below. For each, make a deliberate call: default it on, or make it opt-in where defaulting would cause landmark proliferation or other semantic side effects. Document the call either way. An optional semantic that ships default-on without anyone recording the decision is the failure mode here, just as much as one that's wrongly defaulted.

Accordion panels are one worked example, not the whole rule: `role="region"` is optional in the APG, and applying it to every panel floods the landmark list on a page rendering many accordions — so default it off and let consumers turn it on for the cases where a landmark genuinely helps. Arrow-key navigation between accordion headers is optional in the same pattern and needs its own recorded decision; so does every other optional semantic in whichever pattern you're building.

Whenever you make a call like this, cover both the default and the opt-in path in tests, stories, or docs metadata so the tradeoff is visible to the next person.

**"Document the call" means a file in the repository.** Explaining your reasoning in a PR description, a chat response or a summary does not discharge this — those are read once and then lost, and the next person to touch the component sees only the code. The record has to land in a committed artifact: a test that names the behaviour, a story that demonstrates both paths, a docs metadata field, or a comment at the point of the decision. A component whose optional semantics were carefully reasoned about but only narrated has failed this rule exactly as much as one where nobody thought about them.

### Dev-mode warnings

A component's compound hook (see `modular-ds-utilities`) should fire a dev-mode warning when no accessible name is provided (neither a title part used, nor `aria-label` passed) or when required structural elements are missing. Use the existing `useDevOnlyEffect` (`packages/react/src/internal/hooks/useDevOnlyEffect.ts`) and the shared `warning` utility rather than hand-rolling either. `useDevOnlyEffect` holds the `__DEV__` guard internally, around the `useEffect` rather than inside it — which is the point, per ADR-012: an inline `process.env.NODE_ENV` check inside a plain `useEffect` still registers and schedules that effect on every production render. Call `useDevOnlyEffect` unconditionally; don't wrap it in a `__DEV__` check of your own.

If the hook already knows whether a title rendered, use that — don't go to the DOM for something you have in state. The `useDialog` sketch in `modular-ds-utilities` has a title part register itself through a callback ref, which gives the hook a `hasTitle` boolean directly:

```tsx
useDevOnlyEffect(() => {
  warning(!hasTitle && !ariaLabel, '<Component>: No accessible name provided. Render a title part, or pass aria-label.')
}, [hasTitle, ariaLabel])
```

A callback ref is not a render-phase side effect — it fires at commit and fires again with `null` on unmount, so the flag stays honest. What you must not do is mutate a ref from inside a prop-getter during render: that never resets when the title unmounts, and it's the version that looks obvious and is wrong.

Where a hook has no registration mechanism, query the DOM from the root instead. `Banner.tsx` sets that precedent, querying `[data-banner-title]` from its own root ref inside a dev-only effect. Be aware it costs you a root ref and a stable attribute to query for — presentational parts carry `data-component`, but base parts aren't required to, so check the part you're querying actually has one.

Note `warning` fires when its first argument is **truthy** — it takes the failing condition, not the passing one. Test the name for falsiness rather than for `undefined`: `aria-label=""` type-checks, renders an unnamed component, and slips past an `=== undefined` check.

## Applying this to other ARIA patterns

When building a component with a different ARIA pattern (tabs, menu, listbox, etc.), build a similar responsibility matrix:

1. **Identify the ARIA APG pattern** — read the W3C ARIA Authoring Practices Guide for the relevant pattern.
2. **List all requirements** — roles, states, properties, keyboard interaction, focus management.
3. **Assign each requirement to the lowest API type that will actually exist for this component.** As a default: the consumer does everything at the hook-only level; a base component automates ARIA wiring, focus management, and keyboard interaction; a presentational component adds Primer-token styling on top; a config component maps props to its children. Don't assume all four exist — where a component has no base component, the presentational component owns the ARIA wiring directly.
4. **Mark consumer responsibilities (⚠️)** in **every column** where someone working at that level must handle the requirement themselves, even if a higher API type handles it automatically — `Visible backdrop` in the Dialog matrix above is ⚠️ for base-component consumers _and_ ✅ for presentational ones, and both facts matter. Where a component has no base component, its ⚠️ items belong in the lowest column that does exist, not in a base column invented to hold them.
5. **Commit the matrix.** It's a deliverable, not a thinking aid — put it in the component's docs metadata, a markdown file alongside the component, or its docs page. Every ⚠️ is something a consumer must be told; a matrix that only ever existed in a PR description tells nobody. This is where APG consumer-side caveats belong, such as a pattern warning against nesting controls that need the same arrow keys the component binds.

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
