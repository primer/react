# LabelGroup

`LabelGroup` lays out a collection of `Label` items and collapses overflow behind a toggle when they exceed the available width.

Import: `import {LabelGroup} from '@primer/react-tailwind/LabelGroup'`

Renders an [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'ul'`. Customize the element type of the rendered container.
- `overflowStyle`: `"inline" | "overlay"` — Default `'overlay'`. How hidden children are shown.
- `visibleChildCount`: `number | "auto"` — How many children to show. `'auto'` truncates children to fit the available width.

## Differences from `@primer/react`

- `visibleChildCount="auto"` uses `ResizeObserver` rather than the legacy `IntersectionObserver`. This produces deterministic counts on resize and avoids relying on clipping intersection behavior.
