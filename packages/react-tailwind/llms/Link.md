# Link

`Link` navigates to another location. Use `Button` when the control performs an action, and `LinkButton` when a navigation target needs button styling.

Import: `import {Link} from '@primer/react-tailwind/Link'`

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'a'`. Element to render. Use a non-anchor element when the link is handled by a router.
- `inline`: `boolean | null`
- `muted`: `boolean | null`

## Differences from `@primer/react`

- Preserve `muted`, `inline`, and `as` usage.
