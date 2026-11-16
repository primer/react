---
applyTo: 'packages/react-tailwind/src/**/*.ts,packages/react-tailwind/src/**/*.tsx'
---

# React Tailwind component authoring

These package-specific rules supersede generic Primer React implementation
guidance where the two implementations differ.

## Architecture

- Keep each public component in `src/components/<PascalCaseName>/` with its
  implementation, tests, stories, README, alignment notes, and public `index.ts`.
- Put package-private behavior and composition helpers in `src/internal`.
  Reusable public types belong in `src/utils/types`; do not export incidental
  implementation types.
- Build higher-order components by composing existing package primitives and
  shared internal layers. Do not recreate a Button, ActionList, Overlay,
  FormControl, text style, focus treatment, or state adapter inside another
  component.
- Extract shared behavior, variants, and structural parts when multiple
  components rely on the same contract. Keep dependencies flowing from
  low-level primitives to compound and higher-order components; do not introduce
  circular family dependencies.
- When a package primitive is almost sufficient for a higher-order component,
  extend the primitive with a coherent part, prop, or internal capability rather
  than bypassing or duplicating it. Do not expose one consumer's incidental
  implementation details as general API.
- Keep presentational modules server-safe. Add `'use client'` only when hooks,
  browser APIs, or a Base UI primitive require a client boundary.
- Target React 19 and keep every runtime module compatible with React Compiler.
  Do not add manual memoization to compensate for an unclear data flow.
- Do not import runtime code from `@primer/react`.

## Public APIs

- Expose only stable names. Promote the selected non-deprecated experimental or
  V2 replacement under the base component name; do not add legacy aliases.
- Preserve useful Primer React props and defaults when they remain coherent.
  Omit deprecated APIs, `sx`, and styled-system props.
- Prefer consistent state APIs:
  `value/defaultValue/onValueChange`, `open/defaultOpen/onOpenChange`, and
  `checked/defaultChecked/onCheckedChange`. Native controls retain native form
  events when that is the clearer platform contract.
- Compound components use recognizable namespaces and Base UI-oriented part
  names such as `Root`, `Trigger`, `Portal`, `Positioner`, `Popup` or `Content`,
  `Title`, `Description`, and `Close`.
- Use Base UI's `render` prop for element replacement and behavior composition.
  Keep `as` only for simple presentational components where Primer compatibility
  is valuable.
- Forward the public ref and all valid rest DOM props to the same rendered root
  or primitive part. Never put the ref on an undocumented wrapper while
  forwarding DOM props elsewhere.
- Add stable PascalCase `data-component` identifiers to public roots and
  meaningful public parts. Expose behavior state through separate `data-*`
  attributes.
- Share established size, placement, alignment, responsive, and component types
  instead of creating component-local synonyms. Do not weaken types with
  assertions or broad escape hatches.

## Base UI composition

- Use Base UI for behavior it owns: ARIA, keyboard navigation, focus,
  dismissal, portals, positioning, collections, and controlled state. Do not
  reimplement those systems in parallel.
- Preserve Base UI callback details, event cancellation, refs, state attributes,
  portal ownership, and form behavior unless an intentional compatibility
  adapter is documented and tested.
- Compose branded triggers and controls with `render={<Component />}`. Never
  create nested buttons, links, labels, or other interactive elements.
- Pass `id` to the outermost Base UI part in a render chain, never to its
  render element. Menu, Popover, Dialog, and Tooltip triggers track their open
  state by the `id` they register, and render-element props win the merge. Route
  `aria-describedby`/`aria-labelledby` through a `Tooltip.Trigger` so they merge
  with the tooltip's references instead of replacing them. Omit optional keys
  rather than passing `prop={undefined}` to a render element, since
  `mergeProps` keeps explicit `undefined` values.
- Keep popup composition explicit: root, trigger or anchor, portal, positioner,
  backdrop where applicable, and popup/content. Avoid hidden wrapper contracts.
- Avoid duplicating Base UI state in React state. Derive presentational state
  from primitive state or documented callbacks.
- Use normal React children and namespaces rather than Primer's `__SLOT__`
  extraction unless a parent truly must identify and reorder a specific child.

## Quality requirements

- Keep components small, typed, and direct. Prefer one well-designed shared
  layer over repeated markup, state, Tailwind variants, or Base UI adapters, but
  do not abstract merely similar-looking code without a shared contract.
- Before adding a primitive or helper, search the package for an existing layer.
  Before using Base UI directly in a higher-order component, verify that a
  package primitive cannot supply the behavior cleanly, extending that primitive
  when doing so improves its coherent contract.
- Delete stale compatibility branches, unnecessary comments, and success-shaped
  fallbacks. Invalid states must surface through the established component or
  Base UI behavior.
- Test public behavior rather than implementation details: refs and DOM props,
  controlled and uncontrolled state, keyboard/focus behavior, forms, portals,
  callbacks, SSR/hydration, and accessible semantics as applicable.
- Record every intentional legacy difference or ambiguous compatibility choice
  in the component's `ALIGNMENT.md`.
- After changing runtime code, run the component tests, package type-check,
  React Compiler check, build, API inventory check, and export check.
