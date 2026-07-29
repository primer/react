# Breadcrumbs

`Breadcrumbs` communicates the current location within a hierarchy.

Import: `import {Breadcrumbs} from '@primer/react-tailwind/Breadcrumbs'`

Renders a `<nav>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `overflow`: `"menu" | "menu-with-root" | "wrap"` — Default `'wrap'`.
- `variant`: `"normal" | "spacious"` — Default `'normal'`.

## Item props

- `as`: `React.ElementType` — Default `'a'`.
- `selected`: `boolean`

## Differences from `@primer/react`

- Normal breadcrumb and item composition is intended to be drop-in.
