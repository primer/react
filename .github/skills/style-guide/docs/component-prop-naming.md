# Component Prop Naming

Use these conventions when creating, editing, or evaluating props for Primer React components.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Boolean props](#boolean-props)
  - [Name state props as a bare adjective](#name-state-props-as-a-bare-adjective)
  - [Prefix default values with `default*`](#prefix-default-values-with-default)
  - [Name configuration props based on durable defaults](#name-configuration-props-based-on-durable-defaults)
  - [Use `hide` or `show` for visibility-related props](#use-hide-or-show-for-visibility-related-props)
  - [Prefer named modes for behavior with multiple options](#prefer-named-modes-for-behavior-with-multiple-options)
  - [Use a single mode prop instead of mutually exclusive boolean props](#use-a-single-mode-prop-instead-of-mutually-exclusive-boolean-props)
- [Use the variant prop to communicate purpose](#use-the-variant-prop-to-communicate-purpose)
- [Avoid using the variant prop to communicate appearance](#avoid-using-the-variant-prop-to-communicate-appearance)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Boolean props

### Name state props as a bare adjective

Component props that represent state must be named without a prefix. For
example:

- Prefer `open` over `isOpen`
- Prefer `expanded` over `isExpanded`
- Prefer `selected` over `isSelected`

### Prefix default values with `default*`

When exposing a default value for a state prop, prefix the bare adjective with
`default*`. For example:

- Prefer `defaultOpen` over `defaultIsOpen`
- Prefer `defaultExpanded` over `defaultIsExpanded`
- Prefer `defaultSelected` over `defaultIsSelected`

### Name configuration props based on durable defaults

When a prop is used to configure what a component does, for example hiding a
title, name the prop after the non-default action a consumer takes. For example:

- Use `hideTitle` when the title is visible by default
- Use `showDivider` when the divider is hidden by default
- Use `hideCloseButton` when the close button is visible by default

This helps avoid inverted naming. For example, a prop named `showTitle` may end up
being passed as `false` in most usage, whereas a prop named `hideTitle` would
typically be passed as `true`.

A default is durable when:

- It is part of the component's structural contract, such as whether an optional
  part is rendered
- It is consistent across variants, viewport sizes, and usage contexts
- Changing it would be an intentional design change rather than an implementation
  detail or contextual adjustment
- The non-default action has a concise, unambiguous name

If a default varies by context or both values represent meaningful behaviors,
prefer a stable state name or named modes. The prop name should continue to
describe the requested behavior if the default changes. For example:

```tsx
// Avoid
type ExampleProps = {
  disableTruncation?: boolean
  disableStickyPositioning?: boolean
}

// Prefer
type ExampleProps = {
  textOverflow?: 'truncate' | 'wrap'
  position?: 'sticky' | 'static'
}
```

### Use `hide` or `show` for visibility-related props

When a configuration prop adds or removes a named optional part of a component
and has one stable default, use `hide` or `show` in the prop name. For example:

- Use `hideTitle` when the title is visible by default
- Use `showDivider` when the divider is hidden by default

For visibility state, native HTML semantics, or responsive values, names such as
`hidden` may be appropriate.

### Prefer named modes for behavior with multiple options

When behavior has multiple meaningful modes, prefer a named string-literal union
that describes those modes. For example:

```tsx
// Avoid
type ExampleProps = {
  preventOverflow?: boolean
}

// Prefer
type ExampleProps = {
  overflow?: 'auto' | 'prevent'
}
```

Keep a boolean prop for a stable binary capability or state, such as `disabled`,
`required`, or `loading`, or for configuration based on a durable default. Use a
discriminated union when a mode determines which other props are valid. For
example:

```tsx
type ExampleProps =
  | {
      variant: 'icon'
      'aria-label': string
    }
  | {
      variant: 'text'
      children: React.ReactNode
    }
```

### Use a single mode prop instead of mutually exclusive boolean props

When a component has multiple boolean props that are mutually exclusive, replace
them with one string-literal union prop. This makes it clear that only one option
can be selected at a time and improves type safety. For example:

```tsx
// Avoid
type ExampleProps = {
  singleSelect?: boolean
  multiSelect?: boolean
}

// Prefer
type ExampleProps = {
  selectionVariant?: 'single' | 'multiple'
}
```

## Use the variant prop to communicate purpose

The variant prop is used when a component has multiple semantic variants that
are mutually exclusive. It is used to indicate which variant to use for a
component. When naming variants for a component, each variant should be a
semantic description of the variant's purpose rather than its appearance.

For example, consider a `Banner` component. This component is used to
communicate information to the user. The `variant` prop could be used to
indicate the purpose of the information within the banner. For example:

```tsx
// Prefer
type BannerProps = {
  variant?: 'info' | 'warning' | 'error' | 'success'
}

// Avoid
type BannerProps = {
  variant?: 'blue' | 'yellow' | 'red' | 'green'
}
```

It's important the `variant` is semantic and communicates the purpose of the
component rather than its appearance. This allows for more flexibility in the
future if the appearance of the component changes.

## Avoid using the variant prop to communicate appearance

The variant prop is exclusively meant to communicate the purpose of a component.
It must not be used to communicate the appearance of a component. For example:

```tsx
// Avoid
type ExampleSizeProps = {
  variant?: 'large' | 'medium' | 'small'
}

// Prefer
type ExampleSizeProps = {
  size?: 'large' | 'medium' | 'small'
}

// Avoid
type ExamplePaddingProps = {
  variant?: 'inset' | 'flush'
}

// Prefer
type ExamplePaddingProps = {
  padding?: 'inset' | 'flush'
}

// Avoid
type ExampleAppearanceProps = {
  variant?: 'square' | 'rounded'
}

// Prefer
type ExampleAppearanceProps = {
  shape?: 'square' | 'rounded'
}
```
