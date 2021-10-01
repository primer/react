# ADR 003: Prop norms in Primer React Components

## Status

Proposed

## Context

Today we have:

- Implicit conventions not documented anywhere but consistently reflected in our code (e.g., the type of the `sx` prop)
- Explicit plans to change some of those (e.g., the deprecation of styled-system props)
- Inconsistencies in our implementation (e.g., when components accept a `ref` prop)

This ADR aims to unify conversations about prop APIs, codify our decisions, and sequence the work to get there.

## Decision

### 🟢 `sx`

All components that ultimately render to the DOM should accept an `sx` prop.

The `sx` prop (of type `SystemStyleObject`) should generally set styles for the root HTML element rendered by the component. An exception would be components like `Dialog`, whose outermost HTML element is a backdrop. In that case, it would be appropriate for `sx` styles to apply to child of the backdrop that is more likely to need styling overrides.

It may make sense to have an additional prop to style a descendant element (e.g., `Dialog` could accept a `backdropSx` prop).

### 🟢 `ref`

All components that ultimately render to the DOM should accept a `ref` prop. That `ref` prop should be passed to the root HTMLElement rendered by the component.

### 🟡 `as`

Only components with a clear need for polymorphism should accept an `as` prop. Reasonable cases include:

- Components that need functionality from the `as` prop, like a button
- Components whose accessibility are improved by using semantically appropriate HTML elements

When passing an `as` prop to a component, it should be done in a way that is consistent with the component’s intended use.

### 🟡 DOM props: Limited

All components that accept an `as` prop should accept the props for the element specified by the as prop. _Additionally_, some other elements (e.g., `<TextInput>`) should accept the props for their root HTML element when those props are fundamental to the component’s function.

### 🔴 System props

Components should not accept styled system props (except our utility components: `Box` and `Type`)

_Reasoning:_ Utility components are meant to provide a convenient API for writing styles (including styles that reference theme and other context managed within Primer). Non-utility components implement specific design patterns where additional styling is available for exceptional cases.

- Context: https://github.com/github/primer/discussions/132

### 🔴 `theme`

Components should not accept a `theme` prop (with the exception of `ThemeProvider`).

_Reasoning:_ The `theme` prop doesn't enable anything that can't be done with `<ThemeProvider>`, and promotes the anti-pattern of per-component theme overrides.

### ❓ `children`

TK What can we say about children? What conventions do we expect when a components accepts children, but of a certain type?

## Sequencing

1. Deprecate unwanted props (should be done? Let's verify.)
1. Release an eslint rule to disallow system props
1. Release an eslint rule to disallow `theme`
1. Migrate all usage within PRC
1. Assist memex with migration
1. Remove support for unwanted props
1. Update docs to reflect the standards in this ADR
