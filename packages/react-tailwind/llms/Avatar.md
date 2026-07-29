# Avatar

`Avatar` renders a user or organization image at a consistent size and shape. Use `square` for organizations and other non-person entities.

Import: `import {Avatar} from '@primer/react-tailwind/Avatar'`

## Props

- `shape`: `'circle' | 'square'`
- `size`: `AvatarSize | number | ResponsiveValue<number>`
- `square`: `boolean`

## Differences from `@primer/react`

- Replace responsive size objects with responsive `className` utilities on the Avatar or its layout wrapper.

