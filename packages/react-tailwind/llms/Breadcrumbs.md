# Breadcrumbs

`Breadcrumbs` communicates the current location within a hierarchy.

Import: `import {Breadcrumbs} from '@primer/react-tailwind/Breadcrumbs'`

Renders a [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `overflow`: `"menu" | "menu-with-root" | "wrap"` — Default `'wrap'`. How the trail behaves when it is too wide: wrap onto another line, or collapse the middle into a menu.
- `variant`: `"normal" | "spacious"` — Default `'normal'`. Use `spacious` to increase the spacing between items.

## Breadcrumbs.Item

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'a'`. Element to render. Use a non-anchor element for an item that does not link anywhere.
- `selected`: `boolean` — Marks the item as the current page, which is announced to assistive technology.

## Differences from `@primer/react`

- Normal breadcrumb and item composition is intended to be drop-in.
