# FeatureFlags

`FeatureFlags` scopes boolean flags and `useFeatureFlag` reads one flag.

Import: `import {FeatureFlags} from '@primer/react-tailwind/FeatureFlags'`

## Props

- `children`: `React.ReactNode`
- `flags` (required): `FeatureFlagValues` — Flags to enable or disable for everything rendered inside, merged over any flags from an enclosing provider.

## Differences from `@primer/react`

- Provider and hook usage is intended to be drop-in.
- Preserve nested-provider precedence when migrating scopes.
- There is no `sx` or styled-system surface to migrate.
