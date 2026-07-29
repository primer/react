# AvatarStack

`AvatarStack` is a presentational component for a compact, expandable group of avatars. Import it from `@primer/react-tailwind/AvatarStack`.

Import: `import {AvatarStack} from '@primer/react-tailwind/AvatarStack'`

## Props

- `alignRight`: `boolean` — Align the avatars to the right.
- `children`: `React.ReactElement[]` — A set of Avatar components to stack.
- `disableExpand`: `boolean` — Do not spread the avatars on hover or focus.
- `shape`: `"circle" | "square"` — Default `'circle'`. The shape of the avatars.
- `size`: `number | Partial<Record<"narrow" | "regular" | "wide", number>>` — The size of the avatar children in pixels.
- `variant`: `"cascade" | "stack"` — Default `'cascade'`. The style of overlapping avatars.

## Differences from `@primer/react`

- Replace the import path with `@primer/react-tailwind/AvatarStack`.
