# CSS

Use these guidelines when authoring CSS

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Overview](#overview)
- [Guidelines](#guidelines)
  - [Prefer using `clsx` for conditional class names](#prefer-using-clsx-for-conditional-class-names)
  - [Prefer using `data-*` attributes for states or modifiers instead of CSS class names](#prefer-using-data--attributes-for-states-or-modifiers-instead-of-css-class-names)
  - [Prefer using CSS Custom Properties to bridge between CSS and JavaScript instead of inline styles](#prefer-using-css-custom-properties-to-bridge-between-css-and-javascript-instead-of-inline-styles)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Overview

Component styles are authored using CSS Modules in files that live beside the
corresponding component, for example:

- `packages/react/src/Banner/Banner.tsx`
- `packages/react/src/Banner/Banner.module.css`

## Guidelines

### Prefer using `clsx` for conditional class names

When authoring components, there may be situations where you want a class name
to only be applied if a condition is met. In these situations, prefer using the
`clsx` library to conditional apply class names.

<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
function Example({isActive}) {
  return (
    <div className={`example ${isActive ? 'active' : ''}`}>
      <div>Example</div>
    </div>
  )
}
```

</td><td>

```tsx
function Example({isActive}) {
  return (
    <div className={clsx('example', {active: isActive})}>
      <div>Example</div>
    </div>
  )
}
```

</td></tr>
</tbody></table>

### Prefer using `data-*` attributes for states or modifiers instead of CSS class names

<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
function Example({variant}: {variant: 'primary' | 'secondary'}) {
  return (
    <div
      className={clsx(classes.Example, {
        [classes.ExamplePrimary]: variant === 'primary',
        [classes.ExampleSecondary]: variant === 'secondary',
      })}
    >
      Example
    </div>
  )
}
```

</td><td>

```tsx
function Example({variant}: {variant: 'primary' | 'secondary'}) {
  return (
    <div className={classes.Example} data-variant={variant}>
      Example
    </div>
  )
}
```

</td></tr>
</tbody></table>

### Prefer using CSS Custom Properties to bridge between CSS and JavaScript instead of inline styles

<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
function Example({variant}: {variant: 'primary' | 'secondary'}) {
  return (
    <div
      style={{
        color: variant === 'primary' ? 'blue' : 'red',
      }}
    >
      Example
    </div>
  )
}
```

</td><td>

```tsx
function Example({variant}: {variant: 'primary' | 'secondary'}) {
  return (
    <div
      style={{
        '--example-color': variant === 'primary' ? 'blue' : 'red',
      }}
    >
      Example
    </div>
  )
}
```

</td></tr>
</tbody></table>
