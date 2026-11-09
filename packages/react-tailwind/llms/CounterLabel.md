# CounterLabel

`CounterLabel` displays a numeric count alongside a label, such as an open-issue total. It is presentational and does not format or abbreviate the number.

Import: `import {CounterLabel} from '@primer/react-tailwind/CounterLabel'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {CounterLabel} from '@primer/react-tailwind/CounterLabel'
;<CounterLabel aria-label="12 unread notifications">12</CounterLabel>
```

## API notes

The default variant is `secondary`. The visible count is hidden from assistive technology; without an `aria-label`, the screen-reader text is the count in parentheses.

## Composition

Use next to the control or label whose count it qualifies.

## Accessibility

Provide `aria-label` when the generated parenthesized count is not sufficient context.

## Data attributes

The visible count has `data-component="CounterLabel"`.

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `aria-label`: `string` — Accessible name giving the count meaning, since the number alone rarely explains itself.
- `data-component`: `string` — Default `'CounterLabel'`. Overrides the marker used to identify this element in tests and styling.
- `variant`: `"primary" | "secondary" | null`

## Differences from `@primer/react`

- Keep `variant`, children, and count-related content unchanged.
- Replace deprecated `scheme` usage with `variant`.
- Remove `sx`, styled-system props, and CSS-module selectors.
