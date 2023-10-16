# ADR 012: Development Warnings

## Status

| Stage    | Status |
| -------- | ------ |
| Approved | ✅     |
| Adopted  | 🚧     |

## Context

There are situations where we would like to provide warnings to developers who
use `@primer/react` that something may be deprecated, unsupported, etc. Often,
these will be emitted using `console.warn()`. When using `console.warn()` by
itself, we run into a situation where code that is only meant for development
is included in production code. As a result, it would be helpful to establish
patterns around how to provide warnings to developers in order to make sure
that:

- Calls to `console.warn()` do not appear in production
- Code related to development checks, warnings, or messages are removed from
  production code

## Decision

Code that is meant for development-only warnings or checks **must** be wrapped within a
`__DEV__` block.

```tsx
function ExampleComponent() {
  if (__DEV__) {
    // This code only runs in development
  }
}
```

Under-the-hood, the `__DEV__` block will be compiled to a `NODE_ENV` check so
that it is stripped when `NODE_ENV` is set to `'production'`.

> **Note**
> Contributors may wrap hooks within a `__DEV__` block even though hooks are not
> meant to be called conditionally. This is because the `__DEV__` check can be
> considered constant in that it will always be true or false for the
> environment (development or production).

When a contributor would like to communicate a warning to a developer, they
should use the `warning()` helper.

```ts
warning(condition, 'This is the message that is logged when condition is truth-y')
```

This helper allows you to provide a `condition`. When the condition is truth-y
it will emit the message provided. This helper is automatically wrapped in a
`__DEV__` block and will be removed from production builds.

For more complex conditions, a contributor may combine `console.warn()` with
`__DEV__` when `warning()` does not suffice.

### Impact

- Calls to `console.warn()` will be replaced by `warning()` or will be wrapped
  in a `__DEV__` block
