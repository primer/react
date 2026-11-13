# Blankslate

`Blankslate` provides a structured empty state with optional visual, heading, description, and primary or secondary actions.

Import: `import {Blankslate} from '@primer/react-tailwind/Blankslate'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {
  Blankslate,
  BlankslateDescription,
  BlankslateHeading,
  BlankslatePrimaryAction,
  BlankslateSecondaryAction,
  BlankslateVisual,
} from '@primer/react-tailwind/Blankslate'
;<Blankslate border>
  <BlankslateVisual aria-hidden="true">…</BlankslateVisual>
  <BlankslateHeading>No results</BlankslateHeading>
  <BlankslateDescription>Try a different search.</BlankslateDescription>
  <BlankslatePrimaryAction href="/search">Search again</BlankslatePrimaryAction>
  <BlankslateSecondaryAction href="/help">Learn more</BlankslateSecondaryAction>
</Blankslate>
```

## Composition

Use the compound children in reading order: visual, heading, description, primary action, then secondary action. Primary actions accept either `href` or button props; secondary actions require an `href`.

## Accessibility

Use a heading that describes the empty state and actionable, meaningful labels. `BlankslateVisual` is decorative and is marked `aria-hidden`; do not put essential meaning only in the visual.

## Animation and reduced motion

`Blankslate` has no animation and does not need reduced-motion handling.

## Theming and Tailwind

The component uses Primer spacing, border, and text tokens. Import package styles or compile Tailwind v4 with the package `dist` path in `@source`; use `className` on each compound child for local extensions.

### Data attributes

The wrapper exposes `data-component="Blankslate.Container"`. The root exposes `data-component="Blankslate"` and `data-size`, plus `data-border`, `data-narrow`, and `data-spacious` when enabled. Compound parts expose their `Blankslate.*` component identifiers.

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
- Remove `sx`, styled-system props, and legacy style overrides.
- Prefer the named subcomponents instead of relying on ad hoc region markup.
