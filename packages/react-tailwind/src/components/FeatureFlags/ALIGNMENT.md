# Alignment

## From: `@primer/react`

`FeatureFlags` provides a context provider for named boolean feature flags, and `useFeatureFlag` reads one flag from the nearest provider. Legacy nested providers merge flag objects, with values from the nearest scope taking precedence. The API is behavioral rather than visual; the legacy package's implementation is a React context wrapper and accepts its normal children.

## To: `@primer/react-tailwind`

Tailwind exports the same `FeatureFlags` provider and `useFeatureFlag` hook with the same nearest-scope merge behavior. The implementation remains a React context abstraction and does not use Base UI or Tailwind styling. Feature-flag values are still booleans selected by name, and consumers can continue to place providers around any subtree. This is one of the closest alignments in the package.

## Migration notes

- Provider and hook usage is intended to be drop-in.
- Preserve nested-provider precedence when migrating scopes.
- There is no `sx` or styled-system surface to migrate.
