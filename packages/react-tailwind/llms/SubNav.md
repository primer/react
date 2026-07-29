# SubNav

`SubNav` is a horizontal secondary navigation bar composed from `SubNav.Links` and `SubNav.Link`.

Import: `import {SubNav} from '@primer/react-tailwind/SubNav'`

Renders a `<nav>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `actions`: `React.ReactNode`
- `align`: `"right"`
- `full`: `boolean`
- `label`: `string`

## Link props

- `as`: `React.ElementType` — Default `'a'`.
- `selected`: `boolean`

## Differences from `@primer/react`

- Existing navigation composition and state ownership can be retained.
