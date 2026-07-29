# UnderlineNav

`UnderlineNav` is a presentational navigation composition for sibling destinations. It keeps native link semantics, while consumers own route integration, item order, and selected state.

Import: `import {UnderlineNav} from '@primer/react-tailwind/UnderlineNav'`

Renders a `<nav>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'nav'`. Element to render.
- `hideIconsBreakpoint`: `HideIconsBreakpoint` — Default `'xxlarge'`. Viewport below which item icons are hidden to save space.
- `loadingCounters`: `boolean` — Default `false`. Shows placeholders in place of item counters while their values load.
- `variant`: `"flush" | "inset"` — Default `'inset'`. Whether the bar is inset from its container or sits flush against it.

## Item props

- `as`: `React.ElementType` — Default `'nav'`. Element to render. Use a non-anchor element when the link is handled by a router.
- `counter`: `string | number` — Number shown after the label.
- `leadingVisual`: `React.ReactNode` — Icon shown before the label.
- `onSelect`: `((event: MouseEvent<HTMLElement, MouseEvent>) => void)` — Called when the item is activated.

## Differences from `@primer/react`

- **Intentional — composition:** Wrap items in `UnderlineNav.List`. This preserves native `nav`/`ul`/`li`/link semantics without extracting or reordering consumer children.
