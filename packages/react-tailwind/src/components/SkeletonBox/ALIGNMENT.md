# Alignment

## From: `@primer/react`

Legacy SkeletonBox examples include reusable loading compositions, delayed rendering, and Suspense-based data-loading fixtures.

## To: `@primer/react-tailwind`

SkeletonBox is a presentational loading placeholder with simple `as`, `height`, `width`, and `delay` options. It composes with local SkeletonText and SkeletonAvatar in examples but does not own data fetching, Suspense helpers, or Base UI behavior. Delay controls the documented visible placeholder transition, not application loading state.

## Migration notes

- Keep Suspense, data fetching, and loading transitions in the application.
- Compose SkeletonText and SkeletonAvatar directly for richer placeholder layouts.
- Use `as` only for a simple presentational element choice.
- Named placeholders use image semantics by default so their accessible name is valid. An explicit `role` takes precedence.
- Replace `sx` and styled-system props with `className`.
