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

- `divider`: `ResponsiveValue<"filled" | "line" | "none">` — Default `'none'`. Divider drawn below the header. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the header. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the header region.

## Content props

- `as`: `React.ElementType` — Default `'main'`. Element to render.
- `hidden`: `ResponsiveValue<boolean>` — Hides the content. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the content region.
- `width`: `"full" | "large" | "medium" | "xlarge"` — Default `'full'`. Maximum width of the content column.

## Pane props

- `currentWidth`: `number` — Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself.
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'none'`. Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the pane. Accepts a responsive object to hide it only at some viewports.
- `minWidth`: `number` — Default `256`. Smallest width in pixels the pane may be resized to.
- `offsetHeader`: `string | number` — Default `0`. Distance a sticky pane is offset from the top, to clear a fixed header above it.
- `onResizeEnd`: `((width: number) => void)` — Called with the new width when a resize finishes.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the pane.
- `position`: `ResponsiveValue<PanePosition>` — Default `'end'`. Which side of the content the pane sits on. Accepts a responsive object to move it per viewport.
- `resizable`: `boolean` — Default `false`. Lets the user drag the pane's edge to resize it.
- `sticky`: `boolean` — Default `false`. Keeps the pane in view as the content scrolls.
- `width`: `PaneWidthValue` — Default `'full'`. Pane width, either a named size or a custom min/default/max triple.
- `widthStorageKey`: `string` — Default `'paneWidth'`. Key under which a resized width is persisted, so the pane reopens at the user's chosen size.

## Sidebar props

- `currentWidth`: `number` — Controls the pane width in pixels. Supply it with `onResizeEnd` to own the width yourself.
- `divider`: `ResponsiveValue<PaneDivider>` — Default `'none'`. Divider drawn between the pane and the content. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the pane. Accepts a responsive object to hide it only at some viewports.
- `minWidth`: `number` — Default `256`. Smallest width in pixels the pane may be resized to.
- `offsetHeader`: `string | number` — Default `0`. Distance a sticky pane is offset from the top, to clear a fixed header above it.
- `onResizeEnd`: `((width: number) => void)` — Called with the new width when a resize finishes.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the pane.
- `position`: `ResponsiveValue<PanePosition>` — Default `'end'`. Which side of the content the pane sits on. Accepts a responsive object to move it per viewport.
- `resizable`: `boolean` — Default `false`. Lets the user drag the pane's edge to resize it.
- `responsiveVariant`: `"default" | "fullscreen"` — Default `'default'`. How the sidebar behaves on narrow viewports: inline by default, or as a fullscreen overlay.
- `sticky`: `boolean` — Default `false`. Keeps the pane in view as the content scrolls.
- `width`: `PaneWidthValue` — Default `'full'`. Pane width, either a named size or a custom min/default/max triple.
- `widthStorageKey`: `string` — Default `'paneWidth'`. Key under which a resized width is persisted, so the pane reopens at the user's chosen size.

## Footer props

- `divider`: `"filled" | "line" | "none"` — Default `'none'`. Divider drawn above the footer. Accepts a responsive object to vary it per viewport.
- `hidden`: `ResponsiveValue<boolean>` — Hides the footer. Accepts a responsive object to hide it only at some viewports.
- `padding`: `Spacing` — Default `'normal'`. Inner spacing of the footer region.

## Differences from `@primer/react`

- `header`, `sidebar`, and `footer` accept an element for the corresponding region and take precedence over a matching child. Use them to supply a component of your own where upstream required copying the region's `__SLOT__` symbol onto it.
