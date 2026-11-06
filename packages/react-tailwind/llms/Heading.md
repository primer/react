# Heading

`Heading` renders a section heading. Choose the level with `as` for document structure and `size` for visual size, so heading order stays correct independently of scale.

Import: `import {Heading} from '@primer/react-tailwind/Heading'`

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h2'`. Heading element to render, so the level fits the surrounding document outline independently of its size.
- `size`: `"display" | "large" | "medium" | "small" | null`

## Differences from `@primer/react`

- Rename `variant` to `size`.
