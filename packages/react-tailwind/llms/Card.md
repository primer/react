# Card

`Card` is a composable content container with heading, description, image, metadata, icon, and action parts.

Import: `import {Card} from '@primer/react-tailwind/Card'`

## Props

- `action`: `React.ReactNode` — Supplies the action region. Takes precedence over a matching `Card.Action` child.
- `as`: `"div" | "section"` — Default `'div'`.
- `borderRadius`: `"large" | "medium"` — Default `'large'`.
- `children`: `React.ReactElement[]`
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `Card.Description` child.
- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `Card.Heading` child.
- `icon`: `React.ReactNode` — Supplies the icon region. Takes precedence over a matching `Card.Icon` child.
- `image`: `React.ReactNode` — Supplies the image region. Takes precedence over a matching `Card.Image` child.
- `layout`: `"compact" | "default"` — Default `'default'`.
- `metadata`: `React.ReactNode` — Supplies the metadata region. Takes precedence over a matching `Card.Metadata` child.
- `padding`: `"condensed" | "none" | "normal"` — Default `'normal'`.

## Heading props

- `as`: `"h2" | "h3" | "h4" | "h5" | "h6"` — Default `'div'`.

## Icon props

- `aria-label`: `string`
- `className`: `string`
- `icon`: `React.ElementType`

## Image props

- `src`: `string`

## Differences from `@primer/react`

- A duplicate part is discarded rather than rendered among the custom children. Upstream keeps a single region too, though it takes the last match rather than the first.
