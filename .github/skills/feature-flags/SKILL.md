---
name: feature-flags
description: 'Use when: implementing, creating, testing, or debugging feature flags in Primer React. Covers useFeatureFlag hook, FeatureFlags provider, DefaultFeatureFlags, FeatureFlagScope, Storybook integration, and the feature flag lifecycle at GitHub.'
---

# Feature Flags in Primer React

Feature flags provide a way to incrementally build and deliver changes in Primer alongside the feature flag system at GitHub. They help build confidence in changes and improve the reliability of releases.

## Architecture

Feature flags are implemented in `packages/react/src/FeatureFlags/` with these core pieces:

| File                     | Purpose                                         |
| ------------------------ | ----------------------------------------------- |
| `FeatureFlags.tsx`       | React context provider component                |
| `useFeatureFlag.ts`      | Hook to check if a flag is enabled              |
| `FeatureFlagScope.ts`    | Class that manages flag collections and merging |
| `DefaultFeatureFlags.ts` | Default flag values (all flags listed here)     |
| `FeatureFlagContext.ts`  | React context definition                        |
| `index.ts`               | Public exports                                  |

### Exports

Feature flags are exported from `@primer/react/experimental`:

```tsx
import {FeatureFlags, useFeatureFlag, DefaultFeatureFlags} from '@primer/react/experimental'
```

They are NOT exported from the main `@primer/react` entry point.

## How to Use a Feature Flag in a Component

### 1. Add the flag to DefaultFeatureFlags

Register your flag in `packages/react/src/FeatureFlags/DefaultFeatureFlags.ts` with a default value of `false`:

```typescript
export const DefaultFeatureFlags = FeatureFlagScope.create({
  // ...existing flags...
  primer_react_my_new_feature: false,
})
```

### 2. Use `useFeatureFlag` in your component

```tsx
import {useFeatureFlag} from '../FeatureFlags'

function MyComponent() {
  const enabled = useFeatureFlag('primer_react_my_new_feature')

  if (enabled) {
    return <NewBehavior />
  }
  return <CurrentBehavior />
}
```

### 3. Naming conventions

- Prefix with `primer_react_` for flags in the `@primer/react` package
- Use snake_case: `primer_react_my_feature_name`

## Patterns

### Change behavior conditionally

```tsx
function ExampleComponent({children}) {
  const enabled = useFeatureFlag('primer_react_my_feature')

  return (
    <button
      onClick={() => {
        if (enabled) {
          // new behavior
        } else {
          // current behavior
        }
      }}
    >
      {children}
    </button>
  )
}
```

### Toggle between two component versions

```tsx
function ExampleComponent(props) {
  const enabled = useFeatureFlag('primer_react_my_feature')
  if (enabled) {
    return <ExampleComponentNext {...props} />
  }
  return <ExampleComponentClassic {...props} />
}
```

### Data attributes on DOM elements

```tsx
function MyOverlay() {
  const enabled = useFeatureFlag('primer_react_my_feature')
  return <div data-my-feature={enabled ? '' : undefined} />
}
```

## Real Codebase Examples

### Spinner animation sync (`packages/react/src/Spinner/Spinner.tsx`)

```tsx
const syncAnimationsEnabled = useFeatureFlag('primer_react_spinner_synchronize_animations')
const shouldSync = syncAnimationsEnabled && noMotionPreference
const mergedStyle = shouldSync ? {...style, animationDelay: `${syncDelay}ms`} : style
```

### CSS anchor positioning (`packages/react/src/AnchoredOverlay/AnchoredOverlay.tsx`)

```tsx
const cssAnchorPositioning = useFeatureFlag('primer_react_css_anchor_positioning')
useEffect(() => {
  if (cssAnchorPositioning && !hasLoadedAnchorPositioningPolyfill.current) {
    applyAnchorPositioningPolyfill()
    hasLoadedAnchorPositioningPolyfill.current = true
  }
}, [open, overlayRef, updateOverlayRef, cssAnchorPositioning])
```

### Breadcrumbs overflow (`packages/react/src/Breadcrumbs/Breadcrumbs.tsx`)

```tsx
const overflowMenuEnabled = useFeatureFlag('primer_react_breadcrumbs_overflow_menu')
```

## Testing with Feature Flags

Wrap your component with the `FeatureFlags` provider to set flag values in tests:

```tsx
import {FeatureFlags} from '../../FeatureFlags'

// Test with flag enabled
render(
  <FeatureFlags flags={{primer_react_my_feature: true}}>
    <MyComponent />
  </FeatureFlags>,
)

// Test with flag disabled (or omit the wrapper to use default values from DefaultFeatureFlags)
render(
  <FeatureFlags flags={{primer_react_my_feature: false}}>
    <MyComponent />
  </FeatureFlags>,
)
```

### Key testing behaviors

- Unknown flags default to `false`
- Nested `FeatureFlags` providers merge flags — inner values override outer values
- You should test both enabled and disabled states

## Storybook Integration

### Enable flag in a specific story

```tsx
import {FeatureFlags} from '../../FeatureFlags'

export const WithFeatureEnabled = () => (
  <FeatureFlags flags={{primer_react_my_feature: true}}>
    <MyComponent />
  </FeatureFlags>
)

export const WithFeatureDisabled = () => <MyComponent />
```

### Enable flag in all stories

Storybook's global preview (`packages/react/.storybook/preview.jsx`) already wraps all stories in a `FeatureFlags` provider, using `DefaultFeatureFlags` as the source of default values and toolbar options. In most cases you only need to register your flag in `DefaultFeatureFlags.ts`; you do not need to manually add it to the `FeatureFlags` wrapper.

To enable a flag globally via environment, add its exact flag name (for example, `primer_react_my_feature`) to the `featureFlagEnvList` set in `preview.jsx`, and set the corresponding env var to `1` (for example, `VITE_primer_react_my_feature=1`). The preview code reads `import.meta.env[\`VITE*${flag}\`]`, so the part after `VITE*` must match the flag string exactly.

## Feature Flag Lifecycle

1. **Create** — Register the flag in `DefaultFeatureFlags.ts` with value `false`
2. **Implement** — Use `useFeatureFlag()` in components, write tests for both states
3. **Test in Storybook** — Create stories with the flag enabled/disabled
4. **Ship** — Merge to main; the flag remains off by default
5. **Enable at GitHub** — Use DevPortal to enable for specific actors, then staffship, then GA
6. **Remove** — Once fully rolled out, remove the flag from code and `DefaultFeatureFlags.ts`

### Temporarily testing in Dotcom CI

Set your flag to `true` in `DefaultFeatureFlags.ts` to enable it by default for CI testing. Set it back to `false` before merging.

## FeatureFlags Provider Internals

- `FeatureFlagScope.create(flags)` — Creates a scope from a plain object `{[key: string]: boolean}`
- `FeatureFlagScope.merge(a, b)` — Merges two scopes; `b` values override `a`
- The `FeatureFlags` component merges parent context flags with the provided `flags` prop
- `DefaultFeatureFlags` is the initial context value — it defines all known flags

## Current Feature Flags

Check `packages/react/src/FeatureFlags/DefaultFeatureFlags.ts` for the current list of all registered feature flags and their default values.
