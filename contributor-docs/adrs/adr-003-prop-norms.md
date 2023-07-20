# ADR 003: Prop norms in Primer React Components

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | ✅     |

## Context

Our component prop APIs have, at times been a bit of a mess. We've seen:

- Implicit conventions not documented anywhere but consistently reflected in our code (e.g., the type of the `sx` prop)
- Explicit plans to change some of those (e.g., the deprecation of Styled System props)
- Inconsistencies in our implementation (e.g., when components accept a `ref` prop)

This ADR aims to unify some of these conversations about prop APIs, codify our decisions, and sequence the work to get there.

## Decision

### 🟢 `sx`

All components that ultimately render to the DOM should accept an `sx` prop.

The `sx` prop (of type `SystemStyleObject`) should generally set styles for the root HTML element rendered by the component. An exception would be components like `<Dialog>`, whose outermost HTML element is a backdrop. In that case, it would be appropriate for `sx` styles to apply to child of the backdrop that is more likely to need styling overrides.

### 🟢 `ref`

All components that ultimately render to the DOM should accept a `ref` prop. That `ref` prop should most often be passed to the root HTMLElement rendered by the component, although occasionally a different descendent node may make more sense.

See also: [Discussion on `ref` props (internal)](https://github.com/github/primer/discussions/131)

### 🟡 `as`

Only components with a clear need for polymorphism should accept an `as` prop. Reasonable cases include:

- Components that need functionality from the component passed to the `as` prop, like a `<Button>` that renders a React Router link.
- Components whose accessibility are improved by using semantically appropriate HTML elements, like an ActionList

When a Primer component user passes an `as` prop to a component, it should be done in a way that is consistent with the component’s intended use. In some situations we can enforce that with a narrowed type for our `as` prop.

See also: [Discussion on `as` props (internal)](https://github.com/github/primer/discussions/130)

### 🟡 DOM props: Limited

All components that accept an `as` prop should accept props en masse for the element specified by the `as` prop (excluding props of the same name already used by the component). _Additionally_, some other elements that do _not_ accept an `as` prop should accept the props for their root HTML element when those props are fundamental to the component’s function (e.g., `<TextInput>` should accept DOM props for its underlying `<input>`).

### 🔴 Styled System props

Components should not accept Styled System props (except our utility components: `Box` and `Text`)

_Reasoning:_ Utility components are meant to provide a convenient API for writing styles (including styles that reference theme and other context managed within Primer). Non-utility components implement specific design patterns where additional styling is available for exceptional cases.

See also: [Discussion on the deprecation of styled-system props (internal)](https://github.com/github/primer/discussions/132)

### 🔴 `theme`

Components should not accept a `theme` prop (with the exception of `ThemeProvider`).

_Reasoning:_ The `theme` prop doesn't enable anything that can't be done with `<ThemeProvider>`, and promotes the anti-pattern of per-component theme overrides.

### `children`

I'm intentionally withholding advocacy about `children` prop types because I expect that topic will be covered by a future ADR.

### Sequencing

1. Deprecate remaining unwanted Styled System props (should be done? Let's verify.)
1. Release an eslint rule to disallow Styled System props
1. Release an eslint rule to disallow `theme`
1. Migrate all usage within PRC
1. Assist GitHub projects with migration
1. Remove support for unwanted props
1. Update docs to reflect the standards in this ADR
