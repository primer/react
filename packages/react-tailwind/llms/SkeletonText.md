# SkeletonText

`SkeletonText` creates one or more text-shaped loading lines with typography height presets and an optional maximum width.

Import: `import {SkeletonText} from '@primer/react-tailwind/SkeletonText'`

## Props

- `lines`: `number` — Default `1`.
- `maxWidth`: `MaxWidth<string | number>`
- `size`: `"bodyLarge" | "bodyMedium" | "bodySmall" | "display" | "subtitle" | "titleLarge" | "titleMedium" | "titleSmall"` — Default `'bodyMedium'`.

## Differences from `@primer/react`

- Expect at least one line; fractional counts are floored.
