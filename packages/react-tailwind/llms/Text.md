# Text

`Text` applies Primer typography to inline or block text. Use `Heading` for section headings so that structure is conveyed semantically.

Import: `import {Text} from '@primer/react-tailwind/Text'`

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'span'`. Element to render.
- `size`: `TextSize` — Size from the Primer type scale.
- `weight`: `"light" | "medium" | "normal" | "semibold"` — Font weight.
- `whiteSpace`: `"normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap"` — How whitespace and line breaks in the content are treated.

## Differences from `@primer/react`

- Preserve core typography props and semantic `as` usage.
