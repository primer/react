# Feature flags

This area is made up of several areas:

- A `FeatureFlags` context provider that determines what flags are enabled within a React tree
- A `useFeatureFlag` hook that allows a component to check if a flag is enabled
- A `FeatureFlagScope` class that acts as the value being passed around in
  context. It allows us to combine and merge multiple groups of feature flags
  together in a React tree
- A `GlobalFeatureFlags` value that is used as the default context value. It
  holds all flags that are enabled by default

## FeatureFlags

This component acts as the context provider for feature flags in a React
application or sub-tree. It accepts a `flags` prop that specifies which the
state of feature flags.

```tsx
const defaultFeatureFlags = {
  enable_new_feature: true,
}

function App() {
  return (
    // Note: the value of `flags` should be memoized or initialized outside of
    // render
    <FeatureFlags flags={defaultFeatureFlags}>
      <Content />
    </FeatureFlags>
  )
}
```

This component is primarily used at the root of an application. However, it may
also be used for specific sub-trees, as well, to provide different feature flags
for specific routes or areas of an application.

## useFeatureFlag

The `useFeatureFlag` hook allows a component to determine if a given feature
flag is enabled. The component may use this hook to conditionally alter the
behavior of a component or render a different component altogether.

### Change the behavior of a handler based on a feature flag

```tsx
function ExampleComponent(props) {
  const enabled = useFeatureFlag('enable_new_feature')

  function onClick() {
    if (enabled) {
      // ...
    } else {
      // ...
    }
  }

  // ...
}
```

### Change the behavior of a component based on a feature flag

```tsx
function ExampleComponent(props) {
  const enabled = useFeatureFlag('enable_new_feature')
  if (enabled) {
    return <ExampleComponentNext {...props} />
  }
  return <ExampleComponentClassic {...props} />
}
```

> [!NOTE]
> In scenarios where you are branching between two different components, it may
> be helpful to use [function overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads) in order for the types to be inferred correctly

```tsx
function ExampleComponent(props: ClassicProps): React.ReactNode
function ExampleComponent(props: NextProps): React.ReactNode
function ExampleComponent(props: ClassicProps | NextProps): React.ReactNode {
  //
}
```

By default, using `ClassicProps | NextProps` as the type signature would allow
both props to be applied to a component. Using the function overload, TypeScript
will error if you mix between the two.

## Testing

Use the `FeatureFlags` component to set the value of specific feature flags
during tests.

```tsx
render(
  <FeatureFlags flags={{enableNewFeature: true}}>
    <ExampleComponent />
  </FeatureFlags>,
)
```
