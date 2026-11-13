# Truncate

`Truncate` applies single-line overflow truncation while preserving the full value in the native `title` tooltip.

Import: `import {Truncate} from '@primer/react-tailwind/Truncate'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {Truncate} from '@primer/react-tailwind/Truncate'
;<Truncate title="A long repository name">A long repository name</Truncate>
```

The `title` prop is required and is also the accessible/native tooltip value. The component's content is supplied through standard `children`.

## API notes

A numeric `maxWidth` is interpreted in pixels.

## Composition

Use `inline` when the truncated value is part of a sentence or compact row. Use `as` when the surrounding semantics require another element. The `expandable` flag is descriptive only; this component does not implement an expansion interaction.

## Accessibility

Keep the full value in `title`, even when children are visually truncated. Choose an appropriate `as` element and do not use a link or button element unless the corresponding interaction is provided by the consumer.

## Animation and reduced motion

`Truncate` has no animation and does not need reduced-motion handling.

## Theming and Tailwind

Use `className` to extend the generated `truncate` styles and layout. With Tailwind v4, include the package's compiled `dist` directory in `@source` and import Primer theme tokens. Do not combine compiled `styles.css` with generated package utilities.

### Data attributes

The root exposes `data-component="Truncate"` and `data-expandable` when `expandable` is true. The width is stored in the `--truncate-max-width` inline custom property.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'div'`. Element or component to render, such as `Link` for a truncated link. Components also receive `inline`.
- `expandable`: `boolean` — Reveals the full text on hover and focus.
- `href`: `string` — URL to navigate to when `as` renders a link.
- `inline`: `boolean` — Renders inline rather than as a block.
- `maxWidth`: `string | number` — Default `125`. Width past which the text is clipped.
- `title` (required): `string` — Full text, shown on hover and kept available to assistive technology when the text is clipped.

## Differences from `@primer/react`

- Keep persistent expansion state and controls in the consumer; `expandable` only reveals the text on hover or focus.
- Use `as={Link}` with `href` for truncated links; component targets also receive `inline`.
- The default element stays a `div`; pass `as="span"` for phrasing contexts such as paragraphs.
- Remove `sx` and styled-system props.
