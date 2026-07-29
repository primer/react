# Avatar

`Avatar` renders a user or organization image at a consistent size and shape. Use `square` for organizations and other non-person entities.

Import: `import {Avatar} from '@primer/react-tailwind/Avatar'`

Renders an `<img>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `shape`: `"circle" | "square"` — Corner treatment. `circle` suits a person, `square` suits an organization or other entity.
- `size`: `AvatarSize | ResponsiveValue<number>` — Rendered width and height in pixels. Accepts a responsive object to vary the size per viewport.
- `square`: `boolean` — Forces the square shape, taking precedence over `shape`. Kept for compatibility with `@primer/react`.

## Differences from `@primer/react`

- Replace responsive size objects with responsive `className` utilities on the Avatar or its layout wrapper.
