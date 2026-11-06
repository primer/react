# Blankslate

`Blankslate` provides a structured empty state with optional visual, heading, description, and primary or secondary actions.

Import: `import {Blankslate} from '@primer/react-tailwind/Blankslate'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `border`: `boolean` — Default `false`. Draws a border around the blankslate.
- `narrow`: `boolean` — Default `false`. Constrains the content to a narrower column.
- `size`: `"large" | "medium" | "small"` — Default `'medium'`. Overall scale of the visual, heading, and spacing.
- `spacious`: `boolean` — Default `false`. Increases the vertical padding, for a blankslate that fills a large empty region.

## Blankslate.Description

Renders a [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Blankslate.Heading

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h2'`. Heading element to render, so the heading fits the surrounding document outline.

## Blankslate.PrimaryAction

- `href`: `string`

## Blankslate.SecondaryAction

- `className`: `string`
- `href` (required): `string`

## Blankslate.Visual

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Existing composition and variant props can be retained.
