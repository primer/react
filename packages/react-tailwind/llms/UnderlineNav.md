# UnderlineNav

`UnderlineNav` is a presentational navigation composition for sibling destinations. It keeps native link semantics, while consumers own route integration, item order, and selected state.

Import: `import {UnderlineNav} from '@primer/react-tailwind/UnderlineNav'`

Renders a [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'nav'`. Element to render.
- `hideIconsBreakpoint`: `HideIconsBreakpoint` — Default `'medium'`. Container width below which item icons are hidden to save space. To keep icons visible in a narrow container, use a smaller breakpoint such as `xsmall`, or set to `null` to always show icons.
- `loadingCounters`: `boolean` — Default `false`. Shows placeholders in place of item counters while their values load.
- `variant`: `"flush" | "inset"` — Default `'inset'`. Whether the bar is inset from its container or sits flush against it.

## UnderlineNav.Item

Renders an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `React.ElementType` — Default `'a'`. Element to render, such as a router link component. Native anchors default to `href="#"`; custom components receive no default `href`, so they can supply their own navigation target.
- `counter`: `string | number` — Number shown after the label.
- `leadingVisual`: `React.ReactNode` — Icon shown before the label.
- `onSelect`: `((event: MouseEvent<HTMLElement, MouseEvent>) => void)` — Called when the item is activated, from the bar or from the "More" menu.

## Differences from `@primer/react`

- **Parity — composition:** Place `UnderlineNav.Item` children directly inside `UnderlineNav`; the root renders the `ul` and a visually hidden "`aria-label` navigation" heading, as upstream does.
