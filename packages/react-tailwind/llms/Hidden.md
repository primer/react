# Hidden

`Hidden` conditionally hides presentational content at Primer viewport ranges. It is not a permission or authorization mechanism.

Import: `import {Hidden} from '@primer/react-tailwind/Hidden'`

## Props

- `children`: `ReactNode`
- `when`: `Viewport | readonly Viewport[]`

## Differences from `@primer/react`

- Keep range decisions in `when`; add visual styling with `className` on the wrapper.

