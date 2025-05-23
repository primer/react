<!--
Inspired by Uber's Go Style Guide:
https://github.com/uber-go/guide/blob/85bf203f4371a8ae9e5e9a4d52ea77b17ca04ae6/style.md

Editing this document:

- Update the table of contents as new sections are added or removed. You can use
  `npx doctoc --title '## Table of Contents' contributor-docs/style.md` to accomplish this
- Use tables for side-by-side code samples. See below.

Code Samples:

Use 2 spaces to indent. Horizontal real estate is important in side-by-side
samples.

For side-by-side code samples, use the following snippet.

~~~
<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
UNPREFERRED CODE GOES HERE
```

</td><td>

```tsx
PREFERRED CODE GOES HERE
```

</td></tr>
</tbody></table>
~~~

(You need the empty lines between the <td> and code samples for it to be
treated as Markdown.)

If you need to add labels or descriptions below the code samples, add another
row before the </tbody></table> line.

~~~
<tr>
<td>DESCRIBE UNPREFERRED CODE</td>
<td>DESCRIBE PREFERRED CODE</td>
</tr>
~~~

-->

# Primer Style Guide

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [React](#react)
  - [Server-side rendering](#server-side-rendering)
  - [Prefer managing focus through event handlers instead of effects](#prefer-managing-focus-through-event-handlers-instead-of-effects)
  - [Prefer the `useControllableState` hook when authoring components that can be controlled or uncontrolled](#prefer-the-usecontrollablestate-hook-when-authoring-components-that-can-be-controlled-or-uncontrolled)
  - [Props](#props)
    - [Prefer applying component rest parameters to the root element rendered by a component](#prefer-applying-component-rest-parameters-to-the-root-element-rendered-by-a-component)
    - [Prefer authoring callback prop types with arguments that can be extended](#prefer-authoring-callback-prop-types-with-arguments-that-can-be-extended)
  - [Hooks](#hooks)
    - [Prefer authoring hooks that accept a `ref` instead of returning a `ref` to apply](#prefer-authoring-hooks-that-accept-a-ref-instead-of-returning-a-ref-to-apply)
    - [Prefer creating stable callbacks from hook arguments instead of adding them to dependency arrays](#prefer-creating-stable-callbacks-from-hook-arguments-instead-of-adding-them-to-dependency-arrays)
- [CSS](#css)
  - [Prefer using `clsx` for conditional class names](#prefer-using-clsx-for-conditional-class-names)
  - [Prefer using `data-*` attributes for states or modifiers instead of CSS class names](#prefer-using-data--attributes-for-states-or-modifiers-instead-of-css-class-names)
  - [Prefer using CSS Custom Properties to bridge between CSS and JavaScript instead of inline styles](#prefer-using-css-custom-properties-to-bridge-between-css-and-javascript-instead-of-inline-styles)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## React

### Server-side rendering

All components should be able to be rendered on the server. This means that the
component must not access any JavaScript APIs that are only available in a
browser.

In addition, authors should consider how components will be hydrated as a result
of being server-side rendered. In particular, components should not cause layout
shifts as a result of being hydrated. Instead components should progressively
enhance as JavaScript is loaded on the page.

### Prefer managing focus through event handlers instead of effects

When managing focus within a component, prefer focusing elements within event
handlers as opposed to effects. This helps to ensure that focus is only being
moved as a result of a user interaction. When focus is managed in an effect,
there is a risk that focus will be moved due to an unrelated dependency in the
effect dependency array being updated.

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

### Props

#### Prefer applying component rest parameters to the root element rendered by a component

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

#### Prefer authoring callback prop types with arguments that can be extended

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

### Hooks

#### Prefer authoring hooks that accept a `ref` instead of returning a `ref` to apply

When designing hooks that require a reference to a DOM node (using a `ref`) you
should design the hook to take in a `ref` as an argument instead of creating a
`ref` on behalf of the caller.
This is important when a caller decides to use multiple hooks that rely on a
`ref`. For example,

```tsx
function MyComponent() {
  const [ref1, isHovering] = useHover()
  const [ref2, isDragging] = useDrag()

  // How should the caller merge these two refs?
}
```

If, instead, these hooks took in a `ref` we could have the caller manage the
`ref` and pass it into the hooks.

```tsx
function MyComponent() {
  const ref = useRef(null)
  const isHovering = useHover(ref)
  const isDragging = useDrag(ref)

  // Caller has to add `ref` to a node below
}
```

#### Prefer creating stable callbacks from hook arguments instead of adding them to dependency arrays

A common practice when authoring hooks is to accept a `callback` as an argument
that is called when something is updated or changed. For example:

```tsx
// Example hook
function useEvent(ref, eventName, callback) {
  //
}

function Example() {
  const ref = React.useRef(null)

  useEvent(ref, 'click', () => {
    //
  })
}
```

Instead of adding the callback to a dependency array, create a stable callback
that can be referenced.

```tsx
function useEvent(ref, eventName, callback) {
  const savedCallback = React.useRef(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    const node = ref.current

    const eventListener = event => {
      // Call the saved callback
      savedCallback.current(event)
    }

    node.addEventListener(eventName, eventListener)
    return () => {
      node.removeEventListener(eventName, eventListener)
    }
  }, [ref, eventName])
}
```

Structuring hooks in this way allow us to decouple an effect from the identity
of the callback being passed in. This is helpful since the effect should only
synchronize with ref and event being passed in, not when the callback itself
changes.

Authoring hooks in this way allow us to avoid propagating dependency arrays and
ensures that callbacks are always called with the latest value.

## CSS

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
