# Heading

`Heading` renders a section heading. Choose the level with `as` for document structure and `size` for visual size, so heading order stays correct independently of scale.

Import: `import {Heading} from '@primer/react-tailwind/Heading'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {Heading} from '@primer/react-tailwind/Heading'
;<Heading as="h2">General</Heading>
```

## API notes

The default size is `large`.

## Composition

Set `as` from the document outline independently from the visual `size`.

## Accessibility

Maintain a logical heading hierarchy; size is visual and does not change heading level.

## Data attributes

The heading has `data-component="Heading"`.

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"` — Default `'h2'`. Heading element to render, so the level fits the surrounding document outline independently of its size.
- `size`: `"display" | "large" | "medium" | "small" | null`

## Differences from `@primer/react`

- Rename `variant` to `size`.
- Use `display` when migrating display-heading usage.
- Remove `sx` and styled-system props; keep the semantic `as` element.
