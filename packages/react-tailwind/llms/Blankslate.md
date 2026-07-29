# Blankslate

`Blankslate` provides a structured empty state with optional visual, heading, description, and primary or secondary actions.

Import: `import {Blankslate} from '@primer/react-tailwind/Blankslate'`

Renders a `<div>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `border`: `boolean` — Default `false`.
- `narrow`: `boolean` — Default `false`.
- `size`: `"large" | "medium" | "small"` — Default `'medium'`.
- `spacious`: `boolean` — Default `false`.

## Heading props

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h2'`.

## PrimaryAction props

- `href`: `string`

## SecondaryAction props

- `className`: `string`
- `href`: `string`

## Differences from `@primer/react`

- Existing composition and variant props can be retained.
