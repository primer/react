# API Guidelines

## Overview

## React

### Writing a component

**Checklist**

- [ ] Create entrypoint file
- [ ] Create component file
- [ ] Create test file
- [ ] Create stories
  - [ ] Create default stories with playground
  - [ ] Create feature stories
- [ ] Create e2e test
  - [ ] Add support for VRT
  - [ ] Add support for AAT

```tsx
type ExampleComponentProps = {}

function ExampleComponent(props: ExampleComponent) {
  // Setup, state
  const [state, setState] = useState(defaultValue)
  const value = 1

  // Handlers

  // Effects
  useEffect(() => {
    // ...
  }, [])

  // Output
  return <ExampleComponentOutput state={state} />
}
```

<table>
<thead><tr><th>Unpreferred</th><th>Preferred</th></tr></thead>
<tbody>
<tr><td>

```tsx
const ExampleComponent: React.FC<ExampleProps = () => {
    // ...
};
```

</td><td>

```tsx
function ExampleComponent(props: ExampleComponentProps) {
  // ...
}
```

</td></tr>
</tbody></table>

#### When to use `React.forwardRef`

- This might not be needed anymore with React 19?

### Server-side rendering

- Components should support SSR by default
- Components should not rely on client-side state for layout (avoid layout
  thrashing)
- Components should progressively enhance as JavaScript loads on a page

### Props

#### Container props

These are props that are provided consistently across components and are applied
to the containing element rendered by the component.

- `className`
- `data-testid`
- `React.ComponentPropsWithoutRef<...>`, typically seen as spread props: `{...rest}`

The position of these props should be consistently applied to the same element
across major versions. These should be tested.

#### Controllable props

- Works with and without props being passed
- There should be a `value` and `onChange` or `onValueChange` prop when
  controlled (naming doesn't have to be `value`)
- Do we support mixing between modes?
- `useControllableState` hook

#### Naming boolean props

- Boolean props could be tracking a state value or are opt-in to behavior or
  appearance
  - State behavior: `<ExampleComponent open={isOpen} />`
  - Opt-in: `<ExampleComponent fullWidth />`
- When naming "opt-in" variants, consider the default value and what it should
  be. Name the prop according to what they will "opt-in" to.

#### Naming variant props

- Any specific naming conventions?
- Should they always have a default value? (Maybe the one we expect to be most
  used?)

#### `useCallback` and `useMemo`

- Be intentional about when you apply these to a value
- These can often deopt if a dependency passed in is not stable
  - For example, if a prop is passed in whose value is a function that changes
    every render then the `useCallback` and `useMemo` will also change every
    render

#### Deriving state from props

- Avoid using effects to synchronize state with props

### Effects

- Only synchronize effects with values it should re-synchronize with
  - This can cause weird side-effects like focus stealing unintentionally
- When possible, apply side-effects in event handlers
- When you need to use an unstable value in an effect, consider stabilizing the
  value behind a ref or helper hook and calling that intstead of adding it as a
  dependency to the effect array

### Hooks

#### Hooks that make use of a `ref`

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

#### Hooks that use a callback

- It can be convenient to allow consumers of a hook to pass an unmemoized
  callback to hooks
- Technique: create a stable reference to the callback that is called instead of
  synchronizing the value with the effect

### Focus management

- Prefer managing focus in event handlers over effects
- Technique: how to manage focus when visibility is managed by state
  - Use `flushSync()`
  - Use custom hook for this (`useFocus`)

### When to provide default props

## CSS

### Use `clsx` for conditional class names

### Use `data-*` attributes for variants and conditions

### Prefer CSS Custom Properties as the bridge between JavaScript and CSS

## Techniques

## Links & Resources

- [Multiple Layers of Abstraction in Design Systems](https://engineering.atspotify.com/2023/05/multiple-layers-of-abstraction-in-design-systems/)
- [API design approach](https://mui.com/material-ui/guides/api/)
