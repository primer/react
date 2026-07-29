# SplitPageLayout

`SplitPageLayout` is an opinionated full-width `PageLayout` composition for settings and detail pages with a navigation pane and content area.

Import: `import {SplitPageLayout} from '@primer/react-tailwind/SplitPageLayout'`

## Props

- `columnGap`: `Spacing` — Default `'none'`. Horizontal spacing between the sidebar, content, and pane.
- `containerWidth`: `"full" | "large" | "medium" | "xlarge"` — Default `'full'`. Maximum width of the centered content column.
- `footer`: `React.ReactNode`
- `header`: `React.ReactNode`
- `padding`: `Spacing` — Default `'none'`. Spacing between the page container's outer edges and the viewport.
- `rowGap`: `Spacing` — Default `'none'`. Vertical spacing between the header, content, and footer.
- `sidebar`: `React.ReactNode`

## Header props

- `divider`: `ResponsiveValue<"filled" | "line" | "none">` — Default `'line'`.
- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'none'`.

## Content props

- `as`: `React.ElementType`
- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'none'`.
- `width`: `"full" | "large" | "medium" | "xlarge"` — Default `'large'`.

## Pane props

- `currentWidth`: `number`
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'line'`.
- `hidden`: `ResponsiveValue<boolean>`
- `minWidth`: `number`
- `offsetHeader`: `string | number`
- `onResizeEnd`: `((width: number) => void)`
- `padding`: `Spacing` — Default `'none'`.
- `position`: `ResponsiveValue<PanePosition>` — Default `'start'`.
- `resizable`: `boolean`
- `sticky`: `boolean` — Default `true`.
- `width`: `PaneWidthValue` — Default `'large'`.
- `widthStorageKey`: `string`

## Sidebar props

- `currentWidth`: `number`
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'line'`.
- `hidden`: `ResponsiveValue<boolean>`
- `minWidth`: `number`
- `offsetHeader`: `string | number`
- `onResizeEnd`: `((width: number) => void)`
- `padding`: `Spacing` — Default `'none'`.
- `position`: `ResponsiveValue<PanePosition>` — Default `'start'`.
- `resizable`: `boolean`
- `responsiveVariant`: `"default" | "fullscreen"`
- `sticky`: `boolean` — Default `true`.
- `width`: `PaneWidthValue` — Default `'large'`.
- `widthStorageKey`: `string`

## Footer props

- `divider`: `"filled" | "line" | "none"` — Default `'line'`.
- `hidden`: `ResponsiveValue<boolean>`
- `padding`: `Spacing` — Default `'none'`.

## Differences from `@primer/react`

- Use the local PageLayout-compatible slot and responsive props rather than legacy styling wrappers.
