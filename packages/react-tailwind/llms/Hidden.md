# Hidden

`Hidden` conditionally hides presentational content at Primer viewport ranges. It is not a permission or authorization mechanism.

Import: `import {Hidden} from '@primer/react-tailwind/Hidden'`

Renders a `<div>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `children`: `React.ReactElement[]`
- `when`: `readonly Viewport[] | Viewport`

## Differences from `@primer/react`

- Keep range decisions in `when`; add visual styling with `className` on the wrapper.
