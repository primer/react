# SkeletonText

`SkeletonText` creates one or more text-shaped loading lines with typography height presets and an optional maximum width.

Import: `import {SkeletonText} from '@primer/react-tailwind/SkeletonText'`

## Props

- `lines`: `number` — Default `1`. Number of placeholder lines to render.
- `maxWidth`: `MaxWidth<string | number>` — Largest width the placeholder lines may reach.
- `size`: `"bodyLarge" | "bodyMedium" | "bodySmall" | "display" | "subtitle" | "titleLarge" | "titleMedium" | "titleSmall"` — Default `'bodyMedium'`. Line height, matching the text size it stands in for.

## Differences from `@primer/react`

- Expect at least one line; fractional counts are floored.
