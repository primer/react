# SkeletonBox

`SkeletonBox` reserves space for content that is loading, using a shimmer placeholder that can be delayed until a request has taken long enough to show.

Import: `import {SkeletonBox} from '@primer/react-tailwind/SkeletonBox'`

## Props

- `as`: `React.ElementType` — Default `'div'`. Element to render.
- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `delay`: `number | "long" | "short"` — Waits before showing the placeholder, so a fast response never flashes one. Accepts a named delay or milliseconds.
- `height`: `Height<string | number>` — Height of the placeholder.
- `width`: `Width<string | number>` — Width of the placeholder.

## Differences from `@primer/react`

- Keep Suspense, data fetching, and loading transitions in the application.
