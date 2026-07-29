# NavList

`NavList` is a vertical navigation primitive for settings and page navigation.

Import: `import {NavList} from '@primer/react-tailwind/NavList'`

Renders a `<nav>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `NavList.Heading` child.

## Heading props

- `as`: `"h1" | "h2" | "h3" | "h4" | "h5" | "h6"`
- `size`: `"display" | "large" | "medium" | "small" | null` — Default `'small'`.
- `visuallyHidden`: `boolean`

## Group props

- `hideDivider`: `boolean` — Default `false`.
- `title`: `React.ReactNode`

## Item props

- `description`: `React.ReactNode`
- `inactiveText`: `React.ReactNode`
- `leadingVisual`: `React.ReactNode`
- `trailingAction`: `React.ReactNode`
- `trailingVisual`: `React.ReactNode`

## TrailingAction props

- `alignContent`: `"center" | "start"`
- `as`: `"a" | "button"`
- `block`: `boolean`
- `className`: `string`
- `count`: `string | number`
- `disabled`: `boolean`
- `href`: `string`
- `icon`: `React.ElementType`
- `inactive`: `boolean`
- `label`: `string`
- `labelWrap`: `boolean`
- `loading`: `boolean`
- `loadingAnnouncement`: `string`
- `size`: `ControlSize` — Default `'small'`.
- `style`: `React.CSSProperties`

## Description props

- `truncate`: `boolean`
- `variant`: `"block" | "inline"`

## Differences from `@primer/react`

- `NavList` accepts `heading`, and `NavList.Item` accepts `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
