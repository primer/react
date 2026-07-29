# NavList

`NavList` is a vertical navigation primitive for settings and page navigation.

Import: `import {NavList} from '@primer/react-tailwind/NavList'`

## Props

- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `NavList.Heading` child.

## NavListHeading props

- `visuallyHidden`: `boolean`

## NavListGroup props

- `hideDivider`: `boolean` — Default `false`.
- `title`: `React.ReactNode`

## NavListItem props

- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `NavList.Description` child.
- `inactiveText`: `React.ReactNode`
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `NavList.LeadingVisual` child.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `NavList.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `NavList.TrailingVisual` child.

## Differences from `@primer/react`

- `NavList` accepts `heading`, and `NavList.Item` accepts `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.

