# Avatar

`Avatar` renders a user or organization image at a consistent size and shape. Use `square` for organizations and other non-person entities.

Import: `import {Avatar} from '@primer/react-tailwind/Avatar'`

Renders an `<img>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `shape`: `"circle" | "square"`
- `size`: `AvatarSize | ResponsiveValue<number>`
- `square`: `boolean`

## Differences from `@primer/react`

- Replace responsive size objects with responsive `className` utilities on the Avatar or its layout wrapper.
