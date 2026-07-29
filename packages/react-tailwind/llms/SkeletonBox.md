# SkeletonBox

`SkeletonBox` reserves space for content that is loading, using a shimmer placeholder that can be delayed until a request has taken long enough to show.

Import: `import {SkeletonBox} from '@primer/react-tailwind/SkeletonBox'`

## Props

- `as`: `React.ElementType` — Default `'div'`.
- `data-component`: `string`
- `delay`: `number | "long" | "short"`
- `height`: `Height<string | number>`
- `width`: `Width<string | number>`

## Differences from `@primer/react`

- Keep Suspense, data fetching, and loading transitions in the application.
