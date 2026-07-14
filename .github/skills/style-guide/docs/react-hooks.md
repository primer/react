# React Hooks

Use these guidelines when authoring hooks in React.

<!-- prettier-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Guidelines](#guidelines)
    - [Prefer authoring hooks that accept a `ref` instead of returning a `ref` to apply](#prefer-authoring-hooks-that-accept-a-ref-instead-of-returning-a-ref-to-apply)
    - [Prefer creating stable callbacks from hook arguments instead of adding them to dependency arrays](#prefer-creating-stable-callbacks-from-hook-arguments-instead-of-adding-them-to-dependency-arrays)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- prettier-ignore-end -->

## Guidelines

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
