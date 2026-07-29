# PageLayout

`PageLayout` composes page headers, navigation panes or sidebars, content, and footers into a responsive layout.

Import: `import {PageLayout} from '@primer/react-tailwind/PageLayout'`

Renders a `<div>` and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `columnGap`: `Spacing` — Default `'normal'`. Horizontal spacing between the sidebar, content, and pane.
- `containerWidth`: `"full" | "large" | "medium" | "xlarge"` — Default `'xlarge'`. Maximum width of the centered content column.
- `footer`: `React.ReactNode` — Supplies the footer region. Takes precedence over a matching `PageLayout.Footer` child.
- `header`: `React.ReactNode` — Supplies the header region. Takes precedence over a matching `PageLayout.Header` child.
- `padding`: `Spacing` — Default `'normal'`. Spacing between the page container's outer edges and the viewport.
- `rowGap`: `Spacing` — Default `'normal'`. Vertical spacing between the header, content, and footer.
- `sidebar`: `React.ReactNode` — Supplies the sidebar region. Takes precedence over a matching `PageLayout.Sidebar` child.

## Header props

- `divider`: `ResponsiveValue<"filled" | "line" | "none">` — Default `'none'`.
- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'normal'`.

## Content props

- `as`: `React.ElementType` — Default `'main'`.
- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'normal'`.
- `width`: `"full" | "large" | "medium" | "xlarge"` — Default `'full'`.

## Pane props

- `currentWidth`: `number`
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'none'`.
- `hidden`: `ResponsiveValue<boolean>`
- `minWidth`: `number` — Default `256`.
- `offsetHeader`: `string | number` — Default `0`.
- `onResizeEnd`: `((width: number) => void)`
- `padding`: `Spacing` — Default `'normal'`.
- `position`: `ResponsiveValue<PanePosition>` — Default `'end'`.
- `resizable`: `boolean` — Default `false`.
- `sticky`: `boolean` — Default `false`.
- `width`: `PaneWidthValue` — Default `'full'`.
- `widthStorageKey`: `string` — Default `'paneWidth'`.

## Sidebar props

- `currentWidth`: `number`
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'none'`.
- `hidden`: `ResponsiveValue<boolean>`
- `minWidth`: `number` — Default `256`.
- `offsetHeader`: `string | number` — Default `0`.
- `onResizeEnd`: `((width: number) => void)`
- `padding`: `Spacing` — Default `'normal'`.
- `position`: `ResponsiveValue<PanePosition>` — Default `'end'`.
- `resizable`: `boolean` — Default `false`.
- `responsiveVariant`: `"default" | "fullscreen"` — Default `'default'`.
- `sticky`: `boolean` — Default `false`.
- `width`: `PaneWidthValue` — Default `'full'`.
- `widthStorageKey`: `string` — Default `'paneWidth'`.

## Footer props

- `divider`: `"filled" | "line" | "none"` — Default `'none'`.
- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'normal'`.

## Differences from `@primer/react`

- `header`, `sidebar`, and `footer` accept an element for the corresponding region and take precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
