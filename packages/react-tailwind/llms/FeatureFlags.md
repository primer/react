# FeatureFlags

`FeatureFlags` scopes boolean flags and `useFeatureFlag` reads one flag.

Import: `import {FeatureFlags} from '@primer/react-tailwind/FeatureFlags'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {FeatureFlags, useFeatureFlag} from '@primer/react-tailwind'
;<FeatureFlags flags={{newExperience: true}}>
  <Example />
</FeatureFlags>
```

Nested providers merge their flags with the nearest parent and override duplicate names. Flags are configuration, not an authorization boundary.

## Props

- `children`: `React.ReactNode`
- `flags` (required): `FeatureFlagValues` — Flags to enable or disable for everything rendered inside, merged over any flags from an enclosing provider.

## Differences from `@primer/react`

- Provider and hook usage is intended to be drop-in.
- Preserve nested-provider precedence when migrating scopes.
- There is no `sx` or styled-system surface to migrate.
