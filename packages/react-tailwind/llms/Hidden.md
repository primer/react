# Hidden

`Hidden` conditionally hides presentational content at Primer viewport ranges. It is not a permission or authorization mechanism.

Import: `import {Hidden} from '@primer/react-tailwind/Hidden'`

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `children` (required): `React.ReactNode`
- `when` (required): `readonly Viewport[] | Viewport` — Viewports at which the children are hidden.

## Differences from `@primer/react`

- Keep range decisions in `when`; add visual styling with `className` on the wrapper.
