# Truncate

`Truncate` applies single-line overflow truncation while preserving the full value in the native `title` tooltip.

Import: `import {Truncate} from '@primer/react-tailwind/Truncate'`

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
