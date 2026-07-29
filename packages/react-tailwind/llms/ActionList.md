# ActionList

`ActionList` is a semantic action, menu, or listbox list composed from explicit child parts.

Import: `import {ActionList} from '@primer/react-tailwind/ActionList'`

## Props

- `selectionVariant`: `SelectionVariant`
- `showDividers`: `boolean` — Default `false`.
- `variant`: `'inset' | 'horizontal-inset' | 'full'` — Default `'inset'`.

## ActionListItem props

- `active`: `boolean`
- `children`: `React.ReactNode`
- `className`: `string`
- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `ActionList.Description` child.
- `disabled`: `boolean`
- `inactiveText`: `React.ReactNode`
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `ActionList.LeadingVisual` child.
- `loading`: `boolean` — Default `false`.
- `loadingText`: `string`
- `onSelect`: `(event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void`
- `selected`: `boolean`
- `size`: `'medium' | 'large'` — Default `'medium'`.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `ActionList.TrailingVisual` child.
- `variant`: `'default' | 'danger'` — Default `'inset'`.

## ActionListLinkItem props

- `description`: `React.ReactNode` — Supplies the description region. Takes precedence over a matching `ActionList.Description` child.
- `leadingVisual`: `React.ReactNode` — Supplies the leadingVisual region. Takes precedence over a matching `ActionList.LeadingVisual` child.
- `selected`: `boolean`
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.TrailingAction` child.
- `trailingVisual`: `React.ReactNode` — Supplies the trailingVisual region. Takes precedence over a matching `ActionList.TrailingVisual` child.
- `variant`: `'default' | 'danger'` — Default `'inset'`.

## ActionListGroup props

- `heading`: `React.ReactNode` — Supplies the heading region. Takes precedence over a matching `ActionList.Heading` child.
- `selectionVariant`: `SelectionVariant`
- `title`: `React.ReactNode`

## ActionListGroupHeading props

- `as`: `React.ElementType` — Default `'h3'`.
- `trailingAction`: `React.ReactNode` — Supplies the trailingAction region. Takes precedence over a matching `ActionList.TrailingAction` child.
- `variant`: `'subtle' | 'filled'` — Default `'inset'`.

## ActionListGroupHeadingTrailingAction props

- `icon`: `React.ElementType`

## ActionListDescription props

- `truncate`: `boolean`
- `variant`: `'block' | 'inline'` — Default `'inset'`.

## ActionListHeading props

- `as`: `React.ElementType` — Default `'h3'`.
- `size`: `'small' | 'medium'` — Default `'medium'`.

## Differences from `@primer/react`

- `ActionList.Item` and `ActionList.LinkItem` accept `leadingVisual`, `trailingVisual`, `description`, and `trailingAction`; `ActionList.Group` accepts `heading`; `ActionList.GroupHeading` accepts `trailingAction`. Each takes an element for the corresponding region and takes precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.

