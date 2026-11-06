# Card

`Card` is a composable content container with heading, description, image, metadata, icon, and action parts.

Import: `import {Card} from '@primer/react-tailwind/Card'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `action`: `React.ReactNode` — Supplies the action region. Takes precedence over a matching `Card.Action` child.
- `as`: `"div" | "section"` — Default `'div'`. Element to render. Use `section` when the card is a labelled region of the page.
- `borderRadius`: `"large" | "medium"` — Default `'large'`. Corner radius of the card.
- `children`: `React.ReactNode`
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `Card.Description` child.
- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `Card.Heading` child.
- `icon`: `React.ReactNode` — Supplies the icon region. Takes precedence over a matching `Card.Icon` child.
- `image`: `React.ReactNode` — Supplies the image region. Takes precedence over a matching `Card.Image` child.
- `layout`: `"compact" | "default"` — Default `'default'`. Use `compact` to lay the card out in a row rather than stacked.
- `metadata`: `React.ReactNode` — Supplies the metadata region. Takes precedence over a matching `Card.Metadata` child.
- `padding`: `"condensed" | "none" | "normal"` — Default `'normal'`. Inner spacing of the card.

## Card.Action

Takes no props of its own.

## Card.Description

Renders a [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Card.Heading

Renders a [`<h3>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h3#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `"h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h3'`. Heading element to render, so the card heading fits the surrounding document outline.

## Card.Icon

- `aria-label`: `string` — Accessible name for the icon. Leave unset when the icon is decorative.
- `className`: `string`
- `icon` (required): `React.ElementType` — Icon component to render.

## Card.Image

Renders an [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `src` (required): `string` — Source of the image.

## Card.Metadata

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- A duplicate part is discarded rather than rendered among the custom children. Upstream keeps a single region too, though it takes the last match rather than the first.
- `icon`, `image`, `heading`, `description`, `metadata`, and `action` accept an element for the corresponding region and take precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it. A `section` card still derives its `aria-labelledby` from a heading supplied this way.
- Compose ActionMenu or native action controls inside `Card.Action` instead of relying on a Card-specific menu API.
- Use `as` only for simple presentational roots.
- Preserve meaningful image alt text and accessible action names.
- Replace `sx` and styled-system props with `className` on the target slot.
- Tailwind stories use the package's Button, ActionMenu, ActionList, and VisuallyHidden primitives; their controls remain separate from Card.
