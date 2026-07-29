# UnderlineNav

`UnderlineNav` is a presentational navigation composition for sibling destinations. It keeps native link semantics, while consumers own route integration, item order, and selected state.

Import: `import {UnderlineNav} from '@primer/react-tailwind/UnderlineNav'`

## Props

- `as`: `React.ElementType` — Default `'nav'`.
- `hideIconsBreakpoint`: `HideIconsBreakpoint` — Default `'xxlarge'`.
- `loadingCounters`: `boolean` — Default `false`.
- `variant`: `'inset' | 'flush'` — Default `'inset'`.

## UnderlineNavItem props

- `as`: `React.ElementType` — Default `'nav'`.
- `counter`: `number | string`
- `leadingVisual`: `React.ReactNode`
- `onSelect`: `(event: React.MouseEvent<HTMLElement>) => void`

## Differences from `@primer/react`

- **Intentional — composition:** Wrap items in `UnderlineNav.List`. This preserves native `nav`/`ul`/`li`/link semantics without extracting or reordering consumer children.

