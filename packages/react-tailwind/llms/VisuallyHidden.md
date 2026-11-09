# VisuallyHidden

`VisuallyHidden` hides content visually while keeping it available to screen readers. Use it for context that is obvious visually but missing from the accessible name.

Import: `import {VisuallyHidden} from '@primer/react-tailwind/VisuallyHidden'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {VisuallyHidden} from '@primer/react-tailwind/VisuallyHidden'
;<VisuallyHidden>Close dialog</VisuallyHidden>
```

## API notes

- **native span props** (default: none) — Includes children, `className`, and ARIA attributes.

## Composition

Use inside an otherwise unlabeled local control, or as a focus-revealed skip-link label.

## Accessibility

Hidden text remains available to assistive technology. When focused, the component becomes visually available for keyboard users.

## Data attributes

The span has `data-component="VisuallyHidden"`.

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- Existing `focusable` usage can be retained.
- Recheck custom selectors that target legacy visually-hidden classes.
- Remove `sx` and styled-system props.
