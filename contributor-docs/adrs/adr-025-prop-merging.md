# Prop merging conventions

📆 Date: 2026-07-28

## Status

| Stage          | State       |
| -------------- | ----------- |
| Status         | Proposed ⚠️ |
| Implementation | Pending ⚠️  |

## Context

Primer components often set props on an element while also accepting those same
props from consumers. Relying on object spread order alone either replaces
component behavior and styling or prevents consumers from customizing supported
props. Inconsistent precedence also makes component APIs difficult to predict.

We need one convention for combining component-authored and consumer-authored
props, plus an implementation that applies it consistently.

## Decision

Components must intentionally merge any prop that both the component and
consumer can provide. Pass component props first and consumer props second to the
`mergeProps` utility:

```tsx
<button
  {...mergeProps(
    {
      className: classes.Example,
      onClick: handleClick,
      style: defaultStyle,
    },
    props,
  )}
/>
```

`mergeProps(componentProps, consumerProps)` applies these rules:

- Event handlers are composed in argument order. The component handler runs
  first. The consumer handler runs only if the component handler does not set
  `event.defaultPrevented`. An `undefined` consumer handler is treated as absent
  and does not replace the component handler.
- `className` values are combined with `clsx`, with the component value first.
- `style` objects are shallowly merged, with the consumer value taking
  precedence for duplicate properties.
- All other duplicate props use the consumer value.

Keep forwardable consumer props together and pass them directly as the second
argument. Do not conditionally add optional event handlers before calling
`mergeProps`; the utility handles omitted handlers. If a component must read or
normalize a consumer prop, destructure it and include the forwarded or derived
value in the first object instead of reconstructing the second object.

Use conventional prop values in the first object. For example, combine multiple
internal class names with `clsx` before calling `mergeProps` instead of passing
array or object shorthand:

```tsx
function Example({checked, ...rest}: Props) {
  return (
    <input
      {...mergeProps(
        {
          className: clsx(classes.Control, classes.Example),
          onChange: handleChange,
          'aria-checked': checked ? 'true' : 'false',
          checked,
        },
        rest,
      )}
    />
  )
}
```

If a component must control an attribute for correct behavior, it must not
expose that attribute unconditionally. Omit it from the public prop type, or use
a discriminated union that only exposes it in supported scenarios, rather than
accepting and silently overriding the consumer value.

For example:

```tsx
// Component-owned attribute: `type` is fixed internally and is not public API.
type IconButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'type'>
```

```tsx
// Conditional attributes: only expose anchor-only props when `as: 'a'`.
type ButtonLikeProps =
  | ({
      as?: 'button'
    } & Omit<React.ComponentPropsWithoutRef<'button'>, 'href' | 'target' | 'rel'>)
  | ({
      as: 'a'
    } & React.ComponentPropsWithoutRef<'a'>)
```

The utility is an implementation detail for building Primer React components
and is not part of the package's public API.

### Scenarios requiring separate handling

The general rules do not cover every form of composition:

- **Refs are not composed.** In React 19, `ref` is passed as a prop, but it still
  requires separate composition. Use `useMergedRefs` when both the component
  and consumer need the same element reference. Keep `ref` before the
  `mergeProps` spread so ref handling is visibly separate and merged props are
  applied last:

  ```tsx
  <button ref={mergedRef} {...mergeProps(componentProps, consumerProps)} />
  ```

- **Styles are not deeply merged.** Nested objects and values such as CSS custom
  property maps are replaced at the first duplicate property.
- **Cancellation is based on `defaultPrevented`.** The consumer handler is
  skipped when the first argument's `defaultPrevented` value is truthy after the
  component handler runs. Calling `stopPropagation()` alone does not stop the
  consumer handler because both handlers run for the same React event.
- **Cancellation is synchronous and one-way.** The consumer cannot prevent the
  component handler because it runs second, and an asynchronous call to
  `preventDefault()` occurs too late. APIs that require consumer veto before
  internal behavior need a separate cancellable callback design.
- **Errors stop composition.** If the component handler throws, the consumer
  handler does not run.
- **`on*` callback props are treated as event handlers.** A callback whose name
  starts with `on` and whose value is a function is composed with the same
  cancellation behavior, even if it is not a DOM event handler.
- **Cancellation only considers the first argument.** All callback arguments
  are forwarded, but only a `defaultPrevented` value on the first argument can
  cancel the second callback. Zero-argument callbacks run both handlers.
- **Ordinary prop precedence includes `undefined`.** An explicitly present
  consumer prop with an `undefined` value replaces the component value unless
  the prop has special class name, style, or event-handler behavior.

## Consequences

Component behavior and base styling are preserved while consumers retain
predictable override points. A shared utility reduces hand-written merging logic
and makes precedence consistent across components.

The convention requires component authors to distinguish supported overrides
from attributes that the component must own. Event ordering also means consumer
handlers cannot cancel component work that has already happened.

## Alternatives

### Use prop spread order for every prop

This is concise, but replaces event handlers, class names, and complete style
objects instead of composing them.

### Always give component props precedence

This preserves implementation details but makes accepted consumer props
ineffective and creates a misleading API.

### Let consumers run event handlers first

This would let consumers prevent component behavior, but gives consumers control
over invariants and accessibility behavior that the component owns. APIs that
need a consumer veto should model it explicitly instead of changing the default
ordering for all handlers.
