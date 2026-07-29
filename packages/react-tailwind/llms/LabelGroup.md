# LabelGroup

`LabelGroup` lays out a collection of `Label` items and collapses overflow behind a toggle when they exceed the available width.

Import: `import {LabelGroup} from '@primer/react-tailwind/LabelGroup'`

## Props

- `as`: `React.ElementType` — Default `'ul'`. Customize the element type of the rendered container.
- `overflowStyle`: `'inline' | 'overlay'` — Default `'overlay'`. How hidden children are shown.
- `visibleChildCount`: `'auto' | number` — How many children to show. `'auto'` truncates children to fit the available width.

## Differences from `@primer/react`

- `visibleChildCount="auto"` uses `ResizeObserver` rather than the legacy `IntersectionObserver`. This produces deterministic counts on resize and avoids relying on clipping intersection behavior.

