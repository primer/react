# AvatarStack

`AvatarStack` is a presentational component for a compact, expandable group of avatars. Import it from `@primer/react-tailwind/AvatarStack`.

Import: `import {AvatarStack} from '@primer/react-tailwind/AvatarStack'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `alignRight`: `boolean` — Align the avatars to the right.
- `children` (required): `React.ReactNode` — A set of Avatar components to stack.
- `disableExpand`: `boolean` — Do not spread the avatars on hover or focus.
- `shape`: `"circle" | "square"` — Default `'circle'`. The shape of the avatars.
- `size`: `number | Partial<Record<"narrow" | "regular" | "wide", number>>` — The size of the avatar children in pixels.
- `variant`: `"cascade" | "stack"` — Default `'cascade'`. The style of overlapping avatars.

## Differences from `@primer/react`

- Replace the import path with `@primer/react-tailwind/AvatarStack`.
- Keep avatars and link wrappers as direct children.
- Use `className` instead of styled-system props.
- No intentional AvatarStack behavioral or visual differences are documented. Residual visual-matrix deltas are limited to browser rasterization at circular masked overlap edges; computed styles and geometry match, and single-avatar and square-avatar stories are pixel exact.
