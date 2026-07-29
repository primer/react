# ActionList

`ActionList` is a semantic action, menu, or listbox list composed from explicit child parts.

Import: `import {ActionList} from '@primer/react-tailwind/ActionList'`

## Props

- `selectionVariant`: `SelectionVariant`
- `showDividers`: `boolean` — Default `false`.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Default `'inset'`.

## Root props

- `selectionVariant`: `SelectionVariant`
- `showDividers`: `boolean` — Default `false`.
- `variant`: `"full" | "horizontal-inset" | "inset"` — Default `'inset'`.

## Item props

- `active`: `boolean`
- `children`: `React.ReactElement[]`
- `className`: `string`
- `description`: `React.ReactNode`
- `disabled`: `boolean`
- `inactiveText`: `React.ReactNode`
- `leadingVisual`: `React.ReactNode`
- `loading`: `boolean` — Default `false`.
- `loadingText`: `string`
- `onSelect`: `((event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement, MouseEvent>) => void)`
- `selected`: `boolean`
- `size`: `"large" | "medium"` — Default `'medium'`.
- `trailingAction`: `React.ReactNode`
- `trailingVisual`: `React.ReactNode`
- `variant`: `"danger" | "default"` — Default `'inset'`.

## LinkItem props

- `description`: `React.ReactNode`
- `leadingVisual`: `React.ReactNode`
- `selected`: `boolean`
- `trailingAction`: `React.ReactNode`
- `trailingVisual`: `React.ReactNode`
- `variant`: `"danger" | "default"` — Default `'inset'`.

## Group props

- `heading`: `React.ReactNode`
- `selectionVariant`: `SelectionVariant`
- `title`: `React.ReactNode`

## GroupHeading props

- `as`: `React.ElementType` — Default `'h3'`.
- `trailingAction`: `React.ReactNode`
- `variant`: `"filled" | "subtle"` — Default `'inset'`.

## Description props

- `truncate`: `boolean`
- `variant`: `"block" | "inline"` — Default `'inset'`.

## Heading props

- `as`: `React.ElementType` — Default `'h3'`.
- `size`: `"medium" | "small"` — Default `'medium'`.

## TrailingAction props

- `alignContent`: `"center" | "start"`
- `as`: `"a" | "button"` — Default `'h3'`.
- `block`: `boolean`
- `className`: `string`
- `count`: `string | number`
- `disabled`: `boolean`
- `href`: `string`
- `icon`: `React.ElementType`
- `inactive`: `boolean`
- `label`: `string`
- `labelWrap`: `boolean`
- `loading`: `boolean` — Default `false`.
- `loadingAnnouncement`: `string`
- `size`: `ControlSize` — Default `'medium'`.
- `style`: `React.CSSProperties`

## Differences from `@primer/react`

- `ActionList.Item` and `ActionList.LinkItem` accept `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`; `ActionList.Group` accepts `heading`; `ActionList.GroupHeading` accepts `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
