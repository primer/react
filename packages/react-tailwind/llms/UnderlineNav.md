# UnderlineNav

`UnderlineNav` is a presentational navigation composition for sibling destinations. It keeps native link semantics, while consumers own route integration, item order, and selected state.

Import: `import {UnderlineNav} from '@primer/react-tailwind/UnderlineNav'`

Renders a `<nav>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `as`: `React.ElementType` — Default `'nav'`.
- `hideIconsBreakpoint`: `HideIconsBreakpoint` — Default `'xxlarge'`.
- `loadingCounters`: `boolean` — Default `false`.
- `variant`: `"flush" | "inset"` — Default `'inset'`.

## Item props

- `as`: `React.ElementType` — Default `'nav'`.
- `counter`: `string | number`
- `leadingVisual`: `React.ReactNode`
- `onSelect`: `((event: MouseEvent<HTMLElement, MouseEvent>) => void)`

## Differences from `@primer/react`

- **Intentional — composition:** Wrap items in `UnderlineNav.List`. This preserves native `nav`/`ul`/`li`/link semantics without extracting or reordering consumer children.
