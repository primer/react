# Hidden

`Hidden` conditionally hides presentational content at Primer viewport ranges. It is not a permission or authorization mechanism.

Import: `import {Hidden} from '@primer/react-tailwind/Hidden'`

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
