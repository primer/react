---
applyTo: 'packages/react/src/**/use*.ts,packages/react/src/**/use*.tsx,packages/react/src/hooks/**'
---

# Hook design standards

These rules apply when **creating or modifying React hooks** in this codebase.

## Two Types of Hooks

### Component behavior hooks

Return an object of props to spread onto JSX elements:

```tsx
const {popoverProps, triggerProps} = usePopover({anchorRef})

return (
  <>
    <button {...triggerProps}>Open</button>
    <div {...popoverProps}>Content</div>
  </>
)
```

- A component should use **at most one** component behavior hook
- Key names in the returned object should indicate which JSX element gets the props
- Component behavior hooks compose generic behavior hooks internally

### Generic behavior hooks

Low-level reusable behavior (e.g., `useClickAway`, `useFocusTrap`, `usePosition`). May return any value.

## Dependency Rules

- Generic behaviors → may only depend on other generic behaviors
- Component behaviors → may depend on component and generic behaviors
- Components → may depend on components and component behaviors, NOT generic behaviors directly

## Design Rules

- **Accept refs, don't return them.** Let callers manage refs and pass them in:

```tsx
// Do
const isHovering = useHover(ref)

// Don't
const [ref, isHovering] = useHover()
```

- **Stabilize callbacks.** Store callbacks in a ref to decouple effects from callback identity:

```tsx
function useEvent(ref, eventName, callback) {
  const savedCallback = React.useRef(callback)
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    const handler = e => savedCallback.current(e)
    ref.current?.addEventListener(eventName, handler)
    return () => ref.current?.removeEventListener(eventName, handler)
  }, [ref, eventName])
}
```

- **Zero-arg defaults.** Hooks should work with zero arguments where possible
- **Required args are positional; optional args are a settings object** as the last parameter
- **No external dependencies** unless discussed and approved by the team
