# Component Props

Use these conventions when authoring props for Primer React components.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Naming conventions](#naming-conventions)
  - [Prefer native names](#prefer-native-names)
  - [Controlled and uncontrolled state](#controlled-and-uncontrolled-state)
  - [Boolean props](#boolean-props)
  - [Visual options](#visual-options)
  - [Leading and trailing content](#leading-and-trailing-content)
  - [Text, labels, and announcements](#text-labels-and-announcements)
- [Guidelines](#guidelines)
  - [Prefer applying component rest parameters to the root element rendered by a component](#prefer-applying-component-rest-parameters-to-the-root-element-rendered-by-a-component)
  - [Prefer authoring callback prop types with arguments that can be extended](#prefer-authoring-callback-prop-types-with-arguments-that-can-be-extended)
  - [Prefer the `useControllableState` hook when authoring components that can be controlled or uncontrolled](#prefer-the-usecontrollablestate-hook-when-authoring-components-that-can-be-controlled-or-uncontrolled)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Naming conventions

Use these conventions when deciding on a prop name for a Primer React component.
Start from existing React, HTML, and ARIA names when they already describe the
behavior, then use Primer-specific names only when the prop represents a design
system concept.

### Prefer native names

Use native React and HTML prop names when the component exposes the same concept:

- `children`, `className`, `style`, `id`, `ref`
- `as`, `href`, `target`, `rel`
- `disabled`, `required`, `checked`, `defaultChecked`, `value`, `defaultValue`
- `onChange`, `onClick`, `onKeyDown`, and other native event names

Use real ARIA prop names instead of aliases:

- Do: `'aria-label'`, `'aria-labelledby'`, `'aria-describedby'`
- Don't: `label`, `labelledBy`, `describedBy` when the value maps directly to an
  ARIA attribute

### Controlled and uncontrolled state

For controlled state, pair the state prop with an `onXChange` callback:

- `open` / `onOpenChange`
- `selected` / `onSelectedChange`
- `expanded` / `onExpandedChange`
- `checked` / `onChange` for native-like form controls

For uncontrolled state, use `defaultX`:

- `defaultOpen`
- `defaultSelected`
- `defaultExpanded`
- `defaultChecked`

Prefer the state name directly (`open`, `selected`, `expanded`) over `isOpen`,
`isSelected`, or `isExpanded` for public component props. Existing `is*` props
are usually legacy APIs and should not be used as the default pattern for new
props.

### Boolean props

Use direct adjective or state names when the prop toggles behavior or appearance:

- `disabled`
- `loading`
- `inactive`
- `selected`
- `current`
- `checked`
- `expanded`
- `open`
- `required`
- `indeterminate`
- `truncate`
- `inline`
- `block`
- `fullWidth`

Use `has*` when the prop describes the presence of a structural visual element:

- `hasBorder`

Use `show*` or `hide*` when the prop explicitly controls visibility of optional
content:

- `showSelectAll`
- `showSelectedOptionsFirst`
- `hideTitle`

Use `disable*` sparingly for opt-outs where the default behavior stays enabled:

- `disableFullscreenOnNarrow`

### Visual options

Use `variant` for visual style and `size` for scale.

Examples:

- `variant="default" | "primary" | "danger"`
- `size="small" | "medium" | "large"`

When styling component options with data attributes, mirror the public prop name:

- `variant` -> `data-variant`
- `size` -> `data-size`
- `loading` -> `data-loading`

### Leading and trailing content

Use logical position names for content that appears before or after the main
content:

- `leadingVisual`
- `trailingVisual`
- `trailingAction`
- `leadingAction`
- `secondaryAction`

Prefer `Visual` over `Icon` when the slot can contain any visual React node or
component, not only an Octicon. Older props such as `icon`, `leadingIcon`, and
`trailingIcon` are commonly deprecated in favor of `leadingVisual` or
`trailingVisual`.

### Text, labels, and announcements

Use `children` for primary visible content when possible.

Use semantic names for specific visible text:

- `title`
- `subtitle`
- `description`
- `placeholder`
- `caption`
- `text`

Use purpose-specific names for assistive technology text that the component
renders or announces:

- `srText`
- `loadingAnnouncement`
- `loadingLabel`

Use ARIA attribute names directly when the consumer is providing the accessible
name or description for the underlying element:

- `'aria-label'`
- `'aria-labelledby'`
- `'aria-describedby'`

## Guidelines

### Prefer applying component rest parameters to the root element rendered by a component

Components may accept forwarding props to an underlying element through rest parameters. This strategy allows the component to accept common prop types like `className`, `data-testid`, and more without having to explicitly annotate each property in the component prop type definition. For example:

```tsx
type Props = React.HTMLAttributes<HTMLElement> & {
  variant?: 'primary' | 'secondary'
}

function Example({variant = 'primary', ...rest}: Props) {
  return (
    <div {...rest} data-variant={variant}>
      <div>{children}</div>
    </div>
  )
}
```

These rest parameters should be applied to the root element rendered by the
component. Tests must also make assertions these props are applied to the root
element.

<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
type Props = React.ComponentPropsWithoutRef<'div'>

function Example({children, ...rest}: Props) {
  return (
    <div className="outer">
      <div {...rest}>{children}</div>
    </div>
  )
}
```

</td><td>

```tsx
type Props = React.ComponentPropsWithoutRef<'div'>

function Example({children, ...rest}: Props) {
  return <div {...rest}>{children}</div>
}
```

</td></tr>
</tbody></table>

### Prefer authoring callback prop types with arguments that can be extended

When authoring callback props, it is helpful to structure the types for these
functions in ways that allow for changes over time. For example, instead of
having a dedicated argument for a value consider using an object that contains
that value as a property.

This structure allows additional properties to be added to the object without
having to update the function signature. In particular, this structure allows
us to more easily structure breaking changes if a property needs to be removed
from this type.

This structure is also helpful for creating a consistent function signature
across callback props. Consumers only ever need to supply one argument and will
not need to worry about which position the argument they care about is in.

<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
type Props = {
  onChange: (a: boolean, b: string, c: number) => void
}
```

</td><td>

```tsx
type Props = {
  onChange: ({a, b, c}: {a: boolean; b: string; c: number}) => void
}
```

</td></tr>
</tbody></table>

### Prefer the `useControllableState` hook when authoring components that can be controlled or uncontrolled

Components may be authored in a way that allows state values to be controlled or
uncontrolled. For example:

```tsx
type ExampleProps = {
  value?: string
  defaultValue?: string
  onChange({value}: {value: string}): void
}

function Example(props: ExampleProps) {
  // ...
}

function UncontrolledExample() {
  return (
    <Example
      defaultValue="Example default value"
      onChange={({value}) => {
        console.log(value)
      }}
    />
  )
}

function ControlledExample() {
  const [value, setValue] = React.useState('Example controlled value')
  return (
    <Example
      value={value}
      onChange={({value}) => {
        setValue(value)
      }}
    />
  )
}
```

When building out components that can controlled or uncontrolled, prefer using
the `useControllableState` hook. With the `Example` component above, this
would look like:

```tsx
function Example({defaultValue, onChange, value: controlledValue}: ExampleProps) {
  const [value, setValue] = useControllableState({
    value: controlledValue,
    defaultValue,
    onChange: ({value}) => {
      onChange({value})
    },
  })
}
```
