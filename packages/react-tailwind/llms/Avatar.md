# Avatar

`Avatar` renders a user or organization image at a consistent size and shape. Use `square` for organizations and other non-person entities.

Import: `import {Avatar} from '@primer/react-tailwind/Avatar'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Avatar} from '@primer/react-tailwind/Avatar'
;<Avatar alt="GitHub" src="https://avatars.githubusercontent.com/github" />
```

## API notes

The default size is `small`; named sizes also include `medium`, `large`, and `xlarge`. The default shape is `circle`.

## Composition

Use as an image primitive, including as a child of an avatar stack.

## Accessibility

Provide meaningful `alt` text for informative avatars; leave it empty only for decorative images.

## Data attributes

The image exposes `data-component="Avatar"` and `data-shape`.

Renders an [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `shape`: `"circle" | "square"` — Corner treatment. `circle` suits a person, `square` suits an organization or other entity.
- `size`: `AvatarSize | ResponsiveValue<number>` — Rendered width and height in pixels. Accepts a responsive object to vary the size per viewport.
- `square`: `boolean` — Forces the square shape, taking precedence over `shape`. Kept for compatibility with `@primer/react`.

## Differences from `@primer/react`

- Existing numeric or `{narrow, regular, wide}` sizes and `square` usage can be retained.
- Use `className` instead of `sx` or styled-system props.
