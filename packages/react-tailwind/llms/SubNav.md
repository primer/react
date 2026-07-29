# SubNav

`SubNav` is a horizontal secondary navigation bar composed from `SubNav.Links` and `SubNav.Link`.

Import: `import {SubNav} from '@primer/react-tailwind/SubNav'`

Renders a `<nav>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `actions`: `React.ReactNode` — Controls shown at the end of the bar, beside the links.
- `align`: `"right"` — Aligns the links to the end of the bar.
- `full`: `boolean` — Stretches the bar to fill the width of its container.
- `label`: `string` — Accessible name for the navigation region.

## Link props

- `as`: `React.ElementType` — Default `'a'`. Element to render. Use a non-anchor element when the link is handled by a router.
- `selected`: `boolean` — Marks the link as the current page.

## Differences from `@primer/react`

- Existing navigation composition and state ownership can be retained.
