# PageLayout

`PageLayout` composes page headers, navigation panes or sidebars, content, and footers into a responsive layout.

Import: `import {PageLayout} from '@primer/react-tailwind/PageLayout'`

## Props

- `columnGap`: `Spacing` — Default `'normal'`. Horizontal spacing between the sidebar, content, and pane.
- `containerWidth`: `keyof typeof width` — Default `'xlarge'`. Maximum width of the centered content column.
- `footer`: `React.ReactNode` — Supplies the footer region. Takes precedence over a matching `PageLayout.Footer` child.
- `header`: `React.ReactNode` — Supplies the header region. Takes precedence over a matching `PageLayout.Header` child.
- `padding`: `Spacing` — Default `'normal'`. Spacing between the page container's outer edges and the viewport.
- `rowGap`: `Spacing` — Default `'normal'`. Vertical spacing between the header, content, and footer.
- `sidebar`: `React.ReactNode` — Supplies the sidebar region. Takes precedence over a matching `PageLayout.Sidebar` child.

## DragHandle props

- `aria-label`: `string`
- `aria-labelledby`: `string`
- `aria-valuemax`: `number`
- `aria-valuemin`: `number`
- `aria-valuenow`: `number`
- `formatValueText`: `(value: number) => string` — Default `defaultFormatValueText`.
- `handleRef`: `React.RefObject<HTMLDivElement | null>`
- `onDoubleClick`: `React.MouseEventHandler<HTMLDivElement>`

## PageLayoutHeader props

- `divider`: `'none' | 'line' | ResponsiveValue<'none' | 'line' | 'filled'>` — Default `'none'`.
- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'normal'`.

## PageLayoutContent props

- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'normal'`.
- `width`: `keyof typeof width` — Default `'full'`.

## PageLayoutPaneBase props

- `currentWidth`: `number`
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'none'`.
- `hidden`: `ResponsiveValue<boolean>`
- `minWidth`: `number` — Default `256`.
- `offsetHeader`: `string | number` — Default `0`.
- `onResizeEnd`: `(width: number) => void`
- `padding`: `Spacing` — Default `'normal'`.
- `position`: `ResponsiveValue<PanePosition>` — Default `'end'`.
- `resizable`: `boolean` — Default `false`.
- `sticky`: `boolean` — Default `false`.
- `width`: `PaneWidthValue` — Default `'full'`.
- `widthStorageKey`: `string` — Default `'paneWidth'`.

## PageLayoutSidebar props

- `responsiveVariant`: `'default' | 'fullscreen'` — Default `'default'`.

## PageLayoutFooter props

- `divider`: `'none' | 'line' | 'filled'` — Default `'none'`.
- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'normal'`.

## Differences from `@primer/react`

- `header`, `sidebar`, and `footer` accept an element for the corresponding region and take precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.

