# Hidden

`Hidden` conditionally hides presentational content at Primer viewport ranges. It is not a permission or authorization mechanism.

Import: `import {Hidden} from '@primer/react-tailwind/Hidden'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Import and usage

```tsx
import {Hidden} from '@primer/react-tailwind/Hidden'
;<Hidden when="narrow">Wide navigation</Hidden>
```

`when` accepts a range or an array of ranges. Do not hide the only accessible name, required action, or keyboard path; prefer reflowing the same content when possible.

## API notes

`narrow` is below 48rem (768px); `regular` is 48rem through below 87.5rem (1400px); `wide` starts at 87.5rem. These are Primer named viewport ranges. They are not Tailwind's `lg` breakpoint, which is 63.25rem (1012px).

## Accessibility

At a selected range, `Hidden` applies `display: none`, removing the wrapper and its children from the visual layout and accessibility tree. Keep equivalent labels, actions, and keyboard paths available at every viewport.

## Tailwind extension

Pass `className` to add utilities to the wrapper. A utility using the same responsive variant replaces the corresponding default utility; for example, `md:max-2xl:block` replaces the regular-range visibility rule. The root has `data-component="Hidden"`; it is owned by Primer and is not configurable.

## API design

Hidden is a small presentational utility: consumers compose their own content and retain its native semantics while the wrapper owns only responsive display. No behavior hook or config component is needed because it has no interaction or state to share.

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `children` (required): `React.ReactNode`
- `when` (required): `readonly Viewport[] | Viewport` — Viewports at which the children are hidden.

## Differences from `@primer/react`

- Keep range decisions in `when`; add visual styling with `className` on the wrapper.
- Treat multiple ranges as an additive hide set.
- `wide` maps to Tailwind `2xl`, not `lg`; `lg` remains Primer's separate 63.25rem/1012px size breakpoint.
- Do not expect a styled-system or `sx` compatibility surface.
- The Tailwind component forwards native `style`, but does not reproduce legacy responsive CSS custom properties.
- Use semantic content order; Hidden changes display, and selected content is unavailable to assistive technology.
