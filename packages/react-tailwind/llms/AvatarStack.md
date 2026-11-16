# AvatarStack

`AvatarStack` is a presentational component for a compact, expandable group of avatars. Import it from `@primer/react-tailwind/AvatarStack`.

Import: `import {AvatarStack} from '@primer/react-tailwind/AvatarStack'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Avatar} from '@primer/react-tailwind/Avatar'
import {AvatarStack} from '@primer/react-tailwind/AvatarStack'
;<AvatarStack aria-label="Reviewers">
  <Avatar alt="Mona" src="/mona.png" />
  <Avatar alt="Hubot" src="/hubot.png" />
</AvatarStack>
```

## API notes

`cascade` increases overlap from the third avatar; `stack` uses uniform overlap. When `size` is omitted, the stack uses the smallest child size at each viewport, falling back to 20 pixels.

## Composition

Compose `Avatar` children directly. The stack applies the canonical overlap, shape, truncation, and expansion treatment to each valid direct child; use `Link` as a direct child when an avatar needs link semantics.

The default or explicit `shape="circle"` preserves each avatar's `square` or `shape="square"` setting. A `shape="square"` stack forces square styling on direct avatars and components that forward the `square` prop. When an avatar is inside a link, set its shape on the avatar itself.

Like legacy Primer, the stack forwards `square` to each direct child, including `undefined` in a circular stack when that child has no `square` prop. A wrapper that chooses a default before spreading the forwarded props can therefore lose that default; pass `square` on the wrapper or choose it after the spread. Size inference reads the direct child's `size` prop, not custom wrapper props such as `avatarSize`; pass `size` to the stack when using such a wrapper.

## Accessibility

Give a non-interactive stack an accessible group label when it conveys people or ownership. Provide meaningful avatar `alt` text unless its linked wrapper has the accessible name. The stack body becomes keyboard focusable only when it can expand and has no interactive descendants; linked avatars keep their own focus target.

## Tailwind extension

Use `className` on the stack or children for supported visual extension. Primer owns `data-component="AvatarStack"` and the root state attributes `data-variant`, `data-shape`, `data-avatar-count`, `data-align-right`, and `data-responsive`; the body exposes `data-component="AvatarStack.Body"` and `data-disable-expand`.

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
- A circular stack preserves each avatar's square shape; a square stack forces square on direct avatars and wrappers that forward `square`. Set the avatar's shape directly when it is nested inside a link.
- As in legacy, a circular stack forwards `square: undefined` to a direct child with no `square` prop. Wrappers that set their own `square` before spreading forwarded props lose that default; pass `square` on the wrapper or set it after the spread. Size inference reads the direct child's `size`, not custom aliases such as `avatarSize`; set the stack's `size` explicitly when needed.
- Use `className` instead of styled-system props.
- No intentional AvatarStack behavioral or visual differences are documented. Residual visual-matrix deltas are limited to browser rasterization at circular masked overlap edges; computed styles and geometry match, and single-avatar and square-avatar stories are pixel exact.
