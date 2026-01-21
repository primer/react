# no-use-responsive-value

Disallow using `useResponsiveValue` hook from `@primer/react` or local imports.

## Rule Details

This rule prevents the use of the `useResponsiveValue` hook from:

- `@primer/react` package imports (including `/experimental` and `/deprecated` entrypoints)
- Local file imports (relative paths containing `useResponsiveValue`)

### Why?

This hook is not fully SSR compatible as it relies on `useMediaUnsafeSSR` without a `defaultState`. Using `getResponsiveAttributes` is preferred to avoid hydration mismatches. This rule helps enforce consistent usage of SSR-safe responsive patterns across the codebase.

## Examples

### ❌ Incorrect

```js
import {useResponsiveValue} from '@primer/react'

function Component() {
  const value = useResponsiveValue(['sm', 'md', 'lg'])
  return <div>{value}</div>
}
```

```js
import {Button, useResponsiveValue} from '@primer/react'
```

```js
import {useResponsiveValue} from '@primer/react/experimental'
```

```js
import {useResponsiveValue} from '../hooks/useResponsiveValue'
```

```js
import useResponsiveValue from '../hooks/useResponsiveValue'
```

```js
import {useResponsiveValue} from './useResponsiveValue'
```

### ✅ Correct

```js
import {Button} from '@primer/react'

function Component() {
  // Use alternative responsive patterns
  return <Button>Click me</Button>
}
```

```js
import {useResponsiveValue} from 'other-library'

function Component() {
  // Using useResponsiveValue from a different library is allowed
  const value = useResponsiveValue(['sm', 'md', 'lg'])
  return <div>{value}</div>
}
```

```js
import {useCustomHook} from '../hooks/useCustomHook'

function Component() {
  // Importing other hooks from local paths is allowed
  const value = useCustomHook(['sm', 'md', 'lg'])
  return <div>{value}</div>
}
```

```js
function useResponsiveValue() {
  // Local function definitions are allowed
  return 'custom implementation'
}

function Component() {
  const value = useResponsiveValue()
  return <div>{value}</div>
}
```

## When Not To Use It

If your project needs to use `useResponsiveValue` from `@primer/react`, you can disable this rule:

```js
/* eslint primer-react/no-use-responsive-value: "off" */
```

## Options

This rule has no options.
